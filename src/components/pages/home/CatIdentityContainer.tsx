"use client";

import type { Cat } from "@/types/cat";
import { useGetCat } from "@/hooks/useGetCat";
import CatIdentityView from "./CatIdentityView";

interface CatIdentityContainerProps {
	/** The lightweight cat object from the list card, used for instant header display. */
	listCat: Cat;
	onBack: () => void;
	onEdit?: (cat: Cat) => void;
}

/**
 * Fetches the full cat detail (DNA / bio / owner) from the backend and renders
 * the identity view. Until the detail loads, the list card object is shown so
 * the header (name, photo, gender) appears instantly.
 */
export default function CatIdentityContainer({
	listCat,
	onBack,
	onEdit,
}: CatIdentityContainerProps) {
	const { data } = useGetCat(listCat.id);
	const cat = data ?? listCat;

	return <CatIdentityView cat={cat} onBack={onBack} onEdit={onEdit} />;
}
