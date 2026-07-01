"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
	Cat,
	ChevronDown,
	Eye,
	FileText,
	Heart,
	Loader2,
	Palette,
	Ruler,
	Scissors,
	Search,
	X,
	Activity
} from "lucide-react";
import { useGetBreeds } from "@/hooks/useGetBreeds";
import { useRegisterCat } from "../context/RegisterCatContext";
import StepHeader from "../components/StepHeader";
import StepNavButtons from "../components/StepNavButtons";
import StepProgressBar from "../components/StepProgressBar";

/* ──────────────────────────────────────────────
   Personality traits options
────────────────────────────────────────────── */
const PERSONALITY_OPTIONS = [
	"Playful",
	"Friendly",
	"Curious",
	"Independent",
	"Calm",
];
const MAX_PERSONALITY = 5;

const COAT_LENGTH_OPTIONS = ["Long Hair", "Medium Hair", "Short Hair"] as const;
const EAR_TYPE_OPTIONS = ["Pointed", "Rounded", "Folded"] as const;
const BODY_SIZE_OPTIONS = ["Small", "Medium", "Large"] as const;

const EYE_COLORS = [
	{ name: "Green", color: "#22c55e" },
	{ name: "Blue", color: "#3b82f6" },
	{ name: "Amber", color: "#f59e0b" },
	{ name: "Brown", color: "#92400e" },
	{ name: "Hazel", color: "#84cc16" },
	{ name: "Copper", color: "#ea580c" },
];

/* ================================================================
   FIELDS ONLY — used by the desktop layout panel
   ================================================================ */
/* ================================================================
   FIELDS ONLY — used by the desktop layout panel & mobile view
   ================================================================ */
/* ── Reusable radio group ──────────────────────────── */
const RadioGroup = ({
	label,
	icon,
	options,
	value,
	onChange,
}: {
	label: string;
	icon: React.ReactNode;
	options: readonly string[];
	value: string;
	onChange: (v: string) => void;
}) => (
	<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-4 border-b border-gray-50 last:border-0">
		<div className="flex items-center gap-3 sm:w-[180px] shrink-0">
			<span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg shrink-0">
				{icon}
			</span>
			<span className="text-sm font-bold text-gray-900">{label}</span>
		</div>
		<div className="flex flex-wrap gap-2">
			{options.map((opt) => (
				<button
					key={opt}
					type="button"
					onClick={() => onChange(opt)}
					className={[
						"flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all",
						value === opt
							? "border-[#4359ea] bg-[#4359ea]/10 text-[#4359ea]"
							: "border-gray-200 text-gray-500 hover:border-gray-300",
					].join(" ")}
				>
					<span
						className={[
							"w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
							value === opt ? "border-[#4359ea]" : "border-gray-300",
						].join(" ")}
					>
						{value === opt && (
							<span className="w-2 h-2 rounded-full bg-[#4359ea]" />
						)}
					</span>
					{opt}
				</button>
			))}
		</div>
	</div>
);

export function BioProfileFields() {
	const { formData, updateBioProfile } = useRegisterCat();
	const bio = formData.bioProfile;
	const { data: breeds, isLoading: breedsLoading, isError: breedsError } = useGetBreeds();

	/* ── Breed combobox state ── */
	const [breedSearch, setBreedSearch] = useState("");
	const [breedOpen, setBreedOpen] = useState(false);
	const breedRef = useRef<HTMLDivElement>(null);

	// Close dropdown on outside click
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (breedRef.current && !breedRef.current.contains(e.target as Node)) {
				setBreedOpen(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	const filteredBreeds = (breeds ?? []).filter((b) => {
		const q = breedSearch.toLowerCase();
		return (
			b.name.toLowerCase().includes(q) ||
			(b.name_long && b.name_long.toLowerCase().includes(q))
		);
	});

	const selectBreed = useCallback(
		(name: string) => {
			updateBioProfile({ breed: name });
			setBreedSearch("");
			setBreedOpen(false);
		},
		[updateBioProfile],
	);

	const clearBreed = useCallback(() => {
		updateBioProfile({ breed: "" });
		setBreedSearch("");
	}, [updateBioProfile]);

	const togglePersonality = (trait: string) => {
		const current = bio.personalityTraits;
		if (current.includes(trait)) {
			updateBioProfile({
				personalityTraits: current.filter((t) => t !== trait),
			});
		} else if (current.length < MAX_PERSONALITY) {
			updateBioProfile({ personalityTraits: [...current, trait] });
		}
	};

	return (
		<div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-2">
			{/* 1. Breed */}
			<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-4 border-b border-gray-50">
				<div className="flex items-center gap-3 sm:w-[180px] shrink-0">
					<span className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
						<Cat size={20} />
					</span>
					<span className="text-sm font-bold text-gray-900">
						1. Breed
					</span>
				</div>
				<div className="relative flex-1 w-full" ref={breedRef}>
					{/* Selected breed chip OR search input */}
					{bio.breed && !breedOpen ? (
						<div className="w-full h-11 px-3 pr-10 rounded-xl border border-gray-200 bg-white flex items-center gap-2">
							<span className="text-sm text-gray-900 flex-1 truncate">
								{bio.breed}
							</span>
							<button
								type="button"
								onClick={clearBreed}
								className="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0"
							>
								<X size={12} className="text-gray-500" />
							</button>
							<button
								type="button"
								onClick={() => setBreedOpen(true)}
								className="shrink-0"
							>
								<ChevronDown size={16} className="text-gray-400" />
							</button>
						</div>
					) : (
						<div className="relative">
							<div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
								{breedsLoading ? (
									<Loader2 size={16} className="text-gray-300 animate-spin" />
								) : (
									<Search size={16} className="text-gray-300" />
								)}
							</div>
							<input
								type="text"
								value={breedSearch}
								onChange={(e) => {
									setBreedSearch(e.target.value);
									setBreedOpen(true);
								}}
								onFocus={() => setBreedOpen(true)}
								disabled={breedsLoading}
								placeholder={
									breedsLoading
										? "Loading breeds..."
										: breedsError
											? "Failed to load breeds"
											: "Choose your cat's breed"
								}
								className={[
									"w-full h-11 pl-9 pr-10 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4359ea]/30 focus:border-[#4359ea] transition-all",
									breedSearch ? "text-gray-900" : "text-gray-900",
									"placeholder:text-gray-300",
									breedsLoading ? "opacity-50 cursor-wait" : "",
								].join(" ")}
							/>
							<div className="absolute inset-y-0 right-3 flex items-center">
								<button
									type="button"
									onClick={() => setBreedOpen(!breedOpen)}
									className="p-0.5"
								>
									<ChevronDown
										size={16}
										className={[
											"text-gray-400 transition-transform",
											breedOpen ? "rotate-180" : "",
										].join(" ")}
									/>
								</button>
							</div>
						</div>
					)}

					{/* Dropdown */}
					{breedOpen && !breedsLoading && (
						<div className="absolute z-50 mt-1 w-full max-h-52 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg py-1">
							{filteredBreeds.length === 0 ? (
								<div className="px-3 py-3 text-sm text-gray-400 text-center">
									No breeds found
								</div>
							) : (
								filteredBreeds.map((breed) => (
									<button
										key={breed.id}
										type="button"
										onClick={() => selectBreed(breed.name)}
										className={[
											"w-full text-left px-3 py-2 text-sm transition-colors",
											bio.breed === breed.name
												? "bg-[#4359ea]/10 text-[#4359ea] font-semibold"
												: "text-gray-700 hover:bg-gray-50",
										].join(" ")}
									>
										{breed.name_long
											? `${breed.name} (${breed.name_long})`
											: breed.name}
									</button>
								))
							)}
						</div>
					)}
				</div>
			</div>

			{/* 2. Coat Color */}
			<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-4 border-b border-gray-50">
				<div className="flex items-center gap-3 sm:w-[180px] shrink-0">
					<span className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
						<Palette size={20} />
					</span>
					<span className="text-sm font-bold text-gray-900">
						2. Coat Color
					</span>
				</div>
				<div className="relative flex-1 w-full">
					<select
						value={bio.coatColor}
						onChange={(e) => updateBioProfile({ coatColor: e.target.value })}
						className="w-full h-11 px-3 pr-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4359ea]/30 focus:border-[#4359ea] transition-all appearance-none cursor-pointer"
					>
						<option value="">Select coat color</option>
						<option value="Brown Tabby">Brown Tabby</option>
						<option value="Black">Black</option>
						<option value="White">White</option>
						<option value="Orange Tabby">Orange Tabby</option>
						<option value="Calico">Calico</option>
						<option value="Silver Tabby">Silver Tabby</option>
						<option value="Tortoiseshell">Tortoiseshell</option>
						<option value="Other">Other</option>
					</select>
					<div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
						<ChevronDown size={16} className="text-gray-400" />
					</div>
				</div>
			</div>

			{/* 3. Coat Length */}
			<RadioGroup
				label="3. Coat Length"
				icon={<Scissors size={20} className="text-gray-500" />}
				options={COAT_LENGTH_OPTIONS}
				value={bio.coatLength}
				onChange={(v) =>
					updateBioProfile({
						coatLength: v as (typeof COAT_LENGTH_OPTIONS)[number],
					})
				}
			/>

			{/* 4. Eye Color */}
			<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-4 border-b border-gray-50">
				<div className="flex items-center gap-3 sm:w-[180px] shrink-0">
					<span className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
						<Eye size={20} />
					</span>
					<span className="text-sm font-bold text-gray-900">
						4. Eye Color
					</span>
				</div>
				<div className="relative flex-1 w-full">
					<select
						value={bio.eyeColor}
						onChange={(e) => updateBioProfile({ eyeColor: e.target.value })}
						className="w-full h-11 px-3 pr-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4359ea]/30 focus:border-[#4359ea] transition-all appearance-none cursor-pointer"
					>
						<option value="">Select eye color</option>
						{EYE_COLORS.map((ec) => (
							<option key={ec.name} value={ec.name}>
								{ec.name}
							</option>
						))}
					</select>
					<div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
						<ChevronDown size={16} className="text-gray-400" />
					</div>
				</div>
			</div>

			{/* 5. Ear Type */}
			<RadioGroup
				label="5. Ear Type"
				icon={<Activity size={20} className="text-gray-500" />}
				options={EAR_TYPE_OPTIONS}
				value={bio.earType}
				onChange={(v) =>
					updateBioProfile({
						earType: v as (typeof EAR_TYPE_OPTIONS)[number],
					})
				}
			/>

			{/* 6. Body Size */}
			<RadioGroup
				label="6. Body Size"
				icon={<Ruler size={20} className="text-gray-500" />}
				options={BODY_SIZE_OPTIONS}
				value={bio.bodySize}
				onChange={(v) =>
					updateBioProfile({
						bodySize: v as (typeof BODY_SIZE_OPTIONS)[number],
					})
				}
			/>

			{/* 7. Personality Traits */}
			<div className="py-4 border-b border-gray-50">
				<div className="flex items-center justify-between mb-3">
					<div className="flex items-center gap-3">
						<span className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-500">
							<Heart size={20} />
						</span>
						<span className="text-sm font-bold text-gray-900">
							7. Personality Traits
						</span>
					</div>
					<span className="text-xs font-semibold text-[#4359ea]">
						Selected: {bio.personalityTraits.length}/{MAX_PERSONALITY}
					</span>
				</div>
				<div className="flex flex-wrap gap-2">
					{PERSONALITY_OPTIONS.map((trait) => {
						const isSelected = bio.personalityTraits.includes(trait);
						return (
							<button
								key={trait}
								type="button"
								onClick={() => togglePersonality(trait)}
								className={[
									"flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all",
									isSelected
										? "border-[#4359ea] bg-[#4359ea]/10 text-[#4359ea]"
										: "border-gray-200 text-gray-500 hover:border-gray-300",
								].join(" ")}
							>
								<span
									className={[
										"w-4 h-4 rounded border flex items-center justify-center shrink-0 text-[10px]",
										isSelected
											? "border-[#4359ea] bg-[#4359ea] text-white"
											: "border-gray-300",
									].join(" ")}
								>
									{isSelected && "✓"}
								</span>
								{trait}
							</button>
						);
					})}
				</div>
			</div>

			{/* 8. Additional Notes */}
			<div className="py-4">
				<div className="flex items-center gap-3 mb-3">
					<span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
						<FileText size={20} />
					</span>
					<span className="text-sm font-bold text-gray-900">
						8. Additional Notes
					</span>
				</div>
				<textarea
					value={bio.additionalNotes}
					onChange={(e) =>
						updateBioProfile({ additionalNotes: e.target.value })
					}
					maxLength={300}
					placeholder="Any additional information about your cat..."
					rows={3}
					className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4359ea]/30 focus:border-[#4359ea] transition-all resize-none"
				/>
				<p className="text-right text-[11px] text-gray-400 mt-1">
					{bio.additionalNotes.length}/300
				</p>
			</div>
		</div>
	);
}

/* ================================================================
   FULL SCREEN — mobile / tablet view
   ================================================================ */
export default function BioProfileStep() {
	const { currentStep, goNext, goBack, isFirstStep, isLastStep, canProceed } = useRegisterCat();

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<StepHeader stepIndex={currentStep} onBack={goBack} />

			<div className="flex-1 bg-white -mt-6 rounded-t-[40px] px-5 pt-8 pb-32 sm:px-8 shadow-[0_-8px_20px_rgba(0,0,0,0.04)] relative z-10">
				<div className="max-w-2xl mx-auto space-y-6">
					<StepProgressBar stepIndex={currentStep} />
					
					{/* Re-use the responsive sliced fields */}
					<BioProfileFields />
				</div>
			</div>

			<StepNavButtons
				onBack={goBack}
				onNext={goNext}
				isFirstStep={isFirstStep}
				isLastStep={isLastStep}
				canProceed={canProceed}
			/>
		</div>
	);
}
