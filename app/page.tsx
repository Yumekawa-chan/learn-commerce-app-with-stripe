import {
  createServerComponentClient,
  SupabaseClient,
} from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Database } from '@/lib/database.type';

const getAllLessons = async (supabase: SupabaseClient<Database>) => {
  const { data: lessons } = await supabase.from('lesson').select('*');
  return lessons;
};

const page = async () => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const lessons = await getAllLessons(supabase);
  return (
    <main className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12'>
      <div className='max-w-5xl mx-auto px-4 sm:px-6'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>
            レッスン一覧
          </h1>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            学習を始めるにはレッスンを選択してください
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {lessons?.map((lesson) => (
            <Link
              href={`/${lesson.id}`}
              key={lesson.id}
              className='transform transition duration-300 hover:scale-105'
            >
              <Card className='h-full border-2 border-gray-200 hover:border-indigo-500 hover:shadow-lg overflow-hidden'>
                <div className='h-2 bg-indigo-600'></div>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-xl font-bold text-indigo-700'>
                    {lesson.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-gray-600 line-clamp-3'>
                    {lesson.description}
                  </p>
                  <div className='mt-4 flex justify-end'>
                    <span className='inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800'>
                      詳細を見る
                      <svg
                        className='ml-1 w-5 h-5'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M9 5l7 7-7 7'
                        ></path>
                      </svg>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default page;
