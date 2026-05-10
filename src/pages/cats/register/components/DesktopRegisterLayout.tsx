"use client";

import { ArrowLeft, ArrowRight, CheckCircle2, FastForward } from "lucide-react";
import Image from "next/image";
import { REGISTER_STEPS } from "@/types/registerCat";
import { useRegisterCat } from "../context/RegisterCatContext";

/* ──────────────────────────────────────────────
   Step sidebar (desktop only)
────────────────────────────────────────────── */
function DesktopSidebar() {
	const { currentStep, goToStep } = useRegisterCat();

	return (
		<aside className="w-[260px] xl:w-[300px] shrink-0 flex flex-col gap-4">
			{/* Brand */}
			<div className="flex items-center gap-3 px-4 pb-2">
				<div className="w-9 h-9 rounded-xl bg-[#4359ea] flex items-center justify-center shrink-0">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="white"
						aria-hidden="true"
					>
						<circle cx="5.5" cy="6" r="2.5" opacity="0.9" />
						<circle cx="12" cy="3.5" r="2" opacity="0.9" />
						<circle cx="18.5" cy="6" r="2.5" opacity="0.9" />
						<path d="M12 8c-4 0-7 3-6 7 .7 2.8 3.5 4 6 3 2.5 1 5.3-.2 6-3 1-4-2-7-6-7z" />
					</svg>
				</div>
				<div>
					<p className="text-[15px] font-extrabold text-[#4359ea] leading-tight">
						OLPaw
					</p>
					<p className="text-[11px] text-gray-400 leading-tight">
						Register Your Cat
					</p>
				</div>
			</div>

			{/* Step list */}
			<nav aria-label="Registration steps" className="flex flex-col gap-1">
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
								"flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200",
								isCurrent
									? "bg-[#4359ea] text-white shadow-lg shadow-[#4359ea]/25"
									: isCompleted
										? "bg-[#4359ea]/8 text-[#4359ea] hover:bg-[#4359ea]/15 cursor-pointer"
										: "text-gray-400 cursor-default",
							].join(" ")}
						>
							{/* Step circle / check */}
							<span
								className={[
									"w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all",
									isCurrent
										? "bg-white/20 text-white"
										: isCompleted
											? "bg-[#4359ea] text-white"
											: "bg-gray-100 text-gray-400",
								].join(" ")}
							>
								{isCompleted ? (
									<CheckCircle2 size={16} />
								) : (
									step.number
								)}
							</span>

							{/* Label */}
							<div className="min-w-0">
								<p
									className={[
										"text-[13px] font-bold leading-tight truncate",
										isCurrent ? "text-white" : "",
									].join(" ")}
								>
									{step.title}
								</p>
								<p
									className={[
										"text-[11px] truncate mt-0.5",
										isCurrent
											? "text-white/70"
											: isCompleted
												? "text-[#4359ea]/60"
												: "text-gray-300",
									].join(" ")}
								>
									{step.subtitle}
								</p>
							</div>
						</button>
					);
				})}
			</nav>

			{/* Overall progress */}
			<div className="mt-auto px-4 pb-2">
				<div className="flex justify-between text-[11px] font-semibold mb-1.5">
					<span className="text-gray-500">Progress</span>
					<span className="text-[#4359ea]">
						{currentStep + 1}/{REGISTER_STEPS.length}
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
		</aside>
	);
}

/* ──────────────────────────────────────────────
   Desktop nav buttons (rendered inside content panel)
────────────────────────────────────────────── */
interface DesktopNavButtonsProps {
	showSkip?: boolean;
}

function DesktopNavButtons({ showSkip = false }: DesktopNavButtonsProps) {
	const { goNext, goBack, isFirstStep, isLastStep } = useRegisterCat();

	return (
		<div
			className={[
				"flex gap-3 pt-6 border-t border-gray-100 mt-6",
				showSkip ? "justify-between" : "justify-end",
			].join(" ")}
		>
			<button
				type="button"
				onClick={goBack}
				disabled={isFirstStep}
				className={[
					"flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 text-sm font-bold transition-all",
					isFirstStep
						? "border-gray-100 text-gray-300 cursor-not-allowed"
						: "border-gray-200 text-gray-700 hover:bg-gray-50 active:scale-[0.98]",
				].join(" ")}
			>
				<ArrowLeft size={16} />
				Back
			</button>

			<div className="flex gap-2">
				{showSkip && (
					<button
						type="button"
						onClick={goNext}
						className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-500 text-sm font-bold hover:bg-gray-50 active:scale-[0.98] transition-all"
					>
						<FastForward size={15} />
						Skip
					</button>
				)}
				<button
					type="button"
					onClick={goNext}
					className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#4359ea] to-[#5b35d4] hover:from-[#3348d4] hover:to-[#4a2bbd] text-white text-sm font-bold shadow-md shadow-[#4359ea]/25 active:scale-[0.98] transition-all"
				>
					{isLastStep ? "Submit" : "Next"}
					<ArrowRight size={16} />
				</button>
			</div>
		</div>
	);
}

/* ──────────────────────────────────────────────
   Desktop layout wrapper
────────────────────────────────────────────── */
interface DesktopRegisterLayoutProps {
	children: React.ReactNode;
	showSkip?: boolean;
}

export default function DesktopRegisterLayout({
	children,
	showSkip = false,
}: DesktopRegisterLayoutProps) {
	const { currentStep } = useRegisterCat();
	const step = REGISTER_STEPS[currentStep];

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			{/* ── Top header bar ───────────────────── */}
			<header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center gap-4 sticky top-0 z-40">
				<div className="flex items-center gap-2.5">
					<div className="w-8 h-8 rounded-lg bg-[#4359ea] flex items-center justify-center">
						<svg
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="white"
							aria-hidden="true"
						>
							<circle cx="5.5" cy="6" r="2.5" opacity="0.9" />
							<circle cx="12" cy="3.5" r="2" opacity="0.9" />
							<circle cx="18.5" cy="6" r="2.5" opacity="0.9" />
							<path d="M12 8c-4 0-7 3-6 7 .7 2.8 3.5 4 6 3 2.5 1 5.3-.2 6-3 1-4-2-7-6-7z" />
						</svg>
					</div>
					<span className="text-[16px] font-extrabold text-[#4359ea]">
						OLPaw
					</span>
					<span className="text-gray-300 mx-1">|</span>
					<span className="text-[14px] font-medium text-gray-500">
						Register Your Cat
					</span>
				</div>
				{/* Step breadcrumb */}
				<div className="ml-auto text-sm text-gray-400">
					<span className="font-bold text-gray-700">
						{step?.title}
					</span>
					{" "}
					<span>
						— Step {currentStep + 1} of {REGISTER_STEPS.length}
					</span>
				</div>
			</header>

			{/* ── Main 2-column layout ─────────────── */}
			<div className="flex-1 max-w-6xl xl:max-w-7xl mx-auto w-full px-6 xl:px-10 py-8 flex gap-8 xl:gap-10">
				{/* Sidebar */}
				<DesktopSidebar />

				{/* Content panel */}
				<div className="flex-1 min-w-0">
					<div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 xl:p-8">
						{/* Step title inside content */}
						<div className="mb-6 pb-5 border-b border-gray-100">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-xl bg-[#4359ea]/10 flex items-center justify-center shrink-0">
									<span className="text-[#4359ea] font-extrabold text-sm">
										{(currentStep + 1).toString().padStart(2, "0")}
									</span>
								</div>
								<div>
									<h1 className="text-lg font-extrabold text-gray-900">
										{step?.title}
									</h1>
									<p className="text-sm text-gray-400 mt-0.5">
										{step?.subtitle}
									</p>
								</div>
							</div>
						</div>

						{/* Scrollable form fields */}
						<div className="space-y-5">{children}</div>

						{/* Navigation */}
						<DesktopNavButtons showSkip={showSkip} />
					</div>
				</div>
			</div>
		</div>
	);
}
