import { createClient as _createAdminClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

export function createAdminClient() {
  return _createAdminClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,  // bypasses RLS
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
