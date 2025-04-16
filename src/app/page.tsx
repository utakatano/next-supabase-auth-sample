'use client';

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import LogoutButton from "@/components/auth/LogoutButton";

export default function Home() {
  const { user, isLoading } = useAuth();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full flex justify-end p-4">
        {isLoading ? (
          <div>読み込み中...</div>
        ) : user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm">ようこそ、{user.email}</span>
            <Link href="/dashboard" className="text-blue-500 hover:underline">
              ダッシュボード
            </Link>
            <LogoutButton />
          </div>
        ) : (
          <div className="flex gap-4">
            <Link href="/login" className="text-blue-500 hover:underline">
              ログイン
            </Link>
            <Link href="/signup" className="text-blue-500 hover:underline">
              アカウント登録
            </Link>
          </div>
        )}
      </header>
      
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        
        <div className="max-w-xl text-center sm:text-left">
          <h1 className="text-3xl font-bold mb-4">Next.js + Supabase認証サンプル</h1>
          <p className="mb-6">
            このサンプルアプリケーションでは、Next.jsとSupabaseを使用したユーザー認証の実装例を示しています。
            メールアドレスとパスワードを使用したサインアップ、ログイン、ログアウト機能が含まれています。
          </p>
          
          {!user && (
            <div className="flex gap-4 justify-center sm:justify-start">
              <Link 
                href="/signup"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                アカウント登録
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
              >
                ログイン
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
