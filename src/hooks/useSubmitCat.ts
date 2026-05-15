"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useWallets } from "@privy-io/react-auth/solana";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";

import { useRegisterCat } from "@/views/cats/register/context/RegisterCatContext";
import { createCatProgram } from "@/lib/solana/catSystem";
import type { BioProfileData } from "@/types/registerCat";

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

    setIsSubmitting(true);
    try {
      const program = createCatProgram(wallet);
      const { basicInfo, bioProfile } = formData;
      const ownerPubkey = new PublicKey(wallet.address);

      // Derive user_counter PDA
      const [userCounterPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("user_counter"), ownerPubkey.toBuffer()],
        program.programId,
      );

      // Fetch current cat_count — defaults to 0 if account not yet initialized
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

      // Derive cat PDA using current cat_count as seed
      const [catPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("cat"),
          ownerPubkey.toBuffer(),
          catCount.toArrayLike(Buffer, "le", 8),
        ],
        program.programId,
      );

      await program.methods
        .createCat(
          basicInfo.catName.slice(0, 32),
          toGender(basicInfo.gender),
          bioProfile.breed.slice(0, 32),
          bioProfile.coatColor.slice(0, 32),
          toCoatLength(bioProfile.coatLength),
          bioProfile.eyeColor.slice(0, 32),
          toEarType(bioProfile.earType),
          toBodySize(bioProfile.bodySize),
          composeDescription(bioProfile),
        )
        .accounts({
          owner: wallet.address,
          userCounter: userCounterPda,
          cat: catPda,
        })
        .rpc();

      toast.success("Cat registered on-chain!");
      router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
}
