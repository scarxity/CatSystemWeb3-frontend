"use client";

import withAuth from "@/components/hoc/withAuth";
import Layout from "@/layouts/Layout";
import MarketplacePage from "@/views/marketplace/MarketplacePage";

function Page() {
  return (
    <Layout withNavbar>
      <MarketplacePage />
    </Layout>
  );
}

export default withAuth(Page, "auth");
