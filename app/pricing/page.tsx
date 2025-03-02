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
import Link from 'next/link';
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
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-4'>
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-16'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>料金プラン</h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            あなたのニーズに合わせた最適なプランをお選びください
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className='border-2 border-gray-200 hover:border-indigo-500 transition-all duration-300 hover:shadow-xl'
            >
              <CardHeader className='text-center pb-0'>
                <CardTitle className='text-2xl font-bold text-indigo-700'>
                  {plan.name}
                </CardTitle>
                <CardDescription className='text-gray-500'>
                  {plan.name}プラン詳細
                </CardDescription>
              </CardHeader>

              <CardContent className='text-center py-6'>
                <p className='text-5xl font-bold text-gray-900 mb-2'>
                  {parseInt(plan.price!).toLocaleString()}
                  <span className='text-xl font-normal text-gray-700'>円</span>
                </p>
                <p className='text-gray-600'>
                  / {transInterval(plan.interval)}
                </p>

                <div className='mt-6 border-t border-gray-100 pt-6'>
                  <ul className='space-y-3 text-left mx-auto w-fit'>
                    <li className='flex items-center'>
                      <svg
                        className='h-5 w-5 text-green-500 mr-2'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                      <span>プラン特典 1</span>
                    </li>
                    <li className='flex items-center'>
                      <svg
                        className='h-5 w-5 text-green-500 mr-2'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                      <span>プラン特典 2</span>
                    </li>
                  </ul>
                </div>
              </CardContent>

              <CardFooter className='bg-gray-50 px-6 py-4 flex justify-center'>
                {showSubscribeButton && <SubscriptionButton planId={plan.id} />}
                {showCreateAccountButton && <AuthServerButton />}
                {showManageSubscriptionButton && (
                  <Button className='w-full bg-indigo-600 hover:bg-indigo-700 text-white'>
                    <Link href='/dashboard' className='w-full inline-block'>
                      サブスクリプションを管理する
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
