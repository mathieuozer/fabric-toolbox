import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

/**
 * Get subscription status by user email
 * This links Azure AD identity to Stripe subscription via email
 */
async function userSubscription(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const email = req.query.get("email");

    if (!email) {
      return {
        status: 400,
        jsonBody: { error: "Missing email parameter" },
      };
    }

    // Search for customer by email in Stripe
    const customers = await stripe.customers.list({
      email: email.toLowerCase(),
      limit: 1,
    });

    if (customers.data.length === 0) {
      // No Stripe customer found - user is on Free tier
      return {
        status: 200,
        jsonBody: {
          tier: "free",
          email: email.toLowerCase(),
          customerId: null,
          subscriptionId: null,
          currentPeriodEnd: null,
        },
      };
    }

    const customer = customers.data[0];

    // Check for active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      // Customer exists but no active subscription
      return {
        status: 200,
        jsonBody: {
          tier: "free",
          email: email.toLowerCase(),
          customerId: customer.id,
          subscriptionId: null,
          currentPeriodEnd: null,
        },
      };
    }

    const subscription = subscriptions.data[0];

    // Active subscription found - user is Pro
    return {
      status: 200,
      jsonBody: {
        tier: "pro",
        email: email.toLowerCase(),
        customerId: customer.id,
        subscriptionId: subscription.id,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    };
  } catch (error) {
    context.error("User subscription error:", error);
    return {
      status: 500,
      jsonBody: { error: error instanceof Error ? error.message : "Internal server error" },
    };
  }
}

app.http("user-subscription", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: userSubscription,
});
