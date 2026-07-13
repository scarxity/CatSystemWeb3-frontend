"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, User, FileText, Camera, Loader2, X, Mail, Phone, MapPin, Globe, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

import { baseURL } from "@/lib/api";
import useAuthStore from "@/app/stores/useAuthStore";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { useUpdateProfilePicture } from "@/hooks/useUpdateProfilePicture";

type EditProfileFormData = {
	name: string;
	bio?: string;
	email: string;
	phone_number?: string;
	city: string;
	country: string;
	birthdate: string;
};

const FALLBACK_AVATAR = "/assets/login/cat-avatar.png";

function resolvePictureUrl(url: string | null | undefined): string {
	if (!url) return FALLBACK_AVATAR;
	if (url.startsWith("http")) return url;
	return `${baseURL ?? ""}${url}`;
}

export default function EditProfilePage() {
	const router = useRouter();
	const user = useAuthStore.useUser();
	const userData = user?.user_data as Record<string, unknown> | null | undefined;

	const updateProfile = useUpdateProfile();
	const updatePicture = useUpdateProfilePicture();

	const fileInputRef = useRef<HTMLInputElement>(null);
	const [photoFile, setPhotoFile] = useState<File | null>(null);
	const [photoPreview, setPhotoPreview] = useState<string | null>(null);

	const currentPictureUrl = resolvePictureUrl(
		userData?.profile_picture_url as string | null | undefined,
	);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<EditProfileFormData>({
		defaultValues: {
			name: String(userData?.name ?? user?.name ?? ""),
			bio: String(userData?.bio ?? user?.bio ?? ""),
			email: String(userData?.email ?? ""),
			phone_number: String(userData?.phone_number ?? ""),
			city: String(userData?.city ?? ""),
			country: String(userData?.country ?? ""),
			birthdate: String(userData?.birthdate ?? ""),
		},
	});

	const isSaving = updateProfile.isPending || updatePicture.isPending;

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

	const onSubmit = async (data: EditProfileFormData) => {
		try {
			// 1. Upload the new profile picture first (if the user picked one).
			if (photoFile) {
				await updatePicture.mutateAsync(photoFile);
			}

			// 2. Update name & bio.
			await updateProfile.mutateAsync({
				name: data.name.trim(),
				bio: data.bio?.trim() || "",
				email: data.email.trim(),
				phone_number: data.phone_number?.trim() || "",
				city: data.city.trim(),
				country: data.country.trim(),
				birthdate: data.birthdate,
			});

			toast.success("Profile updated successfully!");
			if (photoPreview) URL.revokeObjectURL(photoPreview);
			router.push("/account");
		} catch {
			// individual mutations already surface their own error toasts
		}
	};

	const previewSrc = photoPreview ?? currentPictureUrl;

	return (
		<div className="min-h-screen bg-[#f8f9fc] px-4 py-8 sm:px-6 lg:px-8">
			<div className="mx-auto max-w-2xl space-y-6">
				{/* Back + title */}
				<div className="flex items-center gap-3">
					<Link
						href="/account"
						className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-colors hover:bg-gray-50"
					>
						<ArrowLeft className="h-4 w-4 text-gray-600" />
					</Link>
					<div>
						<h1 className="text-lg font-bold text-gray-900">Edit Profile</h1>
						<p className="text-xs text-gray-500">
							Update your name, bio, and profile picture
						</p>
					</div>
				</div>

				{/* Form card */}
				<div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* Profile picture */}
						<div className="flex flex-col items-center gap-3">
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

						{/* Name */}
						<div>
							<label
								htmlFor="name"
								className="mb-1.5 block text-sm font-medium text-gray-700"
							>
								Name
							</label>
							<div className="relative">
								<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<User className="h-4 w-4 text-gray-400" />
								</div>
								<input
									id="name"
									type="text"
									placeholder="Enter your name"
									className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 ${
										errors.name
											? "border-red-300 focus:border-red-500 focus:ring-red-500"
											: "border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
									}`}
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

						{/* Email */}
						<div>
							<label
								htmlFor="email"
								className="mb-1.5 block text-sm font-medium text-gray-700"
							>
								Email
							</label>
							<div className="relative">
								<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<Mail className="h-4 w-4 text-gray-400" />
								</div>
								<input
									id="email"
									type="email"
									placeholder="Enter your email"
									className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 ${
										errors.email
											? "border-red-300 focus:border-red-500 focus:ring-red-500"
											: "border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
									}`}
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

						{/* Phone Number */}
						<div>
							<label
								htmlFor="phone_number"
								className="mb-1.5 block text-sm font-medium text-gray-700"
							>
								Phone Number{" "}
								<span className="font-normal text-gray-400">(optional)</span>
							</label>
							<div className="relative">
								<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<Phone className="h-4 w-4 text-gray-400" />
								</div>
								<input
									id="phone_number"
									type="tel"
									inputMode="numeric"
									placeholder="Enter your phone number"
									className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
									{...register("phone_number", {
										pattern: {
											value: /^[0-9]*$/,
											message: "Phone number must contain only numbers",
										},
									})}
								/>
							</div>
						</div>

						{/* City */}
						<div>
							<label
								htmlFor="city"
								className="mb-1.5 block text-sm font-medium text-gray-700"
							>
								City
							</label>
							<div className="relative">
								<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<MapPin className="h-4 w-4 text-gray-400" />
								</div>
								<input
									id="city"
									type="text"
									placeholder="Enter your city"
									className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 ${
										errors.city
											? "border-red-300 focus:border-red-500 focus:ring-red-500"
											: "border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
									}`}
									{...register("city", {
										required: "City is required",
									})}
								/>
							</div>
							{errors.city && (
								<p className="mt-1.5 text-xs text-red-500">
									{errors.city.message}
								</p>
							)}
						</div>

						{/* Country */}
						<div>
							<label
								htmlFor="country"
								className="mb-1.5 block text-sm font-medium text-gray-700"
							>
								Country
							</label>
							<div className="relative">
								<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<Globe className="h-4 w-4 text-gray-400" />
								</div>
								<input
									id="country"
									type="text"
									placeholder="Enter your country"
									className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 ${
										errors.country
											? "border-red-300 focus:border-red-500 focus:ring-red-500"
											: "border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
									}`}
									{...register("country", {
										required: "Country is required",
									})}
								/>
							</div>
							{errors.country && (
								<p className="mt-1.5 text-xs text-red-500">
									{errors.country.message}
								</p>
							)}
						</div>

						{/* Birthdate */}
						<div>
							<label
								htmlFor="birthdate"
								className="mb-1.5 block text-sm font-medium text-gray-700"
							>
								Birthdate
							</label>
							<div className="relative">
								<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
									<Calendar className="h-4 w-4 text-gray-400" />
								</div>
								<input
									id="birthdate"
									type="date"
									className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 ${
										errors.birthdate
											? "border-red-300 focus:border-red-500 focus:ring-red-500"
											: "border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
									}`}
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

						{/* Bio */}
						<div>
							<label
								htmlFor="bio"
								className="mb-1.5 block text-sm font-medium text-gray-700"
							>
								Bio{" "}
								<span className="font-normal text-gray-400">(optional)</span>
							</label>
							<div className="relative">
								<div className="pointer-events-none absolute left-0 top-3 pl-3">
									<FileText className="h-4 w-4 text-gray-400" />
								</div>
								<textarea
									id="bio"
									rows={3}
									placeholder="Tell us a bit about yourself..."
									className="w-full resize-none rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
									{...register("bio")}
								/>
							</div>
						</div>

						{/* Actions */}
						<div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
							<Link
								href="/account"
								className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
							>
								Cancel
							</Link>
							<button
								type="submit"
								disabled={isSaving}
								className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200/50 transition-all hover:from-indigo-600 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
							>
								{isSaving ? (
									<>
										<Loader2 className="h-4 w-4 animate-spin" />
										Saving…
									</>
								) : (
									"Save Changes"
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
