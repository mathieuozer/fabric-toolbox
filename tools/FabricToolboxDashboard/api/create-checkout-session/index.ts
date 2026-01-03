import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-16",
});

async function createCheckoutSession(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    // Check if Stripe is configured
    if (!stripeSecretKey) {
      context.error("STRIPE_SECRET_KEY is not configured");
      return {
        status: 500,
        jsonBody: { error: "Payment system not configured. Please contact support." },
      };
    }

    const body = await req.json() as { priceId?: string; email?: string; customerId?: string; successUrl?: string; cancelUrl?: string };
    const { priceId, email, customerId, successUrl, cancelUrl } = body;

    if (!priceId) {
      return {
        status: 400,
        jsonBody: { error: "Missing priceId" },
      };
    }

    const origin = req.headers.get("origin") || "https://nice-wave-0d4061b03.6.azurestaticapps.net";

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl || `${origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/subscription/cancelled`,
    };

    if (customerId) {
      sessionParams.customer = customerId;
    } else if (email) {
      sessionParams.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return {
      status: 200,
      jsonBody: {
        sessionId: session.id,
        url: session.url,
      },
    };
  } catch (error) {
    context.error("Checkout session error:", error);
    return {
      status: 500,
      jsonBody: { error: error instanceof Error ? error.message : "Internal server error" },
    };
  }
}

app.http("create-checkout-session", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: createCheckoutSession,
});
