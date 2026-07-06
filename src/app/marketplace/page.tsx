"use client";

import withAuth from "@/components/hoc/withAuth";
import Layout from "@/components/layout/Layout";
import MarketplacePage from "@/components/pages/marketplace/MarketplacePage";
import ComingSoonOverlay from "@/components/ui/ComingSoonOverlay";

function Page() {
  return (
    <Layout withNavbar>
      <ComingSoonOverlay message="The marketplace is coming soon. Here's a preview of what's on the way!">
        <MarketplacePage />
      </ComingSoonOverlay>
    </Layout>
  );
}

export default withAuth(Page, "auth");
