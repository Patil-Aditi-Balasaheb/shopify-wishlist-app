import { redirect } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { MONTHLY_PLAN } from "../customValue";

export const loader = async ({ request }) => {
    const { billing } = await authenticate.admin(request);
    const billingCheck = await billing.require({
        plans: [MONTHLY_PLAN],
        onFailure: async () => billing.request({ plan: MONTHLY_PLAN }),
    });

    const subscription = billingCheck.appSubscriptions[0];
    const cancelledSubscription = await billing.cancel({
        subscriptionId: subscription.id,
        isTest: true,
        prorate: true,
    });

    return redirect("/app/pricing");
};