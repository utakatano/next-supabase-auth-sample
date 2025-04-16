'use client';

import Login from "@/components/auth/Login";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // ログイン済みの場合はダッシュボードにリダイレクト
  useEffect(() => {
    if (user && !isLoading) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">読み込み中...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <Login />
        <div className="mt-4 text-center">
          <p>アカウントをお持ちでない場合は、<Link href="/signup" className="text-blue-500 hover:underline">こちら</Link>から登録してください。</p>
        </div>
        <div className="mt-2 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:underline">ホームに戻る</Link>
        </div>
      </div>
    </div>
  );
}