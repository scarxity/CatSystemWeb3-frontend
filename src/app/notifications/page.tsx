"use client";

import withAuth from "@/components/hoc/withAuth";
import Layout from "@/components/layout/Layout";
import NotificationsPage from "@/components/pages/notifications/NotificationsPage";
import ComingSoonOverlay from "@/components/ui/ComingSoonOverlay";

function Page() {
  return (
    <Layout withNavbar>
      <ComingSoonOverlay message="Notifications are coming soon. Here's a preview of what's on the way!">
        <NotificationsPage />
      </ComingSoonOverlay>
    </Layout>
  );
}

export default withAuth(Page, "auth");
