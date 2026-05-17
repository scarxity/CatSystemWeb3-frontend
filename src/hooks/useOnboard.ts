import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import api from "@/lib/api";
import type { ApiError, OnboardRequest, OnboardResponse } from "@/types/api";

export const useOnboard = () => {
	const queryClient = useQueryClient();

	return useMutation<OnboardResponse, AxiosError<ApiError>, OnboardRequest>({
		mutationFn: async (payload: OnboardRequest) => {
			const { data } = await api.post<OnboardResponse>(
				"/users/onboard",
				payload,
			);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["me"] });
		},
	});
};
