import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

async function webhook(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return {
      status: 400,
      jsonBody: { error: "Missing stripe-signature header" },
    };
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    context.error("Webhook signature verification failed:", err);
    return {
      status: 400,
      jsonBody: { error: `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}` },
    };
  }

  switch (event.type) {
    case "customer.subscription.created":
      context.log("Subscription created:", event.data.object);
      break;

    case "customer.subscription.updated":
      context.log("Subscription updated:", event.data.object);
      break;

    case "customer.subscription.deleted":
      context.log("Subscription deleted:", event.data.object);
      break;

    case "invoice.payment_succeeded":
      context.log("Payment succeeded:", event.data.object);
      break;

    case "invoice.payment_failed":
      context.warn("Payment failed:", event.data.object);
      break;

    default:
      context.log(`Unhandled event type: ${event.type}`);
  }

  return {
    status: 200,
    jsonBody: { received: true },
  };
}

app.http("webhook", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: webhook,
});
