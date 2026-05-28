"use client";

import withAuth from "@/components/hoc/withAuth";
import Layout from "@/components/layout/Layout";
import RegisterCatPage from "@/components/pages/cats/register/RegisterCatPage";

/**
 * Route: /cats/register
 *
 * Best-practice pattern for a dashboard multi-step form:
 *
 * ┌─────────────────────────────────────────────────────────┐
 * │  Desktop (≥ lg)                                          │
 * │  → Layout renders app sidebar navbar                     │
 * │  → Form renders as a normal content page (stepper+panel) │
 * │  → No navigation interruption — stays in the same view  │
 * ├─────────────────────────────────────────────────────────┤
 * │  Mobile / Tablet (< lg)                                  │
 * │  → Layout hides sidebar (bottom nav still shown)         │
 * │  → Steps take full-screen with their own header/nav      │
 * └─────────────────────────────────────────────────────────┘
 */
function Page() {
  return (
    <Layout>
      <RegisterCatPage />
    </Layout>
  );
}

export default withAuth(Page, "auth");
