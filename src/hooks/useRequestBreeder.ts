import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import api from "@/lib/api";
import useAuthStore from "@/app/stores/useAuthStore";

export const useRequestBreeder = () => {
	const updateUser = useAuthStore.useUpdateUser();
	const user = useAuthStore.useUser();

	return useMutation({
		mutationFn: async () => {
			const { data } = await api.post("/users/request-breeder");
			return data;
		},
		onSuccess: () => {
			toast.success("Breeder status requested successfully!");
			if (user) {
				updateUser({
					user_data: {
						...user.user_data,
						status: "pending",
					},
				});
			}
		},
		onError: () => {
			toast.error("Failed to request breeder status. Please try again.");
		},
	});
};
