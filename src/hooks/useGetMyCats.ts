"use client";
import { useQuery } from "@tanstack/react-query";
import { useWallets } from "@privy-io/react-auth/solana";

import { createReadOnlyCatProgram } from "@/lib/solana/catSystem";
import type { Cat } from "@/types/cat";

const IMAGE_URLS = [
	"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=200&auto=format&fit=crop",
	"https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=200&auto=format&fit=crop",
	"https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=200&auto=format&fit=crop",
	"https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?q=80&w=200&auto=format&fit=crop",
	"https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=200&auto=format&fit=crop",
];

const ACCENT_COLORS = ["#7C5CFC", "#3B82F6", "#F59E0B", "#10B981", "#EC4899"];
const CARD_BGS = ["#F0EDFF", "#EDF6FF", "#FEF3C7", "#D1FAE5", "#FCE7F3"];

function fromGender(val: Record<string, unknown>): "Male" | "Female" {
	return "female" in val ? "Female" : "Male";
}

async function fetchMyCats(walletAddress: string): Promise<Cat[]> {
	// biome-ignore lint/suspicious/noExplicitAny: Generic Anchor Idl type doesn't expose account names
	const program = createReadOnlyCatProgram() as any;
	const accounts: { publicKey: { toBase58(): string }; account: unknown }[] =
		await program.account.cat.all([
			{
				memcmp: {
					offset: 8,
					bytes: walletAddress,
				},
			},
		]);

	return accounts.map((acc, i) => {
		// biome-ignore lint/suspicious/noExplicitAny: Anchor decoded account, not strongly typed
		const d = acc.account as any;
		const ownerPubkey = d.owner?.toBase58?.() ?? walletAddress;

		return {
			id: acc.publicKey.toBase58() as string,
			name: d.name as string,
			breed: d.breed as string,
			gender: fromGender(d.gender as Record<string, unknown>),
			eyeColor: d.eyeColor as string,
			about: (d.description as string) || undefined,
			owner: {
				name: "Owner",
				walletAddress: ownerPubkey,
				registeredDate: "",
				location: "",
				totalCats: 0,
				verificationStatus: "Verified" as const,
			},
			ageLabel: "Unknown",
			registeredAt: "May 10, 2026",
			tokenId: `#${String(i + 1).padStart(4, "0")}`,
			verified: true,
			identification: { hasPaw: false, hasDNA: false, hasAncestry: false },
			accentColor: ACCENT_COLORS[i % ACCENT_COLORS.length],
			cardBg: CARD_BGS[i % CARD_BGS.length],
			imageUrl: IMAGE_URLS[i % IMAGE_URLS.length],
		};
	});
}

export function useGetMyCats() {
	const { wallets } = useWallets();
	const wallet = wallets[0];

	return useQuery({
		queryKey: ["my-cats", wallet?.address],
		queryFn: () => fetchMyCats(wallet!.address),
		enabled: !!wallet,
	});
}
