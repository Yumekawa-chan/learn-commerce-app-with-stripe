import React from 'react';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

const SuccessPage = () => {
  return (
    <div className='min-h-[80vh] flex items-center justify-center'>
      <div className='text-center space-y-4 p-8'>
        <div className='flex justify-center'>
          <CheckCircle className='w-16 h-16 text-green-500' />
        </div>
        <h1 className='text-2xl font-bold text-gray-900'>
          お支払いが完了しました
        </h1>
        <p className='text-gray-600'>ご購入ありがとうございます</p>
        <Link
          href='/'
          className='inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
