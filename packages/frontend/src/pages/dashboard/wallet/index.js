import Layout from "@/components/Layout/Layout";
import { useUser } from "@/lib/query";

export default function New() {
  const user = useUser();

  if (!user) return;
  return <Layout>Wallet</Layout>;
}
