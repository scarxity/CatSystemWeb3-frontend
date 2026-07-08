import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import api from "@/lib/api";
import useAuthStore from "@/app/stores/useAuthStore";
import type { UpdateProfilePictureResponse } from "@/types/api";

export const useUpdateProfilePicture = () => {
	const updateUser = useAuthStore.useUpdateUser();
	const user = useAuthStore.useUser();

	return useMutation({
		mutationFn: async (file: File) => {
			const fd = new FormData();
			fd.append("photo", file);
			const { data } = await api.post<UpdateProfilePictureResponse>(
				"/users/profile-picture",
				fd,
				{ headers: { "Content-Type": "multipart/form-data" } },
			);
			return data;
		},
		onSuccess: (data) => {
			if (user) {
				updateUser({
					user_data: {
						...user.user_data,
						profile_picture_url: data.profile_picture_url,
					},
				});
			}
		},
		onError: () => {
			toast.error("Failed to update profile picture. Please try again.");
		},
	});
};
