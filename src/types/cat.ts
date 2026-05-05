export type CatGender = "Male" | "Female";

export type CatIdentification = {
	hasPaw: boolean;
	hasDNA: boolean;
	hasAncestry: boolean;
};

export type Cat = {
	id: string;
	name: string;
	breed: string;
	ageLabel: string; // e.g. "2 yrs", "8 months"
	gender: CatGender;
	tokenId: string; // e.g. "#0012"
	verified: boolean;
	identification: CatIdentification;
	/** accent color for the card – resolved from breed/owner preference */
	accentColor: string;
	/** light background tint for the card avatar area */
	cardBg: string;
	imageUrl?: string;
	registeredAt?: string;
};

export type NavItem = {
	href: string;
	label: string;
	/** path to the active (coloured) icon under /public */
	iconActive: string;
	/** path to the inactive (grey) icon under /public */
	iconInactive: string;
};
