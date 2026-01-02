import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

async function createPortalSession(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const body = await req.json() as { customerId?: string; returnUrl?: string };
    const { customerId, returnUrl } = body;

    if (!customerId) {
      return {
        status: 400,
        jsonBody: { error: "Missing customerId" },
      };
    }

    const origin = req.headers.get("origin") || "https://nice-wave-0d4061b03.6.azurestaticapps.net";

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || origin,
    });

    return {
      status: 200,
      jsonBody: { url: session.url },
    };
  } catch (error) {
    context.error("Portal session error:", error);
    return {
      status: 500,
      jsonBody: { error: error instanceof Error ? error.message : "Internal server error" },
    };
  }
}

app.http("create-portal-session", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: createPortalSession,
});
