import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Stripe from 'stripe';
import {
  createServerComponentClient,
  SupabaseClient,
} from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.type';
import SubscriptionButton from '@/components/checkout/SubscriptionButton';
import AuthServerButton from '@/components/auth/AuthServerButton';

interface Plan {
  id: string;
  name: string;
  price: string | null;
  interval: string;
  currency: string;
}

const getAllPlans = async (): Promise<Plan[]> => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const { data: plans } = await stripe.plans.list();
  const plansData = await Promise.all(
    plans.map(async (plan) => {
      const product = await stripe.products.retrieve(plan.product as string);
      return {
        id: plan.id,
        name: product.name,
        price: plan.amount_decimal,
        interval: plan.interval,
        currency: plan.currency,
      };
    }),
  );

  const sortedPlans = plansData.sort(
    (a, b) => parseInt(a.price!) - parseFloat(b.price!),
  );
  return sortedPlans;
};

const getProfileData = async (supabase: SupabaseClient<Database>) => {
  const { data: profile } = await supabase.from('profile').select('*').single();
  return profile;
};

const transInterval = (interval: string) => {
  switch (interval) {
    case 'month':
      return '月';
    case 'year':
      return '年';
  }
};

const PricingPage = async () => {
  const supabase = createServerComponentClient({ cookies });
  const { data: user } = await supabase.auth.getSession();

  const [plans, profile] = await Promise.all([
    await getAllPlans(),
    await getProfileData(supabase),
  ]);

  const showSubscribeButton = !!user.session && !profile?.is_subscribed;
  const showCreateAccountButton = !user.session;
  const showManageSubscriptionButton = !!user.session && profile?.is_subscribed;

  return (
    <div className='w-full max-w-3xl mx-auto py-16 flex justify-around'>
      {plans.map((plan) => (
        <Card className='shadow-md' key={plan.id}>
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              {plan.price}円 / {transInterval(plan.interval)}
            </p>
          </CardContent>
          <CardFooter>
            {showSubscribeButton && <SubscriptionButton planId={plan.id} />}
            {showCreateAccountButton && <AuthServerButton />}
            {showManageSubscriptionButton && (
              <Button>サブスクリプションを管理する</Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PricingPage;
