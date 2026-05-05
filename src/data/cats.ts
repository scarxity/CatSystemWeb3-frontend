import type { Cat } from "@/types/cat";

/**
 * Mock cat data.
 * Replace this with an actual API call, e.g.:
 *   export async function getMyCats(userId: string): Promise<Cat[]> {
 *     const res = await fetch(`/api/cats?userId=${userId}`);
 *     return res.json();
 *   }
 */
export const MOCK_CATS: Cat[] = [
	{
		id: "cat-001",
		name: "Luna",
		breed: "Domestic Shorthair",
		ageLabel: "2 yrs",
		gender: "Female",
		tokenId: "#0012",
		verified: true,
		accentColor: "#7C5CFC",
		cardBg: "#F0EDFF",
		identification: { hasPaw: true, hasDNA: true, hasAncestry: false },
		registeredAt: "May 12, 2024",
		imageUrl:
			"https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=200&auto=format&fit=crop",
		weight: "4.2 kg",
		eyeColor: "Hazel",
		activityLevel: "High",
		microchip: "#982138901233",
		about:
			"Luna is a beautiful 2 yrs old female Domestic Shorthair. Known for her playful and affectionate nature, she loves to spend hours chasing laser pointers.",
		dnaProfile: {
			breedPredisposition: "Domestic Shorthair",
			coatPattern: "Silver Tabby",
			eyeColorGene: "Green (G/D)",
			bloodType: "Type A",
			geneticDiversity: "High",
			geneticDiversityPercentage: 85,
			inbreedingCoefficient: "2.1% (Low)",
		},
		traits: {
			furLengthGene: "Short Hair (ss)",
			dilutionGene: "Non-dilute (DD)",
			whiteSpotting: "None (S/s)",
			brachycephalicGene: "Negative (N/N)",
		},
		ancestry: [
			{ region: "European Domestic", percentage: 62, color: "bg-[#4359ea]" },
			{ region: "Asian Domestic", percentage: 23, color: "bg-purple-600" },
			{ region: "African Wildcat", percentage: 10, color: "bg-cyan-200" },
			{ region: "Middle Eastern", percentage: 5, color: "bg-orange-400" },
		],
	},
	{
		id: "cat-002",
		name: "Oliver",
		breed: "Ragdoll",
		ageLabel: "3 yrs",
		gender: "Male",
		tokenId: "#0013",
		verified: false,
		accentColor: "#3B82F6",
		cardBg: "#EDF6FF",
		identification: { hasPaw: true, hasDNA: false, hasAncestry: false },
		registeredAt: "Jun 01, 2024",
		imageUrl:
			"https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=200&auto=format&fit=crop",
	},
	{
		id: "cat-003",
		name: "Bella",
		breed: "Siamese",
		ageLabel: "1 yr",
		gender: "Female",
		tokenId: "#0014",
		verified: true,
		accentColor: "#F59E0B",
		cardBg: "#FEF3C7",
		identification: { hasPaw: true, hasDNA: true, hasAncestry: true },
		registeredAt: "Jul 15, 2024",
		imageUrl:
			"https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?q=80&w=200&auto=format&fit=crop",
	},
	{
		id: "cat-004",
		name: "Leo",
		breed: "Maine Coon",
		ageLabel: "4 yrs",
		gender: "Male",
		tokenId: "#0015",
		verified: true,
		accentColor: "#10B981",
		cardBg: "#D1FAE5",
		identification: { hasPaw: true, hasDNA: false, hasAncestry: true },
		registeredAt: "Aug 20, 2024",
		imageUrl:
			"https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?q=80&w=200&auto=format&fit=crop",
	},
	{
		id: "cat-005",
		name: "Chloe",
		breed: "Scottish Fold",
		ageLabel: "8 months",
		gender: "Female",
		tokenId: "#0016",
		verified: false,
		accentColor: "#EC4899",
		cardBg: "#FCE7F3",
		identification: { hasPaw: false, hasDNA: true, hasAncestry: false },
		registeredAt: "Sep 05, 2024",
		imageUrl:
			"https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=200&auto=format&fit=crop",
	},
];

/**
 * Simulates fetching the current user's cats.
 * Swap with a real API / blockchain call when ready.
 */
export async function getMyCats(): Promise<Cat[]> {
	// Simulate async network delay
	await new Promise((r) => setTimeout(r, 0));
	return MOCK_CATS;
}
