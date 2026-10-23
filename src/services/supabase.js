
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://jddutkjoyidlolernkiy.supabase.co";
const SUPABASE_KEY = "sb_publishable_U3aHte29pm1LJi-WpnJWJg_Xv5jdV-l";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
