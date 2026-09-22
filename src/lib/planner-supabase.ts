import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // eslint-disable-next-line no-console
  console.error(
    "Supabase-configuratie ontbreekt. Zet PUBLIC_SUPABASE_URL en PUBLIC_SUPABASE_ANON_KEY in .env (zie .env.example)."
  );
}

export const supabase = createClient(url ?? "", anonKey ?? "");
