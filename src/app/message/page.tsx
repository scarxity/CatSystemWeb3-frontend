"use client";

import withAuth from "@/components/hoc/withAuth";
import Layout from "@/layouts/Layout";
import MessagePage from "@/pages/message/MessagePage";

function Page() {
	return (
		<Layout withNavbar>
			<div className="p-0 md:p-6 h-[calc(100vh-68px)] xl:h-screen w-full flex flex-col">
				<MessagePage />
			</div>
		</Layout>
	);
}

export default withAuth(Page, "auth");
