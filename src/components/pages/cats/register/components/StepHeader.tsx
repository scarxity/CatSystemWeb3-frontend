"use client";

import { ArrowLeft } from "lucide-react";
import { useRegisterCat } from "../context/RegisterCatContext";

/* ──────────────────────────────────────────────
   Paw print SVG (decorative)
────────────────────────────────────────────── */
function PawIcon({
	className = "",
	size = 80,
}: {
	className?: string;
	size?: number;
}) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 80 80"
			fill="currentColor"
			className={className}
			aria-hidden="true"
		>
			<ellipse cx="16" cy="18" rx="8" ry="11" opacity="0.5" />
			<ellipse cx="36" cy="10" rx="7" ry="10" opacity="0.5" />
			<ellipse cx="55" cy="10" rx="7" ry="10" opacity="0.5" />
			<ellipse cx="68" cy="20" rx="7" ry="10" opacity="0.5" />
			<path
				d="M40 28 C20 28 10 48 16 62 C20 72 32 74 40 70 C48 74 60 72 64 62 C70 48 60 28 40 28Z"
				opacity="0.6"
			/>
		</svg>
	);
}

/* ──────────────────────────────────────────────
   Props
────────────────────────────────────────────── */
interface StepHeaderProps {
	/** 0-based step index */
	stepIndex: number;
	/** Called when the back arrow is pressed */
	onBack?: () => void;
}

/* ──────────────────────────────────────────────
   Component
────────────────────────────────────────────── */
export default function StepHeader({ stepIndex, onBack }: StepHeaderProps) {
	const { visibleSteps } = useRegisterCat();
	const step = visibleSteps[stepIndex];
	if (!step) return null;

	return (
		<div className="relative overflow-hidden bg-gradient-to-br from-[#4359ea] via-[#5b6ef5] to-[#9b5de5] pt-10 pb-14 px-5 flex flex-col items-center md:pt-12 md:pb-16">
			{/* Back button */}
			{onBack && (
				<button
					type="button"
					onClick={onBack}
					aria-label="Go back"
					className="absolute left-4 top-10 md:left-6 md:top-12 text-white/90 hover:text-white transition-colors z-10"
				>
					<ArrowLeft size={24} strokeWidth={2.5} />
				</button>
			)}

			{/* Decorative paw prints */}
			<PawIcon
				className="absolute left-2 top-6 text-white/15 -rotate-12 md:left-8 md:top-4"
				size={70}
			/>
			<PawIcon
				className="absolute right-0 top-4 text-white/15 rotate-6 md:right-6 md:top-2"
				size={90}
			/>

			{/* Title */}
			<h1 className="text-white text-2xl md:text-3xl font-bold tracking-wide mt-1">
				OLPaw
			</h1>
			<h2 className="text-white text-xl md:text-2xl font-extrabold mt-0.5 text-center">
				{step.title}
			</h2>
			<p className="text-white/80 text-sm md:text-base mt-1 text-center">
				Step {stepIndex + 1} of {visibleSteps.length}: {step.subtitle}
			</p>
		</div>
	);
}
