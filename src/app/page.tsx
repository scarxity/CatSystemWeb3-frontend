import Layout from "@/layouts/Layout";
import HomePage from "@/pages/home/ProtectedHomePage";

export default function Page() {
	return (
		<Layout withNavbar>
			<HomePage />
		</Layout>
	);
}
