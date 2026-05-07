import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import api from "@/lib/api";
import { setToken } from "@/lib/cookies";
import type { AuthWeb3Response } from "@/types/api";

/**
 * Sends the Privy-issued JWT to our backend and stores the
 * returned access token. Redirects to "/" on success.
 */
export const useAuthLogin = () => {
	const router = useRouter();

	console.log("yaya");
	return useMutation({
		mutationFn: async (privyToken: string) => {
			console.log("CALLING API");
			const { data } = await api.post<AuthWeb3Response>("/auth/web3", {
				token: privyToken,
			});
			return data;
		},
		onSuccess: (data) => {
			setToken(data.accessToken);
			toast.success("Welcome to OLPaw!");
			router.push("/");
		},
		onError: () => {
			toast.error("Login failed. Please try again.");
		},
	});
};
