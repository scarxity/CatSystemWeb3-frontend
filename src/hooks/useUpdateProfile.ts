import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import api from "@/lib/api";
import useAuthStore from "@/app/stores/useAuthStore";
import type {
	UpdateProfileRequest,
	UpdateProfileResponse,
} from "@/types/api";

export const useUpdateProfile = () => {
	const updateUser = useAuthStore.useUpdateUser();
	const user = useAuthStore.useUser();

	return useMutation({
		mutationFn: async (payload: UpdateProfileRequest) => {
			const { data } = await api.put<UpdateProfileResponse>(
				"/users/profile",
				payload,
			);
			return data;
		},
		onSuccess: (data) => {
			if (user) {
				updateUser({
					user_data: {
						...user.user_data,
						name: data.user.name,
						bio: data.user.bio,
					},
				});
			}
		},
		onError: () => {
			toast.error("Failed to update profile. Please try again.");
		},
	});
};
