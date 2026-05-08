"use client";

import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import CatCard from "@/components/cat/CatCard";
import { useCreateCat } from "@/hooks/useCreateCat";
import type { Cat } from "@/types/cat";
import type { CatFormData } from "@/types/catForm";
import CatFormView from "./CatFormView";
import CatIdentityView from "./CatIdentityView";

interface HomePageProps {
	/** Cats belonging to the current user, fetched server-side */
	cats: Cat[];
	/** Display name of the current user */
	ownerName?: string;
}

type ViewMode =
	| { type: "home" }
	| { type: "detail"; cat: Cat }
	| { type: "add" }
	| { type: "edit"; cat: Cat };

export default function HomePage({ cats, ownerName = "Alex" }: HomePageProps) {
	const [view, setView] = useState<ViewMode>({ type: "home" });
	const catCount = cats.length;
	const { createCat } = useCreateCat();

	/* ── Add / Edit save handler ──────────────────────────────── */
	const handleSave = async (data: CatFormData, _imageFile: File | null) => {
		try {
			await createCat({ name: data.name, gender: data.gender });
			setView({ type: "home" });
		} catch (err) {
			toast.error("Gagal menyimpan kucing ke blockchain.");
			console.error(err);
		}
	};

	/* ── Render sub-views ─────────────────────────────────────── */
	if (view.type === "detail") {
		return (
			<CatIdentityView
				cat={view.cat}
				onBack={() => setView({ type: "home" })}
				onEdit={(cat) => setView({ type: "edit", cat })}
			/>
		);
	}

	if (view.type === "add") {
		return (
			<CatFormView
				onBack={() => setView({ type: "home" })}
				onSave={handleSave}
			/>
		);
	}

	if (view.type === "edit") {
		return (
			<CatFormView
				cat={view.cat}
				onBack={() => setView({ type: "detail", cat: view.cat })}
				onSave={handleSave}
			/>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			{/* ══════════════════════════════════════════════════════
          TOP BRAND HEADER
      ══════════════════════════════════════════════════════ */}
			<header className="bg-white border-b border-gray-100 px-5 md:px-8 py-4 flex items-center justify-center sticky top-0 z-40">
				<div className="flex items-center gap-2">
					<Image
						src="/assets/Logo Biru.png"
						alt="OLpaw Logo"
						width={28}
						height={28}
						className="w-7 h-7 object-contain flex-shrink-0"
						priority
					/>
					<span
						className="text-[24px] font-bold tracking-tight"
						style={{ fontFamily: "Arial, sans-serif", color: "#4359ea" }}
					>
						OLPaw
					</span>
				</div>
			</header>

			{/* ══════════════════════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════════════════════ */}
			<div className="px-5 md:px-8 py-6 w-full max-w-3xl xl:max-w-7xl mx-auto flex-1 flex flex-col gap-6">
				{/* ── Welcome Section ────────────────────────────────── */}
				<section>
					<h1 className="text-[24px] font-bold text-gray-900 leading-tight flex items-center gap-2">
						Welcome, {ownerName}! <span>👋</span>
					</h1>
					<p className="text-[16px] text-gray-500 mt-1">
						You have{" "}
						<span className="font-semibold text-[#4359ea]">{catCount}</span> cat
						{catCount !== 1 ? "s" : ""} registered.
					</p>
				</section>

				{/* ── My Cats Section ────────────────────────────────── */}
				<section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex-1">
					{/* Section header */}
					<div className="flex items-center justify-between mb-5">
						<h2 className="text-[18px] font-bold text-gray-900">My Cats</h2>
						<button
							type="button"
							onClick={() => setView({ type: "add" })}
							className="text-[15px] font-medium text-[#4359ea] hover:underline"
						>
							+ Add New Cat
						</button>
					</div>

					{/* Cat grid */}
					{catCount === 0 ? (
						<div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-gray-200">
							<Image
								src="/assets/Simbol home abu.png"
								alt="No cats"
								width={56}
								height={56}
								className="w-14 h-14 object-contain mb-4 opacity-40"
							/>
							<p className="text-[14px] font-semibold text-gray-400">
								No cats yet
							</p>
							<p className="text-[12px] text-gray-300 mt-1">
								Register your first cat to get started.
							</p>
						</div>
					) : (
						<div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
							{cats.map((cat) => (
								<CatCard
									key={cat.id}
									cat={cat}
									onViewDetails={(c) => setView({ type: "detail", cat: c })}
								/>
							))}
						</div>
					)}
				</section>
			</div>
		</div>
	);
}
