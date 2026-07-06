import { Clock } from "lucide-react";

import clsxm from "@/lib/clsxm";

interface ComingSoonOverlayProps {
	message?: string;
	className?: string;
	children: React.ReactNode;
}

export default function ComingSoonOverlay({
	message = "We're still working on this feature. Check back soon!",
	className,
	children,
}: ComingSoonOverlayProps) {
	return (
		<div className={clsxm("relative", className)}>
			<div
				aria-hidden
				className="h-full pointer-events-none select-none blur-[3px] opacity-50"
			>
				{children}
			</div>

			<div className="absolute inset-0 z-40 flex items-center justify-center p-4">
				<div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white px-8 py-6 text-center shadow-xl">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
						<Clock size={24} />
					</div>
					<p className="text-lg font-bold text-gray-900">Coming Soon</p>
					<p className="max-w-[240px] text-sm text-gray-500">{message}</p>
				</div>
			</div>
		</div>
	);
}
