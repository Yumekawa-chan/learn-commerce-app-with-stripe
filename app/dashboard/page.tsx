import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import React from 'react';
import { Database } from '@/lib/database.type';
import { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import SubscriptionManagementButton from '@/components/checkout/SubscriptionManagementButton';
const getProfileData = async (supabase: SupabaseClient<Database>) => {
  const { data: profile } = await supabase.from('profile').select('*').single();
  return profile;
};

const DashboardPage = async () => {
  const supabase = createServerComponentClient({ cookies });
  const profile = await getProfileData(supabase);

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12'>
      <div className='w-full max-w-4xl mx-auto px-6 sm:px-8'>
        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
          <div className='bg-indigo-600 py-6 px-8'>
            <h1 className='text-3xl font-bold text-white'>
              ユーザー管理ダッシュボード
            </h1>
          </div>

          <div className='p-8'>
            <div className='bg-gray-50 rounded-lg p-6 border border-gray-200'>
              <h2 className='text-xl font-semibold text-gray-800 mb-4'>
                サブスクリプション状況
              </h2>

              <div className='mb-6'>
                {profile?.is_subscribed ? (
                  <div className='flex items-center space-x-2'>
                    <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                    <p className='text-lg font-medium text-gray-700'>
                      プラン契約中：
                      <span className='text-indigo-600 font-semibold'>
                        {profile.interval}
                      </span>
                    </p>
                  </div>
                ) : (
                  <div className='flex items-center space-x-2'>
                    <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                    <p className='text-lg font-medium text-gray-700'>
                      プラン未加入
                    </p>
                  </div>
                )}
              </div>

              <div className='mt-6'>
                <SubscriptionManagementButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
