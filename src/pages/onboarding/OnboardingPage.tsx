"use client";

import { useForm } from "react-hook-form";
import { User, AtSign, FileText, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import type { AxiosError } from "axios";

import { useOnboard } from "@/hooks/useOnboard";
import type { ApiError } from "@/types/api";

type OnboardingFormData = {
	name: string;
	username: string;
	bio?: string;
};

export default function OnboardingPage() {
	const router = useRouter();
	const onboard = useOnboard();

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<OnboardingFormData>({
		defaultValues: {
			name: "",
			username: "",
			bio: "",
		},
	});

	const onSubmit = (data: OnboardingFormData) => {
		onboard.mutate(data, {
			onSuccess: () => {
				toast.success("Profile setup complete!");
				router.push("/");
			},
			onError: (error: AxiosError<ApiError>) => {
				if (error.response?.status === 409) {
					setError("username", { message: "Username already taken" });
				} else {
					toast.error("Something went wrong. Please try again.");
				}
			},
		});
	};

	return (
		<main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
			{/* Decorative background elements */}
			<div className="paw-bg absolute inset-0 opacity-20 pointer-events-none" />
			<div className="absolute top-10 left-8 w-32 h-32 bg-indigo-200/30 rounded-full blur-2xl animate-float-slow" />
			<div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl animate-float-slow animation-delay-200" />

			<div className="relative z-10 w-full max-w-md animate-fadeInUp">
				<div className="bg-white rounded-2xl shadow-lg p-8">
					{/* Logo */}
					<div className="flex justify-center mb-4">
						<div className="w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-100 shadow-md">
							<Image
								src="/assets/login/cat-avatar.png"
								alt="OLPaw"
								width={64}
								height={64}
								className="w-full h-full object-cover"
							/>
						</div>
					</div>

					{/* Header */}
					<h1 className="text-2xl font-bold text-gray-900 text-center mb-1">
						Complete Your Profile
					</h1>
					<p className="text-sm text-gray-500 text-center mb-8">
						Set up your name, username, and bio to get started.
					</p>

					{/* Form */}
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
						{/* Name Field */}
						<div>
							<label
								htmlFor="name"
								className="block text-sm font-medium text-gray-700 mb-1.5"
							>
								Display Name
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<User className="w-4 h-4 text-gray-400" />
								</div>
								<input
									id="name"
									type="text"
									placeholder="Enter your display name"
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

						{/* Username Field */}
						<div>
							<label
								htmlFor="username"
								className="block text-sm font-medium text-gray-700 mb-1.5"
							>
								Username
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<AtSign className="w-4 h-4 text-gray-400" />
								</div>
								<input
									id="username"
									type="text"
									placeholder="Choose a unique username"
									className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
										errors.username
											? "border-red-300 focus:ring-red-500 focus:border-red-500"
											: "border-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
									} text-sm text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2`}
									{...register("username", {
										required: "Username is required",
										validate: (v) =>
											v.trim() !== "" || "Username is required",
									})}
								/>
							</div>
							{errors.username && (
								<p className="mt-1.5 text-xs text-red-500">
									{errors.username.message}
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
							disabled={onboard.isPending}
							className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold py-3.5 px-6 flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/50 active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
						>
							{onboard.isPending ? (
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
