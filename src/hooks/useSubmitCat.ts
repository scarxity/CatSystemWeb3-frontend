"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useWallets } from "@privy-io/react-auth/solana";

import { useRegisterCat } from "@/pages/cats/register/context/RegisterCatContext";
import { createCatProgram } from "@/lib/solana/catSystem";
import type { RegisterCatFormData } from "@/types/registerCat";

function composeDescription(formData: RegisterCatFormData): string {
	const { bioProfile } = formData;
	return [
		bioProfile.breed && `Breed: ${bioProfile.breed}`,
		bioProfile.coatColor &&
			`Coat: ${[bioProfile.coatColor, bioProfile.coatLength].filter(Boolean).join(" ")}`,
		bioProfile.eyeColor && `Eyes: ${bioProfile.eyeColor}`,
		bioProfile.bodySize && `Size: ${bioProfile.bodySize}`,
		bioProfile.personalityTraits.length > 0 &&
			`Traits: ${bioProfile.personalityTraits.join(", ")}`,
		bioProfile.additionalNotes,
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

			const name = formData.basicInfo.catName.slice(0, 32);
			const gender =
				formData.basicInfo.gender === "Female" ? { female: {} } : { male: {} };
			const description = composeDescription(formData);

			await program.methods
				.createCat(name, gender, description)
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
