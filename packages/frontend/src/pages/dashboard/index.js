import Layout from "@/components/Layout";
import { useLastVisitedQuery, useUser } from "@/lib/query";
export default function Home() {
  const { data: lastVisited } = useLastVisitedQuery();
  const user = useUser();
  console.log(user);
  console.log(lastVisited);
  if (lastVisited) console.log(lastVisited);
  return <Layout>Sem tu</Layout>;
}
