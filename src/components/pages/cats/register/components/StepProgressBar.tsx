"use client";

import { TOTAL_STEPS } from "@/types/registerCat";

interface StepProgressBarProps {
	/** 0-based step index */
	stepIndex: number;
}

export default function StepProgressBar({ stepIndex }: StepProgressBarProps) {
	const currentNumber = stepIndex + 1;
	const progress = Math.round((currentNumber / TOTAL_STEPS) * 100);

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4">
			<div className="flex items-center justify-between mb-2">
				<span className="text-[#4359ea] font-bold text-sm">
					{progress}%
				</span>
				<span className="text-gray-500 font-semibold text-sm">
					{currentNumber} / {TOTAL_STEPS}
				</span>
			</div>
			<div className="h-2 bg-gray-100 rounded-full overflow-hidden">
				<div
					className="h-full bg-gradient-to-r from-[#4359ea] to-[#7c5cfc] rounded-full transition-all duration-500 ease-out"
					style={{ width: `${progress}%` }}
				/>
			</div>
		</div>
	);
}
