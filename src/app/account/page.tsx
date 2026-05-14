"use client";

import withAuth from "@/components/hoc/withAuth";
import Layout from "@/layouts/Layout";
import AccountPage from "@/views/account/AccountPage";

function Page() {
  return (
    <Layout withNavbar>
      <AccountPage />
    </Layout>
  );
}

export default withAuth(Page, "auth");
