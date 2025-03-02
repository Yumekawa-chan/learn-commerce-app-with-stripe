import React from 'react';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

const CancelledPage = () => {
  return (
    <div className='min-h-[80vh] flex items-center justify-center'>
      <div className='text-center space-y-4 p-8'>
        <div className='flex justify-center'>
          <XCircle className='w-16 h-16 text-red-500' />
        </div>
        <h1 className='text-2xl font-bold text-gray-900'>
          お支払いがキャンセルされました
        </h1>
        <p className='text-gray-600'>
          ご不明な点がございましたら、お問い合わせください
        </p>
        <Link
          href='/'
          className='inline-block mt-4 px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors'
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
};

export default CancelledPage;
