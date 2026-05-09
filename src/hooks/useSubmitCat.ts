"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useWallets } from "@privy-io/react-auth/solana";

import { useRegisterCat } from "@/pages/cats/register/context/RegisterCatContext";
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
		bio.personalityTraits.length > 0 && `Traits: ${bio.personalityTraits.join(", ")}`,
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
				.accounts({ owner: wallet.address })
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
