"use client";

import { ArrowLeft, ArrowRight, ChevronsRight, Check } from "lucide-react";

interface StepNavButtonsProps {
	/** Called when the user taps "Back" */
	onBack?: () => void;
	/** Called when the user taps "Next" (or "Submit" on last step) */
	onNext?: () => void;
	/** Called when the user taps "Skip" */
	onSkip?: () => void;
	/** Whether this is the last step (shows "Submit" instead of "Next") */
	isLastStep?: boolean;
	/** Whether this is the first step (hides "Back") */
	isFirstStep?: boolean;
	/** Whether the "Skip" button should be shown */
	showSkip?: boolean;
	/** Optional label override for next button */
	nextLabel?: string;
}

export default function StepNavButtons({
	onBack,
	onNext,
	onSkip,
	isLastStep = false,
	isFirstStep = false,
	showSkip = false,
	nextLabel,
}: StepNavButtonsProps) {
	const label = nextLabel ?? (isLastStep ? "Submit" : "Next");

	/* Decide grid columns: 2 cols normally, 3 cols if skip is shown */
	const gridCols = showSkip ? "grid-cols-3" : "grid-cols-2";

	return (
		<div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-100 px-4 py-3 sm:px-6 z-50">
			<div className={`max-w-2xl mx-auto grid ${gridCols} gap-3`}>
				{/* Back */}
				<button
					type="button"
					onClick={onBack}
					disabled={isFirstStep}
					className={[
						"flex items-center justify-center gap-2 rounded-2xl border-2 py-3 font-bold text-sm transition-all active:scale-[0.98]",
						isFirstStep
							? "border-gray-100 text-gray-300 cursor-not-allowed"
							: "border-gray-200 text-gray-700 hover:bg-gray-50",
					].join(" ")}
				>
					<ArrowLeft size={18} />
					Back
				</button>

				{/* Skip (optional) */}
				{showSkip && (
					<button
						type="button"
						onClick={onSkip}
						className="flex items-center justify-center gap-2 rounded-2xl border-2 border-orange-200 bg-orange-50 py-3 text-orange-600 font-bold text-sm hover:bg-orange-100 active:scale-[0.98] transition-all"
					>
						<ChevronsRight size={16} />
						Skip
					</button>
				)}

				{/* Next / Submit */}
				<button
					type="button"
					onClick={onNext}
					className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#4359ea] to-[#5b35d4] hover:from-[#3348d4] hover:to-[#4a2bbd] active:scale-[0.98] py-3 text-white font-bold text-sm shadow-lg shadow-[#4359ea]/30 transition-all"
				>
					{label}
					{isLastStep ? <Check size={18} /> : <ArrowRight size={18} />}
				</button>
			</div>
		</div>
	);
}
