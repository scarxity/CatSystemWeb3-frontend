"use client";

import withAuth from "@/components/hoc/withAuth";
import Layout from "@/components/layout/Layout";
import RequestBreederPage from "@/components/pages/account/request-breeder/RequestBreederPage";

function Page() {
	return (
		<Layout withNavbar>
			<RequestBreederPage />
		</Layout>
	);
}

export default withAuth(Page, "auth");
