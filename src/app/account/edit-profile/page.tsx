"use client";

import withAuth from "@/components/hoc/withAuth";
import Layout from "@/components/layout/Layout";
import EditProfilePage from "@/components/pages/account/edit-profile/EditProfilePage";

function Page() {
	return (
		<Layout withNavbar>
			<EditProfilePage />
		</Layout>
	);
}

export default withAuth(Page, "auth");
