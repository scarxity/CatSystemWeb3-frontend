"use client";

import withAuth from "@/components/hoc/withAuth";
import Layout from "@/components/layout/Layout";
import NotificationsPage from "@/components/pages/notifications/NotificationsPage";

function Page() {
  return (
    <Layout withNavbar>
      <NotificationsPage />
    </Layout>
  );
}

export default withAuth(Page, "auth");
