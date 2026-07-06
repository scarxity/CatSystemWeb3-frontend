"use client";

import withAuth from "@/components/hoc/withAuth";
import Layout from "@/components/layout/Layout";
import MessagePage from "@/components/pages/message/MessagePage";
import ComingSoonOverlay from "@/components/ui/ComingSoonOverlay";

function Page() {
  return (
    <Layout withNavbar>
      <div className="p-0 md:p-6 h-[calc(100vh-68px)] xl:h-screen w-full flex flex-col">
        <ComingSoonOverlay
          className="h-full"
          message="Messages are coming soon. Here's a preview of what's on the way!"
        >
          <MessagePage />
        </ComingSoonOverlay>
      </div>
    </Layout>
  );
}

export default withAuth(Page, "auth");
