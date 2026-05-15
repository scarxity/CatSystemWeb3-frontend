"use client";

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import type { ReactNode } from "react";
import {
	EMPTY_REGISTER_FORM,
	TOTAL_STEPS,
	type BasicInfoData,
	type BioProfileData,
	type DnaProfileData,
	type FamilyTreeData,
	type HealthReportData,
	type OwnerDataData,
	type RegisterCatFormData,
} from "@/types/registerCat";

/* ================================================================
   Context shape
   ================================================================ */
interface RegisterCatContextValue {
	/** Current step index (0-based internally, 1-based for display) */
	currentStep: number;
	/** Full form state across all steps */
	formData: RegisterCatFormData;
	/** Navigate to the next step */
	goNext: () => void;
	/** Navigate to the previous step */
	goBack: () => void;
	/** Jump to a specific step (0-based) */
	goToStep: (step: number) => void;
	/** Update a specific step's data */
	updateBasicInfo: (data: Partial<BasicInfoData>) => void;
	updateBioProfile: (data: Partial<BioProfileData>) => void;
	updateDnaProfile: (data: Partial<DnaProfileData>) => void;
	updateHealthReport: (data: Partial<HealthReportData>) => void;
	updateOwnerData: (data: Partial<OwnerDataData>) => void;
	updateFamilyTree: (data: Partial<FamilyTreeData>) => void;
	/** Progress percentage */
	progress: number;
	/** Whether the current step is the first one */
	isFirstStep: boolean;
	/** Whether the current step is the last one */
	isLastStep: boolean;
}

const RegisterCatContext = createContext<RegisterCatContextValue | null>(null);

/* ================================================================
   Provider
   ================================================================ */
export function RegisterCatProvider({ children }: { children: ReactNode }) {
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] =
		useState<RegisterCatFormData>(EMPTY_REGISTER_FORM);

	/* ── Navigation ─────────────────────────────────────────── */
	const goNext = useCallback(
		() => setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS - 1)),
		[],
	);
	const goBack = useCallback(
		() => setCurrentStep((s) => Math.max(s - 1, 0)),
		[],
	);
	const goToStep = useCallback(
		(step: number) => setCurrentStep(Math.max(0, Math.min(step, TOTAL_STEPS - 1))),
		[],
	);

	/* ── Step updaters ──────────────────────────────────────── */
	const updateBasicInfo = useCallback(
		(data: Partial<BasicInfoData>) =>
			setFormData((prev) => ({
				...prev,
				basicInfo: { ...prev.basicInfo, ...data },
			})),
		[],
	);

	const updateBioProfile = useCallback(
		(data: Partial<BioProfileData>) =>
			setFormData((prev) => ({
				...prev,
				bioProfile: { ...prev.bioProfile, ...data },
			})),
		[],
	);

	const updateDnaProfile = useCallback(
		(data: Partial<DnaProfileData>) =>
			setFormData((prev) => ({
				...prev,
				dnaProfile: { ...prev.dnaProfile, ...data },
			})),
		[],
	);

	const updateHealthReport = useCallback(
		(data: Partial<HealthReportData>) =>
			setFormData((prev) => ({
				...prev,
				healthReport: { ...prev.healthReport, ...data },
			})),
		[],
	);

	const updateOwnerData = useCallback(
		(data: Partial<OwnerDataData>) =>
			setFormData((prev) => ({
				...prev,
				ownerData: { ...prev.ownerData, ...data },
			})),
		[],
	);

	const updateFamilyTree = useCallback(
		(data: Partial<FamilyTreeData>) =>
			setFormData((prev) => ({
				...prev,
				familyTree: { ...prev.familyTree, ...data },
			})),
		[],
	);

	/* ── Derived ────────────────────────────────────────────── */
	const progress = Math.round(((currentStep + 1) / TOTAL_STEPS) * 100);
	const isFirstStep = currentStep === 0;
	const isLastStep = currentStep === TOTAL_STEPS - 1;

	const value = useMemo<RegisterCatContextValue>(
		() => ({
			currentStep,
			formData,
			goNext,
			goBack,
			goToStep,
			updateBasicInfo,
			updateBioProfile,
			updateDnaProfile,
			updateHealthReport,
			updateOwnerData,
			updateFamilyTree,
			progress,
			isFirstStep,
			isLastStep,
		}),
		[
			currentStep,
			formData,
			goNext,
			goBack,
			goToStep,
			updateBasicInfo,
			updateBioProfile,
			updateDnaProfile,
			updateHealthReport,
			updateOwnerData,
			updateFamilyTree,
			progress,
			isFirstStep,
			isLastStep,
		],
	);

	return (
		<RegisterCatContext.Provider value={value}>
			{children}
		</RegisterCatContext.Provider>
	);
}

/* ================================================================
   Hook
   ================================================================ */
export function useRegisterCat(): RegisterCatContextValue {
	const ctx = useContext(RegisterCatContext);
	if (!ctx) {
		throw new Error(
			"useRegisterCat must be used within <RegisterCatProvider>",
		);
	}
	return ctx;
}
