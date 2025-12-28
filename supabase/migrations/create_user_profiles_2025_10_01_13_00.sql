-- Create user profiles table
CREATE TABLE public.user_profiles_2025_10_01_13_00 (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  student_type TEXT CHECK (student_type IN ('international', 'low_income', 'first_generation', 'other')),
  citizenship_status TEXT CHECK (citizenship_status IN ('us_citizen', 'permanent_resident', 'f1_visa', 'j1_visa', 'other')),
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'es', 'hi', 'zh', 'ar', 'fr')),
  graduation_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved colleges table
CREATE TABLE public.saved_colleges_2025_10_01_13_00 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles_2025_10_01_13_00(id) ON DELETE CASCADE,
  college_name TEXT NOT NULL,
  college_type TEXT CHECK (college_type IN ('ivy_league', 't20', 'state_school', 'other')),
  application_status TEXT DEFAULT 'considering' CHECK (application_status IN ('considering', 'applying', 'applied', 'accepted', 'rejected', 'waitlisted')),
  application_deadline DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create application timeline table
CREATE TABLE public.application_timeline_2025_10_01_13_00 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles_2025_10_01_13_00(id) ON DELETE CASCADE,
  task_title TEXT NOT NULL,
  task_description TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  college_name TEXT,
  task_category TEXT CHECK (task_category IN ('testing', 'applications', 'financial_aid', 'essays', 'recommendations', 'other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create college comparisons table
CREATE TABLE public.college_comparisons_2025_10_01_13_00 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles_2025_10_01_13_00(id) ON DELETE CASCADE,
  comparison_name TEXT NOT NULL,
  colleges JSONB NOT NULL, -- Array of college objects
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_profiles_2025_10_01_13_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_colleges_2025_10_01_13_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_timeline_2025_10_01_13_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_comparisons_2025_10_01_13_00 ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON public.user_profiles_2025_10_01_13_00
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles_2025_10_01_13_00
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles_2025_10_01_13_00
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own saved colleges" ON public.saved_colleges_2025_10_01_13_00
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own saved colleges" ON public.saved_colleges_2025_10_01_13_00
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own timeline" ON public.application_timeline_2025_10_01_13_00
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own timeline" ON public.application_timeline_2025_10_01_13_00
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own comparisons" ON public.college_comparisons_2025_10_01_13_00
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own comparisons" ON public.college_comparisons_2025_10_01_13_00
  FOR ALL USING (auth.uid() = user_id);

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user_2025_10_01_13_00()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles_2025_10_01_13_00 (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created_2025_10_01_13_00
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_2025_10_01_13_00();