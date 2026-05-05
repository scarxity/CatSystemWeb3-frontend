import NavbarComponent from "@/components/navbar/Navbar";
import { NAV_ITEMS } from "@/config/nav";

/**
 * Layout-level Navbar that uses the shared NAV_ITEMS config.
 * Wrap this in Layout or use directly in app/layout.tsx.
 */
export default function Navbar() {
	return (
		<NavbarComponent
			items={NAV_ITEMS}
			appName="OLpaw"
			logoSrc="/assets/Logo Biru.png"
		/>
	);
}
