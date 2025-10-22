import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pcqywunqsqlvgwelipsq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcXl3dW5xc3Fsdmd3ZWxpcHNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMTcxNTksImV4cCI6MjA3NDg5MzE1OX0.8Be7FjALkpbRCIsLxGrx2RMs1O5X9TQk4Zi6dTi1a9A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
