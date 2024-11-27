import Layout from "@/components/Layout/Layout";
import { useUser } from "@/lib/query";
import { useRouter } from "next/router";
import { useEffect } from "react";
export default function Home() {
  const router = useRouter();
  const user = useUser();
  useEffect(() => {
    if (user) {
      router.push("/");
    } else {
      router.replace("/404");
    }
  }, [router, user]);
  return <Layout title="Dashboard"></Layout>;
}
