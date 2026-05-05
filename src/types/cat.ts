export type CatGender = "Male" | "Female";

export type CatIdentification = {
	hasPaw: boolean;
	hasDNA: boolean;
	hasAncestry: boolean;
};

export type CatDNAProfile = {
	breedPredisposition: string;
	coatPattern: string;
	eyeColorGene: string;
	bloodType: string;
	geneticDiversity: "Low" | "Medium" | "High";
	geneticDiversityPercentage: number;
	inbreedingCoefficient: string;
};

export type CatTraits = {
	furLengthGene: string;
	dilutionGene: string;
	whiteSpotting: string;
	brachycephalicGene: string;
};

export type CatAncestry = {
	region: string;
	percentage: number;
	color: string;
}[];

export type CatMedicalRecord = {
	id: string;
	title: string;
	date: string;
	description: string;
	clinic?: string;
	doctor?: string;
	type: "vaccine" | "checkup" | "surgery" | "other";
};

export type CatFamilyMember = {
	id: string;
	relation: "Sire" | "Dam" | "Sibling" | "Offspring";
	name: string;
	breed: string;
	tokenId: string;
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

	// Extended dynamic details
	weight?: string;
	eyeColor?: string;
	activityLevel?: string;
	microchip?: string;
	about?: string;

	dnaProfile?: CatDNAProfile;
	traits?: CatTraits;
	ancestry?: CatAncestry;
	medicalRecords?: CatMedicalRecord[];
	family?: CatFamilyMember[];
};

export type NavItem = {
	href: string;
	label: string;
	/** path to the active (coloured) icon under /public */
	iconActive: string;
	/** path to the inactive (grey) icon under /public */
	iconInactive: string;
};
