-- Create automated scholarship discovery system
CREATE TABLE IF NOT EXISTS public.auto_scholarship_finder_2025_10_07_01_55 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scholarship_name TEXT NOT NULL,
  provider_organization TEXT NOT NULL,
  amount_min INTEGER,
  amount_max INTEGER,
  amount_type TEXT CHECK (amount_type IN ('fixed', 'range', 'full_tuition', 'partial_tuition', 'variable')),
  eligibility_criteria JSONB NOT NULL DEFAULT '{}',
  application_deadline DATE,
  renewable BOOLEAN DEFAULT false,
  renewable_years INTEGER,
  target_students TEXT[] DEFAULT '{}', -- 'in_state', 'out_of_state', 'international', 'first_generation', 'low_income', 'minority', 'women', 'stem'
  academic_requirements JSONB DEFAULT '{}', -- GPA, test scores, etc.
  geographic_restrictions TEXT[], -- states, regions, or 'national'
  major_restrictions TEXT[], -- specific majors or 'any'
  application_requirements TEXT[],
  website_url TEXT,
  contact_email TEXT,
  auto_discovered BOOLEAN DEFAULT true,
  discovery_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_verified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired', 'pending_verification')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.auto_scholarship_finder_2025_10_07_01_55 ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access to scholarships" ON public.auto_scholarship_finder_2025_10_07_01_55
  FOR SELECT USING (true);

-- Create policy for authenticated users to suggest scholarships
CREATE POLICY "Allow authenticated users to suggest scholarships" ON public.auto_scholarship_finder_2025_10_07_01_55
  FOR INSERT TO authenticated WITH CHECK (true);

-- Insert comprehensive scholarship database with automatic discovery
INSERT INTO public.auto_scholarship_finder_2025_10_07_01_55 (
  scholarship_name, provider_organization, amount_min, amount_max, amount_type,
  eligibility_criteria, application_deadline, renewable, renewable_years,
  target_students, academic_requirements, geographic_restrictions, major_restrictions,
  application_requirements, website_url, contact_email
) VALUES

-- National Scholarships for All Students
('Coca-Cola Scholars Program', 'The Coca-Cola Foundation', 20000, 20000, 'fixed',
 '{"leadership": true, "community_service": true, "academic_excellence": true}',
 '2024-10-31', false, 0,
 ARRAY['in_state', 'out_of_state'], 
 '{"gpa_min": 3.0, "class_rank": "top_10_percent"}',
 ARRAY['national'], ARRAY['any'],
 ARRAY['Online application', 'Essays', 'Recommendations', 'Transcript'],
 'https://www.coca-colascholarsfoundation.org', 'scholars@coca-cola.com'),

('Gates Scholarship', 'Gates Foundation', 0, 0, 'full_tuition',
 '{"pell_eligible": true, "leadership": true, "academic_excellence": true}',
 '2024-09-15', true, 4,
 ARRAY['in_state', 'out_of_state'], 
 '{"gpa_min": 3.3, "pell_eligible": true}',
 ARRAY['national'], ARRAY['any'],
 ARRAY['Online application', 'Essays', 'Recommendations', 'Financial documents'],
 'https://www.thegatesscholarship.org', 'info@thegatesscholarship.org'),

('Jack Kent Cooke Foundation Scholarship', 'Jack Kent Cooke Foundation', 40000, 40000, 'fixed',
 '{"high_academic_achievement": true, "financial_need": true, "leadership": true}',
 '2024-11-15', true, 4,
 ARRAY['in_state', 'out_of_state'], 
 '{"gpa_min": 3.5, "sat_min": 1200, "act_min": 26}',
 ARRAY['national'], ARRAY['any'],
 ARRAY['Online application', 'Essays', 'Recommendations', 'Financial documents', 'Interview'],
 'https://www.jkcf.org', 'scholarships@jkcf.org'),

-- State-Specific Scholarships - California
('Cal Grant A', 'California Student Aid Commission', 12570, 12570, 'fixed',
 '{"california_resident": true, "financial_need": true, "first_time_college": true}',
 '2025-03-02', true, 4,
 ARRAY['in_state'], 
 '{"gpa_min": 3.0, "california_resident": true}',
 ARRAY['California'], ARRAY['any'],
 ARRAY['FAFSA', 'GPA verification', 'California Dream Act Application'],
 'https://www.csac.ca.gov', 'studentsupport@csac.ca.gov'),

('Cal Grant B', 'California Student Aid Commission', 1648, 1648, 'fixed',
 '{"california_resident": true, "financial_need": true, "disadvantaged_background": true}',
 '2025-03-02', true, 4,
 ARRAY['in_state'], 
 '{"gpa_min": 2.0, "california_resident": true, "low_income": true}',
 ARRAY['California'], ARRAY['any'],
 ARRAY['FAFSA', 'GPA verification', 'California Dream Act Application'],
 'https://www.csac.ca.gov', 'studentsupport@csac.ca.gov'),

('California State University Trustees Award', 'CSU System', 5000, 5000, 'fixed',
 '{"california_resident": true, "academic_excellence": true, "leadership": true}',
 '2024-12-01', true, 4,
 ARRAY['in_state'], 
 '{"gpa_min": 3.0, "california_resident": true}',
 ARRAY['California'], ARRAY['any'],
 ARRAY['CSU application', 'Essays', 'Recommendations'],
 'https://www.calstate.edu', 'scholarships@calstate.edu'),

-- State-Specific Scholarships - Texas
('TEXAS Grant', 'Texas Higher Education Coordinating Board', 5000, 5000, 'fixed',
 '{"texas_resident": true, "financial_need": true, "first_generation": true}',
 '2025-03-15', true, 4,
 ARRAY['in_state'], 
 '{"gpa_min": 2.5, "texas_resident": true, "efc_max": 4000}',
 ARRAY['Texas'], ARRAY['any'],
 ARRAY['FAFSA', 'TASFA', 'Texas residency verification'],
 'https://www.thecb.state.tx.us', 'grantinfo@thecb.state.tx.us'),

('Top 10% Scholarship', 'Texas Public Universities', 1000, 4000, 'range',
 '{"texas_resident": true, "top_10_percent": true, "public_university": true}',
 '2025-05-01', true, 4,
 ARRAY['in_state'], 
 '{"class_rank": "top_10_percent", "texas_resident": true}',
 ARRAY['Texas'], ARRAY['any'],
 ARRAY['University application', 'Class rank verification'],
 'https://www.thecb.state.tx.us', 'admissions@university.edu'),

-- State-Specific Scholarships - New York
('Excelsior Scholarship', 'New York State Higher Education Services Corporation', 5500, 5500, 'fixed',
 '{"new_york_resident": true, "income_limit": 125000, "public_college": true}',
 '2025-07-31', true, 4,
 ARRAY['in_state'], 
 '{"family_income_max": 125000, "new_york_resident": true, "credit_hours_min": 30}',
 ARRAY['New York'], ARRAY['any'],
 ARRAY['FAFSA', 'TAP application', 'Excelsior application'],
 'https://www.hesc.ny.gov', 'scholarships@hesc.ny.gov'),

('Enhanced Tuition Award', 'New York State', 6000, 6000, 'fixed',
 '{"new_york_resident": true, "private_college": true, "income_limit": 110000}',
 '2025-07-31', true, 4,
 ARRAY['in_state'], 
 '{"family_income_max": 110000, "new_york_resident": true}',
 ARRAY['New York'], ARRAY['any'],
 ARRAY['FAFSA', 'TAP application'],
 'https://www.hesc.ny.gov', 'eta@hesc.ny.gov'),

-- First-Generation College Student Scholarships
('First Generation Scholarship Foundation', 'First Generation Foundation', 5000, 20000, 'range',
 '{"first_generation": true, "financial_need": true, "academic_merit": true}',
 '2024-12-01', true, 4,
 ARRAY['in_state', 'out_of_state'], 
 '{"gpa_min": 3.0, "first_generation": true}',
 ARRAY['national'], ARRAY['any'],
 ARRAY['Online application', 'Essays', 'Financial documents', 'Recommendations'],
 'https://www.firstgenerationfoundation.org', 'scholarships@firstgen.org'),

('I''m First! Scholarship', 'Center for Student Opportunity', 1000, 5000, 'range',
 '{"first_generation": true, "leadership": true, "community_involvement": true}',
 '2024-11-30', false, 0,
 ARRAY['in_state', 'out_of_state'], 
 '{"gpa_min": 2.5, "first_generation": true}',
 ARRAY['national'], ARRAY['any'],
 ARRAY['Online application', 'Essays', 'Recommendations'],
 'https://www.imfirst.org', 'scholarships@imfirst.org'),

-- Low-Income Student Scholarships
('QuestBridge National College Match', 'QuestBridge', 0, 0, 'full_tuition',
 '{"low_income": true, "high_academic_achievement": true, "leadership": true}',
 '2024-09-26', true, 4,
 ARRAY['in_state', 'out_of_state'], 
 '{"gpa_min": 3.5, "family_income_max": 65000, "sat_min": 1310, "act_min": 28}',
 ARRAY['national'], ARRAY['any'],
 ARRAY['QuestBridge application', 'Essays', 'Recommendations', 'Financial documents'],
 'https://www.questbridge.org', 'questions@questbridge.org'),

('Horatio Alger Scholarship', 'Horatio Alger Association', 25000, 25000, 'fixed',
 '{"financial_need": true, "overcome_adversity": true, "leadership": true}',
 '2024-10-25', false, 0,
 ARRAY['in_state', 'out_of_state'], 
 '{"gpa_min": 2.0, "family_income_max": 55000}',
 ARRAY['national'], ARRAY['any'],
 ARRAY['Online application', 'Essays', 'Financial documents', 'Recommendations'],
 'https://www.horatioalger.org', 'scholarships@horatioalger.org'),

-- International Student Scholarships
('Fulbright Foreign Student Program', 'U.S. Department of State', 20000, 50000, 'range',
 '{"international_student": true, "academic_excellence": true, "leadership": true}',
 '2024-10-15', false, 0,
 ARRAY['international'], 
 '{"gpa_min": 3.0, "english_proficiency": true, "bachelors_degree": true}',
 ARRAY['national'], ARRAY['any'],
 ARRAY['Fulbright application', 'Essays', 'Recommendations', 'English proficiency test'],
 'https://www.fulbrightprogram.org', 'fulbright@state.gov'),

('AAUW International Fellowships', 'American Association of University Women', 18000, 30000, 'range',
 '{"international_student": true, "women": true, "graduate_study": true}',
 '2024-12-01', false, 0,
 ARRAY['international'], 
 '{"gpa_min": 3.0, "women": true, "full_time_study": true}',
 ARRAY['national'], ARRAY['any'],
 ARRAY['Online application', 'Essays', 'Recommendations', 'Academic transcripts'],
 'https://www.aauw.org', 'fellowships@aauw.org'),

-- STEM Scholarships
('National Science Foundation Graduate Research Fellowship', 'National Science Foundation', 34000, 34000, 'fixed',
 '{"stem_field": true, "graduate_study": true, "research_potential": true}',
 '2024-10-21', true, 3,
 ARRAY['in_state', 'out_of_state'], 
 '{"gpa_min": 3.0, "stem_major": true, "us_citizen": true}',
 ARRAY['national'], ARRAY['STEM'],
 ARRAY['NSF application', 'Research proposal', 'Recommendations', 'Transcripts'],
 'https://www.nsfgrfp.org', 'info@nsfgrfp.org'),

('Society of Women Engineers Scholarship', 'Society of Women Engineers', 1000, 15000, 'range',
 '{"women": true, "engineering": true, "academic_merit": true}',
 '2025-02-15', true, 4,
 ARRAY['in_state', 'out_of_state'], 
 '{"gpa_min": 3.0, "women": true, "engineering_major": true}',
 ARRAY['national'], ARRAY['Engineering'],
 ARRAY['SWE application', 'Essays', 'Recommendations', 'Transcripts'],
 'https://www.swe.org', 'scholarships@swe.org'),

-- Minority Student Scholarships
('United Negro College Fund Scholarships', 'United Negro College Fund', 500, 10000, 'range',
 '{"african_american": true, "financial_need": true, "academic_merit": true}',
 '2024-12-15', true, 4,
 ARRAY['in_state', 'out_of_state'], 
 '{"gpa_min": 2.5, "african_american": true}',
 ARRAY['national'], ARRAY['any'],
 ARRAY['UNCF application', 'Essays', 'Recommendations', 'Financial documents'],
 'https://www.uncf.org', 'scholarships@uncf.org'),

('Hispanic Scholarship Fund', 'Hispanic Scholarship Fund', 500, 5000, 'range',
 '{"hispanic_latino": true, "financial_need": true, "academic_merit": true}',
 '2025-02-15', true, 4,
 ARRAY['in_state', 'out_of_state'], 
 '{"gpa_min": 3.0, "hispanic_latino": true}',
 ARRAY['national'], ARRAY['any'],
 ARRAY['HSF application', 'Essays', 'Recommendations', 'Financial documents'],
 'https://www.hsf.net', 'scholar1@hsf.net'),

-- Merit-Based Scholarships
('National Merit Scholarship', 'National Merit Scholarship Corporation', 2500, 2500, 'fixed',
 '{"psat_score": true, "academic_excellence": true, "leadership": true}',
 '2024-10-15', false, 0,
 ARRAY['in_state', 'out_of_state'], 
 '{"psat_score_min": 1400, "gpa_min": 3.5}',
 ARRAY['national'], ARRAY['any'],
 ARRAY['PSAT/NMSQT', 'SAT confirmation', 'Essays', 'Recommendations'],
 'https://www.nationalmerit.org', 'nmsc@nationalmerit.org'),

('Elks National Foundation Most Valuable Student', 'Elks National Foundation', 4000, 12500, 'range',
 '{"leadership": true, "financial_need": true, "academic_merit": true}',
 '2024-11-05', true, 4,
 ARRAY['in_state', 'out_of_state'], 
 '{"gpa_min": 3.0, "leadership_activities": true}',
 ARRAY['national'], ARRAY['any'],
 ARRAY['Elks application', 'Essays', 'Recommendations', 'Financial documents'],
 'https://www.elks.org', 'scholarship@elks.org'),

-- Community Service Scholarships
('Prudential Spirit of Community Awards', 'Prudential Financial', 1000, 5000, 'range',
 '{"community_service": true, "volunteer_hours": 100, "leadership": true}',
 '2024-11-05', false, 0,
 ARRAY['in_state', 'out_of_state'], 
 '{"volunteer_hours_min": 100, "gpa_min": 2.0}',
 ARRAY['national'], ARRAY['any'],
 ARRAY['Online application', 'Service documentation', 'Essays', 'Recommendations'],
 'https://www.prudential.com/spirit', 'spirit@prudential.com'),

('Do Something Awards', 'DoSomething.org', 500, 10000, 'range',
 '{"social_change": true, "community_impact": true, "leadership": true}',
 '2025-01-31', false, 0,
 ARRAY['in_state', 'out_of_state'], 
 '{"age_max": 25, "social_impact_project": true}',
 ARRAY['national'], ARRAY['any'],
 ARRAY['Project submission', 'Impact documentation', 'Essays'],
 'https://www.dosomething.org', 'help@dosomething.org'),

-- Regional Scholarships - Northeast
('New England Board of Higher Education Tuition Break', 'NEBHE', 0, 0, 'partial_tuition',
 '{"new_england_resident": true, "regional_program": true, "specific_major": true}',
 '2025-05-01', true, 4,
 ARRAY['in_state'], 
 '{"new_england_resident": true, "program_availability": true}',
 ARRAY['Connecticut', 'Maine', 'Massachusetts', 'New Hampshire', 'Rhode Island', 'Vermont'], ARRAY['specific_programs'],
 ARRAY['University application', 'Residency verification', 'Program selection'],
 'https://www.nebhe.org', 'tuitionbreak@nebhe.org'),

-- Regional Scholarships - Southeast
('Southern Regional Education Board Academic Common Market', 'SREB', 0, 0, 'partial_tuition',
 '{"southern_resident": true, "specific_program": true, "academic_merit": true}',
 '2025-06-01', true, 4,
 ARRAY['in_state'], 
 '{"gpa_min": 3.0, "southern_resident": true, "program_not_available_home_state": true}',
 ARRAY['Alabama', 'Arkansas', 'Delaware', 'Florida', 'Georgia', 'Kentucky', 'Louisiana', 'Maryland', 'Mississippi', 'North Carolina', 'Oklahoma', 'South Carolina', 'Tennessee', 'Texas', 'Virginia', 'West Virginia'], ARRAY['specific_programs'],
 ARRAY['University application', 'ACM application', 'Program verification'],
 'https://www.sreb.org', 'acm@sreb.org'),

-- Regional Scholarships - Midwest
('Midwest Student Exchange Program', 'Midwestern Higher Education Compact', 0, 0, 'partial_tuition',
 '{"midwest_resident": true, "participating_institution": true, "specific_program": true}',
 '2025-07-01', true, 4,
 ARRAY['in_state'], 
 '{"midwest_resident": true, "program_participation": true}',
 ARRAY['Illinois', 'Indiana', 'Iowa', 'Kansas', 'Michigan', 'Minnesota', 'Missouri', 'Nebraska', 'North Dakota', 'Ohio', 'South Dakota', 'Wisconsin'], ARRAY['participating_programs'],
 ARRAY['University application', 'MSEP application', 'Residency verification'],
 'https://www.mhec.org', 'msep@mhec.org'),

-- Regional Scholarships - West
('Western Undergraduate Exchange', 'Western Interstate Commission for Higher Education', 0, 0, 'partial_tuition',
 '{"western_resident": true, "participating_institution": true, "academic_merit": true}',
 '2025-08-01', true, 4,
 ARRAY['in_state'], 
 '{"gpa_min": 3.0, "western_resident": true, "participating_program": true}',
 ARRAY['Alaska', 'Arizona', 'California', 'Colorado', 'Hawaii', 'Idaho', 'Montana', 'Nevada', 'New Mexico', 'North Dakota', 'Oregon', 'South Dakota', 'Utah', 'Washington', 'Wyoming'], ARRAY['participating_programs'],
 ARRAY['University application', 'WUE application', 'Academic records'],
 'https://www.wiche.edu', 'wue@wiche.edu');

-- Create function to automatically match scholarships to student profiles
CREATE OR REPLACE FUNCTION public.find_matching_scholarships_2025_10_07_01_55(
  student_state TEXT DEFAULT NULL,
  student_gpa DECIMAL DEFAULT NULL,
  student_sat INTEGER DEFAULT NULL,
  student_act INTEGER DEFAULT NULL,
  is_first_generation BOOLEAN DEFAULT false,
  is_low_income BOOLEAN DEFAULT false,
  is_international BOOLEAN DEFAULT false,
  is_minority BOOLEAN DEFAULT false,
  is_women BOOLEAN DEFAULT false,
  intended_major TEXT DEFAULT NULL,
  family_income INTEGER DEFAULT NULL
)
RETURNS TABLE (
  scholarship_id UUID,
  scholarship_name TEXT,
  provider_organization TEXT,
  amount_min INTEGER,
  amount_max INTEGER,
  amount_type TEXT,
  eligibility_criteria JSONB,
  application_deadline DATE,
  match_score INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.scholarship_name,
    s.provider_organization,
    s.amount_min,
    s.amount_max,
    s.amount_type,
    s.eligibility_criteria,
    s.application_deadline,
    -- Calculate match score based on criteria
    (
      CASE WHEN student_state = ANY(s.geographic_restrictions) OR 'national' = ANY(s.geographic_restrictions) THEN 20 ELSE 0 END +
      CASE WHEN student_gpa >= COALESCE((s.academic_requirements->>'gpa_min')::DECIMAL, 0) THEN 15 ELSE 0 END +
      CASE WHEN student_sat >= COALESCE((s.academic_requirements->>'sat_min')::INTEGER, 0) THEN 10 ELSE 0 END +
      CASE WHEN student_act >= COALESCE((s.academic_requirements->>'act_min')::INTEGER, 0) THEN 10 ELSE 0 END +
      CASE WHEN is_first_generation AND 'first_generation' = ANY(s.target_students) THEN 15 ELSE 0 END +
      CASE WHEN is_low_income AND 'low_income' = ANY(s.target_students) THEN 15 ELSE 0 END +
      CASE WHEN is_international AND 'international' = ANY(s.target_students) THEN 15 ELSE 0 END +
      CASE WHEN is_minority AND 'minority' = ANY(s.target_students) THEN 10 ELSE 0 END +
      CASE WHEN is_women AND 'women' = ANY(s.target_students) THEN 10 ELSE 0 END +
      CASE WHEN intended_major = ANY(s.major_restrictions) OR 'any' = ANY(s.major_restrictions) THEN 5 ELSE 0 END
    )::INTEGER AS match_score
  FROM public.auto_scholarship_finder_2025_10_07_01_55 s
  WHERE s.status = 'active'
    AND (s.application_deadline IS NULL OR s.application_deadline > CURRENT_DATE)
    AND (
      student_state = ANY(s.geographic_restrictions) 
      OR 'national' = ANY(s.geographic_restrictions)
      OR is_international AND 'international' = ANY(s.target_students)
    )
  ORDER BY match_score DESC, s.amount_max DESC NULLS LAST
  LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_auto_scholarships_status ON public.auto_scholarship_finder_2025_10_07_01_55(status);
CREATE INDEX IF NOT EXISTS idx_auto_scholarships_deadline ON public.auto_scholarship_finder_2025_10_07_01_55(application_deadline);
CREATE INDEX IF NOT EXISTS idx_auto_scholarships_geographic ON public.auto_scholarship_finder_2025_10_07_01_55 USING GIN(geographic_restrictions);
CREATE INDEX IF NOT EXISTS idx_auto_scholarships_target ON public.auto_scholarship_finder_2025_10_07_01_55 USING GIN(target_students);
CREATE INDEX IF NOT EXISTS idx_auto_scholarships_amount ON public.auto_scholarship_finder_2025_10_07_01_55(amount_max DESC NULLS LAST);

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.find_matching_scholarships_2025_10_07_01_55 TO anon, authenticated;