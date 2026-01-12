// Supabase Edge Function: export-clients
// Create this in: Edge Functions > Create a new function > name it "export-clients"
// Then paste this code and click Deploy

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");

serve(async (req) => {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Basic ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { 
      status: 401, 
      headers: { "Content-Type": "application/json" } 
    });
  }

  const credentials = atob(authHeader.slice(6)).split(":");
  const adminUsername = Deno.env.get("ADMIN_USERNAME");
  const adminPassword = Deno.env.get("ADMIN_PASSWORD");

  if (credentials[0] !== adminUsername || credentials[1] !== adminPassword) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), { 
      status: 401, 
      headers: { "Content-Type": "application/json" } 
    });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 400, 
      headers: { "Content-Type": "application/json" } 
    });
  }

  return new Response(JSON.stringify(data), { 
    status: 200, 
    headers: { "Content-Type": "application/json" } 
  });
});
