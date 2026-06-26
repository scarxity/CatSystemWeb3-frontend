"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useWallets } from "@privy-io/react-auth/solana";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

import { useRegisterCat } from "@/components/pages/cats/register/context/RegisterCatContext";
import { createCatProgram } from "@/lib/solana/catSystem";
import api from "@/lib/api";
import { REQUIRED_IMAGE_SLOTS, type BioProfileData, type CatImageUpload } from "@/types/registerCat";

function toGender(val: string) {
  return val === "Female" ? { female: {} } : { male: {} };
}

function toCoatLength(val: BioProfileData["coatLength"]) {
  if (val === "Long Hair") return { long: {} };
  if (val === "Medium Hair") return { medium: {} };
  return { short: {} };
}

function toEarType(val: BioProfileData["earType"]) {
  if (val === "Rounded") return { rounded: {} };
  if (val === "Folded") return { folded: {} };
  return { pointed: {} };
}

function toBodySize(val: BioProfileData["bodySize"]) {
  if (val === "Medium") return { medium: {} };
  if (val === "Large") return { large: {} };
  return { small: {} };
}

function composeDescription(bio: BioProfileData): string {
  return [
    bio.personalityTraits.length > 0 &&
      `Traits: ${bio.personalityTraits.join(", ")}`,
    bio.additionalNotes,
  ]
    .filter(Boolean)
    .join(". ")
    .slice(0, 512);
}

/** Upload all cat images at once, returns array of { url, filename } */
async function uploadCatImages(images: CatImageUpload[]) {
  const filesWithData = images.filter((img) => img.file != null);
  if (filesWithData.length === 0) return [];

  const fd = new FormData();
  for (const img of filesWithData) {
    fd.append("images", img.file!);
  }

  const { data } = await api.post<{ images: { url: string; filename: string }[] }>(
    "/cats/images",
    fd,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data.images;
}

export function useSubmitCat() {
  const router = useRouter();
  const { wallets } = useWallets();
  const { formData } = useRegisterCat();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const wallet = wallets[0];
    if (!wallet) {
      toast.error("No wallet connected.");
      return;
    }

    const { basicInfo, bioProfile } = formData;

    // Validate required images (first 4 slots must have files)
    const requiredImages = basicInfo.images.slice(0, REQUIRED_IMAGE_SLOTS.length);
    const missingRequired = requiredImages.filter((img) => !img.file);
    if (missingRequired.length > 0) {
      toast.error(
        `Please upload all required photos: ${missingRequired.map((img) => img.description).join(", ")}`,
      );
      return;
    }

    // Filter to only images that have files
    const imagesToUpload = basicInfo.images.filter((img) => img.file != null);

    setIsSubmitting(true);

    // Step 1: upload images to backend
    let uploadedUrls: { url: string; filename: string }[];
    try {
      uploadedUrls = await uploadCatImages(imagesToUpload);
    } catch (err) {
      console.error("[register] image upload failed:", err);
      toast.error("Image upload failed. Please try again.");
      setIsSubmitting(false);
      return;
    }

    // Step 2: on-chain create_cat
    let catPda: PublicKey;
    try {
      const program = createCatProgram(wallet);
      const ownerPubkey = new PublicKey(wallet.address);

      const [userCounterPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("user_counter"), ownerPubkey.toBuffer()],
        program.programId,
      );

      let catCount = new BN(0);
      try {
        // biome-ignore lint/suspicious/noExplicitAny: Anchor generic Idl type
        const counter = await (program.account as any).userCounter.fetch(
          userCounterPda,
        );
        catCount = counter.catCount as BN;
      } catch {
        // account doesn't exist yet (first registration)
      }

      [catPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("cat"),
          ownerPubkey.toBuffer(),
          catCount.toArrayLike(Buffer, "le", 8),
        ],
        program.programId,
      );

      // Convert dateOfBirth to unix timestamp (seconds)
      const dobTimestamp = basicInfo.dateOfBirth
        ? new BN(Math.floor(new Date(basicInfo.dateOfBirth).getTime() / 1000))
        : new BN(0);

      // Build the BioProfile struct for on-chain
      const bioProfileArg = {
        breed: bioProfile.breed.slice(0, 32),
        coatColor: bioProfile.coatColor.slice(0, 32),
        coatLength: toCoatLength(bioProfile.coatLength),
        eyeColor: bioProfile.eyeColor.slice(0, 32),
        earType: toEarType(bioProfile.earType),
        bodySize: toBodySize(bioProfile.bodySize),
        personalityTrait: (bioProfile.personalityTraits[0] || "").slice(0, 32),
        description: composeDescription(bioProfile),
      };

      await program.methods
        .createCat(
          basicInfo.catName.slice(0, 32),
          toGender(basicInfo.gender),
          dobTimestamp,
          bioProfileArg,
        )
        .accounts({
          owner: wallet.address,
          userCounter: userCounterPda,
          cat: catPda,
        })
        .rpc();

      toast.success("Cat registered on-chain!");
    } catch (err) {
      console.error("[register] on-chain create_cat failed:", err);
      toast.error("Cat registration failed. Please try again.");
      setIsSubmitting(false);
      return;
    }

    // Step 3: on-chain add_cat_image × N
    try {
      const program = createCatProgram(wallet);

      for (let i = 0; i < uploadedUrls.length; i++) {
        const uploaded = uploadedUrls[i];
        const imgDescription = imagesToUpload[i]?.description || "";

        // Fetch current image_count from the cat account
        // biome-ignore lint/suspicious/noExplicitAny: Anchor generic Idl type
        const catAccount = await (program.account as any).cat.fetch(catPda);
        const imageCount = catAccount.imageCount as number;

        const [catImagePda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from("cat-image"),
            catPda.toBuffer(),
            Buffer.from([imageCount]),
          ],
          program.programId,
        );

        await program.methods
          .addCatImage(
            uploaded.url.slice(0, 256),
            imgDescription.slice(0, 64),
          )
          .accounts({
            cat: catPda,
            catImage: catImagePda,
            payer: wallet.address,
          })
          .rpc();

        toast.success(`Image ${i + 1}/${uploadedUrls.length} uploaded on-chain`);
      }

      toast.success("All images registered! 🎉");
      router.push("/");
    } catch (err) {
      console.error("[register] on-chain add_cat_image failed:", err);
      toast.error(
        "Some images failed to register on-chain. The cat was created successfully — you can add images later.",
      );
      router.push("/");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
}
