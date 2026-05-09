"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, FastForward } from "lucide-react";
import { useRouter } from "next/navigation";
import { RegisterCatProvider, useRegisterCat } from "./context/RegisterCatContext";
import { REGISTER_STEPS } from "@/types/registerCat";

/* ── Step full-screen components (mobile / tablet) */
import BasicInfoStep from "./steps/BasicInfoStep";
import BioProfileStep from "./steps/BioProfileStep";
import DnaProfileStep from "./steps/DnaProfileStep";
import HealthReportStep from "./steps/HealthReportStep";
import OwnerDataStep from "./steps/OwnerDataStep";
import FamilyTreeStep from "./steps/FamilyTreeStep";

/* ── Fields-only components (desktop panel) */
import { BasicInfoFields } from "./steps/BasicInfoStep";
import { BioProfileFields } from "./steps/BioProfileStep";
import { DnaProfileFields } from "./steps/DnaProfileStep";
import { HealthReportFields } from "./steps/HealthReportStep";
import { OwnerDataFields } from "./steps/OwnerDataStep";
import { FamilyTreeFields } from "./steps/FamilyTreeStep";

/* ──────────────────────────────────────────────────────────────
   Mobile/Tablet — full-screen steps (lg:hidden)
   These components manage their own gradient header + bottom nav.
────────────────────────────────────────────────────────────── */
const MOBILE_STEPS = [
	BasicInfoStep,
	BioProfileStep,
	DnaProfileStep,
	HealthReportStep,
	OwnerDataStep,
	FamilyTreeStep,
];

function MobileStepRouter() {
	const { currentStep } = useRegisterCat();
	const StepComponent = MOBILE_STEPS[currentStep];
	if (!StepComponent) return null;
	return <StepComponent />;
}

/* ──────────────────────────────────────────────────────────────
   Desktop — Step stepper sidebar (left column)
────────────────────────────────────────────────────────────── */
function DesktopStepper() {
	const { currentStep, goToStep } = useRegisterCat();

	return (
		<aside className="w-[220px] xl:w-[260px] shrink-0">
			<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sticky top-6">
				{/* Header */}
				<div className="mb-4 pb-4 border-b border-gray-50">
					<p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
						Registration Steps
					</p>
				</div>

				{/* Step list */}
				<nav className="flex flex-col gap-1" aria-label="Registration steps">
					{REGISTER_STEPS.map((step, idx) => {
						const isCompleted = idx < currentStep;
						const isCurrent = idx === currentStep;
						const isUpcoming = idx > currentStep;

						return (
							<button
								key={step.key}
								type="button"
								onClick={() => isCompleted && goToStep(idx)}
								aria-current={isCurrent ? "step" : undefined}
								disabled={isUpcoming}
								className={[
									"flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 w-full",
									isCurrent
										? "bg-[#4359ea] text-white shadow-md shadow-[#4359ea]/20"
										: isCompleted
											? "text-[#4359ea] hover:bg-[#4359ea]/8 cursor-pointer"
											: "text-gray-300 cursor-default",
								].join(" ")}
							>
								{/* Circle indicator */}
								<span
									className={[
										"w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0",
										isCurrent
											? "bg-white/25 text-white"
											: isCompleted
												? "bg-[#4359ea] text-white"
												: "bg-gray-100 text-gray-300",
									].join(" ")}
								>
									{isCompleted ? <CheckCircle2 size={13} /> : step.number}
								</span>

								{/* Label */}
								<div className="min-w-0">
									<p className={["text-[12px] font-bold truncate", isCurrent ? "text-white" : ""].join(" ")}>
										{step.title}
									</p>
									<p className={["text-[10px] truncate", isCurrent ? "text-white/70" : isCompleted ? "text-[#4359ea]/50" : "text-gray-300"].join(" ")}>
										{step.subtitle}
									</p>
								</div>
							</button>
						);
					})}
				</nav>

				{/* Overall progress */}
				<div className="mt-4 pt-4 border-t border-gray-50">
					<div className="flex justify-between text-[11px] font-semibold mb-1.5">
						<span className="text-gray-400">Overall</span>
						<span className="text-[#4359ea]">
							{currentStep + 1} / {REGISTER_STEPS.length}
						</span>
					</div>
					<div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
						<div
							className="h-full bg-gradient-to-r from-[#4359ea] to-[#7c5cfc] rounded-full transition-all duration-500"
							style={{
								width: `${Math.round(((currentStep + 1) / REGISTER_STEPS.length) * 100)}%`,
							}}
						/>
					</div>
				</div>
			</div>
		</aside>
	);
}

/* ──────────────────────────────────────────────────────────────
   Desktop — Navigation buttons (inside content card)
────────────────────────────────────────────────────────────── */
function DesktopNavButtons() {
	const router = useRouter();
	const { goNext, goBack, isFirstStep, isLastStep, currentStep } = useRegisterCat();
	// Family Tree (step 5) is optional
	const showSkip = currentStep === 5;

	const handleNext = () => {
		if (isLastStep) {
			router.push("/");
		} else {
			goNext();
		}
	};

	return (
		<div className="flex items-center justify-between pt-5 mt-6 border-t border-gray-100">
			{/* Back */}
			<button
				type="button"
				onClick={goBack}
				disabled={isFirstStep}
				className={[
					"flex items-center gap-2 px-5 py-3 rounded-2xl border-2 text-sm font-bold transition-all active:scale-[0.98]",
					isFirstStep
						? "border-gray-100 text-gray-300 cursor-not-allowed"
						: "border-gray-200 text-gray-700 hover:bg-gray-50",
				].join(" ")}
			>
				<ArrowLeft size={16} /> Back
			</button>

			<div className="flex gap-2">
				{/* Skip (Family Tree only) */}
				{showSkip && (
					<button
						type="button"
						onClick={() => router.push("/")}
						className="flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-orange-200 bg-orange-50 text-orange-600 text-sm font-bold hover:bg-orange-100 active:scale-[0.98] transition-all"
					>
						<FastForward size={14} /> Skip
					</button>
				)}

				{/* Next / Submit */}
				<button
					type="button"
					onClick={handleNext}
					className="flex items-center justify-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-[#4359ea] to-[#5b35d4] hover:from-[#3348d4] hover:to-[#4a2bbd] text-white text-sm font-bold shadow-lg shadow-[#4359ea]/30 active:scale-[0.98] transition-all min-w-[130px]"
				>
					{isLastStep ? (
						<>Submit <CheckCircle2 size={16} /></>
					) : (
						<>Next <ArrowRight size={16} /></>
					)}
				</button>
			</div>
		</div>
	);
}

/* ──────────────────────────────────────────────────────────────
   Desktop — Form fields mapped per step
────────────────────────────────────────────────────────────── */
const DESKTOP_FIELDS = [
	BasicInfoFields,
	BioProfileFields,
	DnaProfileFields,
	HealthReportFields,
	OwnerDataFields,
	FamilyTreeFields,
];

function DesktopFormPanel() {
	const { currentStep } = useRegisterCat();
	const step = REGISTER_STEPS[currentStep];
	const FieldsComponent = DESKTOP_FIELDS[currentStep];
	if (!FieldsComponent || !step) return null;

	return (
		<div className="flex-1 min-w-0">
			<div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 xl:p-8">
				{/* Step heading inside the card */}
				<div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
					<div className="w-10 h-10 rounded-xl bg-[#4359ea]/10 flex items-center justify-center shrink-0">
						<span className="text-[#4359ea] font-extrabold text-sm">
							{String(currentStep + 1).padStart(2, "0")}
						</span>
					</div>
					<div>
						<h1 className="text-base font-extrabold text-gray-900">{step.title}</h1>
						<p className="text-sm text-gray-400">{step.subtitle}</p>
					</div>
				</div>

				{/* Active step fields */}
				<div key={currentStep}>
					<FieldsComponent />
				</div>

				<DesktopNavButtons />
			</div>
		</div>
	);
}

/* ──────────────────────────────────────────────────────────────
   Desktop — Full layout (rendered inside app's Layout/navbar)
   Shows stepper sidebar + form panel side by side.
   The app's sidebar navbar is already rendered by Layout.tsx.
────────────────────────────────────────────────────────────── */
function DesktopLayout() {
	return (
		<div className="px-6 xl:px-10 py-8">
			{/* Page title */}
			<div className="mb-6 flex items-center gap-4">
				<button 
					type="button" 
					onClick={() => window.location.href = "/"}
					className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all"
				>
					<ArrowLeft size={18} />
				</button>
				<div>
					<h2 className="text-xl font-extrabold text-gray-900">Register Your Cat</h2>
					<p className="text-sm text-gray-400 mt-1">
						Complete all 6 steps to register your cat on OLPaw.
					</p>
				</div>
			</div>

			{/* Two-column: stepper + form */}
			<div className="flex gap-6 xl:gap-8 items-start">
				<DesktopStepper />
				<DesktopFormPanel />
			</div>
		</div>
	);
}

/* ──────────────────────────────────────────────────────────────
   Page entry — one provider, two layouts via CSS
   
   ┌─────────────────────────────────────────────┐
   │  MOBILE  (< lg): full-screen per step        │
   │  DESKTOP (≥ lg): stepper + panel in Layout   │
   └─────────────────────────────────────────────┘
────────────────────────────────────────────────────────────── */
export default function RegisterCatPage() {
	return (
		<RegisterCatProvider>
			{/* Mobile / Tablet — full-screen steps */}
			<div className="lg:hidden">
				<MobileStepRouter />
			</div>

			{/* Desktop — sidebar stepper + form panel */}
			{/* (App navbar already rendered by Layout in page.tsx) */}
			<div className="hidden lg:block">
				<DesktopLayout />
			</div>
		</RegisterCatProvider>
	);
}
