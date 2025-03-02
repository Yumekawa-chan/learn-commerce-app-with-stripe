'use client';

import {
  Session,
  createClientComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

const AuthClientButton = ({ session }: { session: Session | null }) => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignin = () => {
    supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };
  const handleSignout = () => {
    const supabase = createClientComponentClient();
    supabase.auth.signOut();
    router.refresh();
  };

  return (
    <>
      {session ? (
        <Button onClick={handleSignout}>ログアウト</Button>
      ) : (
        <Button onClick={handleSignin}>サインイン</Button>
      )}
    </>
  );
};

export default AuthClientButton;
