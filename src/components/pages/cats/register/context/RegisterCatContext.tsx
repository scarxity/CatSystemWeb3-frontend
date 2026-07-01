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
	REGISTER_STEPS,
	type BasicInfoData,
	type BioProfileData,
	type DnaProfileData,
	type FamilyTreeData,
	type HealthReportData,
	type OwnerDataData,
	type RegisterCatFormData,
} from "@/types/registerCat";
import useAuthStore from "@/app/stores/useAuthStore";

/* ================================================================
   Context shape
   ================================================================ */
interface RegisterCatContextValue {
	/** Current step index (0-based internally, 1-based for display) */
	currentStep: number;
	/** Actual step index in the full REGISTER_STEPS array */
	actualStepIndex: number;
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
	/** Whether the current step can proceed (all required fields filled) */
	canProceed: boolean;
	/** Visible steps based on user role */
	visibleSteps: ReadonlyArray<typeof REGISTER_STEPS[number]>;
	/** Total number of visible steps */
	totalVisibleSteps: number;
}

const RegisterCatContext = createContext<RegisterCatContextValue | null>(null);

/* ================================================================
   Validation helpers
   ================================================================ */
function validateBasicInfo(data: BasicInfoData): boolean {
	if (!data.catName.trim()) return false;
	if (!data.dateOfBirth) return false;
	const requiredImages = data.images.slice(0, 4);
	return requiredImages.every(img => img.file !== null);
}

function validateBioProfile(data: BioProfileData): boolean {
	return !!(
		data.breed.trim() &&
		data.coatColor.trim() &&
		data.coatLength &&
		data.eyeColor.trim() &&
		data.earType &&
		data.bodySize
	);
}

function validateDnaProfile(_data: DnaProfileData): boolean {
	return true;
}

function validateHealthReport(_data: HealthReportData): boolean {
	return true;
}

function validateOwnerData(data: OwnerDataData): boolean {
	const basicValid = !!(
		data.ownerName.trim() &&
		data.email.trim() &&
		data.phone.trim() &&
		data.country.trim() &&
		data.city.trim() &&
		data.address.trim() &&
		data.ownerType
	);

	if (!basicValid) return false;

	if (data.ownerType === "Individual Breeder") {
		const breederValid = !!(
			data.breederRegistration.registrationNumber.trim() &&
			data.breederRegistration.organization.trim() &&
			data.breederRegistration.status &&
			data.breederRegistration.certificate
		);
		if (!breederValid) return false;
	}

	return !!(
		data.ownershipProof.documentType &&
		data.ownershipProof.document
	);
}

function validateFamilyTree(_data: FamilyTreeData): boolean {
	return true;
}

function validateStep(step: number, formData: RegisterCatFormData): boolean {
	switch (step) {
		case 0: return validateBasicInfo(formData.basicInfo);
		case 1: return validateBioProfile(formData.bioProfile);
		case 2: return validateDnaProfile(formData.dnaProfile);
		case 3: return validateHealthReport(formData.healthReport);
		case 4: return validateOwnerData(formData.ownerData);
		case 5: return validateFamilyTree(formData.familyTree);
		default: return false;
	}
}

/* ================================================================
   Provider
   ================================================================ */
export function RegisterCatProvider({ children }: { children: ReactNode }) {
	const user = useAuthStore.useUser();
	const [currentStep, setCurrentStep] = useState(0);
	const [formData, setFormData] =
		useState<RegisterCatFormData>(EMPTY_REGISTER_FORM);

	const userData = user?.user_data as Record<string, unknown> | null | undefined;
	const userType = String(userData?.type || "cat_user");
	const isBreeder = userType === "breeder";

	const visibleSteps = useMemo(() => {
		if (isBreeder) {
			return REGISTER_STEPS;
		}
		return REGISTER_STEPS.filter((step, idx) => {
			return idx !== 2 && idx !== 4 && idx !== 5;
		});
	}, [isBreeder]);

	const totalVisibleSteps = visibleSteps.length;

	const stepIndexMap = useMemo(() => {
		const map: number[] = [];
		visibleSteps.forEach((step) => {
			const actualIndex = REGISTER_STEPS.findIndex(s => s.key === step.key);
			map.push(actualIndex);
		});
		return map;
	}, [visibleSteps]);

	const getActualStepIndex = (visibleIndex: number): number => {
		return stepIndexMap[visibleIndex] ?? 0;
	};

	const actualStepIndex = getActualStepIndex(currentStep);

	/* ── Navigation ─────────────────────────────────────────── */
	const goNext = useCallback(
		() => setCurrentStep((s) => Math.min(s + 1, totalVisibleSteps - 1)),
		[totalVisibleSteps],
	);
	const goBack = useCallback(
		() => setCurrentStep((s) => Math.max(s - 1, 0)),
		[],
	);
	const goToStep = useCallback(
		(step: number) => setCurrentStep(Math.max(0, Math.min(step, totalVisibleSteps - 1))),
		[totalVisibleSteps],
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
	const progress = Math.round(((currentStep + 1) / totalVisibleSteps) * 100);
	const isFirstStep = currentStep === 0;
	const isLastStep = currentStep === totalVisibleSteps - 1;
	const canProceed = useMemo(
		() => validateStep(actualStepIndex, formData),
		[actualStepIndex, formData],
	);

	const value = useMemo<RegisterCatContextValue>(
		() => ({
			currentStep,
			actualStepIndex,
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
			canProceed,
			visibleSteps,
			totalVisibleSteps,
		}),
		[
			currentStep,
			actualStepIndex,
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
			canProceed,
			visibleSteps,
			totalVisibleSteps,
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
