"use client";

import { CalendarDays, CloudUpload, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useMemo, useRef } from "react";
import { useRegisterCat } from "../context/RegisterCatContext";
import StepHeader from "../components/StepHeader";
import StepNavButtons from "../components/StepNavButtons";
import StepProgressBar from "../components/StepProgressBar";
import type { CatGender } from "@/types/cat";
import { REQUIRED_IMAGE_SLOTS, MAX_IMAGES, type CatImageUpload } from "@/types/registerCat";

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

/* ──────────────────────────────────────────────
   Single Image Upload Slot
────────────────────────────────────────────── */
function ImageUploadSlot({
	index,
	image,
	isRequired,
	onFileSet,
	onRemove,
	onDescriptionChange,
}: {
	index: number;
	image: CatImageUpload;
	isRequired: boolean;
	onFileSet: (index: number, file: File) => void;
	onRemove: (index: number) => void;
	onDescriptionChange: (index: number, desc: string) => void;
}) {
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFile = useCallback(
		(file: File) => onFileSet(index, file),
		[index, onFileSet],
	);

	const onChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) handleFile(file);
		},
		[handleFile],
	);

	const onDrop = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			const file = e.dataTransfer.files?.[0];
			if (file && file.type.startsWith("image/")) handleFile(file);
		},
		[handleFile],
	);

	return (
		<div className="flex flex-col gap-1.5">
			{/* Label */}
			<div className="flex items-center justify-between">
				<p className="text-xs font-semibold text-gray-700">
					{image.description || `Image ${index + 1}`}
					{isRequired && <span className="text-red-500 ml-0.5">*</span>}
				</p>
				{!isRequired && (
					<button
						type="button"
						onClick={() => onRemove(index)}
						className="text-red-400 hover:text-red-600 transition-colors"
						aria-label={`Remove image ${index + 1}`}
					>
						<Trash2 size={13} />
					</button>
				)}
			</div>

			{/* Upload area + Preview */}
			<div className="grid grid-cols-2 gap-2">
				<div
					role="button"
					tabIndex={0}
					aria-label={`Upload ${image.description}`}
					onClick={() => inputRef.current?.click()}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
					}}
					onDragOver={(e) => e.preventDefault()}
					onDrop={onDrop}
					className="flex flex-col items-center justify-center gap-1.5 border-2 border-dashed border-[#4359ea]/40 rounded-2xl p-3 cursor-pointer hover:border-[#4359ea] hover:bg-[#4359ea]/5 transition-all min-h-[100px]"
				>
					<CloudUpload size={24} className="text-[#4359ea]" />
					<p className="text-[10px] font-medium text-gray-600 text-center leading-tight">
						Drag &amp; drop
					</p>
					<p className="text-[9px] text-[#4359ea] font-semibold">or browse</p>
					<p className="text-[8px] text-gray-400">JPG, PNG ≤5MB</p>
				</div>

				{image.preview ? (
					<div className="relative rounded-2xl overflow-hidden min-h-[100px] bg-gray-100">
						<Image src={image.preview} alt={`${image.description} preview`} fill className="object-cover" />
						<button
							type="button"
							onClick={() => onRemove(index)}
							aria-label={`Remove ${image.description}`}
							className="absolute top-1.5 right-1.5 bg-white rounded-full p-1 shadow-md hover:bg-red-50 transition-colors"
						>
							<Trash2 size={13} className="text-red-500" />
						</button>
					</div>
				) : (
					<div className="flex items-center justify-center rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 min-h-[100px] text-gray-300 text-[10px] select-none">
						Preview
					</div>
				)}
			</div>

			{/* Description (editable for optional slots) */}
			{!isRequired && (
				<input
					type="text"
					value={image.description}
					onChange={(e) => onDescriptionChange(index, e.target.value)}
					placeholder="Image description..."
					maxLength={64}
					className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4359ea]/30 focus:border-[#4359ea] transition-all"
				/>
			)}

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

/* ================================================================
   FIELDS ONLY — used by the desktop layout panel
   ================================================================ */
export function BasicInfoFields() {
	const { formData, updateBasicInfo } = useRegisterCat();
	const { catName, dateOfBirth, gender, images } = formData.basicInfo;
	const dobInputRef = useRef<HTMLInputElement>(null);
	const age = useMemo(() => calcAge(dateOfBirth), [dateOfBirth]);

	/* ── Image handlers ─────────────────────────── */
	const setImageFile = useCallback(
		(index: number, file: File) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				const newImages = [...images];
				newImages[index] = {
					...newImages[index],
					file,
					preview: reader.result as string,
				};
				updateBasicInfo({ images: newImages });
			};
			reader.readAsDataURL(file);
		},
		[images, updateBasicInfo],
	);

	const removeImage = useCallback(
		(index: number) => {
			const isRequired = index < REQUIRED_IMAGE_SLOTS.length;
			if (isRequired) {
				// Just clear the file, keep the slot
				const newImages = [...images];
				newImages[index] = { ...newImages[index], file: null, preview: null };
				updateBasicInfo({ images: newImages });
			} else {
				// Remove the optional slot entirely
				const newImages = images.filter((_, i) => i !== index);
				updateBasicInfo({ images: newImages });
			}
		},
		[images, updateBasicInfo],
	);

	const updateDescription = useCallback(
		(index: number, description: string) => {
			const newImages = [...images];
			newImages[index] = { ...newImages[index], description };
			updateBasicInfo({ images: newImages });
		},
		[images, updateBasicInfo],
	);

	const addOptionalSlot = useCallback(() => {
		if (images.length >= MAX_IMAGES) return;
		const newImages: CatImageUpload[] = [
			...images,
			{ file: null, preview: null, description: "" },
		];
		updateBasicInfo({ images: newImages });
	}, [images, updateBasicInfo]);

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

			{/* ═══ Gender ═══ */}
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

			{/* ═══ Cat Photos ═══ */}
			<div>
				<div className="flex items-center justify-between mb-3">
					<p className="text-sm font-bold text-gray-900">
						Cat Photos <span className="text-red-500">*</span>
						<span className="ml-2 text-xs font-normal text-gray-500">
							(4 required, up to {MAX_IMAGES} total)
						</span>
					</p>
					<span className="text-xs font-semibold text-[#4359ea]">
						{images.filter((img) => img.file).length} / {images.length} uploaded
					</span>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{images.map((img, idx) => (
						<ImageUploadSlot
							key={`img-${idx}-${img.description}`}
							index={idx}
							image={img}
							isRequired={idx < REQUIRED_IMAGE_SLOTS.length}
							onFileSet={setImageFile}
							onRemove={removeImage}
							onDescriptionChange={updateDescription}
						/>
					))}
				</div>

				{/* Add More button */}
				{images.length < MAX_IMAGES && (
					<button
						type="button"
						onClick={addOptionalSlot}
						className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 text-xs font-semibold hover:border-[#4359ea] hover:text-[#4359ea] hover:bg-[#4359ea]/5 transition-all w-full justify-center"
					>
						<Plus size={14} />
						Add More Photos ({images.length}/{MAX_IMAGES})
					</button>
				)}
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
