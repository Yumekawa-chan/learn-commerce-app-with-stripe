'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
const SubscriptionManagementButton = () => {
  const router = useRouter();
  const loadPortal = async () => {
    const response = await fetch('http://localhost:3000/api/portal');
    const data = await response.json();
    router.push(data.url);
  };
  return (
    <div>
      <Button onClick={loadPortal}>サブスクリプション管理</Button>
    </div>
  );
};

export default SubscriptionManagementButton;
