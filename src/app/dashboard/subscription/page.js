import { headers } from "next/headers";
import { fetchServer } from "@/lib/server-api";
import SubscriptionManager from "@/components/dashboard/subscription/SubscriptionManager";

export const metadata = {
  title: "Abonelik Yönetimi | SaaS",
};

export default async function SubscriptionPage() {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const cookieHeader = headersList.get("cookie") ?? "";

  const [currentRes, plansRes] = await Promise.all([
    fetch(`${protocol}://${host}/api/subscription/get-current-subscription`, {
      cache: "no-store",
      headers: { cookie: cookieHeader },
    }),
    fetchServer("/api/subscription/plans"),
  ]);

  const currentBody = await currentRes.json();
  const currentSubscription = currentBody?.isSuccess ? currentBody.data : null;
  const availablePlans = plansRes.body?.isSuccess ? plansRes.body.data : [];

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-lg font-semibold text-neutral-900">
        Abonelik Yönetimi
      </h1>
      <p className="text-sm text-neutral-500">
        Şirketinizin planlarını, aktif modüllerini ve fatura dönemini buradan
        yönetebilirsiniz.
      </p>

      <SubscriptionManager
        initialSubscription={currentSubscription}
        plans={availablePlans}
      />
    </div>
  );
}
