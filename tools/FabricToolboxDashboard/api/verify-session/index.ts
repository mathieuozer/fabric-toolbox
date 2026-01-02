import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

async function verifySession(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const sessionId = req.query.get("sessionId");

    if (!sessionId) {
      return {
        status: 400,
        jsonBody: { error: "Missing sessionId" },
      };
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"],
    });

    if (session.payment_status !== "paid") {
      return {
        status: 400,
        jsonBody: { error: "Payment not completed" },
      };
    }

    const subscription = session.subscription as Stripe.Subscription;

    return {
      status: 200,
      jsonBody: {
        active: true,
        customerId: session.customer as string,
        subscriptionId: subscription.id,
        currentPeriodEnd: subscription.current_period_end,
      },
    };
  } catch (error) {
    context.error("Verify session error:", error);
    return {
      status: 500,
      jsonBody: { error: error instanceof Error ? error.message : "Internal server error" },
    };
  }
}

app.http("verify-session", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: verifySession,
});
