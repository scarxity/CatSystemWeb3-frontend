"use client";

import { CalendarDays, CloudUpload, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useMemo, useRef } from "react";
import { useRegisterCat } from "../context/RegisterCatContext";
import StepHeader from "../components/StepHeader";
import StepNavButtons from "../components/StepNavButtons";
import StepProgressBar from "../components/StepProgressBar";
import type { CatGender } from "@/types/cat";

/* ──────────────────────────────────────────────
   Helper – calculate age from DOB string
────────────────────────────────────────────── */
function calcAge(dob: string): string | null {
	if (!dob) return null;
	const birth = new Date(dob);
	const now = new Date();
	let years = now.getFullYear() - birth.getFullYear();
	let months = now.getMonth() - birth.getMonth();
	if (months < 0) {
		years--;
		months += 12;
	}
	if (years > 0) return `Age: ${years} year${years > 1 ? "s" : ""}`;
	if (months > 0) return `Age: ${months} month${months > 1 ? "s" : ""}`;
	return "Age: < 1 month";
}

/* ================================================================
   FIELDS ONLY — used by the desktop layout panel
   ================================================================ */
type PhotoSlot = "photo" | "photo2";

function PhotoSlotInput({
	label,
	slot,
	preview,
}: {
	label: string;
	slot: PhotoSlot;
	preview: string | null;
}) {
	const { updateBasicInfo } = useRegisterCat();
	const inputRef = useRef<HTMLInputElement>(null);

	const fileField = slot;
	const previewField = (slot === "photo" ? "photoPreview" : "photo2Preview") as const;

	const setFile = useCallback(
		(file: File) => {
			const reader = new FileReader();
			reader.onloadend = () =>
				updateBasicInfo({
					[fileField]: file,
					[previewField]: reader.result as string,
				});
			reader.readAsDataURL(file);
		},
		[fileField, previewField, updateBasicInfo],
	);

	const onChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) setFile(file);
		},
		[setFile],
	);

	const onDrop = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			const file = e.dataTransfer.files?.[0];
			if (file && file.type.startsWith("image/")) setFile(file);
		},
		[setFile],
	);

	const remove = useCallback(() => {
		updateBasicInfo({ [fileField]: null, [previewField]: null });
		if (inputRef.current) inputRef.current.value = "";
	}, [fileField, previewField, updateBasicInfo]);

	return (
		<div>
			<p className="text-xs font-semibold text-gray-700 mb-1.5">{label}</p>
			<div className="grid grid-cols-2 gap-2">
				<div
					role="button"
					tabIndex={0}
					aria-label={`Upload ${label}`}
					onClick={() => inputRef.current?.click()}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
					}}
					onDragOver={(e) => e.preventDefault()}
					onDrop={onDrop}
					className="flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-[#4359ea]/40 rounded-2xl p-3 cursor-pointer hover:border-[#4359ea] hover:bg-[#4359ea]/5 transition-all min-h-[120px]"
				>
					<CloudUpload size={28} className="text-[#4359ea]" />
					<p className="text-[11px] font-medium text-gray-600 text-center leading-tight">
						Drag &amp; drop
					</p>
					<p className="text-[10px] text-[#4359ea] font-semibold">or browse</p>
					<p className="text-[9px] text-gray-400">JPG, PNG ≤5MB</p>
				</div>
				{preview ? (
					<div className="relative rounded-2xl overflow-hidden min-h-[120px] bg-gray-100">
						<Image src={preview} alt={`${label} preview`} fill className="object-cover" />
						<button
							type="button"
							onClick={remove}
							aria-label={`Remove ${label}`}
							className="absolute top-1.5 right-1.5 bg-white rounded-full p-1 shadow-md hover:bg-red-50 transition-colors"
						>
							<Trash2 size={13} className="text-red-500" />
						</button>
					</div>
				) : (
					<div className="flex items-center justify-center rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 min-h-[120px] text-gray-300 text-[10px] select-none">
						Preview
					</div>
				)}
			</div>
			<input
				ref={inputRef}
				type="file"
				accept="image/jpeg,image/png,image/webp"
				className="hidden"
				onChange={onChange}
			/>
		</div>
	);
}

export function BasicInfoFields() {
	const { formData, updateBasicInfo } = useRegisterCat();
	const { catName, dateOfBirth, gender, photoPreview, photo2Preview } =
		formData.basicInfo;
	const dobInputRef = useRef<HTMLInputElement>(null);
	const age = useMemo(() => calcAge(dateOfBirth), [dateOfBirth]);

	return (
		<>
			{/* ═══ Cat Name ═══ */}
			<div>
				<label
					htmlFor="cat-name-desktop"
					className="block text-sm font-bold text-gray-900 mb-2"
				>
					Cat Name <span className="text-red-500">*</span>
				</label>
				<div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-[#4359ea] focus-within:ring-2 focus-within:ring-[#4359ea]/20 transition-all">
					<span className="text-[#4359ea] shrink-0" aria-hidden="true">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
							<circle cx="5.5" cy="6" r="2.5" opacity="0.8" />
							<circle cx="12" cy="3.5" r="2" opacity="0.8" />
							<circle cx="18.5" cy="6" r="2.5" opacity="0.8" />
							<path d="M12 8c-4 0-7 3-6 7 .7 2.8 3.5 4 6 3 2.5 1 5.3-.2 6-3 1-4-2-7-6-7z" />
						</svg>
					</span>
					<input
						id="cat-name-desktop"
						type="text"
						value={catName}
						onChange={(e) => updateBasicInfo({ catName: e.target.value })}
						placeholder="e.g. Luna"
						className="flex-1 text-gray-900 text-sm placeholder:text-gray-300 outline-none bg-transparent"
					/>
				</div>
			</div>

			{/* ═══ Date of Birth ═══ */}
			<div>
				<label
					htmlFor="cat-dob-desktop"
					className="block text-sm font-bold text-gray-900 mb-2"
				>
					Date of Birth <span className="text-red-500">*</span>
				</label>
				<div className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-[#4359ea] focus-within:ring-2 focus-within:ring-[#4359ea]/20 transition-all">
					<CalendarDays size={18} className="text-[#4359ea] shrink-0" />
					<input
						ref={dobInputRef}
						id="cat-dob-desktop"
						type="date"
						value={dateOfBirth}
						onChange={(e) => updateBasicInfo({ dateOfBirth: e.target.value })}
						className="flex-1 text-gray-900 text-sm outline-none bg-transparent cursor-pointer"
					/>
					<button
						type="button"
						onClick={() => dobInputRef.current?.showPicker?.()}
						className="text-[#4359ea] hover:opacity-70 transition-opacity"
						aria-label="Open date picker"
					>
						<CalendarDays size={18} />
					</button>
				</div>
				{age && (
					<div className="mt-2 inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-xl px-3 py-1.5">
						<CalendarDays size={13} className="text-green-500" />
						{age}
					</div>
				)}
			</div>

			{/* ═══ Gender + Photo side by side on desktop ═══ */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
				{/* Gender */}
				<div>
					<p className="text-sm font-bold text-gray-900 mb-2">
						Gender <span className="text-red-500">*</span>
					</p>
					<div className="grid grid-cols-2 gap-2">
						{(["Male", "Female"] as CatGender[]).map((g) => {
							const isSelected = gender === g;
							const isMale = g === "Male";
							return (
								<button
									key={g}
									type="button"
									onClick={() => updateBasicInfo({ gender: g })}
									className={[
										"flex items-center gap-2 rounded-2xl border-2 px-3 py-3 text-sm font-semibold transition-all duration-200",
										isSelected
											? isMale
												? "border-[#4359ea] bg-[#4359ea]/5 text-[#4359ea]"
												: "border-pink-400 bg-pink-50 text-pink-500"
											: "border-gray-200 bg-white text-gray-500 hover:border-gray-300",
									].join(" ")}
								>
									<span
										className={[
											"w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
											isSelected
												? isMale ? "border-[#4359ea]" : "border-pink-400"
												: "border-gray-300",
										].join(" ")}
									>
										{isSelected && (
											<span
												className={`w-2 h-2 rounded-full ${isMale ? "bg-[#4359ea]" : "bg-pink-400"}`}
											/>
										)}
									</span>
									<span className={`text-base ${isMale ? "text-blue-500" : "text-pink-400"}`} aria-hidden="true">
										{isMale ? "♂" : "♀"}
									</span>
									{g}
								</button>
							);
						})}
					</div>
				</div>

				{/* Photo Uploads — exactly 2 required */}
				<div className="space-y-3">
					<p className="text-sm font-bold text-gray-900">
						Photos <span className="text-red-500">*</span>
						<span className="ml-2 text-xs font-normal text-gray-500">
							(2 required)
						</span>
					</p>
					<PhotoSlotInput label="Front photo" slot="photo" preview={photoPreview} />
					<PhotoSlotInput label="Side photo" slot="photo2" preview={photo2Preview} />
				</div>
			</div>
		</>
	);
}

/* ================================================================
   FULL SCREEN — mobile / tablet view
   ================================================================ */
export default function BasicInfoStep() {
	const { currentStep, goNext, goBack, isFirstStep } = useRegisterCat();

	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			<StepHeader stepIndex={currentStep} onBack={goBack} />
			
			<div className="flex-1 bg-white -mt-6 rounded-t-[40px] px-5 pt-8 pb-32 sm:px-8 shadow-[0_-8px_20px_rgba(0,0,0,0.04)] relative z-10">
				<div className="max-w-2xl mx-auto space-y-6">
					<StepProgressBar stepIndex={currentStep} />
					
					{/* Re-use the responsive sliced fields */}
					<BasicInfoFields />
				</div>
			</div>
			
			<StepNavButtons onBack={goBack} onNext={goNext} isFirstStep={isFirstStep} />
		</div>
	);
}
