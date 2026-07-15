"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { User, FileText, Loader2, Mail, Phone, MapPin, Globe, Calendar, Camera, X } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";

import { useOnboard } from "@/hooks/useOnboard";
import { useUpdateProfilePicture } from "@/hooks/useUpdateProfilePicture";

type OnboardingFormData = {
	name: string;
	bio?: string;
	email: string;
	phone_number?: string;
	city: string;
	country: string;
	birthdate: string;
};

const FALLBACK_AVATAR = "/assets/login/cat-avatar.png";

export default function OnboardingPage() {
	const onboard = useOnboard();
	const updatePicture = useUpdateProfilePicture();

	const fileInputRef = useRef<HTMLInputElement>(null);
	const [photoFile, setPhotoFile] = useState<File | null>(null);
	const [photoPreview, setPhotoPreview] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<OnboardingFormData>({
		defaultValues: {
			name: "",
			bio: "",
			email: "",
			phone_number: "",
			city: "",
			country: "",
			birthdate: "",
		},
	});

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
		if (!ALLOWED.includes(file.type)) {
			toast.error("Please choose a JPEG, PNG, or WebP image.");
			return;
		}
		const MAX_SIZE_MB = 5;
		if (file.size > MAX_SIZE_MB * 1024 * 1024) {
			toast.error(`Image must be under ${MAX_SIZE_MB} MB.`);
			return;
		}

		setPhotoFile(file);
		setPhotoPreview(URL.createObjectURL(file));
	};

	const clearPhoto = () => {
		setPhotoFile(null);
		if (photoPreview) URL.revokeObjectURL(photoPreview);
		setPhotoPreview(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const onSubmit = async (data: OnboardingFormData) => {
		try {
			await onboard.mutateAsync(data);

			if (photoFile) {
				await updatePicture.mutateAsync(photoFile);
			}

			toast.success("Profile setup complete!");
			if (photoPreview) URL.revokeObjectURL(photoPreview);
			window.location.replace("/");
		} catch {
			toast.error("Something went wrong. Please try again.");
		}
	};

	const isSaving = onboard.isPending || updatePicture.isPending;

	const previewSrc = photoPreview ?? FALLBACK_AVATAR;

	return (
		<main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
			{/* Decorative background elements */}
			<div className="paw-bg absolute inset-0 opacity-20 pointer-events-none" />
			<div className="absolute top-10 left-8 w-32 h-32 bg-indigo-200/30 rounded-full blur-2xl animate-float-slow" />
			<div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl animate-float-slow animation-delay-200" />

			<div className="relative z-10 w-full max-w-md animate-fadeInUp">
				<div className="bg-white rounded-2xl shadow-lg p-8">
					{/* Profile Picture */}
					<div className="flex flex-col items-center gap-3 mb-4">
						<div className="relative h-28 w-28">
							<div className="h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-blue-100 shadow-md ring-1 ring-gray-100">
								<Image
									src={previewSrc}
									alt="Profile"
									width={112}
									height={112}
									className="h-full w-full object-cover"
									unoptimized
								/>
							</div>
							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md transition-colors hover:bg-indigo-700"
								aria-label="Change profile picture"
							>
								<Camera className="h-4 w-4" />
							</button>
						</div>

						<input
							ref={fileInputRef}
							type="file"
							accept="image/jpeg,image/png,image/webp"
							className="hidden"
							onChange={handleFileChange}
						/>

						{photoFile ? (
							<button
								type="button"
								onClick={clearPhoto}
								className="inline-flex items-center gap-1 text-xs font-medium text-red-500 transition-colors hover:text-red-600"
							>
								<X className="h-3.5 w-3.5" />
								Remove selected photo
							</button>
						) : (
							<p className="text-xs text-gray-400">
								JPEG, PNG, or WebP — max 5 MB
							</p>
						)}
					</div>

					{/* Header */}
					<h1 className="text-2xl font-bold text-gray-900 text-center mb-1">
						Complete Your Profile
					</h1>
					<p className="text-sm text-gray-500 text-center mb-8">
						Set up your name and bio to get started.
					</p>

					{/* Form */}
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
						{/* Name Field */}
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-gray-700 mb-1.5"
							>
								Name <span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<User className="w-4 h-4 text-gray-400" />
								</div>
								<input
									id="name"
									type="text"
									placeholder="Enter your name"
									className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
										errors.name
											? "border-red-300 focus:ring-red-500 focus:border-red-500"
											: "border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
									} text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2`}
									{...register("name", {
										required: "Name is required",
										validate: (v) =>
											v.trim() !== "" || "Name is required",
									})}
								/>
							</div>
							{errors.name && (
								<p className="mt-1.5 text-xs text-red-500">
									{errors.name.message}
								</p>
							)}
						</div>

						{/* Email Field */}
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 mb-1.5"
							>
								Email <span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Mail className="w-4 h-4 text-gray-400" />
								</div>
								<input
									id="email"
									type="email"
									placeholder="Enter your email"
									className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
										errors.email
											? "border-red-300 focus:ring-red-500 focus:border-red-500"
											: "border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
									} text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2`}
									{...register("email", {
										required: "Email is required",
										pattern: {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
											message: "Invalid email address",
										},
									})}
								/>
							</div>
							{errors.email && (
								<p className="mt-1.5 text-xs text-red-500">
									{errors.email.message}
								</p>
							)}
						</div>

						{/* Phone Number Field */}
						<div>
							<label
								htmlFor="phone_number"
								className="block text-sm font-medium text-gray-700 mb-1.5"
							>
								Phone Number{" "}
								<span className="text-gray-400 font-normal">(optional)</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Phone className="w-4 h-4 text-gray-400" />
								</div>
								<input
									id="phone_number"
									type="tel"
									inputMode="numeric"
									placeholder="Enter your phone number"
									className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
										errors.phone_number
											? "border-red-300 focus:ring-red-500 focus:border-red-500"
											: "border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
									} text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2`}
									{...register("phone_number", {
										pattern: {
											value: /^[0-9]*$/,
											message: "Phone number must contain only numbers",
										},
									})}
								/>
							</div>
							{errors.phone_number && (
								<p className="mt-1.5 text-xs text-red-500">
									{errors.phone_number.message}
								</p>
							)}
						</div>

						{/* City Field */}
						<div>
							<label
								htmlFor="city"
								className="block text-sm font-medium text-gray-700 mb-1.5"
							>
								City <span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<MapPin className="w-4 h-4 text-gray-400" />
								</div>
								<input
									id="city"
									type="text"
									placeholder="Enter your city"
									className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
										errors.city
											? "border-red-300 focus:ring-red-500 focus:border-red-500"
											: "border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
									} text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2`}
									{...register("city", {
										required: "City is required",
										validate: (v) =>
											v.trim() !== "" || "City is required",
									})}
								/>
							</div>
							{errors.city && (
								<p className="mt-1.5 text-xs text-red-500">
									{errors.city.message}
								</p>
							)}
						</div>

						{/* Country Field */}
						<div>
							<label
								htmlFor="country"
								className="block text-sm font-medium text-gray-700 mb-1.5"
							>
								Country <span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Globe className="w-4 h-4 text-gray-400" />
								</div>
								<input
									id="country"
									type="text"
									placeholder="Enter your country"
									className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
										errors.country
											? "border-red-300 focus:ring-red-500 focus:border-red-500"
											: "border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
									} text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2`}
									{...register("country", {
										required: "Country is required",
										validate: (v) =>
											v.trim() !== "" || "Country is required",
									})}
								/>
							</div>
							{errors.country && (
								<p className="mt-1.5 text-xs text-red-500">
									{errors.country.message}
								</p>
							)}
						</div>

						{/* Birthdate Field */}
						<div>
							<label
								htmlFor="birthdate"
								className="block text-sm font-medium text-gray-700 mb-1.5"
							>
								Birthdate <span className="text-red-500">*</span>
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Calendar className="w-4 h-4 text-gray-400" />
								</div>
								<input
									id="birthdate"
									type="date"
									className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
										errors.birthdate
											? "border-red-300 focus:ring-red-500 focus:border-red-500"
											: "border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
									} text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2`}
									{...register("birthdate", {
										required: "Birthdate is required",
									})}
								/>
							</div>
							{errors.birthdate && (
								<p className="mt-1.5 text-xs text-red-500">
									{errors.birthdate.message}
								</p>
							)}
						</div>

						{/* Bio Field */}
						<div>
							<label
								htmlFor="bio"
								className="block text-sm font-medium text-gray-700 mb-1.5"
							>
								Bio{" "}
								<span className="text-gray-400 font-normal">(optional)</span>
							</label>
							<div className="relative">
								<div className="absolute top-3 left-0 pl-3 pointer-events-none">
									<FileText className="w-4 h-4 text-gray-400" />
								</div>
								<textarea
									id="bio"
									rows={3}
									placeholder="Tell us a bit about yourself..."
									className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 resize-none"
									{...register("bio")}
								/>
							</div>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isSaving}
							className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold py-3.5 px-6 flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/50 active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
						>
							{isSaving ? (
								<>
									<Loader2 className="w-5 h-5 animate-spin" />
									Submitting…
								</>
							) : (
								"Complete Setup"
							)}
						</button>
					</form>
				</div>

				{/* Footer */}
				<div className="mt-4 text-center">
					<p className="text-[11px] text-gray-400">
						You can update your profile later in settings.
					</p>
				</div>
			</div>
		</main>
	);
}
