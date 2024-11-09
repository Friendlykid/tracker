import Layout from "@/components/Layout";
import { useLastVisitedQuery, useUser } from "@/lib/query";
export default function Home() {
  const { data: lastVisited } = useLastVisitedQuery();
  const user = useUser();
  console.log(user);
  if (lastVisited) console.log(lastVisited);
  return <Layout>{lastVisited}</Layout>;
}
