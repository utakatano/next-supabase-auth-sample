import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// このミドルウェアは各リクエスト時に実行されます
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Supabaseクライアントをミドルウェアコンテキストで作成
  const supabase = createMiddlewareClient({ req, res });
  
  // セッションを更新し、必要に応じてリフレッシュトークンを使用
  const { data: { session } } = await supabase.auth.getSession();

  // ダッシュボードなどの認証が必要なパスにアクセスしようとしたとき
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      // セッションがない場合はログインページにリダイレクト
      const redirectUrl = new URL('/login', req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // ログイン済みユーザーがログインページや登録ページにアクセスしようとしたとき
  if ((req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup')) && session) {
    // すでにログインしている場合はダッシュボードにリダイレクト
    const redirectUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// このミドルウェアを実行するパスを指定
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
};