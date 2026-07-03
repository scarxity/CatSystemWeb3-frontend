"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useWallets } from "@privy-io/react-auth/solana";
import { PublicKey, Transaction } from "@solana/web3.js";
import { AnchorProvider, BN } from "@coral-xyz/anchor";

import { useRegisterCat } from "@/components/pages/cats/register/context/RegisterCatContext";
import { createCatProgram } from "@/lib/solana/catSystem";
import api from "@/lib/api";
import {
	REQUIRED_IMAGE_SLOTS,
	type BioProfileData,
	type CatImageUpload,
} from "@/types/registerCat";

/* ================================================================
   Anchor serialisation helpers
   ================================================================ */

function toGender(val: string) {
	return val === "Female" ? { female: {} } : { male: {} };
}

/**
 * Generic Anchor enum serialiser.
 * Converts an IDL variant name like "VeryLarge" → { veryLarge: {} },
 * matching Anchor's camelCase convention for enum discriminants.
 */
function toAnchorEnum(variant: string): Record<string, Record<string, never>> {
	if (!variant) return {};
	if (variant === "AB") return { ab: {} }; // Special case for all-caps
	
	const key = variant.charAt(0).toLowerCase() + variant.slice(1);
	return { [key]: {} };
}

/**
 * Build the on-chain BioProfile struct from form data.
 * Every field maps 1:1 to the IDL `BioProfile` struct.
 * String fields are sliced to the max length defined by program error codes.
 */
function buildBioProfileArg(bp: BioProfileData) {
	return {
		// — strings (respect IDL max lengths) —
		breed: (bp.breed || []).join(", ").slice(0, 32),
		coatColor: (bp.coatColor || []).join(", ").slice(0, 32),
		eyeColor: (bp.eyeColor || "").slice(0, 32),
		distinctiveMarks: (bp.distinctiveMarks || "").slice(0, 128),
		specialSkill: (bp.specialSkill || "").slice(0, 64),
		likes: (bp.likes || "").slice(0, 128),
		dislikes: (bp.dislikes || "").slice(0, 128),
		personalityTrait: (bp.temperament || "").slice(0, 32),
		additionalNotes: (bp.additionalNotes || "").slice(0, 256),

		// — PatternType (struct { category, visual_pattern, color }) —
		patternType: {
			category: toAnchorEnum(bp.patternType.category || "Tabby"),
			visualPattern: toAnchorEnum(bp.patternType.visualPattern || "Mackerel"),
			color: toAnchorEnum(bp.patternType.color || "Hitam"),
		},

		// — simple enums —
		coatLength: toAnchorEnum(bp.coatLength || "Short"),
		earType: toAnchorEnum(bp.earType || "Pointed"),
		bodySize: toAnchorEnum(bp.bodySize || "Small"),
		bodyType: toAnchorEnum(bp.bodyType || "Ideal"),
		bloodType: toAnchorEnum(bp.bloodType || "A"),
		temperament: toAnchorEnum(bp.temperament || "Friendly"),
		energyLevel: toAnchorEnum(bp.energyLevel || "Calm"),
		socialBehavior: toAnchorEnum(bp.socialBehavior || "Friendly"),
	};
}

/* ================================================================
   Image upload
   ================================================================ */

/** Upload all cat images at once, returns array of { url, filename } */
async function uploadCatImages(images: CatImageUpload[]) {
	const filesWithData = images.filter((img) => img.file != null);
	if (filesWithData.length === 0) return [];

	const fd = new FormData();
	for (const img of filesWithData) {
		fd.append("images", img.file!);
	}

	const { data } = await api.post<{
		images: { url: string; filename: string }[];
	}>("/cats/images", fd, {
		headers: { "Content-Type": "multipart/form-data" },
	});
	return data.images;
}

/* ================================================================
   Hook
   ================================================================ */

export function useSubmitCat() {
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

		// Step 2: build and send a single transaction with createCat + all addCatImage
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
				const counter = await (program.account as any).userCounter.fetch(userCounterPda);
				catCount = counter.catCount as BN;
			} catch {
				// account doesn't exist yet (first registration)
			}

			const [catPda] = PublicKey.findProgramAddressSync(
				[
					Buffer.from("cat"),
					ownerPubkey.toBuffer(),
					catCount.toArrayLike(Buffer, "le", 8),
				],
				program.programId,
			);

			const dobTimestamp = basicInfo.dateOfBirth
				? new BN(Math.floor(new Date(basicInfo.dateOfBirth).getTime() / 1000))
				: new BN(0);

			const bioProfileArg = buildBioProfileArg(bioProfile);

			const createCatIx = await program.methods
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
				.instruction();

			// Derive each image PDA using its position (0, 1, 2…) — the cat doesn't
			// exist on-chain yet so we can't fetch imageCount; we know it starts at 0.
			const imageIxs = await Promise.all(
				uploadedUrls.map((uploaded, i) => {
					const imgDescription = imagesToUpload[i]?.description || "";

					const [catImagePda] = PublicKey.findProgramAddressSync(
						[Buffer.from("cat-image"), catPda.toBuffer(), Buffer.from([i])],
						program.programId,
					);

					return program.methods
						.addCatImage(uploaded.url.slice(0, 256), imgDescription.slice(0, 64))
						.accounts({
							cat: catPda,
							catImage: catImagePda,
							payer: wallet.address,
						})
						.instruction();
				}),
			);

			const tx = new Transaction().add(createCatIx, ...imageIxs);
			await (program.provider as AnchorProvider).sendAndConfirm(tx);

			toast.success("Cat registered on-chain with all images!");
			window.location.replace("/");
		} catch (err) {
			console.error("[register] on-chain transaction failed:", err);
			toast.error("Cat registration failed. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return { handleSubmit, isSubmitting };
}
