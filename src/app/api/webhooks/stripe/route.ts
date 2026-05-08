import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

let stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
      apiVersion: "2026-04-22.dahlia",
    });
  }
  return stripe;
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

// Initialize Supabase admin client to bypass RLS for webhook updates
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event: Stripe.Event;

    if (process.env.STRIPE_SECRET_KEY && webhookSecret && signature) {
      try {
        event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err: any) {
        console.error(`Webhook signature verification failed.`, err.message);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
      }
    } else {
      // If we don't have keys configured, we might be testing locally without webhooks
      // Fallback to parsing the body directly (only recommended for local dev without ngrok)
      event = JSON.parse(body);
    }

    const session = event.data.object as Stripe.Checkout.Session;

    switch (event.type) {
      case "checkout.session.completed":
        // Payment is successful and the subscription is created.
        const userId = session.client_reference_id || session.metadata?.userId;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        if (userId) {
          // Retrieve the subscription to see what plan they bought
          // For simplicity, if we don't have stripe configured, we'll just upgrade them to "pro"
          let plan = "pro";
          
          if (process.env.STRIPE_SECRET_KEY) {
             const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
             // Logic to determine plan based on price ID
             // If price == Premium Price ID -> 'premium'
             // Else -> 'pro'
          }

          // Update user profile in Supabase
          const { error } = await supabaseAdmin
            .from("profiles")
            .update({
              plan: plan,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              updated_at: new Date().toISOString()
            })
            .eq("id", userId);

          if (error) {
            console.error("Error updating user profile:", error);
            return new NextResponse("Database Error", { status: 500 });
          }
          console.log(`Successfully upgraded user ${userId} to ${plan} plan.`);
        }
        break;

      case "customer.subscription.deleted":
        // User cancelled their subscription
        const deletedSubscription = event.data.object as Stripe.Subscription;
        
        // Find user by stripe_subscription_id and downgrade them
        const { error: downgradeError } = await supabaseAdmin
          .from("profiles")
          .update({
            plan: "free",
            updated_at: new Date().toISOString()
          })
          .eq("stripe_subscription_id", deletedSubscription.id);

        if (downgradeError) {
          console.error("Error downgrading user profile:", downgradeError);
        }
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new NextResponse(null, { status: 200 });
  } catch (error: any) {
    console.error("[WEBHOOK_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
