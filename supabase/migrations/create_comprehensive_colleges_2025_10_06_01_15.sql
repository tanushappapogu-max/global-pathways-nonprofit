-- Create comprehensive colleges table
CREATE TABLE public.colleges_database_2025_10_06_01_15 (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  college_type TEXT CHECK (college_type IN ('ivy_league', 't20', 'state_school', 'liberal_arts', 'technical', 'community')),
  admission_rate DECIMAL(5,2),
  tuition_in_state INTEGER,
  tuition_out_state INTEGER,
  total_cost INTEGER,
  undergraduate_enrollment INTEGER,
  acceptance_rate_international DECIMAL(5,2),
  
  -- Financial Aid Information
  need_blind_domestic BOOLEAN DEFAULT FALSE,
  need_blind_international BOOLEAN DEFAULT FALSE,
  meets_full_need BOOLEAN DEFAULT FALSE,
  no_loan_policy BOOLEAN DEFAULT FALSE,
  average_aid_amount INTEGER,
  
  -- Application Information
  application_platform TEXT,
  early_decision_deadline DATE,
  early_action_deadline DATE,
  regular_decision_deadline DATE,
  
  -- Academic Information
  sat_range_25th INTEGER,
  sat_range_75th INTEGER,
  act_range_25th INTEGER,
  act_range_75th INTEGER,
  gpa_average DECIMAL(3,2),
  
  -- Programs and Features
  popular_majors TEXT[],
  special_programs TEXT[],
  research_opportunities BOOLEAN DEFAULT FALSE,
  study_abroad_programs BOOLEAN DEFAULT FALSE,
  
  -- Campus Life
  housing_guaranteed_years INTEGER DEFAULT 0,
  greek_life BOOLEAN DEFAULT FALSE,
  division_athletics TEXT,
  campus_setting TEXT CHECK (campus_setting IN ('urban', 'suburban', 'rural')),
  
  -- Additional Information
  website_url TEXT,
  application_fee INTEGER DEFAULT 0,
  application_fee_waiver BOOLEAN DEFAULT FALSE,
  test_optional BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.colleges_database_2025_10_06_01_15 ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
CREATE POLICY "Anyone can view colleges" ON public.colleges_database_2025_10_06_01_15
  FOR SELECT USING (true);

-- Insert Ivy League Schools
INSERT INTO public.colleges_database_2025_10_06_01_15 (
  name, location, state, college_type, admission_rate, tuition_out_state, total_cost,
  undergraduate_enrollment, need_blind_domestic, need_blind_international, meets_full_need, no_loan_policy,
  application_platform, early_decision_deadline, regular_decision_deadline,
  sat_range_25th, sat_range_75th, act_range_25th, act_range_75th, gpa_average,
  popular_majors, housing_guaranteed_years, campus_setting, website_url, test_optional
) VALUES
-- Harvard University
('Harvard University', 'Cambridge, MA', 'Massachusetts', 'ivy_league', 3.4, 54269, 79450,
 7000, true, true, true, true,
 'Common Application', '2024-11-01', '2025-01-01',
 1460, 1580, 33, 35, 4.18,
 ARRAY['Economics', 'Computer Science', 'Government', 'Psychology', 'Biology'], 4, 'urban',
 'https://www.harvard.edu', true),

-- Yale University
('Yale University', 'New Haven, CT', 'Connecticut', 'ivy_league', 4.6, 59950, 83880,
 6000, true, true, true, true,
 'Common Application', '2024-11-01', '2025-01-02',
 1470, 1570, 33, 35, 4.14,
 ARRAY['Economics', 'Political Science', 'History', 'Psychology', 'Biology'], 4, 'urban',
 'https://www.yale.edu', true),

-- Princeton University
('Princeton University', 'Princeton, NJ', 'New Jersey', 'ivy_league', 5.8, 56010, 79540,
 5400, true, true, true, true,
 'Common Application', '2024-11-01', '2025-01-01',
 1470, 1570, 32, 35, 3.95,
 ARRAY['Economics', 'Computer Science', 'Public Policy', 'Engineering', 'Physics'], 4, 'suburban',
 'https://www.princeton.edu', true),

-- Columbia University
('Columbia University', 'New York, NY', 'New York', 'ivy_league', 3.9, 65524, 85967,
 8100, false, false, true, true,
 'Common Application', '2024-11-01', '2025-01-01',
 1450, 1560, 32, 35, 4.15,
 ARRAY['Economics', 'Political Science', 'Computer Science', 'Engineering', 'English'], 4, 'urban',
 'https://www.columbia.edu', true),

-- University of Pennsylvania
('University of Pennsylvania', 'Philadelphia, PA', 'Pennsylvania', 'ivy_league', 5.9, 63452, 87063,
 10000, false, false, true, true,
 'Common Application', '2024-11-01', '2025-01-05',
 1470, 1570, 33, 35, 3.94,
 ARRAY['Finance', 'Economics', 'Nursing', 'Engineering', 'International Studies'], 4, 'urban',
 'https://www.upenn.edu', true),

-- Dartmouth College
('Dartmouth College', 'Hanover, NH', 'New Hampshire', 'ivy_league', 6.2, 60687, 84012,
 4500, false, false, true, true,
 'Common Application', '2024-11-01', '2025-01-03',
 1440, 1560, 32, 35, 4.11,
 ARRAY['Economics', 'Government', 'Computer Science', 'Psychology', 'Engineering'], 4, 'rural',
 'https://www.dartmouth.edu', true),

-- Brown University
('Brown University', 'Providence, RI', 'Rhode Island', 'ivy_league', 5.4, 62680, 85566,
 7000, false, false, true, true,
 'Common Application', '2024-11-01', '2025-01-03',
 1440, 1570, 32, 35, 4.05,
 ARRAY['Computer Science', 'Economics', 'Biology', 'International Relations', 'Engineering'], 4, 'urban',
 'https://www.brown.edu', true),

-- Cornell University
('Cornell University', 'Ithaca, NY', 'New York', 'ivy_league', 7.9, 62456, 83196,
 15000, false, false, true, false,
 'Common Application', '2024-11-01', '2025-01-02',
 1400, 1540, 32, 35, 4.07,
 ARRAY['Engineering', 'Business', 'Agriculture', 'Computer Science', 'Biology'], 4, 'rural',
 'https://www.cornell.edu', true);

-- Insert Top 20 Universities
INSERT INTO public.colleges_database_2025_10_06_01_15 (
  name, location, state, college_type, admission_rate, tuition_out_state, total_cost,
  undergraduate_enrollment, need_blind_domestic, need_blind_international, meets_full_need, no_loan_policy,
  application_platform, early_decision_deadline, regular_decision_deadline,
  sat_range_25th, sat_range_75th, act_range_25th, act_range_75th, gpa_average,
  popular_majors, housing_guaranteed_years, campus_setting, website_url, test_optional
) VALUES
-- Stanford University
('Stanford University', 'Stanford, CA', 'California', 't20', 3.9, 56169, 78898,
 7000, true, false, true, true,
 'Common Application', '2024-11-01', '2025-01-03',
 1470, 1570, 32, 35, 4.18,
 ARRAY['Computer Science', 'Engineering', 'Economics', 'Biology', 'Human Biology'], 4, 'suburban',
 'https://www.stanford.edu', true),

-- MIT
('Massachusetts Institute of Technology', 'Cambridge, MA', 'Massachusetts', 't20', 6.7, 53790, 77020,
 4500, true, true, true, true,
 'Common Application', '2024-11-01', '2025-01-01',
 1510, 1580, 34, 36, 4.17,
 ARRAY['Computer Science', 'Mechanical Engineering', 'Electrical Engineering', 'Physics', 'Mathematics'], 4, 'urban',
 'https://web.mit.edu', true),

-- University of Chicago
('University of Chicago', 'Chicago, IL', 'Illinois', 't20', 7.2, 61179, 84300,
 6800, true, false, true, true,
 'Common Application', '2024-11-01', '2025-01-03',
 1500, 1570, 33, 35, 4.48,
 ARRAY['Economics', 'Mathematics', 'Political Science', 'Biology', 'Physics'], 4, 'urban',
 'https://www.uchicago.edu', true),

-- California Institute of Technology
('California Institute of Technology', 'Pasadena, CA', 'California', 't20', 6.4, 56394, 79539,
 1000, true, true, true, true,
 'Common Application', '2024-11-01', '2025-01-03',
 1530, 1580, 35, 36, 4.19,
 ARRAY['Engineering', 'Physics', 'Computer Science', 'Mathematics', 'Chemistry'], 4, 'suburban',
 'https://www.caltech.edu', true),

-- Duke University
('Duke University', 'Durham, NC', 'North Carolina', 't20', 6.2, 63054, 82749,
 6500, false, false, true, true,
 'Common Application', '2024-11-01', '2025-01-03',
 1470, 1570, 33, 35, 4.13,
 ARRAY['Economics', 'Public Policy', 'Biology', 'Computer Science', 'Psychology'], 4, 'suburban',
 'https://www.duke.edu', true),

-- Northwestern University
('Northwestern University', 'Evanston, IL', 'Illinois', 't20', 7.0, 63468, 87251,
 9000, false, false, true, true,
 'Common Application', '2024-11-01', '2025-01-03',
 1450, 1550, 33, 35, 4.09,
 ARRAY['Journalism', 'Engineering', 'Economics', 'Psychology', 'Theatre'], 4, 'suburban',
 'https://www.northwestern.edu', true),

-- Johns Hopkins University
('Johns Hopkins University', 'Baltimore, MD', 'Maryland', 't20', 7.5, 60480, 82430,
 6000, false, false, true, true,
 'Common Application', '2024-11-01', '2025-01-03',
 1470, 1570, 33, 35, 3.92,
 ARRAY['Biomedical Engineering', 'International Studies', 'Neuroscience', 'Public Health', 'Computer Science'], 4, 'urban',
 'https://www.jhu.edu', true),

-- Vanderbilt University
('Vanderbilt University', 'Nashville, TN', 'Tennessee', 't20', 6.7, 56946, 76622,
 7000, false, false, true, true,
 'Common Application', '2024-11-01', '2025-01-01',
 1460, 1570, 33, 35, 3.83,
 ARRAY['Economics', 'Human Development', 'Engineering', 'Political Science', 'Psychology'], 4, 'urban',
 'https://www.vanderbilt.edu', true),

-- Rice University
('Rice University', 'Houston, TX', 'Texas', 't20', 8.7, 52070, 70566,
 4000, true, false, true, true,
 'Common Application', '2024-11-01', '2025-01-01',
 1470, 1570, 33, 35, 4.12,
 ARRAY['Engineering', 'Computer Science', 'Economics', 'Architecture', 'Natural Sciences'], 4, 'urban',
 'https://www.rice.edu', true),

-- Washington University in St. Louis
('Washington University in St. Louis', 'St. Louis, MO', 'Missouri', 't20', 11.2, 60590, 82259,
 7200, false, false, true, true,
 'Common Application', '2024-11-01', '2025-01-04',
 1470, 1570, 33, 35, 4.16,
 ARRAY['Business', 'Engineering', 'Biology', 'Psychology', 'Art'], 4, 'suburban',
 'https://wustl.edu', true);

-- Insert Major State Universities
INSERT INTO public.colleges_database_2025_10_06_01_15 (
  name, location, state, college_type, admission_rate, tuition_in_state, tuition_out_state, total_cost,
  undergraduate_enrollment, need_blind_domestic, meets_full_need,
  application_platform, regular_decision_deadline,
  sat_range_25th, sat_range_75th, act_range_25th, act_range_75th, gpa_average,
  popular_majors, housing_guaranteed_years, campus_setting, website_url, test_optional
) VALUES
-- UC Berkeley
('University of California, Berkeley', 'Berkeley, CA', 'California', 'state_school', 14.5, 14226, 44008, 58556,
 30000, true, true,
 'UC Application', '2024-11-30',
 1330, 1530, 28, 35, 4.0,
 ARRAY['Computer Science', 'Engineering', 'Economics', 'Biology', 'Business'], 2, 'urban',
 'https://www.berkeley.edu', true),

-- UCLA
('University of California, Los Angeles', 'Los Angeles, CA', 'California', 'state_school', 12.3, 13804, 43473, 62205,
 31000, true, true,
 'UC Application', '2024-11-30',
 1290, 1510, 27, 34, 4.0,
 ARRAY['Psychology', 'Economics', 'Political Science', 'Biology', 'Film'], 2, 'urban',
 'https://www.ucla.edu', true),

-- University of Michigan
('University of Michigan', 'Ann Arbor, MI', 'Michigan', 'state_school', 20.2, 16178, 52266, 68432,
 30000, false, true,
 'Common Application', '2025-02-01',
 1340, 1520, 31, 34, 3.9,
 ARRAY['Engineering', 'Business', 'Psychology', 'Economics', 'Computer Science'], 2, 'suburban',
 'https://umich.edu', true),

-- University of Virginia
('University of Virginia', 'Charlottesville, VA', 'Virginia', 'state_school', 21.0, 17674, 51940, 70412,
 17000, false, true,
 'Common Application', '2025-01-01',
 1330, 1500, 30, 34, 4.32,
 ARRAY['Economics', 'Psychology', 'Biology', 'Commerce', 'Political Science'], 2, 'suburban',
 'https://www.virginia.edu', true),

-- University of North Carolina at Chapel Hill
('University of North Carolina at Chapel Hill', 'Chapel Hill, NC', 'North Carolina', 'state_school', 19.2, 7019, 36776, 53180,
 19000, false, true,
 'Common Application', '2025-01-15',
 1300, 1480, 28, 33, 4.39,
 ARRAY['Business', 'Journalism', 'Psychology', 'Biology', 'Political Science'], 2, 'suburban',
 'https://www.unc.edu', true),

-- Georgia Institute of Technology
('Georgia Institute of Technology', 'Atlanta, GA', 'Georgia', 'state_school', 17.0, 12682, 33794, 49432,
 18000, false, false,
 'Common Application', '2025-01-01',
 1370, 1520, 31, 35, 4.07,
 ARRAY['Engineering', 'Computer Science', 'Business', 'Architecture', 'Sciences'], 2, 'urban',
 'https://www.gatech.edu', true),

-- University of Texas at Austin
('University of Texas at Austin', 'Austin, TX', 'Texas', 'state_school', 31.8, 11678, 40032, 56424,
 40000, false, false,
 'ApplyTexas', '2024-12-01',
 1230, 1480, 27, 33, 3.84,
 ARRAY['Business', 'Engineering', 'Communications', 'Liberal Arts', 'Natural Sciences'], 2, 'urban',
 'https://www.utexas.edu', true),

-- University of Florida
('University of Florida', 'Gainesville, FL', 'Florida', 'state_school', 23.0, 6381, 28658, 43710,
 35000, false, false,
 'Common Application', '2024-11-01',
 1270, 1430, 28, 32, 4.4,
 ARRAY['Business', 'Engineering', 'Journalism', 'Medicine', 'Agriculture'], 2, 'suburban',
 'https://www.ufl.edu', true),

-- University of Washington
('University of Washington', 'Seattle, WA', 'Washington', 'state_school', 48.0, 12092, 39906, 57879,
 32000, false, false,
 'Common Application', '2024-11-15',
 1220, 1470, 27, 33, 3.8,
 ARRAY['Computer Science', 'Engineering', 'Business', 'Psychology', 'Biology'], 2, 'urban',
 'https://www.washington.edu', true),

-- Ohio State University
('Ohio State University', 'Columbus, OH', 'Ohio', 'state_school', 57.0, 11936, 32061, 47016,
 46000, false, false,
 'Common Application', '2025-02-01',
 1240, 1450, 26, 32, 3.83,
 ARRAY['Business', 'Engineering', 'Psychology', 'Biology', 'Communications'], 2, 'urban',
 'https://www.osu.edu', true);

-- Insert More Top Universities
INSERT INTO public.colleges_database_2025_10_06_01_15 (
  name, location, state, college_type, admission_rate, tuition_out_state, total_cost,
  undergraduate_enrollment, need_blind_domestic, meets_full_need, no_loan_policy,
  application_platform, early_decision_deadline, regular_decision_deadline,
  sat_range_25th, sat_range_75th, act_range_25th, act_range_75th, gpa_average,
  popular_majors, housing_guaranteed_years, campus_setting, website_url, test_optional
) VALUES
-- Emory University
('Emory University', 'Atlanta, GA', 'Georgia', 't20', 13.0, 57120, 76034,
 7000, false, false, true,
 'Common Application', '2024-11-01', '2025-01-01',
 1350, 1520, 30, 34, 3.78,
 ARRAY['Business', 'Biology', 'Psychology', 'Nursing', 'Political Science'], 4, 'suburban',
 'https://www.emory.edu', true),

-- Georgetown University
('Georgetown University', 'Washington, DC', 'District of Columbia', 't20', 12.2, 59957, 82509,
 7400, false, false, false,
 'Georgetown Application', '2024-11-01', '2025-01-10',
 1370, 1520, 31, 35, 4.01,
 ARRAY['International Affairs', 'Government', 'Economics', 'Finance', 'Psychology'], 4, 'urban',
 'https://www.georgetown.edu', false),

-- Carnegie Mellon University
('Carnegie Mellon University', 'Pittsburgh, PA', 'Pennsylvania', 't20', 11.3, 59864, 79196,
 7000, false, false, false,
 'Common Application', '2024-11-01', '2025-01-01',
 1460, 1560, 33, 35, 3.87,
 ARRAY['Computer Science', 'Engineering', 'Business', 'Drama', 'Art'], 4, 'urban',
 'https://www.cmu.edu', true),

-- University of Southern California
('University of Southern California', 'Los Angeles, CA', 'California', 't20', 12.4, 63468, 83817,
 20000, false, false, false,
 'Common Application', '2024-11-01', '2025-01-15',
 1350, 1530, 30, 34, 3.79,
 ARRAY['Business', 'Communications', 'Engineering', 'Film', 'International Relations'], 4, 'urban',
 'https://www.usc.edu', true),

-- New York University
('New York University', 'New York, NY', 'New York', 't20', 12.8, 58168, 79462,
 29000, false, false, false,
 'Common Application', '2024-11-01', '2025-01-01',
 1350, 1530, 30, 34, 3.69,
 ARRAY['Business', 'Liberal Arts', 'Film', 'Psychology', 'Economics'], 4, 'urban',
 'https://www.nyu.edu', true),

-- Tufts University
('Tufts University', 'Medford, MA', 'Massachusetts', 't20', 10.0, 63804, 82916,
 5500, false, false, true,
 'Common Application', '2024-11-01', '2025-01-01',
 1420, 1550, 32, 35, 4.04,
 ARRAY['International Relations', 'Economics', 'Psychology', 'Engineering', 'Biology'], 4, 'suburban',
 'https://www.tufts.edu', true),

-- Wake Forest University
('Wake Forest University', 'Winston-Salem, NC', 'North Carolina', 't20', 22.0, 60876, 79910,
 5200, false, false, true,
 'Common Application', '2024-11-01', '2025-01-01',
 1330, 1490, 29, 33, 3.74,
 ARRAY['Business', 'Psychology', 'Politics', 'Biology', 'Communications'], 4, 'suburban',
 'https://www.wfu.edu', true),

-- University of Notre Dame
('University of Notre Dame', 'Notre Dame, IN', 'Indiana', 't20', 15.0, 59794, 77542,
 9000, false, false, true,
 'Common Application', '2024-11-01', '2025-01-01',
 1400, 1550, 32, 35, 4.06,
 ARRAY['Business', 'Engineering', 'Liberal Arts', 'Science', 'Architecture'], 4, 'suburban',
 'https://www.nd.edu', true);

-- Create indexes for better performance
CREATE INDEX idx_colleges_type ON public.colleges_database_2025_10_06_01_15(college_type);
CREATE INDEX idx_colleges_state ON public.colleges_database_2025_10_06_01_15(state);
CREATE INDEX idx_colleges_admission_rate ON public.colleges_database_2025_10_06_01_15(admission_rate);
CREATE INDEX idx_colleges_tuition ON public.colleges_database_2025_10_06_01_15(tuition_out_state);