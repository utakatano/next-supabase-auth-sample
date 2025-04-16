'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';

export default function LogoutButton() {
  const router = useRouter();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
    >
      ログアウト
    </button>
  );
}