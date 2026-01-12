# Supabase Integration Guide

## Step 1: Create Supabase Project
1. Go to https://supabase.com and sign up
2. Create a new project
3. Note your `Project URL` and `Anon Key` (you'll need these)

## Step 2: Create Database Tables

Run this SQL in Supabase SQL Editor:

```sql
-- Create clients table
CREATE TABLE clients (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  service_type VARCHAR(100) NOT NULL,
  notes TEXT,
  welcome_email TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX idx_clients_email ON clients(email);
```

## Step 3: Create Edge Functions

Go to Edge Functions in Supabase dashboard and create these:

### Function 1: `intake` (POST /intake)
```typescript
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");

serve(async (req) => {
  if (req.method === "POST") {
    const { name, email, service_type, notes } = await req.json();
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Save to database
    const { error } = await supabase.from("clients").insert({
      name,
      email,
      service_type,
      notes: notes || "",
    });
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    return new Response(
      JSON.stringify({ message: `Client ${name} onboarded successfully!` }),
      { 
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  
  return new Response("Method not allowed", { status: 405 });
});
```

### Function 2: `export-clients` (GET /admin/export)
```typescript
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");

serve(async (req) => {
  // Basic auth check
  const authHeader = req.headers.get("authorization");
  
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  
  const credentials = atob(authHeader.slice(6)).split(":");
  const username = credentials[0];
  const password = credentials[1];
  
  // Verify credentials (stored in Deno env vars)
  const adminUsername = Deno.env.get("ADMIN_USERNAME");
  const adminPassword = Deno.env.get("ADMIN_PASSWORD");
  
  if (username !== adminUsername || password !== adminPassword) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
    });
  }
  
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
```

## Step 4: Set Edge Function Environment Variables

In Supabase, go to Edge Functions > Settings and add:
- `ADMIN_USERNAME` = `gemra2025`
- `ADMIN_PASSWORD` = `naveenmidunan`

## Step 5: Enable CORS (if needed)
In your Supabase project, SQL Editor, run:
```sql
CREATE OR REPLACE FUNCTION handle_auth()
RETURNS void AS $$
BEGIN
  null;
END;
$$ LANGUAGE plpgsql;
```

Your Edge Functions URLs will be:
- Intake: `https://YOUR_PROJECT.supabase.co/functions/v1/intake`
- Export: `https://YOUR_PROJECT.supabase.co/functions/v1/export-clients`
