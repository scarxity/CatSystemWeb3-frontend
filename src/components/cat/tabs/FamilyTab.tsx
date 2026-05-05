import type { Cat } from "@/types/cat";

export default function FamilyTab({ cat }: { cat: Cat }) {
	return (
		<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
			<h2 className="text-[18px] font-bold text-gray-900 mb-5">
				Lineage & Family
			</h2>
			{cat.family && cat.family.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{cat.family.map((member) => (
						<div
							key={member.id}
							className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-4"
						>
							<div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-bold text-green-600 shadow-sm border border-green-100">
								{member.relation[0]}
							</div>
							<div>
								<span className="text-[11px] font-bold text-green-600 uppercase tracking-wider">
									{member.relation}
								</span>
								<h4 className="font-bold text-[15px] text-gray-900">
									{member.name}
								</h4>
								<p className="text-[12px] text-gray-600">
									{member.breed} • {member.tokenId}
								</p>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="bg-green-50 border border-green-100 rounded-2xl p-5">
					<p className="text-[14px] text-gray-600">
						Ancestry tree is currently being analyzed and verified on-chain.
					</p>
				</div>
			)}
		</div>
	);
}
