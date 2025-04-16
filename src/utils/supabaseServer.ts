import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export const createSupabaseServerClient = () => {
  return createClient(
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
          const cookieStore = cookies();
          const cookieHeader = cookieStore.toString();

          const headers = new Headers(options?.headers);
          if (cookieHeader) {
            headers.set("Cookie", cookieHeader);
          }

          return fetch(url, { ...options, headers });
        },
      },
    }
  );
};
