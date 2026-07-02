"use client";
import { useQuery } from "@tanstack/react-query";

import api, { baseURL } from "@/lib/api";
import type { Cat } from "@/types/cat";

const FALLBACK_IMAGE =
	"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=200&auto=format&fit=crop";

function resolveImageUrl(url: string | null | undefined): string {
	if (!url) return FALLBACK_IMAGE;
	if (url.startsWith("http")) return url;
	return `${baseURL ?? ""}${url}`;
}

function formatRegisteredAt(blockTime: number | null): string | undefined {
	if (!blockTime) return undefined;
	return new Date(blockTime * 1000).toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});
}

/** "Short" → "Short Hair"; leaves already-suffixed / empty values sensible. */
function coatLengthLabel(value: string): string {
	if (!value) return "Unknown";
	return /hair/i.test(value) ? value : `${value} Hair`;
}

function parseDescription(description: string | undefined): {
	personality: string[];
	about: string | undefined;
} {
	if (!description) return { personality: [], about: undefined };
	// Supports format: "Traits: Friendly, Curious, Playful. some note"
	const traitsMatch = description.match(/Traits?:\s*([^.]+)(?:\.\s*(.*))?/i);
	if (traitsMatch) {
		const personality = traitsMatch[1]
			.split(",")
			.map((t) => t.trim())
			.filter(Boolean);
		const about = traitsMatch[2] ? traitsMatch[2].trim() : undefined;
		return { personality, about };
	}
	return { personality: [], about: description };
}

/** Shape returned by GET /cats/getindividual/:pda */
interface ApiCatDetail {
	cat_pda: string;
	owner_wallet: string;
	name: string;
	gender: "Male" | "Female";
	image_url: string | null;
	block_time: number | null;
	bio_profile: {
		breed: string;
		coat_color: string;
		coat_length: string;
		eye_color: string;
		ear_type: string;
		body_size: string;
		personality_trait: string;
		description: string;
	};
}

interface GetIndividualResponse {
	cat: ApiCatDetail;
}

async function fetchCat(pda: string): Promise<Cat> {
	const { data } = await api.get<GetIndividualResponse>(
		`/cats/getindividual/${pda}`,
	);
	const c = data.cat;
	const bio = c.bio_profile;
	const { personality, about } = parseDescription(bio.description);

	return {
		id: c.cat_pda,
		name: c.name,
		breed: bio.breed,
		gender: c.gender,
		eyeColor: bio.eye_color,
		about,
		ageLabel: "Unknown",
		tokenId: "#0000",
		verified: true,
		identification: { hasPaw: false, hasDNA: false, hasAncestry: false },
		accentColor: "#7C5CFC",
		cardBg: "#F0EDFF",
		imageUrl: resolveImageUrl(c.image_url),
		registeredAt: formatRegisteredAt(c.block_time),
		// DNA profile – populated from indexed on-chain data
		dnaProfile: {
			breed: bio.breed,
			coatColor: bio.coat_color || "",
			coatLength: coatLengthLabel(bio.coat_length),
			earType: bio.ear_type || "Unknown",
			bodySize: bio.body_size || "Unknown",
			eyeColor: bio.eye_color || "",
		},
		// Bio
		bio:
			personality.length > 0
				? {
						dateOfBirth: "",
						color: bio.coat_color || "",
						personality,
						vaccinated: false,
						neutered: false,
						indoor: false,
						diet: "",
						favoriteFood: "",
					}
				: undefined,
		owner: {
			name: "Owner",
			walletAddress: c.owner_wallet,
			registeredDate: "",
			location: "",
			totalCats: 0,
			verificationStatus: "Verified" as const,
		},
	};
}

export function useGetCat(pda: string | undefined) {
	return useQuery({
		queryKey: ["cat", pda],
		queryFn: () => fetchCat(pda as string),
		enabled: !!pda,
	});
}
