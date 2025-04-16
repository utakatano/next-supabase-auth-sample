'use client';

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LogoutButton from "@/components/auth/LogoutButton";
import Link from "next/link";
import { supabase } from "@/utils/supabase";

export default function Dashboard() {
  const { user, session, isLoading } = useAuth();
  const router = useRouter();

  // 未ログインの場合はログインページにリダイレクト
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">読み込み中...</div>;
  }

  if (!user) {
    return null; // リダイレクト中は何も表示しない
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">ダッシュボード</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">{user.email}</span>
            <LogoutButton />
          </div>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">アカウント情報</h2>
          <div className="space-y-2">
            <p><strong>メールアドレス:</strong> {user.email}</p>
            <p><strong>ユーザーID:</strong> {user.id}</p>
            <p><strong>最終ログイン:</strong> {new Date(user.last_sign_in_at || '').toLocaleString('ja-JP')}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">利用可能なアクション</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 p-4 rounded-md hover:bg-gray-50">
              <h3 className="font-medium mb-2">プロフィール設定</h3>
              <p className="text-sm text-gray-500 mb-4">アカウント情報やプロフィールを編集します。</p>
              <button className="text-blue-500 hover:underline text-sm">設定を開く</button>
            </div>
            
            <div className="border border-gray-200 p-4 rounded-md hover:bg-gray-50">
              <h3 className="font-medium mb-2">パスワード変更</h3>
              <p className="text-sm text-gray-500 mb-4">アカウントのパスワードを変更します。</p>
              <button 
                className="text-blue-500 hover:underline text-sm"
                onClick={async () => {
                  try {
                    const { error } = await supabase.auth.resetPasswordForEmail(user.email || '');
                    if (error) throw error;
                    alert('パスワードリセット用のメールを送信しました。');
                  } catch (error: any) {
                    alert(error.message || 'エラーが発生しました。');
                  }
                }}
              >
                パスワードを変更
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-500 hover:underline">ホームに戻る</Link>
        </div>
      </div>
    </div>
  );
}