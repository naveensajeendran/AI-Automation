// Supabase Edge Function: intake
// Create this in: Edge Functions > Create a new function > name it "intake"
// Then paste this code and click Deploy

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { name, email, service_type, notes } = await req.json();
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { error } = await supabase.from("clients").insert({
    name,
    email,
    service_type,
    notes: notes || "",
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 400, 
      headers: { "Content-Type": "application/json" } 
    });
  }

  return new Response(JSON.stringify({ message: `Client ${name} onboarded successfully!` }), { 
    status: 200, 
    headers: { "Content-Type": "application/json" } 
  });
});
