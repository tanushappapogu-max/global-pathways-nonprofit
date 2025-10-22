-- Insert comprehensive scholarship data
INSERT INTO public.scholarships_2025_10_06_00_42 (
  scholarship_name, provider_name, amount_min, amount_max, deadline_date,
  eligibility_criteria, gpa_requirement, state_requirements, demographic_requirements,
  application_url, description, is_active
) VALUES

-- International Student Scholarships
('Fulbright Foreign Student Program', 'U.S. Department of State', 25000, 50000, '2025-10-15',
 ARRAY['Graduate students', 'Young professionals', 'Artists', 'International students only'],
 3.0, NULL,
 ARRAY['International Students'],
 'https://foreign.fulbrightonline.org/',
 'Offers scholarships for graduate students, young professionals, and artists to study in the U.S. Covers tuition, living expenses, and travel costs.',
 true),

('Hubert Humphrey Fellowship Program', 'U.S. Department of State', 40000, 60000, '2025-06-01',
 ARRAY['Experienced professionals', 'Mid-career professionals', 'Non-degree program'],
 NULL, NULL,
 ARRAY['International Students'],
 'https://www.humphreyfellowship.org/',
 'Provides non-degree scholarships for experienced professionals wishing to undertake academic study in the U.S.',
 true),

('MPOWER Financing Global Citizen Scholarship', 'MPOWER Financing', 2000, 10000, '2025-07-31',
 ARRAY['International students', 'DACA recipients', 'Enrolled in U.S. or Canadian school'],
 3.0, NULL,
 ARRAY['International Students', 'DACA Recipients'],
 'https://www.mpowerfinancing.com/scholarships/',
 'Offers scholarships for international students studying in the U.S. and Canada. Multiple awards given annually.',
 true),

('AAUW International Fellowships', 'American Association of University Women', 18000, 30000, '2024-12-01',
 ARRAY['Women only', 'International students', 'Graduate study', 'Full-time enrollment'],
 3.5, NULL,
 ARRAY['Women in STEM', 'International Students'],
 'https://www.aauw.org/resources/programs/fellowships-grants/current-opportunities/international/',
 'Fellowships for women who are not U.S. citizens or permanent residents pursuing graduate or postgraduate study.',
 true),

-- First-Generation Student Scholarships
('First Gen Scholars Program', 'First Gen Scholars', 1000, 20000, '2025-03-01',
 ARRAY['First-generation college students', 'Low-income families', 'High school seniors'],
 2.5, NULL,
 ARRAY['First Generation College'],
 'https://www.firstgenscholars.org/',
 'Empowers first-generation, low-income students to navigate college and graduate debt-free through scholarships and mentorship.',
 true),

('TIAA First-Generation Scholarship', 'TIAA', 5000, 5000, '2025-02-15',
 ARRAY['First-generation college students', 'Undergraduate students', 'Financial need'],
 3.0, NULL,
 ARRAY['First Generation College'],
 'https://www.scholarshipamerica.org/tiaa-scholarship/',
 'Assists first-generation undergraduate students planning to continue their education in college.',
 true),

('First Generation Matching Grant Program', 'Florida College Access Network', 1000, 4000, '2025-04-30',
 ARRAY['First-generation college students', 'Florida residents', 'Financial need'],
 2.0, ARRAY['Florida'],
 ARRAY['First Generation College'],
 'https://www.floridacollegeaccess.org/grants/',
 'Provides financial assistance to first-generation students in Florida pursuing higher education.',
 true),

('I''m First! Scholarship', 'Center for Student Opportunity', 1000, 16000, '2025-09-30',
 ARRAY['First-generation college students', 'High school seniors', 'College students'],
 2.5, NULL,
 ARRAY['First Generation College'],
 'https://www.imfirst.org/scholarship/',
 'Supports first-generation college students with financial assistance and mentorship opportunities.',
 true),

-- Low-Income Student Scholarships
('Horatio Alger National Scholarship', 'Horatio Alger Association', 25000, 25000, '2024-10-25',
 ARRAY['High school juniors', 'Financial need', 'Perseverance through adversity', 'Community involvement'],
 2.0, NULL,
 ARRAY['Low-Income Students'],
 'https://scholars.horatioalger.org/scholarships/',
 'Awards $25,000 to high school juniors demonstrating financial need and perseverance through difficult circumstances.',
 true),

('Gates Scholarship', 'Gates Foundation', 50000, 80000, '2024-09-15',
 ARRAY['High-achieving students', 'Low-income families', 'Minority students', 'Pell Grant eligible'],
 3.3, NULL,
 ARRAY['African American', 'Hispanic/Latino', 'Asian American', 'Native American', 'Low-Income Students'],
 'https://www.thegatesscholarship.org/',
 'Covers 100% of costs not covered by financial aid for high-achieving, low-income students.',
 true),

('Hagan Scholarship', 'Hagan Foundation', 6000, 48000, '2024-11-15',
 ARRAY['High school seniors', 'Rural areas', 'Financial need', 'Academic potential'],
 3.5, NULL,
 ARRAY['Rural Students', 'Low-Income Students'],
 'https://www.haganscholarships.org/',
 'Provides up to $6,000 per semester for students with high academic potential and financial need from rural areas.',
 true),

('Jack Kent Cooke Foundation College Scholarship', 'Jack Kent Cooke Foundation', 40000, 40000, '2024-11-01',
 ARRAY['High school seniors', 'Exceptional academic ability', 'Financial need', 'Leadership'],
 3.5, NULL,
 ARRAY['Low-Income Students'],
 'https://www.jkcf.org/our-scholarships/college-scholarship-program/',
 'Provides up to $40,000 annually for exceptional students with financial need to attend top colleges.',
 true),

-- Hispanic/Latino Scholarships
('Hispanic Scholarship Fund General Scholarship', 'Hispanic Scholarship Fund', 500, 5000, '2025-02-15',
 ARRAY['Hispanic/Latino heritage', 'U.S. citizens or legal residents', 'Undergraduate or graduate'],
 3.0, NULL,
 ARRAY['Hispanic/Latino'],
 'https://www.hsf.net/scholarship/',
 'Supports Hispanic/Latino students pursuing higher education with merit-based scholarships.',
 true),

('MALDEF Scholarship Program', 'Mexican American Legal Defense Fund', 2000, 10000, '2025-01-31',
 ARRAY['Mexican American/Latino students', 'Law school or graduate school', 'Community involvement'],
 3.0, NULL,
 ARRAY['Hispanic/Latino', 'Mexican American'],
 'https://www.maldef.org/leadership/scholarships/',
 'Provides scholarships to Mexican American/Latino students pursuing law or graduate degrees.',
 true),

-- African American Scholarships
('UNCF General Scholarship', 'United Negro College Fund', 1000, 10000, '2025-06-30',
 ARRAY['African American students', 'Financial need', 'Academic merit', 'UNCF member schools'],
 2.5, NULL,
 ARRAY['African American'],
 'https://uncf.org/scholarships',
 'Provides scholarships to African American students attending UNCF member institutions.',
 true),

('Thurgood Marshall College Fund Scholarship', 'Thurgood Marshall College Fund', 3100, 16000, '2025-04-30',
 ARRAY['Students at HBCU schools', 'Academic excellence', 'Leadership potential'],
 3.0, NULL,
 ARRAY['African American', 'HBCU Students'],
 'https://tmcf.org/students-alumni/scholarship/',
 'Supports students attending Historically Black Colleges and Universities (HBCUs).',
 true),

-- Women in STEM Scholarships
('Society of Women Engineers Scholarship', 'Society of Women Engineers', 1000, 15000, '2025-02-15',
 ARRAY['Women in engineering', 'STEM fields', 'Undergraduate or graduate'],
 3.0, NULL,
 ARRAY['Women in STEM'],
 'https://swe.org/scholarships/',
 'Supports women pursuing engineering and technology degrees at all academic levels.',
 true),

('AAUW STEM Scholarships', 'American Association of University Women', 2000, 12000, '2025-01-15',
 ARRAY['Women in STEM', 'Graduate students', 'Research focus'],
 3.5, NULL,
 ARRAY['Women in STEM'],
 'https://www.aauw.org/resources/programs/fellowships-grants/',
 'Fellowships for women pursuing advanced degrees in STEM fields.',
 true),

-- State-Specific Scholarships
('Cal Grant Program', 'California Student Aid Commission', 1000, 12570, '2025-03-02',
 ARRAY['California residents', 'Financial need', 'Academic merit'],
 3.0, ARRAY['California'],
 NULL,
 'https://www.csac.ca.gov/cal-grants',
 'California state grant program providing financial assistance to eligible California residents.',
 true),

('Texas Grant Program', 'Texas Higher Education Coordinating Board', 1000, 5000, '2025-03-15',
 ARRAY['Texas residents', 'Financial need', 'Enrolled in Texas institutions'],
 2.5, ARRAY['Texas'],
 NULL,
 'https://www.tgslc.org/grants.cfm',
 'State grant program for Texas residents demonstrating financial need.',
 true),

('New York State Tuition Assistance Program', 'New York State Higher Education Services', 500, 5665, '2025-05-01',
 ARRAY['New York residents', 'Financial need', 'Full-time enrollment'],
 2.0, ARRAY['New York'],
 NULL,
 'https://www.hesc.ny.gov/pay-for-college/apply-for-financial-aid/nys-tap.html',
 'Need-based grant program for New York State residents attending college in New York.',
 true),

-- Military/Veterans Scholarships
('Pat Tillman Foundation Scholarship', 'Pat Tillman Foundation', 1000, 25000, '2025-02-28',
 ARRAY['Military veterans', 'Active duty service members', 'Spouses', 'Leadership potential'],
 NULL, NULL,
 ARRAY['Military/Veterans'],
 'https://pattillmanfoundation.org/apply/',
 'Supports military veterans, active duty service members, and their spouses pursuing higher education.',
 true),

('Student Veterans of America Scholarship', 'Student Veterans of America', 1000, 5000, '2025-04-15',
 ARRAY['Military veterans', 'Current students', 'Community involvement'],
 3.0, NULL,
 ARRAY['Military/Veterans'],
 'https://studentveterans.org/programs/scholarships/',
 'Provides financial assistance to student veterans pursuing undergraduate and graduate degrees.',
 true),

-- LGBTQ+ Scholarships
('Point Foundation Scholarship', 'Point Foundation', 1000, 27600, '2025-01-27',
 ARRAY['LGBTQ+ students', 'Academic merit', 'Leadership potential', 'Community involvement'],
 3.2, NULL,
 ARRAY['LGBTQ+'],
 'https://pointfoundation.org/point-apply/application-faqs/',
 'Provides scholarships, mentorship, and leadership development for LGBTQ+ students.',
 true),

('PFLAG National Scholarship Program', 'PFLAG National', 1000, 5000, '2025-03-31',
 ARRAY['LGBTQ+ students', 'Allies', 'High school seniors', 'Community involvement'],
 2.5, NULL,
 ARRAY['LGBTQ+'],
 'https://pflag.org/scholarship',
 'Supports LGBTQ+ students and allies pursuing higher education.',
 true),

-- Community College Transfer Scholarships
('Phi Theta Kappa Transfer Scholarship', 'Phi Theta Kappa Honor Society', 1000, 30000, '2025-12-01',
 ARRAY['Community college students', 'Phi Theta Kappa members', 'Transferring to 4-year college'],
 3.5, NULL,
 NULL,
 'https://www.ptk.org/scholarships/',
 'Scholarships for community college students transferring to four-year institutions.',
 true),

('Jack Kent Cooke Undergraduate Transfer Scholarship', 'Jack Kent Cooke Foundation', 40000, 40000, '2024-12-06',
 ARRAY['Community college students', 'Exceptional academic record', 'Financial need', 'Transferring'],
 3.5, NULL,
 ARRAY['Community College Transfer', 'Low-Income Students'],
 'https://www.jkcf.org/our-scholarships/undergraduate-transfer-scholarship/',
 'Provides up to $40,000 annually for high-achieving community college students transferring to four-year schools.',
 true);

-- Update existing scholarship records with more comprehensive information
UPDATE public.scholarships_2025_10_06_00_42 
SET 
  eligibility_criteria = ARRAY['Merit-based', 'Academic excellence', 'Leadership potential', 'Community involvement'],
  demographic_requirements = ARRAY['All Students'],
  description = 'Merit-based scholarship recognizing academic achievement, leadership, and community service.'
WHERE scholarship_name = 'Merit Excellence Award' AND provider_name = 'Academic Foundation';

UPDATE public.scholarships_2025_10_06_00_42 
SET 
  eligibility_criteria = ARRAY['Financial need', 'Academic merit', 'U.S. citizens or eligible non-citizens'],
  demographic_requirements = ARRAY['Low-Income Students'],
  description = 'Need-based scholarship for students demonstrating financial hardship and academic potential.'
WHERE scholarship_name = 'Need-Based Grant' AND provider_name = 'Education Support Fund';