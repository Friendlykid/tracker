import Layout from "@/components/Layout/Layout";
import { SubscriptionForm } from "@/components/SubscriptionForm";
import { BITCOIN } from "@/lib/constants";
import { useSubscription, useUser } from "@/lib/query";
import { useRouter } from "next/router";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";

export default function BtcEdit() {
  const user = useUser();
  const router = useRouter();
  const { data: subscription, isFetched } = useSubscription(
    BITCOIN,
    router.query.slug
  );
  useEffect(() => {
    if (isFetched && !subscription) {
      enqueueSnackbar({ variant: "error", message: "Wrong input" });
      router.push("/");
    }
  }, [subscription, isFetched, router]);
  if (!user || !isFetched || !subscription) return null;
  return (
    <Layout title="Edit">
      {isFetched && (
        <SubscriptionForm
          isEdit
          defaultblockchain={BITCOIN}
          defaultName={subscription.name}
          defaultAddr={subscription.address}
          defaultAlert={subscription.alert}
        />
      )}
    </Layout>
  );
}
