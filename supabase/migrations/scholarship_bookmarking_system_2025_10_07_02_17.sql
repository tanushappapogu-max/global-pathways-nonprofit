-- Create scholarship bookmarks table
CREATE TABLE IF NOT EXISTS public.scholarship_bookmarks_2025_10_07_02_17 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  scholarship_id UUID,
  scholarship_name TEXT NOT NULL,
  provider_organization TEXT,
  amount_min INTEGER,
  amount_max INTEGER,
  application_deadline DATE,
  website_url TEXT,
  notes TEXT,
  priority_level TEXT CHECK (priority_level IN ('high', 'medium', 'low')) DEFAULT 'medium',
  application_status TEXT CHECK (application_status IN ('not_started', 'in_progress', 'submitted', 'awarded', 'rejected')) DEFAULT 'not_started',
  reminder_date DATE,
  bookmarked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scholarship alerts table
CREATE TABLE IF NOT EXISTS public.scholarship_alerts_2025_10_07_02_17 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_name TEXT NOT NULL,
  criteria JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  last_checked TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scholarship recommendations cache table
CREATE TABLE IF NOT EXISTS public.scholarship_recommendations_2025_10_07_02_17 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  student_profile JSONB NOT NULL,
  recommendations JSONB NOT NULL,
  ai_powered BOOLEAN DEFAULT false,
  match_score_threshold INTEGER DEFAULT 60,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Enable RLS
ALTER TABLE public.scholarship_bookmarks_2025_10_07_02_17 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarship_alerts_2025_10_07_02_17 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarship_recommendations_2025_10_07_02_17 ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for bookmarks
CREATE POLICY "Users can manage their own bookmarks" ON public.scholarship_bookmarks_2025_10_07_02_17
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for alerts
CREATE POLICY "Users can manage their own alerts" ON public.scholarship_alerts_2025_10_07_02_17
  FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for recommendations
CREATE POLICY "Users can access their own recommendations" ON public.scholarship_recommendations_2025_10_07_02_17
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_scholarship_bookmarks_user_id ON public.scholarship_bookmarks_2025_10_07_02_17(user_id);
CREATE INDEX IF NOT EXISTS idx_scholarship_bookmarks_deadline ON public.scholarship_bookmarks_2025_10_07_02_17(application_deadline);
CREATE INDEX IF NOT EXISTS idx_scholarship_alerts_user_id ON public.scholarship_alerts_2025_10_07_02_17(user_id);
CREATE INDEX IF NOT EXISTS idx_scholarship_alerts_active ON public.scholarship_alerts_2025_10_07_02_17(is_active);
CREATE INDEX IF NOT EXISTS idx_scholarship_recommendations_user_id ON public.scholarship_recommendations_2025_10_07_02_17(user_id);
CREATE INDEX IF NOT EXISTS idx_scholarship_recommendations_expires ON public.scholarship_recommendations_2025_10_07_02_17(expires_at);

-- Create function to clean expired recommendations
CREATE OR REPLACE FUNCTION clean_expired_recommendations()
RETURNS void AS $$
BEGIN
  DELETE FROM public.scholarship_recommendations_2025_10_07_02_17
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create function to get upcoming deadlines
CREATE OR REPLACE FUNCTION get_upcoming_scholarship_deadlines(user_uuid UUID, days_ahead INTEGER DEFAULT 30)
RETURNS TABLE (
  scholarship_name TEXT,
  provider_organization TEXT,
  application_deadline DATE,
  days_until_deadline INTEGER,
  priority_level TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sb.scholarship_name,
    sb.provider_organization,
    sb.application_deadline,
    (sb.application_deadline - CURRENT_DATE)::INTEGER as days_until_deadline,
    sb.priority_level
  FROM public.scholarship_bookmarks_2025_10_07_02_17 sb
  WHERE sb.user_id = user_uuid
    AND sb.application_deadline IS NOT NULL
    AND sb.application_deadline >= CURRENT_DATE
    AND sb.application_deadline <= (CURRENT_DATE + days_ahead)
    AND sb.application_status IN ('not_started', 'in_progress')
  ORDER BY sb.application_deadline ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION clean_expired_recommendations() TO authenticated;
GRANT EXECUTE ON FUNCTION get_upcoming_scholarship_deadlines(UUID, INTEGER) TO authenticated;