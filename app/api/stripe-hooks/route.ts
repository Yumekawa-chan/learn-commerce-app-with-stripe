import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.type';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const endpointSecret = process.env.STRIPE_SIGNING_SECRET;
  const signature = req.headers.get('stripe-signature');
  const reqBuffer = Buffer.from(await req.arrayBuffer());
  const supabase = createRouteHandlerClient<Database>({ cookies });

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      reqBuffer,
      signature!,
      endpointSecret!,
    );

    switch (event.type) {
      case 'customer.subscription.created':
        const customerSubscriptionCreated = event.data.object;
        await supabase
          .from('profile')
          .update({
            is_subscribed: true,
            interval: customerSubscriptionCreated.items.data[0].plan.interval,
          })
          .eq('stripe_customer', event.data.object.customer as string);
        break;
      case 'customer.subscription.updated':
        const customerSubscriptionUpdated = event.data.object;

        if (customerSubscriptionUpdated.status === 'canceled') {
          await supabase
            .from('profile')
            .update({
              is_subscribed: false,
              interval: null,
            })
            .eq('stripe_customer', event.data.object.customer as string);
        } else {
          await supabase
            .from('profile')
            .update({
              is_subscribed: true,
              interval: customerSubscriptionUpdated.items.data[0].plan.interval,
            })
            .eq('stripe_customer', event.data.object.customer as string);
        }
        break;
      case 'customer.subscription.deleted':
        await supabase
          .from('profile')
          .update({
            is_subscribed: false,
            interval: null,
          })
          .eq('stripe_customer', event.data.object.customer as string);
        break;
    }
    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }
}
