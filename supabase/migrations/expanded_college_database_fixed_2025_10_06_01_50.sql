-- Update the college_type constraint to include 'private'
ALTER TABLE public.colleges_database_2025_10_06_01_15 
DROP CONSTRAINT IF EXISTS colleges_database_2025_10_06_01_15_college_type_check;

ALTER TABLE public.colleges_database_2025_10_06_01_15 
ADD CONSTRAINT colleges_database_2025_10_06_01_15_college_type_check 
CHECK (college_type IN ('ivy_league', 't20', 'state_school', 'liberal_arts', 'technical', 'community', 'private'));

-- Now insert the additional colleges with corrected types
INSERT INTO public.colleges_database_2025_10_06_01_15 (
  name, location, state, college_type, admission_rate, tuition_in_state, tuition_out_state, total_cost,
  undergraduate_enrollment, application_platform, regular_decision_deadline,
  sat_range_25th, sat_range_75th, act_range_25th, act_range_75th, gpa_average,
  popular_majors, housing_guaranteed_years, campus_setting, website_url, test_optional
) VALUES
-- More California Universities
('UC San Diego', 'La Jolla, CA', 'California', 'state_school', 32.3, 14648, 44402, 63220,
 31000, 'UC Application', '2024-11-30',
 1270, 1480, 28, 34, 4.08,
 ARRAY['Engineering', 'Biology', 'Computer Science', 'Economics', 'Psychology'], 2, 'suburban',
 'https://www.ucsd.edu', true),

('UC Irvine', 'Irvine, CA', 'California', 'state_school', 28.9, 13727, 43481, 62091,
 30000, 'UC Application', '2024-11-30',
 1230, 1420, 26, 33, 3.96,
 ARRAY['Business', 'Engineering', 'Biology', 'Psychology', 'Computer Science'], 2, 'suburban',
 'https://www.uci.edu', true),

('UC Davis', 'Davis, CA', 'California', 'state_school', 46.3, 14495, 44249, 63508,
 31000, 'UC Application', '2024-11-30',
 1160, 1400, 25, 32, 3.99,
 ARRAY['Agriculture', 'Engineering', 'Biology', 'Psychology', 'Economics'], 2, 'suburban',
 'https://www.ucdavis.edu', true),

('UC Santa Barbara', 'Santa Barbara, CA', 'California', 'state_school', 32.2, 14391, 44145, 63156,
 23000, 'UC Application', '2024-11-30',
 1230, 1440, 28, 33, 4.10,
 ARRAY['Psychology', 'Economics', 'Communication', 'Biology', 'Political Science'], 2, 'suburban',
 'https://www.ucsb.edu', true),

('Cal Poly San Luis Obispo', 'San Luis Obispo, CA', 'California', 'state_school', 28.4, 10467, 22131, 41000,
 22000, 'Cal State Apply', '2024-11-30',
 1240, 1440, 27, 33, 3.96,
 ARRAY['Engineering', 'Architecture', 'Business', 'Agriculture', 'Computer Science'], 2, 'suburban',
 'https://www.calpoly.edu', true),

-- Texas Universities
('Texas A&M University', 'College Station, TX', 'Texas', 'state_school', 63.0, 12413, 40607, 56272,
 54000, 'ApplyTexas', '2024-12-01',
 1160, 1380, 25, 31, 3.68,
 ARRAY['Engineering', 'Business', 'Agriculture', 'Liberal Arts', 'Science'], 1, 'suburban',
 'https://www.tamu.edu', true),

('University of Houston', 'Houston, TX', 'Texas', 'state_school', 66.0, 11966, 27046, 43000,
 37000, 'ApplyTexas', '2024-12-01',
 1120, 1320, 24, 29, 3.54,
 ARRAY['Business', 'Engineering', 'Liberal Arts', 'Education', 'Architecture'], 1, 'urban',
 'https://www.uh.edu', true),

('Texas Tech University', 'Lubbock, TX', 'Texas', 'state_school', 70.0, 11832, 25892, 42000,
 31000, 'ApplyTexas', '2024-12-01',
 1080, 1280, 23, 28, 3.58,
 ARRAY['Engineering', 'Business', 'Agriculture', 'Arts & Sciences', 'Education'], 1, 'urban',
 'https://www.ttu.edu', true),

-- New York Universities
('SUNY Stony Brook', 'Stony Brook, NY', 'New York', 'state_school', 44.0, 7070, 24740, 42000,
 17000, 'Common Application', '2025-01-15',
 1270, 1470, 28, 33, 3.84,
 ARRAY['Engineering', 'Medicine', 'Computer Science', 'Business', 'Psychology'], 2, 'suburban',
 'https://www.stonybrook.edu', true),

('SUNY Binghamton', 'Binghamton, NY', 'New York', 'state_school', 40.0, 7070, 24740, 42000,
 14000, 'Common Application', '2025-01-15',
 1300, 1450, 29, 33, 3.70,
 ARRAY['Business', 'Engineering', 'Liberal Arts', 'Nursing', 'Psychology'], 2, 'suburban',
 'https://www.binghamton.edu', true),

('SUNY Buffalo', 'Buffalo, NY', 'New York', 'state_school', 68.0, 7070, 28194, 45000,
 22000, 'Common Application', '2025-02-01',
 1160, 1350, 25, 30, 3.70,
 ARRAY['Engineering', 'Business', 'Medicine', 'Arts & Sciences', 'Architecture'], 2, 'urban',
 'https://www.buffalo.edu', true),

('Fordham University', 'Bronx, NY', 'New York', 'private', 54.0, 58081, 58081, 79000,
 9000, 'Common Application', '2025-01-01',
 1270, 1450, 29, 33, 3.64,
 ARRAY['Business', 'Liberal Arts', 'Communications', 'Social Work', 'Education'], 4, 'urban',
 'https://www.fordham.edu', true),

-- Florida Universities
('Florida State University', 'Tallahassee, FL', 'Florida', 'state_school', 32.0, 5656, 21683, 38000,
 32000, 'Common Application', '2024-11-01',
 1210, 1360, 26, 30, 4.07,
 ARRAY['Psychology', 'Criminal Justice', 'Business', 'Communications', 'Political Science'], 2, 'suburban',
 'https://www.fsu.edu', true),

('University of Central Florida', 'Orlando, FL', 'Florida', 'state_school', 44.0, 6368, 22467, 39000,
 58000, 'Common Application', '2025-05-01',
 1160, 1310, 25, 29, 4.12,
 ARRAY['Business', 'Engineering', 'Health Sciences', 'Education', 'Arts & Humanities'], 2, 'suburban',
 'https://www.ucf.edu', true),

('Florida International University', 'Miami, FL', 'Florida', 'state_school', 58.0, 6556, 18963, 35000,
 46000, 'Common Application', '2025-05-01',
 1080, 1250, 23, 28, 3.89,
 ARRAY['Business', 'Engineering', 'International Business', 'Architecture', 'Public Health'], 2, 'urban',
 'https://www.fiu.edu', true),

-- Illinois Universities
('University of Illinois Chicago', 'Chicago, IL', 'Illinois', 'state_school', 79.0, 13927, 28619, 45000,
 22000, 'Common Application', '2025-01-15',
 1080, 1310, 23, 29, 3.50,
 ARRAY['Business', 'Engineering', 'Liberal Arts', 'Public Health', 'Education'], 2, 'urban',
 'https://www.uic.edu', true),

('Illinois Institute of Technology', 'Chicago, IL', 'Illinois', 'technical', 54.0, 51606, 51606, 70000,
 3000, 'Common Application', '2025-01-15',
 1270, 1470, 28, 33, 3.91,
 ARRAY['Engineering', 'Computer Science', 'Architecture', 'Business', 'Applied Technology'], 4, 'urban',
 'https://www.iit.edu', true),

('DePaul University', 'Chicago, IL', 'Illinois', 'private', 70.0, 42449, 42449, 60000,
 14000, 'Common Application', '2025-02-01',
 1100, 1320, 24, 29, 3.70,
 ARRAY['Business', 'Liberal Arts', 'Communications', 'Computing', 'Music'], 4, 'urban',
 'https://www.depaul.edu', true),

-- Pennsylvania Universities
('Penn State University Park', 'University Park, PA', 'Pennsylvania', 'state_school', 56.0, 18898, 36476, 53000,
 40000, 'Common Application', '2024-11-30',
 1160, 1360, 25, 30, 3.67,
 ARRAY['Business', 'Engineering', 'Liberal Arts', 'Communications', 'Agriculture'], 2, 'suburban',
 'https://www.psu.edu', true),

('Temple University', 'Philadelphia, PA', 'Pennsylvania', 'state_school', 70.0, 16970, 29066, 46000,
 28000, 'Common Application', '2025-02-01',
 1070, 1280, 23, 29, 3.54,
 ARRAY['Business', 'Communications', 'Liberal Arts', 'Engineering', 'Fine Arts'], 2, 'urban',
 'https://www.temple.edu', true),

('Drexel University', 'Philadelphia, PA', 'Pennsylvania', 'private', 75.0, 56595, 56595, 75000,
 13000, 'Common Application', '2025-01-15',
 1180, 1390, 26, 31, 3.73,
 ARRAY['Engineering', 'Business', 'Computing', 'Design', 'Health Sciences'], 4, 'urban',
 'https://www.drexel.edu', true),

-- Massachusetts Universities
('Boston University', 'Boston, MA', 'Massachusetts', 'private', 18.3, 58560, 58560, 78000,
 17000, 'Common Application', '2025-01-04',
 1350, 1500, 30, 34, 3.88,
 ARRAY['Business', 'Communications', 'Engineering', 'Liberal Arts', 'Health Sciences'], 4, 'urban',
 'https://www.bu.edu', true),

('Northeastern University', 'Boston, MA', 'Massachusetts', 'private', 18.1, 56500, 56500, 76000,
 15000, 'Common Application', '2025-01-01',
 1390, 1540, 32, 35, 4.04,
 ARRAY['Business', 'Engineering', 'Computer Science', 'Health Sciences', 'Liberal Arts'], 4, 'urban',
 'https://www.northeastern.edu', true),

('University of Massachusetts Amherst', 'Amherst, MA', 'Massachusetts', 'state_school', 64.0, 16186, 37405, 54000,
 24000, 'Common Application', '2025-01-15',
 1200, 1390, 26, 32, 3.90,
 ARRAY['Business', 'Engineering', 'Liberal Arts', 'Natural Sciences', 'Social Sciences'], 2, 'suburban',
 'https://www.umass.edu', true),

-- Virginia Universities
('Virginia Tech', 'Blacksburg, VA', 'Virginia', 'state_school', 65.0, 13691, 32835, 50000,
 29000, 'Common Application', '2025-01-15',
 1180, 1390, 25, 32, 4.04,
 ARRAY['Engineering', 'Business', 'Agriculture', 'Architecture', 'Liberal Arts'], 2, 'suburban',
 'https://www.vt.edu', true),

('James Madison University', 'Harrisonburg, VA', 'Virginia', 'state_school', 78.0, 12330, 29230, 46000,
 20000, 'Common Application', '2025-01-15',
 1120, 1290, 24, 29, 3.65,
 ARRAY['Business', 'Education', 'Health Sciences', 'Liberal Arts', 'Visual Arts'], 2, 'suburban',
 'https://www.jmu.edu', true),

-- North Carolina Universities
('NC State University', 'Raleigh, NC', 'North Carolina', 'state_school', 47.0, 9058, 28444, 45000,
 25000, 'Common Application', '2025-01-15',
 1240, 1420, 27, 32, 4.41,
 ARRAY['Engineering', 'Agriculture', 'Business', 'Design', 'Natural Resources'], 2, 'urban',
 'https://www.ncsu.edu', true),

-- Ohio Universities
('Case Western Reserve University', 'Cleveland, OH', 'Ohio', 'private', 27.0, 52948, 52948, 71000,
 5000, 'Common Application', '2025-01-15',
 1330, 1520, 30, 34, 3.83,
 ARRAY['Engineering', 'Business', 'Liberal Arts', 'Medicine', 'Nursing'], 4, 'urban',
 'https://www.case.edu', true),

('Miami University', 'Oxford, OH', 'Ohio', 'state_school', 88.0, 15555, 36555, 53000,
 17000, 'Common Application', '2025-02-01',
 1200, 1380, 26, 31, 3.76,
 ARRAY['Business', 'Education', 'Liberal Arts', 'Engineering', 'Fine Arts'], 2, 'suburban',
 'https://www.miamioh.edu', true),

-- More State Universities
('University of Alabama', 'Tuscaloosa, AL', 'Alabama', 'state_school', 80.0, 11100, 30840, 47000,
 33000, 'Common Application', '2025-02-01',
 1060, 1280, 23, 30, 3.71,
 ARRAY['Business', 'Communications', 'Engineering', 'Liberal Arts', 'Education'], 1, 'suburban',
 'https://www.ua.edu', true),

('Auburn University', 'Auburn, AL', 'Alabama', 'state_school', 85.0, 11796, 31956, 48000,
 25000, 'Common Application', '2025-02-01',
 1210, 1380, 26, 31, 3.91,
 ARRAY['Engineering', 'Business', 'Agriculture', 'Liberal Arts', 'Architecture'], 1, 'suburban',
 'https://www.auburn.edu', true),

('University of Arizona', 'Tucson, AZ', 'Arizona', 'state_school', 87.0, 12691, 36718, 53000,
 35000, 'Common Application', '2025-05-01',
 1050, 1290, 22, 29, 3.43,
 ARRAY['Business', 'Engineering', 'Liberal Arts', 'Agriculture', 'Fine Arts'], 2, 'urban',
 'https://www.arizona.edu', true),

('Arizona State University', 'Tempe, AZ', 'Arizona', 'state_school', 88.0, 11338, 29428, 46000,
 42000, 'Common Application', '2025-02-01',
 1120, 1360, 22, 28, 3.54,
 ARRAY['Business', 'Engineering', 'Liberal Arts', 'Journalism', 'Public Service'], 1, 'urban',
 'https://www.asu.edu', true),

('University of Arkansas', 'Fayetteville, AR', 'Arkansas', 'state_school', 78.0, 9062, 25872, 42000,
 23000, 'Common Application', '2025-08-01',
 1090, 1300, 23, 29, 3.69,
 ARRAY['Business', 'Engineering', 'Agriculture', 'Liberal Arts', 'Education'], 1, 'suburban',
 'https://www.uark.edu', true),

('University of Colorado Boulder', 'Boulder, CO', 'Colorado', 'state_school', 84.0, 12086, 37288, 54000,
 29000, 'Common Application', '2025-01-15',
 1160, 1370, 25, 31, 3.66,
 ARRAY['Business', 'Engineering', 'Liberal Arts', 'Communications', 'Environmental Studies'], 2, 'suburban',
 'https://www.colorado.edu', true),

('Colorado State University', 'Fort Collins, CO', 'Colorado', 'state_school', 91.0, 12017, 30607, 47000,
 25000, 'Common Application', '2025-02-01',
 1080, 1290, 23, 29, 3.59,
 ARRAY['Business', 'Engineering', 'Agriculture', 'Liberal Arts', 'Natural Sciences'], 2, 'suburban',
 'https://www.colostate.edu', true),

('University of Connecticut', 'Storrs, CT', 'Connecticut', 'state_school', 56.0, 15730, 38340, 55000,
 19000, 'Common Application', '2025-01-15',
 1210, 1420, 26, 32, 3.76,
 ARRAY['Business', 'Engineering', 'Liberal Arts', 'Agriculture', 'Education'], 2, 'suburban',
 'https://www.uconn.edu', true),

('University of Delaware', 'Newark, DE', 'Delaware', 'state_school', 74.0, 14280, 35890, 52000,
 18000, 'Common Application', '2025-01-15',
 1150, 1350, 25, 30, 3.69,
 ARRAY['Business', 'Engineering', 'Liberal Arts', 'Agriculture', 'Health Sciences'], 2, 'suburban',
 'https://www.udel.edu', true),

('University of Georgia', 'Athens, GA', 'Georgia', 'state_school', 48.0, 11818, 30392, 47000,
 29000, 'Common Application', '2025-01-01',
 1220, 1400, 27, 32, 4.00,
 ARRAY['Business', 'Journalism', 'Liberal Arts', 'Agriculture', 'Education'], 2, 'suburban',
 'https://www.uga.edu', true),

('University of Hawaii at Manoa', 'Honolulu, HI', 'Hawaii', 'state_school', 84.0, 11304, 33336, 50000,
 13000, 'Common Application', '2025-01-05',
 1000, 1240, 21, 27, 3.74,
 ARRAY['Business', 'Liberal Arts', 'Engineering', 'Natural Sciences', 'Pacific Studies'], 1, 'urban',
 'https://www.hawaii.edu', true),

('Boise State University', 'Boise, ID', 'Idaho', 'state_school', 84.0, 7344, 24988, 41000,
 20000, 'Common Application', '2025-07-15',
 1020, 1250, 21, 28, 3.53,
 ARRAY['Business', 'Engineering', 'Liberal Arts', 'Health Sciences', 'Education'], 1, 'urban',
 'https://www.boisestate.edu', true),

('University of Iowa', 'Iowa City, IA', 'Iowa', 'state_school', 86.0, 9830, 31233, 48000,
 21000, 'Common Application', '2025-05-01',
 1140, 1350, 24, 30, 3.73,
 ARRAY['Business', 'Liberal Arts', 'Engineering', 'Medicine', 'Journalism'], 2, 'suburban',
 'https://www.uiowa.edu', true),

('Iowa State University', 'Ames, IA', 'Iowa', 'state_school', 92.0, 9168, 25420, 42000,
 25000, 'Common Application', '2025-07-01',
 1040, 1290, 22, 29, 3.78,
 ARRAY['Engineering', 'Agriculture', 'Business', 'Liberal Arts', 'Design'], 2, 'suburban',
 'https://www.iastate.edu', true),

('University of Kansas', 'Lawrence, KS', 'Kansas', 'state_school', 93.0, 10824, 26592, 43000,
 19000, 'Common Application', '2025-08-01',
 1060, 1290, 22, 29, 3.39,
 ARRAY['Business', 'Liberal Arts', 'Engineering', 'Journalism', 'Education'], 1, 'suburban',
 'https://www.ku.edu', true),

('Kansas State University', 'Manhattan, KS', 'Kansas', 'state_school', 95.0, 10441, 26615, 43000,
 16000, 'Common Application', '2025-08-01',
 1020, 1270, 21, 28, 3.49,
 ARRAY['Agriculture', 'Engineering', 'Business', 'Liberal Arts', 'Architecture'], 1, 'suburban',
 'https://www.k-state.edu', true),

('University of Kentucky', 'Lexington, KY', 'Kentucky', 'state_school', 95.0, 12484, 31054, 48000,
 22000, 'Common Application', '2025-02-15',
 1080, 1310, 23, 29, 3.61,
 ARRAY['Business', 'Engineering', 'Liberal Arts', 'Agriculture', 'Medicine'], 1, 'suburban',
 'https://www.uky.edu', true),

('Louisiana State University', 'Baton Rouge, LA', 'Louisiana', 'state_school', 76.0, 11950, 28627, 45000,
 25000, 'Common Application', '2025-01-15',
 1100, 1310, 24, 29, 3.50,
 ARRAY['Business', 'Engineering', 'Liberal Arts', 'Agriculture', 'Mass Communication'], 1, 'suburban',
 'https://www.lsu.edu', true),

('University of Maine', 'Orono, ME', 'Maine', 'state_school', 94.0, 11240, 30970, 47000,
 9000, 'Common Application', '2025-02-01',
 1020, 1250, 22, 28, 3.30,
 ARRAY['Business', 'Engineering', 'Liberal Arts', 'Natural Sciences', 'Education'], 2, 'suburban',
 'https://www.maine.edu', true),

('University of Maryland College Park', 'College Park, MD', 'Maryland', 'state_school', 51.0, 10779, 36891, 54000,
 30000, 'Common Application', '2025-01-20',
 1270, 1480, 29, 34, 4.32,
 ARRAY['Business', 'Engineering', 'Computer Science', 'Journalism', 'Liberal Arts'], 2, 'suburban',
 'https://www.umd.edu', true),

('University of Minnesota Twin Cities', 'Minneapolis, MN', 'Minnesota', 'state_school', 75.0, 15027, 33325, 50000,
 35000, 'Common Application', '2025-01-01',
 1270, 1480, 27, 32, 3.80,
 ARRAY['Business', 'Engineering', 'Liberal Arts', 'Agriculture', 'Public Health'], 2, 'urban',
 'https://www.umn.edu', true),

('University of Mississippi', 'Oxford, MS', 'Mississippi', 'state_school', 88.0, 8934, 25444, 42000,
 18000, 'Common Application', '2025-07-20',
 1050, 1280, 22, 29, 3.60,
 ARRAY['Business', 'Liberal Arts', 'Engineering', 'Journalism', 'Education'], 1, 'suburban',
 'https://www.olemiss.edu', true),

('University of Missouri', 'Columbia, MO', 'Missouri', 'state_school', 79.0, 11513, 28348, 45000,
 23000, 'Common Application', '2025-05-01',
 1080, 1320, 23, 29, 3.58,
 ARRAY['Business', 'Journalism', 'Engineering', 'Liberal Arts', 'Agriculture'], 1, 'suburban',
 'https://www.missouri.edu', true),

('University of Montana', 'Missoula, MT', 'Montana', 'state_school', 95.0, 7967, 27685, 44000,
 8000, 'Common Application', '2025-03-01',
 1000, 1250, 21, 28, 3.46,
 ARRAY['Liberal Arts', 'Business', 'Forestry', 'Journalism', 'Fine Arts'], 1, 'suburban',
 'https://www.umt.edu', true),

('University of Nebraska Lincoln', 'Lincoln, NE', 'Nebraska', 'state_school', 79.0, 9242, 25038, 42000,
 20000, 'Common Application', '2025-05-01',
 1080, 1350, 22, 29, 3.70,
 ARRAY['Business', 'Engineering', 'Agriculture', 'Liberal Arts', 'Journalism'], 1, 'suburban',
 'https://www.unl.edu', true),

('University of Nevada Las Vegas', 'Las Vegas, NV', 'Nevada', 'state_school', 85.0, 8291, 24431, 41000,
 25000, 'Common Application', '2025-07-01',
 980, 1200, 20, 26, 3.39,
 ARRAY['Business', 'Liberal Arts', 'Engineering', 'Hotel Administration', 'Fine Arts'], 1, 'urban',
 'https://www.unlv.edu', true),

('University of New Hampshire', 'Durham, NH', 'New Hampshire', 'state_school', 87.0, 18499, 35077, 52000,
 11000, 'Common Application', '2025-02-01',
 1080, 1290, 24, 29, 3.50,
 ARRAY['Business', 'Liberal Arts', 'Engineering', 'Life Sciences', 'Health Sciences'], 2, 'suburban',
 'https://www.unh.edu', true),

('Rutgers University', 'New Brunswick, NJ', 'New Jersey', 'state_school', 68.0, 15407, 32189, 49000,
 36000, 'Common Application', '2024-12-01',
 1190, 1410, 26, 32, 3.73,
 ARRAY['Business', 'Engineering', 'Liberal Arts', 'Pharmacy', 'Agriculture'], 2, 'suburban',
 'https://www.rutgers.edu', true),

('University of New Mexico', 'Albuquerque, NM', 'New Mexico', 'state_school', 96.0, 7146, 22966, 39000,
 16000, 'Common Application', '2025-06-15',
 970, 1210, 19, 26, 3.34,
 ARRAY['Liberal Arts', 'Business', 'Engineering', 'Fine Arts', 'Medicine'], 1, 'urban',
 'https://www.unm.edu', true),

('University of North Dakota', 'Grand Forks, ND', 'North Dakota', 'state_school', 84.0, 8817, 13543, 30000,
 10000, 'Common Application', '2025-08-01',
 1000, 1250, 20, 27, 3.50,
 ARRAY['Business', 'Engineering', 'Liberal Arts', 'Aviation', 'Medicine'], 1, 'suburban',
 'https://www.und.edu', true),

('University of Oklahoma', 'Norman, OK', 'Oklahoma', 'state_school', 73.0, 11763, 28072, 45000,
 22000, 'Common Application', '2025-02-01',
 1100, 1340, 23, 30, 3.62,
 ARRAY['Business', 'Engineering', 'Liberal Arts', 'Journalism', 'Fine Arts'], 1, 'suburban',
 'https://www.ou.edu', true),

('Oklahoma State University', 'Stillwater, OK', 'Oklahoma', 'state_school', 71.0, 9019, 24539, 41000,
 20000, 'Common Application', '2025-08-01',
 1030, 1270, 22, 28, 3.58,
 ARRAY['Business', 'Engineering', 'Agriculture', 'Liberal Arts', 'Architecture'], 1, 'suburban',
 'https://www.okstate.edu', true),

('University of Oregon', 'Eugene, OR', 'Oregon', 'state_school', 84.0, 12720, 38415, 55000,
 17000, 'Common Application', '2025-01-15',
 1080, 1310, 22, 29, 3.59,
 ARRAY['Business', 'Liberal Arts', 'Journalism', 'Education', 'Architecture'], 1, 'suburban',
 'https://www.uoregon.edu', true),

('Oregon State University', 'Corvallis, OR', 'Oregon', 'state_school', 83.0, 12375, 32617, 49000,
 24000, 'Common Application', '2025-02-01',
 1050, 1290, 22, 29, 3.59,
 ARRAY['Engineering', 'Business', 'Liberal Arts', 'Agriculture', 'Forestry'], 1, 'suburban',
 'https://www.oregonstate.edu', true),

('University of Rhode Island', 'Kingston, RI', 'Rhode Island', 'state_school', 76.0, 14566, 32578, 49000,
 14000, 'Common Application', '2025-02-01',
 1080, 1290, 24, 29, 3.50,
 ARRAY['Business', 'Engineering', 'Liberal Arts', 'Pharmacy', 'Ocean Engineering'], 2, 'suburban',
 'https://www.uri.edu', true),

('University of South Carolina', 'Columbia, SC', 'South Carolina', 'state_school', 69.0, 12616, 33928, 51000,
 26000, 'Common Application', '2024-12-01',
 1150, 1330, 25, 30, 4.11,
 ARRAY['Business', 'Liberal Arts', 'Engineering', 'Journalism', 'Public Health'], 2, 'urban',
 'https://www.sc.edu', true),

('Clemson University', 'Clemson, SC', 'South Carolina', 'state_school', 51.0, 15558, 38550, 55000,
 20000, 'Common Application', '2025-01-01',
 1220, 1400, 27, 32, 4.43,
 ARRAY['Engineering', 'Business', 'Agriculture', 'Liberal Arts', 'Architecture'], 2, 'suburban',
 'https://www.clemson.edu', true),

('University of South Dakota', 'Vermillion, SD', 'South Dakota', 'state_school', 88.0, 9638, 12931, 29000,
 7000, 'Common Application', '2025-08-01',
 1000, 1250, 20, 27, 3.53,
 ARRAY['Business', 'Liberal Arts', 'Medicine', 'Law', 'Fine Arts'], 1, 'suburban',
 'https://www.usd.edu', true),

('University of Tennessee Knoxville', 'Knoxville, TN', 'Tennessee', 'state_school', 68.0, 13244, 31664, 48000,
 23000, 'Common Application', '2024-12-15',
 1210, 1400, 26, 32, 4.12,
 ARRAY['Business', 'Engineering', 'Liberal Arts', 'Agriculture', 'Communications'], 2, 'suburban',
 'https://www.utk.edu', true),

('University of Utah', 'Salt Lake City, UT', 'Utah', 'state_school', 89.0, 10279, 29215, 46000,
 24000, 'Common Application', '2025-04-01',
 1160, 1370, 24, 30, 3.66,
 ARRAY['Business', 'Engineering', 'Liberal Arts', 'Medicine', 'Fine Arts'], 1, 'urban',
 'https://www.utah.edu', true),

('Utah State University', 'Logan, UT', 'Utah', 'state_school', 94.0, 7387, 21751, 38000,
 24000, 'Common Application', '2025-08-01',
 1020, 1270, 21, 28, 3.60,
 ARRAY['Agriculture', 'Engineering', 'Business', 'Liberal Arts', 'Natural Resources'], 1, 'suburban',
 'https://www.usu.edu', true),

('University of Vermont', 'Burlington, VT', 'Vermont', 'state_school', 67.0, 18890, 43890, 61000,
 10000, 'Common Application', '2025-01-15',
 1180, 1370, 26, 31, 3.67,
 ARRAY['Business', 'Liberal Arts', 'Engineering', 'Agriculture', 'Environment'], 2, 'suburban',
 'https://www.uvm.edu', true),

('Washington State University', 'Pullman, WA', 'Washington', 'state_school', 76.0, 11584, 26504, 43000,
 25000, 'Common Application', '2025-01-31',
 1020, 1250, 21, 28, 3.50,
 ARRAY['Business', 'Liberal Arts', 'Engineering', 'Agriculture', 'Communications'], 1, 'suburban',
 'https://www.wsu.edu', true),

('West Virginia University', 'Morgantown, WV', 'West Virginia', 'state_school', 88.0, 8976, 25320, 42000,
 21000, 'Common Application', '2025-08-01',
 1010, 1240, 21, 27, 3.39,
 ARRAY['Business', 'Engineering', 'Liberal Arts', 'Medicine', 'Agriculture'], 1, 'suburban',
 'https://www.wvu.edu', true),

('University of Wisconsin Madison', 'Madison, WI', 'Wisconsin', 'state_school', 57.0, 10725, 38630, 55000,
 33000, 'Common Application', '2025-02-01',
 1280, 1470, 28, 33, 3.88,
 ARRAY['Business', 'Engineering', 'Liberal Arts', 'Agriculture', 'Journalism'], 2, 'urban',
 'https://www.wisc.edu', true),

('University of Wyoming', 'Laramie, WY', 'Wyoming', 'state_school', 96.0, 5220, 17010, 34000,
 9000, 'Common Application', '2025-08-10',
 1020, 1280, 21, 28, 3.50,
 ARRAY['Business', 'Engineering', 'Liberal Arts', 'Agriculture', 'Natural Sciences'], 1, 'suburban',
 'https://www.uwyo.edu', true);

-- Create indexes for better performance on new data
CREATE INDEX IF NOT EXISTS idx_colleges_name ON public.colleges_database_2025_10_06_01_15(name);
CREATE INDEX IF NOT EXISTS idx_colleges_tuition_range ON public.colleges_database_2025_10_06_01_15(tuition_in_state, tuition_out_state);
CREATE INDEX IF NOT EXISTS idx_colleges_enrollment ON public.colleges_database_2025_10_06_01_15(undergraduate_enrollment);