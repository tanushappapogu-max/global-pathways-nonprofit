-- Create comprehensive tables for full website functionality (fixed version)

-- User profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles_2025_10_14_02_00 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  country TEXT,
  state TEXT,
  city TEXT,
  education_level TEXT,
  field_of_study TEXT,
  gpa DECIMAL(3,2),
  sat_score INTEGER,
  act_score INTEGER,
  financial_need TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved scholarships table
CREATE TABLE IF NOT EXISTS public.saved_scholarships_2025_10_14_02_00 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  scholarship_id UUID,
  scholarship_name TEXT NOT NULL,
  amount TEXT,
  deadline DATE,
  status TEXT DEFAULT 'saved',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- College applications table
CREATE TABLE IF NOT EXISTS public.college_applications_2025_10_14_02_00 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  college_name TEXT NOT NULL,
  application_status TEXT DEFAULT 'planning',
  deadline DATE,
  application_fee DECIMAL(10,2),
  requirements_completed JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAFSA progress table
CREATE TABLE IF NOT EXISTS public.fafsa_progress_2025_10_14_02_00 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  step_name TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completion_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cost calculations table
CREATE TABLE IF NOT EXISTS public.cost_calculations_2025_10_14_02_00 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  college_name TEXT NOT NULL,
  tuition DECIMAL(10,2),
  room_board DECIMAL(10,2),
  books_supplies DECIMAL(10,2),
  personal_expenses DECIMAL(10,2),
  transportation DECIMAL(10,2),
  total_cost DECIMAL(10,2),
  financial_aid DECIMAL(10,2),
  net_cost DECIMAL(10,2),
  calculation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings table
CREATE TABLE IF NOT EXISTS public.user_settings_2025_10_14_02_00 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  deadline_reminders BOOLEAN DEFAULT TRUE,
  newsletter_subscription BOOLEAN DEFAULT TRUE,
  language_preference TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE public.user_profiles_2025_10_14_02_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_scholarships_2025_10_14_02_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_applications_2025_10_14_02_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fafsa_progress_2025_10_14_02_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_calculations_2025_10_14_02_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings_2025_10_14_02_00 ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles_2025_10_14_02_00
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles_2025_10_14_02_00
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles_2025_10_14_02_00
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for saved_scholarships
CREATE POLICY "Users can manage own saved scholarships" ON public.saved_scholarships_2025_10_14_02_00
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for college_applications
CREATE POLICY "Users can manage own applications" ON public.college_applications_2025_10_14_02_00
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for fafsa_progress
CREATE POLICY "Users can manage own FAFSA progress" ON public.fafsa_progress_2025_10_14_02_00
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for cost_calculations
CREATE POLICY "Users can manage own calculations" ON public.cost_calculations_2025_10_14_02_00
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for user_settings
CREATE POLICY "Users can manage own settings" ON public.user_settings_2025_10_14_02_00
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles_2025_10_14_02_00(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_scholarships_user_id ON public.saved_scholarships_2025_10_14_02_00(user_id);
CREATE INDEX IF NOT EXISTS idx_college_applications_user_id ON public.college_applications_2025_10_14_02_00(user_id);
CREATE INDEX IF NOT EXISTS idx_fafsa_progress_user_id ON public.fafsa_progress_2025_10_14_02_00(user_id);
CREATE INDEX IF NOT EXISTS idx_cost_calculations_user_id ON public.cost_calculations_2025_10_14_02_00(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON public.user_settings_2025_10_14_02_00(user_id);