"use client";

import withAuth from "@/components/hoc/withAuth";
import Layout from "@/components/layout/Layout";
import MarketplacePage from "@/components/pages/marketplace/MarketplacePage";

function Page() {
  return (
    <Layout withNavbar>
      <MarketplacePage />
    </Layout>
  );
}

export default withAuth(Page, "auth");
