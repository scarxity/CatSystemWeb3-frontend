import Navbar from "@/layouts/Navbar";

interface LayoutProps {
	children: React.ReactNode;
	withNavbar?: boolean;
	className?: string;
}

/**
 * Root application layout.
 * - Renders the sidebar (desktop/tablet) / bottom nav (mobile) when withNavbar=true
 * - Applies correct margin/padding offsets so content never sits behind the nav
 */
export default function Layout({
	children,
	withNavbar = true,
	className,
}: LayoutProps) {
	return (
		<div className="flex min-h-screen bg-gray-50">
			{withNavbar && <Navbar />}

			<main
				className={[
					"flex-1 w-full min-w-0",
					/* Sidebar offset on md+ */
					withNavbar ? "xl:ml-[220px]" : "",
					/* Bottom nav padding on mobile */
					withNavbar ? "pb-[68px] xl:pb-0" : "",
					className ?? "",
				]
					.filter(Boolean)
					.join(" ")}
			>
				{children}
			</main>
		</div>
	);
}
