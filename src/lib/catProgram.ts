import {
	PublicKey,
	SystemProgram,
	TransactionInstruction,
} from "@solana/web3.js";

// TODO: Replace with actual deployed program ID
export const CAT_PROGRAM_ID = new PublicKey(
	"11111111111111111111111111111111",
);

// Anchor instruction discriminator = SHA256("global:<ix_name>")[0:8]
async function computeDiscriminator(ixName: string): Promise<Buffer> {
	const hash = await crypto.subtle.digest(
		"SHA-256",
		new TextEncoder().encode(`global:${ixName}`),
	);
	return Buffer.from(new Uint8Array(hash).slice(0, 8));
}

function encodeString(value: string): Buffer {
	const bytes = Buffer.from(value, "utf8");
	const len = Buffer.allocUnsafe(4);
	len.writeUInt32LE(bytes.length, 0);
	return Buffer.concat([len, bytes]);
}

function encodeGender(gender: "Male" | "Female"): Buffer {
	return Buffer.from([gender === "Male" ? 0 : 1]);
}

export async function buildCreateCatInstruction(
	owner: PublicKey,
	catPda: PublicKey,
	name: string,
	gender: "Male" | "Female",
	description: string,
): Promise<TransactionInstruction> {
	const discriminator = await computeDiscriminator("create_cat");
	const data = Buffer.concat([
		discriminator,
		encodeString(name),
		encodeGender(gender),
		encodeString(description),
	]);

	return new TransactionInstruction({
		programId: CAT_PROGRAM_ID,
		keys: [
			{ pubkey: catPda, isSigner: false, isWritable: true },
			{ pubkey: owner, isSigner: true, isWritable: true },
			{ pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
		],
		data,
	});
}

// TODO: Update seeds to match the actual program's PDA derivation
export function deriveCatPda(owner: PublicKey): [PublicKey, number] {
	return PublicKey.findProgramAddressSync(
		[Buffer.from("cat"), owner.toBuffer()],
		CAT_PROGRAM_ID,
	);
}
