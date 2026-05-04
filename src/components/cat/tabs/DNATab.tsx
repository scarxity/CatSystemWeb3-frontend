import { ChevronRight } from "lucide-react";
import Image from "next/image";
import type { Cat } from "@/types/cat";

export default function DNATab({ cat }: { cat: Cat }) {
	return (
		<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
			{/* Card 1: Genetic Profile */}
			<div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 mb-4 shadow-sm">
				<div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-3">
					<Image
						src="/assets/Identification DNA simbol.png"
						alt="DNA"
						width={22}
						height={22}
						className="object-contain"
					/>
					<h3 className="font-bold text-[#4359ea] text-[15px]">
						Genetic Profile
					</h3>
				</div>
				<div className="space-y-3">
					<div className="flex justify-between items-center text-[13px]">
						<span className="text-gray-500">Breed Predisposition</span>
						<span className="font-semibold text-gray-900">
							{cat.dnaProfile?.breedPredisposition || cat.breed}
						</span>
					</div>
					<div className="flex justify-between items-center text-[13px]">
						<span className="text-gray-500">Coat Pattern</span>
						<span className="font-semibold text-gray-900">
							{cat.dnaProfile?.coatPattern || "Unknown"}
						</span>
					</div>
					<div className="flex justify-between items-center text-[13px]">
						<span className="text-gray-500">Eye Color Gene</span>
						<span className="font-semibold text-gray-900">
							{cat.dnaProfile?.eyeColorGene || "Unknown"}
						</span>
					</div>
					<div className="flex justify-between items-center text-[13px]">
						<span className="text-gray-500">Blood Type</span>
						<span className="font-semibold text-gray-900">
							{cat.dnaProfile?.bloodType || "Unknown"}
						</span>
					</div>
					<div className="flex justify-between items-center text-[13px]">
						<span className="text-gray-500">Genetic Diversity</span>
						{cat.dnaProfile?.geneticDiversity ? (
							<span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] border border-emerald-100 flex items-center gap-1">
								{cat.dnaProfile.geneticDiversity}
								<div className="flex items-end gap-[1px] h-2.5">
									<div className="w-[2px] h-[40%] bg-emerald-400"></div>
									<div className="w-[2px] h-[70%] bg-emerald-400"></div>
									<div className="w-[2px] h-[100%] bg-emerald-400"></div>
								</div>
							</span>
						) : (
							<span className="font-semibold text-gray-500">Pending Test</span>
						)}
					</div>
					<div className="flex justify-between items-center text-[13px]">
						<span className="text-gray-500">Inbreeding Coefficient</span>
						<span className="font-semibold text-gray-900">
							{cat.dnaProfile?.inbreedingCoefficient || "Unknown"}
						</span>
					</div>
				</div>
				<div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between cursor-pointer group">
					<span className="text-[#4359ea] text-[13px] font-bold group-hover:underline">
						View Full DNA Report
					</span>
					<ChevronRight size={16} className="text-[#4359ea]" />
				</div>
			</div>

			{/* Card 2: Traits & Markers */}
			<div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-2xl p-4 mb-4 shadow-sm">
				<div className="flex items-center gap-2 mb-3 border-b border-purple-200 pb-3">
					<Image
						src="/assets/Identification paw simbol.png"
						alt="Paw"
						width={22}
						height={22}
						className="object-contain"
					/>
					<h3 className="font-bold text-purple-700 text-[15px]">
						Traits & Markers
					</h3>
				</div>
				<div className="space-y-3">
					<div className="flex justify-between items-center text-[13px]">
						<span className="text-gray-500">Fur Length Gene</span>
						<span className="font-semibold text-gray-900">
							{cat.traits?.furLengthGene || "Unknown"}
						</span>
					</div>
					<div className="flex justify-between items-center text-[13px]">
						<span className="text-gray-500">Dilution Gene</span>
						<span className="font-semibold text-gray-900">
							{cat.traits?.dilutionGene || "Unknown"}
						</span>
					</div>
					<div className="flex justify-between items-center text-[13px]">
						<span className="text-gray-500">White Spotting</span>
						<span className="font-semibold text-gray-900">
							{cat.traits?.whiteSpotting || "Unknown"}
						</span>
					</div>
					<div className="flex justify-between items-center text-[13px]">
						<span className="text-gray-500">Brachycephalic Gene</span>
						<span className="font-semibold text-gray-900">
							{cat.traits?.brachycephalicGene || "Unknown"}
						</span>
					</div>
				</div>
				<div className="mt-4 pt-3 border-t border-purple-200 flex items-center justify-between cursor-pointer group">
					<span className="text-purple-700 text-[13px] font-bold group-hover:underline">
						View All Genetic Traits
					</span>
					<ChevronRight size={16} className="text-purple-700" />
				</div>
			</div>

			{/* Card 3: DNA Ancestry */}
			<div className="bg-cyan-50/50 border border-cyan-100 rounded-2xl p-4 shadow-sm">
				<div className="flex items-center gap-2 mb-3 border-b border-cyan-100 pb-3 opacity-70">
					<Image
						src="/assets/Identification ancestry simbol.png"
						alt="Ancestry"
						width={22}
						height={22}
						className="object-contain grayscale"
					/>
					<h3 className="font-bold text-cyan-800 text-[15px]">DNA Ancestry</h3>
				</div>
				<div className="space-y-3 opacity-80">
					{cat.ancestry && cat.ancestry.length > 0 ? (
						cat.ancestry.map((ancestry) => (
							<div
								key={ancestry.region}
								className="flex items-center justify-between text-[13px]"
							>
								<div className="flex items-center gap-2 w-32">
									<span
										className={`w-2 h-2 rounded-full ${ancestry.color || "bg-gray-400"}`}
									></span>
									<span className="text-gray-600 truncate">
										{ancestry.region}
									</span>
								</div>
								<div className="flex-1 mx-3 h-2 bg-gray-200 rounded-full overflow-hidden">
									<div
										className={`h-full ${ancestry.color || "bg-gray-400"} rounded-full`}
										style={{ width: `${ancestry.percentage}%` }}
									></div>
								</div>
								<span className="font-medium text-gray-500 w-8 text-right">
									{ancestry.percentage}%
								</span>
							</div>
						))
					) : (
						<div className="text-[13px] text-gray-500 text-center py-2">
							Ancestry data is being analyzed.
						</div>
					)}
				</div>
				<div className="mt-4 pt-3 border-t border-cyan-100 flex items-center justify-between cursor-pointer group opacity-60">
					<span className="text-cyan-800 text-[13px] font-bold">
						View Ancestry Map
					</span>
					<ChevronRight size={16} className="text-cyan-800" />
				</div>
			</div>
		</div>
	);
}
