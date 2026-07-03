"use client";
import { useQuery } from "@tanstack/react-query";

import api from "@/lib/api";

export interface Breed {
	id: number;
	name: string;
	name_long: string;
}

interface GetBreedsResponse {
	breeds: Breed[];
}

async function fetchBreeds(): Promise<Breed[]> {
	const { data } = await api.get<GetBreedsResponse>("/cats/breeds");
	return data.breeds;
}

export function useGetBreeds() {
	return useQuery({
		queryKey: ["cat-breeds"],
		queryFn: fetchBreeds,
		staleTime: 1000 * 60 * 30, // 30 minutes – breed list rarely changes
	});
}
