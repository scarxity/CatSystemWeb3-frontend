"use client";

import withAuth from "@/components/hoc/withAuth";
import OnboardingPage from "./OnboardingPage";

export default withAuth(OnboardingPage, "auth");
