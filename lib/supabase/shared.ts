export interface SupabaseCredentials {
  url: string;
  anonKey: string;
}

export function getSupabaseCredentialsOrNull(): SupabaseCredentials | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export function hasSupabaseCredentials() {
  return getSupabaseCredentialsOrNull() !== null;
}

export function getSupabaseCredentials() {
  const credentials = getSupabaseCredentialsOrNull();

  if (!credentials) {
    throw new Error(
      "Supabase environment variables are missing. Define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
  }

  return credentials;
}
