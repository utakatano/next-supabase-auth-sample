import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// このミドルウェアは各リクエスト時に実行されます
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Supabaseクライアントをミドルウェアコンテキストで作成
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        fetch: (url, options) => {
          const cookieFetchHeaders = new Headers(options?.headers);
          // クッキーをリクエストに含める
          const cookie = req.cookies.toString();
          if (cookie) {
            cookieFetchHeaders.set("cookie", cookie);
          }
          return fetch(url, { ...options, headers: cookieFetchHeaders });
        },
      },
    }
  );

  // セッションを更新し、必要に応じてリフレッシュトークンを使用
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // レスポンスにセッションクッキーを設定
  const setCookies = res.cookies.getAll().concat(
    // クッキーを処理するための配列
    (req.cookies.getAll() || []).map((cookie) => ({
      name: cookie.name,
      value: cookie.value,
    }))
  );

  setCookies.forEach((cookie) => {
    res.cookies.set(cookie.name, cookie.value);
  });

  // ダッシュボードなどの認証が必要なパスにアクセスしようとしたとき
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      // セッションがない場合はログインページにリダイレクト
      const redirectUrl = new URL("/login", req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // ログイン済みユーザーがログインページや登録ページにアクセスしようとしたとき
  if (
    (req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/signup")) &&
    session
  ) {
    // すでにログインしている場合はダッシュボードにリダイレクト
    const redirectUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// このミドルウェアを実行するパスを指定
export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
