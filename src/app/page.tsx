import Layout from "@/layouts/Layout";
import HomePage from "@/views/home/ProtectedHomePage";

export default function Page() {
  return (
    <Layout withNavbar>
      <HomePage />
    </Layout>
  );
}
