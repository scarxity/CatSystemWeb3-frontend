import type { Cat } from "@/types/cat";

export default function HealthTab({ cat }: { cat: Cat }) {
	return (
		<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
			<h2 className="text-[18px] font-bold text-gray-900 mb-5">
				Medical Records
			</h2>
			{cat.medicalRecords && cat.medicalRecords.length > 0 ? (
				<div className="space-y-4">
					{cat.medicalRecords.map((record) => (
						<div
							key={record.id}
							className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5"
						>
							<div className="flex justify-between items-start mb-2">
								<h3 className="font-bold text-emerald-800 text-[15px]">
									{record.title}
								</h3>
								<span className="text-[12px] font-semibold text-emerald-600 bg-white px-2 py-1 rounded-md">
									{record.date}
								</span>
							</div>
							<p className="text-[14px] text-gray-700 mb-3">
								{record.description}
							</p>
							{(record.doctor || record.clinic) && (
								<p className="text-[12px] text-gray-500 font-medium bg-white/60 w-fit px-2 py-1 rounded-md">
									{record.doctor} {record.clinic && `(${record.clinic})`}
								</p>
							)}
						</div>
					))}
				</div>
			) : (
				<div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
					<p className="text-[14px] text-gray-600">
						No medical issues reported. Up to date on all vaccinations.
					</p>
				</div>
			)}
		</div>
	);
}
