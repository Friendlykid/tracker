import Layout from "@/components/Layout/Layout";
import { SubscriptionForm } from "@/components/SubscriptionForm";
import { useUser } from "@/lib/query";

export default function New() {
  const user = useUser();

  if (!user) return;
  return (
    <Layout>
      <SubscriptionForm />
    </Layout>
  );
}
