'use client';
import { Session } from '@supabase/auth-helpers-nextjs';
import { Button } from '../ui/button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
const AuthClientButton = ({ session }: { session: Session | null }) => {
  const handleSignin = () => {
    const supabase = createClientComponentClient();
    supabase.auth.signInWithOAuth({
      provider: 'github',
    });
  };

  return <Button onClick={handleSignin}>サインイン</Button>;
};

export default AuthClientButton;
