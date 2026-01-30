import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log("SUPABASE_URL:", SUPABASE_URL);
console.log("SUPABASE_ANON_KEY:", SUPABASE_ANON_KEY);

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Call Supabase directly
export const submitClientIntake = async (clientData) => {
  try {
    console.log("Submitting to Supabase directly");
    
    const { error } = await supabase
      .from('clients')
      .insert([clientData])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return { message: `Client ${clientData.name} onboarded successfully!` };
  } catch (error) {
    console.error("Intake error:", error);
    throw error;
  }
};

// Fetch clients (admin only)
export const fetchClients = async (username, password) => {
  try {
    // Verify credentials locally
    if (username !== "gemra2025" || password !== "naveenmidunan") {
      throw new Error("Invalid credentials");
    }
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Export error:", error);
    throw error;
  }
};
