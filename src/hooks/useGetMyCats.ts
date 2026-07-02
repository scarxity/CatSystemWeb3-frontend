"use client";
import { useQuery } from "@tanstack/react-query";

import api, { baseURL } from "@/lib/api";
import useAuthStore from "@/app/stores/useAuthStore";
import type { Cat } from "@/types/cat";

const FALLBACK_IMAGE =
	"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=200&auto=format&fit=crop";

const ACCENT_COLORS = ["#7C5CFC", "#3B82F6", "#F59E0B", "#10B981", "#EC4899"];
const CARD_BGS = ["#F0EDFF", "#EDF6FF", "#FEF3C7", "#D1FAE5", "#FCE7F3"];

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

/** Shape returned by GET /cats/getlist — only the fields the list card renders. */
interface ApiCat {
	cat_pda: string;
	name: string;
	gender: "Male" | "Female";
	breed: string;
	image_url: string | null;
	block_time: number | null;
}

interface GetListResponse {
	cats: ApiCat[];
}

async function fetchMyCats(): Promise<Cat[]> {
	const { data } = await api.get<GetListResponse>("/cats/getlist");

	return data.cats.map((c, i) => ({
		id: c.cat_pda,
		name: c.name,
		breed: c.breed,
		gender: c.gender,
		ageLabel: "Unknown",
		tokenId: `#${String(i + 1).padStart(4, "0")}`,
		verified: true,
		identification: { hasPaw: false, hasDNA: false, hasAncestry: false },
		accentColor: ACCENT_COLORS[i % ACCENT_COLORS.length],
		cardBg: CARD_BGS[i % CARD_BGS.length],
		imageUrl: resolveImageUrl(c.image_url),
		registeredAt: formatRegisteredAt(c.block_time),
	}));
}

export function useGetMyCats() {
	const user = useAuthStore.useUser();

	return useQuery({
		queryKey: ["my-cats", user?.wallet],
		queryFn: fetchMyCats,
		enabled: !!user?.wallet,
	});
}
