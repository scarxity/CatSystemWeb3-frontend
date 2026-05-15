"use client";

import withAuth from "@/components/hoc/withAuth";
import Layout from "@/layouts/Layout";
import NotificationsPage from "@/views/notifications/NotificationsPage";

function Page() {
  return (
    <Layout withNavbar>
      <NotificationsPage />
    </Layout>
  );
}

export default withAuth(Page, "auth");
