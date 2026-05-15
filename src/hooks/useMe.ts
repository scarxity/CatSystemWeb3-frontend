import { useQuery } from "@tanstack/react-query";

import api from "@/lib/api";
import { getToken } from "@/lib/cookies";
import type { MeResponse } from "@/types/api";

export const useMe = () => {
	return useQuery<MeResponse>({
		queryKey: ["me"],
		queryFn: async () => {
			const { data } = await api.get<MeResponse>("/me");
			return data;
		},
		enabled: !!getToken(),
		retry: false,
	});
};
