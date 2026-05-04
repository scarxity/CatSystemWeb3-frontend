import type { Cat } from "@/types/cat";

export default function BioTab({ cat }: { cat: Cat }) {
	return (
		<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
			<h2 className="text-[18px] font-bold text-gray-900 mb-4">
				About {cat.name}
			</h2>
			<div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 text-gray-700 text-[14px] leading-relaxed mb-5">
				<p className="mb-3">
					{cat.about ||
						`${cat.name} is a beautiful ${cat.ageLabel} old ${cat.gender.toLowerCase()} ${cat.breed}.`}
				</p>
				<p>
					Registered on the OLPaw platform on {cat.registeredAt || "Unknown"},
					ensuring full authenticity.
				</p>
			</div>
		</div>
	);
}
