"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
	Brain,
	Cat,
	ChevronDown,
	Droplet,
	Dumbbell,
	Ear,
	Eye,
	FileText,
	Heart,
	Loader2,
	Paintbrush,
	Palette,
	Ruler,
	Scissors,
	Search,
	Sparkles,
	Star,
	ThumbsDown,
	ThumbsUp,
	Users,
	X,
	Zap,
} from "lucide-react";
import { useGetBreeds } from "@/hooks/useGetBreeds";
import { useRegisterCat } from "../context/RegisterCatContext";
import type {
	PatternCategory,
	VisualPattern,
	PatternColor,
	CoatLength,
	EarType,
	BodySize,
	BodyType,
	BloodType,
	Temperament,
	EnergyLevel,
	SocialBehavior,
} from "@/types/registerCat";
import StepHeader from "../components/StepHeader";
import StepNavButtons from "../components/StepNavButtons";
import StepProgressBar from "../components/StepProgressBar";

/* ──────────────────────────────────────────────
   Options – values match IDL enum variant names.
   { value, label } pairs let us show friendly text
   to the user while storing the Anchor-ready variant.
────────────────────────────────────────────── */
interface SelectOption<T extends string = string> {
	value: T;
	label: string;
}

const COAT_COLOR_OPTIONS = [
	"Black", "White", "Gray/Blue", "Brown", "Orange/Red",
	"Cream", "Chocolate", "Cinnamon", "Tabby", "Calico",
	"Tortoiseshell", "Bicolor", "Colorpoint", "Other",
];

/* PatternType sub-fields */
const PATTERN_CATEGORY_OPTIONS: SelectOption<PatternCategory>[] = [
	{ value: "Tabby", label: "Tabby" },
	{ value: "Solid", label: "Solid" },
	{ value: "Bicolor", label: "Bicolor" },
	{ value: "Special", label: "Special" },
];
const VISUAL_PATTERN_OPTIONS: SelectOption<VisualPattern>[] = [
	{ value: "Mackerel", label: "Garis (Mackerel)" },
	{ value: "Classic", label: "Marble (Classic)" },
	{ value: "Solid", label: "Polos (Solid)" },
];
const PATTERN_COLOR_OPTIONS: SelectOption<PatternColor>[] = [
	{ value: "Hitam", label: "Hitam" },
	{ value: "Abu", label: "Abu" },
	{ value: "Orange", label: "Orange" },
	{ value: "Putih", label: "Putih" },
];

const COAT_LENGTH_OPTIONS: SelectOption<CoatLength>[] = [
	{ value: "Long", label: "Long hair (>5cm)" },
	{ value: "Medium", label: "Medium hair (2-5cm)" },
	{ value: "Short", label: "Short hair (<2cm)" },
];
const EYE_COLOR_OPTIONS = [
	"Amber/Gold", "Blue", "Green", "Yellow/Orange",
	"Copper", "Brown", "Gray", "Heterochromia",
];
const EAR_TYPE_OPTIONS: SelectOption<EarType>[] = [
	{ value: "Pointed", label: "Pointed" },
	{ value: "Rounded", label: "Rounded" },
	{ value: "Folded", label: "Folded" },
];
const BODY_SIZE_OPTIONS: SelectOption<BodySize>[] = [
	{ value: "Small", label: "Small (<3kg)" },
	{ value: "Medium", label: "Medium (3-5kg)" },
	{ value: "Large", label: "Large (5-7kg)" },
	{ value: "VeryLarge", label: "Very large (>7kg)" },
];
const BODY_TYPE_OPTIONS: SelectOption<BodyType>[] = [
	{ value: "Oriental", label: "Oriental / Long & Slender" },
	{ value: "Muscular", label: "Muscular" },
	{ value: "Lean", label: "Lean" },
	{ value: "Ideal", label: "Ideal" },
	{ value: "Stocky", label: "Stocky" },
	{ value: "Overweight", label: "Overweight" },
];
const BLOOD_TYPE_OPTIONS: SelectOption<BloodType>[] = [
	{ value: "A", label: "A" },
	{ value: "B", label: "B" },
	{ value: "AB", label: "AB" },
];

const TEMPERAMENT_OPTIONS: SelectOption<Temperament>[] = [
	{ value: "Friendly", label: "Friendly" },
	{ value: "Aggressive", label: "Aggressive" },
	{ value: "Calm", label: "Calm" },
];
const ENERGY_LEVEL_OPTIONS: SelectOption<EnergyLevel>[] = [
	{ value: "Low", label: "Low" },
	{ value: "Calm", label: "Calm" },
	{ value: "Balanced", label: "Balanced" },
	{ value: "Active", label: "Active" },
	{ value: "Hyper", label: "Hyper" },
];
const SOCIAL_BEHAVIOR_OPTIONS: SelectOption<SocialBehavior>[] = [
	{ value: "Friendly", label: "Friendly" },
	{ value: "Playful", label: "Playful" },
	{ value: "Independent", label: "Independent" },
	{ value: "GoodWithCat", label: "Good with cat" },
	{ value: "Vocal", label: "Vocal" },
];

/* ── Reusable input groups ──────────────────────────── */
const CheckboxGroup = ({
	label,
	icon,
	options,
	values,
	onChange,
}: {
	label: string;
	icon?: React.ReactNode;
	options: readonly string[];
	values: string[];
	onChange: (v: string[]) => void;
}) => (
	<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-4 border-b border-gray-50 last:border-0">
		<div className="flex items-center gap-3 sm:w-[180px] shrink-0">
			{icon && (
				<span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
					{icon}
				</span>
			)}
			<span className="text-sm font-bold text-gray-900">{label}</span>
		</div>
		<div className="flex flex-wrap gap-2 flex-1">
			{options.map((opt) => {
				const isSelected = values?.includes(opt);
				return (
					<button
						key={opt}
						type="button"
						onClick={() => {
							if (isSelected) {
								onChange(values.filter((v) => v !== opt));
							} else {
								onChange([...(values || []), opt]);
							}
						}}
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
						{opt}
					</button>
				);
			})}
		</div>
	</div>
);

/**
 * RadioGroup that accepts either plain string[] or SelectOption[].
 * When options are SelectOption[], it stores `value` but displays `label`.
 */
const RadioGroup = <T extends string = string>({
	label,
	icon,
	options,
	value,
	onChange,
}: {
	label: string;
	icon?: React.ReactNode;
	options: readonly (T | SelectOption<T>)[];
	value: T | "";
	onChange: (v: T) => void;
}) => {
	const normalised = options.map((o) =>
		typeof o === "string" ? { value: o as T, label: o as string } : o,
	);
	return (
		<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-4 border-b border-gray-50 last:border-0">
			<div className="flex items-center gap-3 sm:w-[180px] shrink-0">
				{icon && (
					<span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
						{icon}
					</span>
				)}
				<span className="text-sm font-bold text-gray-900">{label}</span>
			</div>
			<div className="flex flex-wrap gap-2 flex-1">
				{normalised.map((opt) => (
					<button
						key={opt.value}
						type="button"
						onClick={() => onChange(opt.value)}
						className={[
							"flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all",
							value === opt.value
								? "border-[#4359ea] bg-[#4359ea]/10 text-[#4359ea]"
								: "border-gray-200 text-gray-500 hover:border-gray-300",
						].join(" ")}
					>
						<span
							className={[
								"w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
								value === opt.value ? "border-[#4359ea]" : "border-gray-300",
							].join(" ")}
						>
							{value === opt.value && (
								<span className="w-2 h-2 rounded-full bg-[#4359ea]" />
							)}
						</span>
						{opt.label}
					</button>
				))}
			</div>
		</div>
	);
};

const TextInput = ({
	label,
	icon,
	value,
	onChange,
	placeholder = "",
	multiline = false,
}: {
	label: string;
	icon?: React.ReactNode;
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
	multiline?: boolean;
}) => (
	<div className="flex flex-col sm:flex-row sm:items-start sm:items-center gap-2 sm:gap-4 py-4 border-b border-gray-50 last:border-0">
		<div className="flex items-center gap-3 sm:w-[180px] shrink-0">
			{icon && (
				<span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
					{icon}
				</span>
			)}
			<span className="text-sm font-bold text-gray-900">{label}</span>
		</div>
		<div className="flex-1 w-full">
			{multiline ? (
				<textarea
					value={value || ""}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					rows={3}
					className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4359ea]/30 focus:border-[#4359ea] transition-all resize-none"
				/>
			) : (
				<input
					type="text"
					value={value || ""}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4359ea]/30 focus:border-[#4359ea] transition-all"
				/>
			)}
		</div>
	</div>
);

export function BioProfileFields() {
	const { formData, updateBioProfile } = useRegisterCat();
	const bio = formData.bioProfile;
	const {
		data: breeds,
		isLoading: breedsLoading,
		isError: breedsError,
	} = useGetBreeds();

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

	const toggleBreed = useCallback(
		(name: string) => {
			const currentBreeds = Array.isArray(bio.breed) ? bio.breed : [];
			if (currentBreeds.includes(name)) {
				updateBioProfile({ breed: currentBreeds.filter((b) => b !== name) });
			} else {
				updateBioProfile({ breed: [...currentBreeds, name] });
			}
		},
		[bio.breed, updateBioProfile],
	);

	const removeBreed = useCallback(
		(name: string) => {
			const currentBreeds = Array.isArray(bio.breed) ? bio.breed : [];
			updateBioProfile({ breed: currentBreeds.filter((b) => b !== name) });
		},
		[bio.breed, updateBioProfile],
	);

	return (
		<div className="space-y-6">
			{/* Physical Section */}
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4">
				<h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-2 flex items-center gap-2">
					<span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
						<Cat size={16} />
					</span>
					Physical Characteristics
				</h3>

				{/* Breed Multiselect */}
				<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-4 border-b border-gray-50 last:border-0">
					<div className="flex items-center gap-3 sm:w-[180px] shrink-0">
						<span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
							<Search size={20} />
						</span>
						<span className="text-sm font-bold text-gray-900">Breed</span>
					</div>
					<div className="relative flex-1 w-full" ref={breedRef}>
						{/* Selected breed chips */}
						{Array.isArray(bio.breed) && bio.breed.length > 0 && (
							<div className="flex flex-wrap gap-2 mb-2">
								{bio.breed.map((b) => (
									<div
										key={b}
										className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl text-xs font-semibold"
									>
										<span>{b}</span>
										<button
											type="button"
											onClick={() => removeBreed(b)}
											className="w-4 h-4 rounded-full hover:bg-blue-200 flex items-center justify-center transition-colors"
										>
											<X size={10} />
										</button>
									</div>
								))}
							</div>
						)}
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
											: "Search and select breeds"
								}
								className={[
									"w-full h-11 pl-9 pr-10 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4359ea]/30 focus:border-[#4359ea] transition-all",
									"placeholder:text-gray-300 text-gray-900",
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

						{/* Dropdown */}
						{breedOpen && !breedsLoading && (
							<div className="absolute z-50 mt-1 w-full max-h-52 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg py-1">
								{filteredBreeds.length === 0 ? (
									<div className="px-3 py-3 text-sm text-gray-400 text-center">
										No breeds found
									</div>
								) : (
									filteredBreeds.map((breed) => {
										const isSelected =
											Array.isArray(bio.breed) &&
											bio.breed.includes(breed.name);
										return (
											<button
												key={breed.id}
												type="button"
												onClick={() => toggleBreed(breed.name)}
												className={[
													"w-full flex items-center justify-between text-left px-3 py-2 text-sm transition-colors",
													isSelected
														? "bg-[#4359ea]/10 text-[#4359ea] font-semibold"
														: "text-gray-700 hover:bg-gray-50",
												].join(" ")}
											>
												<span>{breed.name}</span>
												{isSelected && (
													<span className="text-[#4359ea]">✓</span>
												)}
											</button>
										);
									})
								)}
							</div>
						)}
					</div>
				</div>

				<CheckboxGroup
					label="Coat Color"
					icon={<Palette size={20} />}
					options={COAT_COLOR_OPTIONS}
					values={bio.coatColor || []}
					onChange={(v) => updateBioProfile({ coatColor: v })}
				/>
				{/* Pattern Type – 3 sub-fields matching IDL struct */}
				<div className="py-4 border-b border-gray-50">
					<div className="flex items-center gap-3 mb-4">
						<span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
							<Paintbrush size={20} />
						</span>
						<span className="text-sm font-bold text-gray-900">Pattern Type</span>
					</div>
					<div className="space-y-3 pl-0 sm:pl-[52px]">
						<RadioGroup
							label="Category"
							options={PATTERN_CATEGORY_OPTIONS}
							value={bio.patternType.category}
							onChange={(v) => updateBioProfile({ patternType: { ...bio.patternType, category: v } })}
						/>
						<RadioGroup
							label="Visual Pattern"
							options={VISUAL_PATTERN_OPTIONS}
							value={bio.patternType.visualPattern}
							onChange={(v) => updateBioProfile({ patternType: { ...bio.patternType, visualPattern: v } })}
						/>
						<RadioGroup
							label="Color"
							options={PATTERN_COLOR_OPTIONS}
							value={bio.patternType.color}
							onChange={(v) => updateBioProfile({ patternType: { ...bio.patternType, color: v } })}
						/>
					</div>
				</div>

				<RadioGroup
					label="Coat Length"
					icon={<Scissors size={20} />}
					options={COAT_LENGTH_OPTIONS}
					value={bio.coatLength}
					onChange={(v) => updateBioProfile({ coatLength: v })}
				/>
				<RadioGroup
					label="Eye Color"
					icon={<Eye size={20} />}
					options={EYE_COLOR_OPTIONS}
					value={bio.eyeColor}
					onChange={(v) => updateBioProfile({ eyeColor: v })}
				/>
				<RadioGroup
					label="Ear Type"
					icon={<Ear size={20} />}
					options={EAR_TYPE_OPTIONS}
					value={bio.earType}
					onChange={(v) => updateBioProfile({ earType: v })}
				/>
				<RadioGroup
					label="Body Size"
					icon={<Ruler size={20} />}
					options={BODY_SIZE_OPTIONS}
					value={bio.bodySize}
					onChange={(v) => updateBioProfile({ bodySize: v })}
				/>
				<RadioGroup
					label="Body Type"
					icon={<Dumbbell size={20} />}
					options={BODY_TYPE_OPTIONS}
					value={bio.bodyType}
					onChange={(v) => updateBioProfile({ bodyType: v })}
				/>
				<TextInput
					label="Distinctive Marks"
					icon={<Sparkles size={20} />}
					value={bio.distinctiveMarks}
					onChange={(v) => updateBioProfile({ distinctiveMarks: v })}
					placeholder="e.g. White spot on nose, black tail tip"
				/>
				<RadioGroup
					label="Blood Type"
					icon={<Droplet size={20} />}
					options={BLOOD_TYPE_OPTIONS}
					value={bio.bloodType}
					onChange={(v) => updateBioProfile({ bloodType: v })}
				/>
			</div>

			{/* Personality Section */}
			<div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-4">
				<h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-2 flex items-center gap-2">
					<span className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 shrink-0">
						<Heart size={16} />
					</span>
					Personality & Behavior
				</h3>

				<RadioGroup
					label="Temperament"
					icon={<Brain size={20} />}
					options={TEMPERAMENT_OPTIONS}
					value={bio.temperament}
					onChange={(v) => updateBioProfile({ temperament: v })}
				/>
				<RadioGroup
					label="Energy Level"
					icon={<Zap size={20} />}
					options={ENERGY_LEVEL_OPTIONS}
					value={bio.energyLevel}
					onChange={(v) => updateBioProfile({ energyLevel: v })}
				/>
				<RadioGroup
					label="Social Behavior"
					icon={<Users size={20} />}
					options={SOCIAL_BEHAVIOR_OPTIONS}
					value={bio.socialBehavior}
					onChange={(v) => updateBioProfile({ socialBehavior: v })}
				/>
				<TextInput
					label="Special Skill"
					icon={<Star size={20} />}
					value={bio.specialSkill}
					onChange={(v) => updateBioProfile({ specialSkill: v })}
					placeholder="e.g. Opening doors, catching toys mid-air"
				/>
				<TextInput
					label="Likes"
					icon={<ThumbsUp size={20} />}
					value={bio.likes}
					onChange={(v) => updateBioProfile({ likes: v })}
					placeholder="e.g. Salmon treats, chin scratches, sunny windows"
				/>
				<TextInput
					label="Dislikes"
					icon={<ThumbsDown size={20} />}
					value={bio.dislikes}
					onChange={(v) => updateBioProfile({ dislikes: v })}
					placeholder="e.g. Loud noises, vacuum cleaners, baths"
				/>
				<TextInput
					label="Additional Notes"
					icon={<FileText size={20} />}
					value={bio.additionalNotes}
					onChange={(v) => updateBioProfile({ additionalNotes: v })}
					placeholder="Any other important behavior details..."
					multiline={true}
				/>
			</div>
		</div>
	);
}

/* ================================================================
   FULL SCREEN — mobile / tablet view
   ================================================================ */
export default function BioProfileStep() {
	const { currentStep, goNext, goBack, isFirstStep, isLastStep, canProceed } =
		useRegisterCat();

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
