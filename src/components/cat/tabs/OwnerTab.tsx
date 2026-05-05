export default function OwnerTab() {
	return (
		<div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
			<h2 className="text-[18px] font-bold text-gray-900 mb-4">
				Ownership Data
			</h2>
			<div className="bg-[#4359ea]/5 border border-[#4359ea]/10 rounded-2xl p-5">
				<p className="text-[14px] text-gray-600">
					Currently owned by you. Registered on Solana Network.
				</p>
				<div className="mt-4 pt-4 border-t border-[#4359ea]/10">
					<p className="text-[12px] font-semibold text-[#4359ea] uppercase tracking-wider mb-1">
						Contract Address
					</p>
					<p className="text-[13px] font-mono bg-white px-2 py-1 rounded border border-[#4359ea]/10 break-all">
						0x1234567890abcdef1234567890abcdef12345678
					</p>
				</div>
			</div>
		</div>
	);
}
