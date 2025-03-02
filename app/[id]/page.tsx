import {
  createServerComponentClient,
  SupabaseClient,
} from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import React from 'react';
import { Database } from '@/lib/database.type';
import { YouTubeEmbed } from '@next/third-parties/google';
import { extractYouTubeVideoId } from '@/utils/extractVideoId';

const getDetailLessons = async (
  id: number,
  supabase: SupabaseClient<Database>,
) => {
  const { data: lessons } = await supabase
    .from('lesson')
    .select('*')
    .eq('id', id)
    .single();
  return lessons;
};

const getPremiumContent = async (
  id: number,
  supabase: SupabaseClient<Database>,
) => {
  const { data: video } = await supabase
    .from('premium_content')
    .select('video_url')
    .eq('id', id)
    .single();
  return video;
};

const LessonDetailPage = async ({ params }: { params: { id: number } }) => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const [lesson, video] = await Promise.all([
    await getDetailLessons(params.id, supabase),
    await getPremiumContent(params.id, supabase),
  ]);
  const videoId = extractYouTubeVideoId(video?.video_url ?? '') as string;

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6'>
        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
          <div className='bg-indigo-600 py-4 px-6'>
            <h1 className='text-2xl md:text-3xl font-bold text-white'>
              {lesson?.title}
            </h1>
          </div>

          <div className='p-6'>
            <div className='bg-gray-50 rounded-lg p-5 mb-8 border border-gray-200'>
              <h2 className='text-xl font-semibold text-gray-800 mb-3'>
                レッスン概要
              </h2>
              <p className='text-gray-700 leading-relaxed'>
                {lesson?.description}
              </p>
            </div>

            <div className='rounded-lg overflow-hidden shadow-md'>
              <YouTubeEmbed height={450} videoid={videoId} />
            </div>

            <div className='mt-8 flex justify-between items-center'>
              <button className='px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300 transition'>
                前のレッスン
              </button>
              <button className='px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition'>
                次のレッスン
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetailPage;
