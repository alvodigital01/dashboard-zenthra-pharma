"use client";

import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseCredentials } from "@/lib/supabase/shared";
import type { Database } from "@/types/database";

function buildBrowserClient() {
  const { url, anonKey } = getSupabaseCredentials();
  return createBrowserClient<Database>(url, anonKey);
}

type BrowserSupabaseClient = ReturnType<typeof buildBrowserClient>;

let browserClient: BrowserSupabaseClient | undefined;

export function createBrowserSupabaseClient() {
  if (browserClient) {
    return browserClient;
  }

  browserClient = buildBrowserClient();

  return browserClient;
}
