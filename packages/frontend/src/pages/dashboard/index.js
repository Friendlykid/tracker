import Layout from "@/components/Layout/Layout";
import { useUser } from "@/lib/query";
export default function Home() {
  const user = useUser();
  return <Layout title="Dashboard">Sem přihlášenej</Layout>;
}
