// recommend-service/recommend/lib/supabaseServer.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
	throw new Error("Missing SUPABASE environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
