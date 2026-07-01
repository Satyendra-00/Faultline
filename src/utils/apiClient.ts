import { supabase } from "./supabaseClient";

type FetchOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch(input: string, init: FetchOptions = {}) {
  const { auth = true, headers, ...rest } = init;
  const finalHeaders = new Headers(headers);

  if (auth) {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    if (token) {
      finalHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  return fetch(input, {
    ...rest,
    headers: finalHeaders,
  });
}
