import Layout from "@/components/Layout/Layout";
import { useUser } from "@/lib/query";

export default function EthWallet() {
  const user = useUser();
  if (!user) return null;
  return <Layout>Eth Wallet</Layout>;
}
