import { getMyCats } from "@/data/cats";
import Layout from "@/layouts/Layout";
import HomePage from "@/pages/home/ProtectedHomePage";

/**
 * Next.js App Router entry point for "/".
 * Data is fetched server-side here and passed down as props.
 * Swap getMyCats() with a real API call when the backend is ready.
 */
export default async function Page() {
	const cats = await getMyCats();

	return (
		<Layout withNavbar>
			<HomePage cats={cats} ownerName="Cat Owner" />
		</Layout>
	);
}
