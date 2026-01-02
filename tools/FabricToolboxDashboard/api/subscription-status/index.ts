import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

async function subscriptionStatus(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const customerId = req.query.get("customerId");

    if (!customerId) {
      return {
        status: 400,
        jsonBody: { error: "Missing customerId" },
      };
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return {
        status: 200,
        jsonBody: {
          active: false,
          customerId,
        },
      };
    }

    const subscription = subscriptions.data[0];

    return {
      status: 200,
      jsonBody: {
        active: true,
        customerId,
        subscriptionId: subscription.id,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    };
  } catch (error) {
    context.error("Subscription status error:", error);
    return {
      status: 500,
      jsonBody: { error: error instanceof Error ? error.message : "Internal server error" },
    };
  }
}

app.http("subscription-status", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: subscriptionStatus,
});
