import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://hbkjtwavvacaieekxlyy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_b3KlExKMVWCmjYyW47qFzw_sMb2zrCg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Call Supabase directly
export const submitClientIntake = async (clientData) => {
  try {
    console.log("Submitting to Supabase directly");
    
    const { data, error } = await supabase
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
