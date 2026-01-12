# Supabase Migration Checklist

## ✅ What's Done
- [x] Backend replaced with Supabase Edge Functions
- [x] Frontend updated to use Supabase API
- [x] `api.js` created with Supabase client functions
- [x] `ClientForm.js` connected to Supabase
- [x] `AdminPanel.js` connected to Supabase export

## 📋 Next Steps to Deploy

### 1. Create Supabase Account
- Go to https://supabase.com
- Sign up and create a new project
- Choose PostgreSQL

### 2. Create Database Schema
In Supabase SQL Editor, run:
```sql
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

CREATE INDEX idx_clients_email ON clients(email);
```

### 3. Create Edge Functions
In Supabase dashboard, go to **Edge Functions** and create these:

#### Function: `intake`
```typescript
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
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify({ message: `Client ${name} onboarded successfully!` }), { status: 200, headers: { "Content-Type": "application/json" } });
});
```

#### Function: `export-clients`
```typescript
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");

serve(async (req) => {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Basic ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const credentials = atob(authHeader.slice(6)).split(":");
  const adminUsername = Deno.env.get("ADMIN_USERNAME");
  const adminPassword = Deno.env.get("ADMIN_PASSWORD");

  if (credentials[0] !== adminUsername || credentials[1] !== adminPassword) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
});
```

### 4. Set Edge Function Secrets
For both functions, set these environment variables:
- `ADMIN_USERNAME` = `gemra2025`
- `ADMIN_PASSWORD` = `naveenmidunan`

### 5. Update Frontend Configuration
Edit `frontend/src/api.js` and replace:
```javascript
const SUPABASE_URL = "YOUR_PROJECT_URL"; // e.g., https://abcdefgh.supabase.co
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY"; // Get from Supabase Settings > API
```

### 6. Test the Frontend
```bash
cd frontend
npm start
```

Visit http://localhost:3000 and:
- Submit a client in the form
- Go to Admin page and download clients

## 🎯 How It Works

1. **Client Intake**: Frontend sends data to Edge Function `intake` → saves to PostgreSQL
2. **Admin Export**: Frontend sends basic auth to Edge Function `export-clients` → retrieves from PostgreSQL

## 🚀 You Can Now Delete:
- `Backend/` folder (no longer needed)
- `database.py`
- `main.py`
- `routes/`
- `services/` (unless you want to use services outside the intake flow)

Your frontend is now fully serverless and scalable! 🎉
