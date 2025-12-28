-- Create impact metrics table
CREATE TABLE public.impact_metrics_2025_10_06_00_42 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create testimonials table
CREATE TABLE public.testimonials_2025_10_06_00_42 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  student_class TEXT,
  testimonial_text TEXT NOT NULL,
  aid_amount INTEGER,
  is_featured BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create partners table
CREATE TABLE public.partners_2025_10_06_00_42 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_name TEXT NOT NULL,
  partner_type TEXT CHECK (partner_type IN ('high_school', 'nonprofit', 'library', 'community_center', 'other')),
  logo_url TEXT,
  website_url TEXT,
  contact_email TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create counselor profiles table
CREATE TABLE public.counselor_profiles_2025_10_06_00_42 (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  school_name TEXT,
  school_district TEXT,
  phone_number TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create counselor students table
CREATE TABLE public.counselor_students_2025_10_06_00_42 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  counselor_id UUID REFERENCES public.counselor_profiles_2025_10_06_00_42(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_email TEXT,
  graduation_year INTEGER,
  fafsa_status TEXT DEFAULT 'not_started' CHECK (fafsa_status IN ('not_started', 'in_progress', 'submitted', 'completed')),
  aid_received INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog posts table
CREATE TABLE public.blog_posts_2025_10_06_00_42 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author_name TEXT DEFAULT 'Global Pathways Team',
  is_published BOOLEAN DEFAULT FALSE,
  featured_image_url TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scholarship database table
CREATE TABLE public.scholarships_2025_10_06_00_42 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scholarship_name TEXT NOT NULL,
  provider_name TEXT NOT NULL,
  amount_min INTEGER,
  amount_max INTEGER,
  deadline_date DATE,
  eligibility_criteria TEXT[],
  gpa_requirement DECIMAL(3,2),
  state_requirements TEXT[],
  demographic_requirements TEXT[],
  application_url TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notification preferences table
CREATE TABLE public.notification_preferences_2025_10_06_00_42 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles_2025_10_01_13_00(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  phone_number TEXT,
  deadline_reminders BOOLEAN DEFAULT TRUE,
  scholarship_alerts BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.impact_metrics_2025_10_06_00_42 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials_2025_10_06_00_42 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partners_2025_10_06_00_42 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counselor_profiles_2025_10_06_00_42 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counselor_students_2025_10_06_00_42 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts_2025_10_06_00_42 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarships_2025_10_06_00_42 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences_2025_10_06_00_42 ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view impact metrics" ON public.impact_metrics_2025_10_06_00_42
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view approved testimonials" ON public.testimonials_2025_10_06_00_42
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Anyone can view active partners" ON public.partners_2025_10_06_00_42
  FOR SELECT USING (is_active = true);

CREATE POLICY "Counselors can view own profile" ON public.counselor_profiles_2025_10_06_00_42
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Counselors can update own profile" ON public.counselor_profiles_2025_10_06_00_42
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Counselors can insert own profile" ON public.counselor_profiles_2025_10_06_00_42
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Counselors can manage own students" ON public.counselor_students_2025_10_06_00_42
  FOR ALL USING (auth.uid() = counselor_id);

CREATE POLICY "Anyone can view published blog posts" ON public.blog_posts_2025_10_06_00_42
  FOR SELECT USING (is_published = true);

CREATE POLICY "Anyone can view active scholarships" ON public.scholarships_2025_10_06_00_42
  FOR SELECT USING (is_active = true);

CREATE POLICY "Users can manage own notification preferences" ON public.notification_preferences_2025_10_06_00_42
  FOR ALL USING (auth.uid() = user_id);

-- Insert initial impact metrics
INSERT INTO public.impact_metrics_2025_10_06_00_42 (metric_name, metric_value) VALUES
('students_helped', 2847),
('fafsa_submissions', 1923),
('total_aid_unlocked', 26922000),
('partner_organizations', 47);

-- Insert sample testimonials
INSERT INTO public.testimonials_2025_10_06_00_42 (student_name, student_class, testimonial_text, aid_amount, is_featured, is_approved) VALUES
('Jasmine Rodriguez', 'Class of 2025', 'This site helped me complete FAFSA early — I qualified for $12,500 in grants! The step-by-step guide made everything so much clearer.', 12500, true, true),
('Ahmed Hassan', 'Class of 2024', 'As an international student, I thought I had no options for financial aid. Global Pathways showed me scholarship opportunities I never knew existed. I received $8,000 in merit scholarships!', 8000, true, true),
('Maria Santos', 'Class of 2025', 'The counselor portal helped my school track all our students'' FAFSA progress. We increased our completion rate by 40% this year!', 0, true, true),
('David Chen', 'Class of 2024', 'The college comparison tool saved me so much time. I was able to compare financial aid packages side by side and make the best decision for my family.', 15200, true, true),
('Priya Patel', 'Class of 2025', 'The multilingual support was a game-changer for my parents. They could finally understand the FAFSA process in Hindi and help me complete it correctly.', 9800, true, true);

-- Insert sample partners
INSERT INTO public.partners_2025_10_06_00_42 (partner_name, partner_type, website_url) VALUES
('Lincoln High School', 'high_school', 'https://lincolnhs.edu'),
('Boys & Girls Club of America', 'nonprofit', 'https://bgca.org'),
('YMCA National', 'nonprofit', 'https://ymca.org'),
('Chicago Public Library', 'library', 'https://chipublib.org'),
('United Way', 'nonprofit', 'https://unitedway.org'),
('Hispanic Scholarship Fund', 'nonprofit', 'https://hsf.net'),
('College Possible', 'nonprofit', 'https://collegepossible.org');

-- Insert sample blog posts
INSERT INTO public.blog_posts_2025_10_06_00_42 (title, slug, content, excerpt, is_published, tags) VALUES
('FAFSA Changes for 2024-2025: What Students Need to Know', 'fafsa-changes-2024-2025', 'The FAFSA has undergone significant changes for the 2024-2025 academic year. Here''s what students and families need to know...', 'Important updates to the FAFSA process that every student should understand.', true, ARRAY['fafsa', 'financial-aid', 'updates']),
('5 Common FAFSA Mistakes That Cost Students Thousands', 'common-fafsa-mistakes', 'Avoid these costly errors when completing your FAFSA application...', 'Learn about the most common FAFSA mistakes and how to avoid them.', true, ARRAY['fafsa', 'tips', 'mistakes']),
('International Students: Your Guide to US College Funding', 'international-student-funding-guide', 'While international students can''t file FAFSA, there are still many funding opportunities available...', 'Comprehensive guide to funding options for international students.', true, ARRAY['international', 'scholarships', 'funding']);

-- Insert sample scholarships
INSERT INTO public.scholarships_2025_10_06_00_42 (scholarship_name, provider_name, amount_min, amount_max, deadline_date, eligibility_criteria, gpa_requirement, application_url, description) VALUES
('Hispanic Scholarship Fund General Scholarship', 'Hispanic Scholarship Fund', 500, 5000, '2025-03-30', ARRAY['Hispanic heritage', 'US citizen or permanent resident', 'Enrolled in accredited university'], 3.0, 'https://hsf.net/scholarship', 'Merit-based scholarships for Hispanic students pursuing higher education.'),
('Gates Millennium Scholars Program', 'Bill & Melinda Gates Foundation', 1000, 200000, '2025-01-15', ARRAY['African American, American Indian, Asian Pacific Islander, or Hispanic', 'Pell Grant eligible', 'US citizen or permanent resident'], 3.3, 'https://gmsp.org', 'Comprehensive scholarship covering full cost of attendance.'),
('Jack Kent Cooke Foundation Scholarship', 'Jack Kent Cooke Foundation', 40000, 40000, '2024-11-14', ARRAY['High academic achievement', 'Financial need', 'Leadership potential'], 3.5, 'https://jkcf.org', 'Scholarship for high-achieving students with financial need.');

-- Create function to update impact metrics
CREATE OR REPLACE FUNCTION public.update_impact_metric_2025_10_06_00_42(metric_name_param TEXT, increment_value INTEGER DEFAULT 1)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.impact_metrics_2025_10_06_00_42 (metric_name, metric_value)
  VALUES (metric_name_param, increment_value)
  ON CONFLICT (metric_name) 
  DO UPDATE SET 
    metric_value = public.impact_metrics_2025_10_06_00_42.metric_value + increment_value,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;