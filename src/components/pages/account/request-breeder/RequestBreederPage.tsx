"use client";

import React, { useState, useRef } from "react";
import {
	ArrowLeft,
	Upload,
	File as FileIcon,
	X,
	CheckCircle2,
	ShieldCheck,
	Clock,
	Award,
	AlertCircle,
	Cat,
} from "lucide-react";
import Link from "next/link";
import { useRequestBreeder } from "@/hooks/useRequestBreeder";
import useAuthStore from "@/app/stores/useAuthStore";

// ─── Benefit card shown in the info panel ──────────────────────────────────
function BenefitItem({
	icon: Icon,
	title,
	description,
}: {
	icon: React.ElementType;
	title: string;
	description: string;
}) {
	return (
		<div className="flex items-start gap-3">
			<div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
				<Icon className="h-4 w-4" />
			</div>
			<div>
				<p className="text-sm font-semibold text-gray-800">{title}</p>
				<p className="text-xs text-gray-500 leading-relaxed">{description}</p>
			</div>
		</div>
	);
}

// ─── Step badge ────────────────────────────────────────────────────────────
function Step({
	number,
	label,
	active,
	done,
}: {
	number: number;
	label: string;
	active?: boolean;
	done?: boolean;
}) {
	return (
		<div className="flex flex-col items-center gap-1">
			<div
				className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-all ${
					done
						? "border-emerald-500 bg-emerald-500 text-white"
						: active
						? "border-blue-600 bg-blue-600 text-white"
						: "border-gray-200 bg-white text-gray-400"
				}`}
			>
				{done ? <CheckCircle2 className="h-4 w-4" /> : number}
			</div>
			<span
				className={`text-[10px] font-medium ${
					active ? "text-blue-600" : done ? "text-emerald-600" : "text-gray-400"
				}`}
			>
				{label}
			</span>
		</div>
	);
}

// ─── Main page ─────────────────────────────────────────────────────────────
export default function RequestBreederPage() {
	const [file, setFile] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const requestBreederMutation = useRequestBreeder();
	const user = useAuthStore.useUser();
	const userData = user?.user_data as Record<string, unknown> | null | undefined;
	const isRequestPending = userData?.status === "pending";

	const isSuccess = requestBreederMutation.isSuccess;
	const isError = requestBreederMutation.isError;
	const isPending = requestBreederMutation.isPending;

	// ── handlers ──
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFile(e.target.files[0]);
		}
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			setFile(e.dataTransfer.files[0]);
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => setIsDragging(false);

	const clearFile = () => {
		setFile(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!file) return;
		const MAX_SIZE_MB = 10;
		if (file.size > MAX_SIZE_MB * 1024 * 1024) {
			alert(`File size must be under ${MAX_SIZE_MB} MB.`);
			return;
		}
		requestBreederMutation.mutate(file);
	};

	const fileSizeMB = file ? (file.size / 1024 / 1024).toFixed(2) : "0";

	// ── step index ──
	const step = (isSuccess || isRequestPending) ? 2 : file ? 1 : 0;

	return (
		<div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
			{/* ── page width cap ── */}
			<div className="mx-auto max-w-5xl space-y-6">

				{/* ── Back + title ── */}
				<div className="flex items-center gap-3">
					<Link
						href="/account"
						className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-colors hover:bg-gray-50"
					>
						<ArrowLeft className="h-4 w-4 text-gray-600" />
					</Link>
					<div>
						<h1 className="text-lg font-bold text-gray-900">Request Breeder Status</h1>
						<p className="text-xs text-gray-500">Submit your verification to unlock breeder features</p>
					</div>
				</div>

				{/* ── Step tracker ── */}
				<div className="flex items-center gap-0 rounded-2xl border border-gray-100 bg-white px-6 py-4 shadow-sm">
					<Step number={1} label="Upload Doc" active={step === 0} done={step >= 1} />
					<div className={`mx-2 h-px flex-1 transition-colors ${step >= 1 ? "bg-emerald-400" : "bg-gray-200"}`} />
					<Step number={2} label="Submit" active={step === 1} done={step >= 2} />
					<div className={`mx-2 h-px flex-1 transition-colors ${step >= 2 ? "bg-emerald-400" : "bg-gray-200"}`} />
					<Step number={3} label="Review" active={step === 2} done={false} />
				</div>

				{/* ── Two-column body ── */}
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">

					{/* ── Left: info panel ── */}
					<aside className="space-y-4">
						{/* hero card */}
						<div className="overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-md">
							<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
								<Cat className="h-6 w-6 text-white" />
							</div>
							<h2 className="mb-1 text-base font-bold">Become a Breeder</h2>
							<p className="text-xs leading-relaxed text-blue-100">
								Unlock professional tools to register cats, manage litters, and grow your cattery on OLpaw.
							</p>
						</div>

						{/* benefits */}
						<div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
							<p className="text-xs font-semibold uppercase tracking-wider text-gray-400">What you get</p>
							<BenefitItem
								icon={ShieldCheck}
								title="Verified Breeder Badge"
								description="Display a trusted badge on your profile and cat listings."
							/>
							<BenefitItem
								icon={Award}
								title="Cat Registration"
								description="Register pedigree cats with full DNA and health records."
							/>
							<BenefitItem
								icon={Clock}
								title="Fast Review"
								description="Applications are reviewed within 1–3 business days."
							/>
						</div>

						{/* requirement note */}
						<div className="flex gap-2 rounded-2xl border border-amber-100 bg-amber-50 p-4">
							<AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
							<p className="text-xs text-amber-700 leading-relaxed">
								You must upload a valid government-issued ID or professional certificate in PDF format. File must be under 10 MB.
							</p>
						</div>
					</aside>

					{/* ── Right: form card ── */}
					<div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">

						{/* ── SUCCESS STATE ── */}
						{(isSuccess || isRequestPending) ? (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
									<CheckCircle2 className="h-8 w-8 text-emerald-600" />
								</div>
								<h2 className="mb-2 text-xl font-bold text-gray-900">Request Submitted!</h2>
								<p className="mb-6 max-w-xs text-sm text-gray-500">
									Your breeder application is now under review. We&apos;ll notify you once it&apos;s approved.
								</p>
								<Link
									href="/account"
									className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
								>
									<ArrowLeft className="h-4 w-4" />
									Back to Account
								</Link>
							</div>
						) : (
							/* ── FORM ── */
							<form onSubmit={handleSubmit} className="space-y-6">
								{/* section header */}
								<div>
									<h3 className="text-base font-bold text-gray-900">Upload Verification Document</h3>
									<p className="mt-1 text-sm text-gray-500">
										Accepted format: PDF only &mdash; max 10 MB.
									</p>
								</div>

								{/* ── Drop zone ── */}
								<div
									role="button"
									tabIndex={0}
									aria-label="Upload document"
									className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 ${
										isDragging
											? "border-blue-500 bg-blue-50"
											: file
											? "border-emerald-400 bg-emerald-50/40"
											: "border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/30"
									}`}
									onDrop={handleDrop}
									onDragOver={handleDragOver}
									onDragLeave={handleDragLeave}
									onClick={() => !file && fileInputRef.current?.click()}
									onKeyDown={(e) => e.key === "Enter" && !file && fileInputRef.current?.click()}
								>
									<input
										type="file"
										ref={fileInputRef}
										onChange={handleFileChange}
										className="hidden"
										accept=".pdf,application/pdf"
									/>

									{!file ? (
										/* empty state */
										<div className="flex flex-col items-center justify-center gap-3 p-10 cursor-pointer">
											<div className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${isDragging ? "bg-blue-100" : "bg-white shadow-sm border border-gray-100"}`}>
												<Upload className={`h-6 w-6 transition-colors ${isDragging ? "text-blue-600" : "text-gray-400"}`} />
											</div>
											<div className="text-center">
												<p className="text-sm font-semibold text-gray-700">
													{isDragging ? "Drop your file here" : "Click to upload or drag & drop"}
												</p>
												<p className="text-xs text-gray-400 mt-0.5">PDF only (max. 10 MB)</p>
											</div>
										</div>
									) : (
										/* file preview */
										<div className="flex items-center gap-3 p-4">
											<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
												<FileIcon className="h-5 w-5" />
											</div>
											<div className="min-w-0 flex-1">
												<p className="truncate text-sm font-semibold text-gray-800">{file.name}</p>
												<p className="text-xs text-gray-400">{fileSizeMB} MB</p>
											</div>
											<button
												type="button"
												onClick={(e) => { e.stopPropagation(); clearFile(); }}
												className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
												aria-label="Remove file"
											>
												<X className="h-4 w-4" />
											</button>
										</div>
									)}
								</div>

								{/* ── Error banner ── */}
								{isError && (
									<div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-4">
										<AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
										<p className="text-sm text-red-600">
											You already have a pending breeder request, or something went wrong. Please try again later.
										</p>
									</div>
								)}

								{/* ── Submit button ── */}
								<div className="flex items-center justify-between border-t border-gray-100 pt-4">
									<p className="text-xs text-gray-400">
										{file ? "Ready to submit." : "Upload a document to continue."}
									</p>
									<button
										type="submit"
										id="submit-breeder-request"
										disabled={!file || isPending}
										className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									>
										{isPending ? (
											<>
												<svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
													<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
													<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
												</svg>
												Submitting…
											</>
										) : (
											<>
												<ShieldCheck className="h-4 w-4" />
												Submit Request
											</>
										)}
									</button>
								</div>
							</form>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
