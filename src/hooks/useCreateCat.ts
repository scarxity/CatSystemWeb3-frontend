"use client";

import {
	useSignAndSendTransaction,
	useWallets,
} from "@privy-io/react-auth/solana";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { useState } from "react";
import toast from "react-hot-toast";
import { buildCreateCatInstruction, deriveCatPda } from "@/lib/catProgram";

const RPC_ENDPOINT = "https://api.testnet.solana.com";

interface CreateCatArgs {
	name: string;
	gender: "Male" | "Female";
}

export function useCreateCat() {
	const { wallets } = useWallets();
	const { signAndSendTransaction } = useSignAndSendTransaction();
	const [isPending, setIsPending] = useState(false);

	const createCat = async ({ name, gender }: CreateCatArgs) => {
		const wallet = wallets[0];
		if (!wallet) throw new Error("No wallet connected");

		const owner = new PublicKey(wallet.address);
		const [catPda] = deriveCatPda(owner);
		const connection = new Connection(RPC_ENDPOINT, "confirmed");

		const ix = await buildCreateCatInstruction(
			owner,
			catPda,
			name,
			gender,
			"placeholder description",
		);

		const { blockhash } = await connection.getLatestBlockhash();

		const tx = new Transaction({
			recentBlockhash: blockhash,
			feePayer: owner,
		}).add(ix);

		setIsPending(true);
		try {
			await signAndSendTransaction({
				transaction: tx.serialize({ requireAllSignatures: false }),
				wallet,
				chain: "solana:testnet",
			});
			toast.success("Cat berhasil disimpan di blockchain!");
		} finally {
			setIsPending(false);
		}
	};

	return { createCat, isPending };
}
