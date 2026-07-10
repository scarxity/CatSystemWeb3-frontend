"use client";

import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Cat } from "@/types/cat";

export default function PhotosTab({ cat }: { cat: Cat }) {
	const photos = cat.photos ?? [];
	const [selected, setSelected] = useState<number | null>(null);

	// ── Empty state ──────────────────────────────────────────────
	if (photos.length === 0) {
		return (
			<div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col items-center justify-center gap-3 py-16 text-center">
				<div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
					<ImageOff size={28} className="text-gray-400" />
				</div>
				<p className="text-[15px] font-semibold text-gray-500">No photos yet</p>
				<p className="text-[12px] text-gray-400 max-w-[200px]">
					Photos uploaded during registration will appear here.
				</p>
			</div>
		);
	}

	return (
		<>
			<div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-3">
				{/* Header */}
				<div className="flex items-center justify-between mb-1">
					<h3 className="text-[15px] font-bold text-gray-900">Gallery</h3>
					<span className="text-[12px] font-semibold text-[#4359ea] bg-[#4359ea]/10 px-2.5 py-1 rounded-full">
						{photos.length} photo{photos.length !== 1 ? "s" : ""}
					</span>
				</div>

				{/* Grid */}
				<div className="grid grid-cols-2 gap-2.5">
					{photos.map((photo, i) => (
						<button
							key={photo.url + i}
							type="button"
							onClick={() => setSelected(i)}
							className="group relative aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4359ea]/50"
							aria-label={photo.description || `Cat photo ${i + 1}`}
						>
							<Image
								src={photo.url}
								alt={photo.description || `Cat photo ${i + 1}`}
								fill
								className="object-cover group-hover:brightness-90 transition-all duration-200"
								sizes="(max-width: 640px) 50vw, 33vw"
							/>
							{/* Description overlay */}
							{photo.description && (
								<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2.5 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
									<p className="text-white text-[10px] font-semibold truncate">
										{photo.description}
									</p>
								</div>
							)}
						</button>
					))}
				</div>
			</div>

			{/* Lightbox */}
			{selected !== null && (
				<div
					className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 animate-in fade-in duration-200"
					onClick={() => setSelected(null)}
					role="dialog"
					aria-modal="true"
					aria-label="Photo lightbox"
				>
					<div
						className="relative max-w-lg w-full"
						onClick={(e) => e.stopPropagation()}
					>
						{/* Close */}
						<button
							type="button"
							onClick={() => setSelected(null)}
							className="absolute -top-10 right-0 text-white/80 hover:text-white text-[13px] font-semibold transition-colors z-10"
						>
							✕ Close
						</button>

						{/* Image */}
						<div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gray-900">
							<Image
								src={photos[selected].url}
								alt={photos[selected].description || `Cat photo ${selected + 1}`}
								fill
								className="object-contain"
								sizes="(max-width: 640px) 100vw, 512px"
							/>
						</div>

						{/* Caption */}
						{photos[selected].description && (
							<p className="mt-3 text-center text-white/70 text-[13px] font-medium">
								{photos[selected].description}
							</p>
						)}

						{/* Counter */}
						<p className="mt-1.5 text-center text-white/40 text-[11px]">
							{selected + 1} / {photos.length}
						</p>

						{/* Prev / Next */}
						{photos.length > 1 && (
							<div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-3">
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										setSelected((prev) =>
											prev !== null
												? (prev - 1 + photos.length) % photos.length
												: 0,
										);
									}}
									className="pointer-events-auto w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white text-lg transition-colors"
									aria-label="Previous photo"
								>
									‹
								</button>
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										setSelected((prev) =>
											prev !== null ? (prev + 1) % photos.length : 0,
										);
									}}
									className="pointer-events-auto w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white text-lg transition-colors"
									aria-label="Next photo"
								>
									›
								</button>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
}
