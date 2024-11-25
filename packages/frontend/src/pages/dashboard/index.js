import Layout from "@/components/Layout/Layout";
import { useUser } from "@/lib/query";
export default function Home() {
  const user = useUser();
  if (!user) return null;
  return <Layout title="Dashboard">Sem přihlášenej</Layout>;
}
