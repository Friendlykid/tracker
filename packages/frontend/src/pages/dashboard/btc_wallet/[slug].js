import Layout from "@/components/Layout/Layout";
import { useUser } from "@/lib/query";

export default function BtcWallet() {
  const user = useUser();
  if (!user) return null;
  return <Layout title="Btc Wallet">Btc Wallet</Layout>;
}
