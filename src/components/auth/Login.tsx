"use client";

import { useState } from "react";
import { createSupabaseClient } from "@/utils/supabase";
import { handleErrorMessage } from "@/utils/handleErrorMessage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const supabase = createSupabaseClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      window.location.href = "/dashboard"; // ログイン後にリダイレクト
    } catch (error: unknown) {
      setMessage({
        type: "error",
        text: handleErrorMessage(
          error,
          "ログインに失敗しました。認証情報を確認してください。"
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage({
        type: "error",
        text: "パスワードリセットのためにメールアドレスを入力してください。",
      });
      return;
    }

    try {
      const supabase = createSupabaseClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setMessage({
        type: "success",
        text: "パスワードリセット用のメールを送信しました。",
      });
    } catch (error: unknown) {
      setMessage({
        type: "error",
        text: handleErrorMessage(
          error,
          "エラーが発生しました。再度お試しください。"
        ),
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">ログイン</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            パスワード
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? "ログイン中..." : "ログイン"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-3 rounded-md ${
            message.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="mt-4 text-center">
        <a
          href="#"
          className="text-sm text-blue-500 hover:underline"
          onClick={handlePasswordReset}
        >
          パスワードをお忘れですか？
        </a>
      </div>
    </div>
  );
}
