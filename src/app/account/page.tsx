import Layout from "@/layouts/Layout";
import AccountPage from "@/pages/account/AccountPage";

/**
 * Next.js App Router entry point for "/account".
 */
export default function Page() {
	return (
		<Layout withNavbar>
			<AccountPage />
		</Layout>
	);
}
