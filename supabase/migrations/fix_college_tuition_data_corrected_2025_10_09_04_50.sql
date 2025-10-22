-- Update college tuition data to ensure accuracy for in-state and out-of-state costs
-- Fix any missing or incorrect tuition information

-- First, let's check and fix some key colleges with accurate 2024-2025 tuition data

-- Update Harvard University (Private - same tuition for all)
UPDATE public.colleges_database_2025_10_06_01_15 
SET 
  tuition_in_state = 54269,
  tuition_out_state = 54269,
  total_cost = 79450
WHERE name = 'Harvard University';

-- Update Yale University (Private - same tuition for all)
UPDATE public.colleges_database_2025_10_06_01_15 
SET 
  tuition_in_state = 59950,
  tuition_out_state = 59950,
  total_cost = 83880
WHERE name = 'Yale University';

-- Update UC Berkeley (Public - different in-state vs out-of-state)
UPDATE public.colleges_database_2025_10_06_01_15 
SET 
  tuition_in_state = 14226,
  tuition_out_state = 44008,
  total_cost = 58556
WHERE name = 'University of California, Berkeley';

-- Update UCLA (Public - different in-state vs out-of-state)
UPDATE public.colleges_database_2025_10_06_01_15 
SET 
  tuition_in_state = 13804,
  tuition_out_state = 43473,
  total_cost = 62205
WHERE name = 'University of California, Los Angeles';

-- Update University of Michigan (Public - different in-state vs out-of-state)
UPDATE public.colleges_database_2025_10_06_01_15 
SET 
  tuition_in_state = 16178,
  tuition_out_state = 52266,
  total_cost = 68432
WHERE name = 'University of Michigan';

-- Update University of Virginia (Public - different in-state vs out-of-state)
UPDATE public.colleges_database_2025_10_06_01_15 
SET 
  tuition_in_state = 17674,
  tuition_out_state = 51940,
  total_cost = 70412
WHERE name = 'University of Virginia';

-- Update University of Texas at Austin (Public - different in-state vs out-of-state)
UPDATE public.colleges_database_2025_10_06_01_15 
SET 
  tuition_in_state = 11678,
  tuition_out_state = 40032,
  total_cost = 56424
WHERE name = 'University of Texas at Austin';

-- Update University of Florida (Public - different in-state vs out-of-state)
UPDATE public.colleges_database_2025_10_06_01_15 
SET 
  tuition_in_state = 6381,
  tuition_out_state = 28658,
  total_cost = 43710
WHERE name = 'University of Florida';

-- Update Georgia Tech (Public - different in-state vs out-of-state)
UPDATE public.colleges_database_2025_10_06_01_15 
SET 
  tuition_in_state = 12682,
  tuition_out_state = 33794,
  total_cost = 49432
WHERE name = 'Georgia Institute of Technology';

-- Update University of Washington (Public - different in-state vs out-of-state)
UPDATE public.colleges_database_2025_10_06_01_15 
SET 
  tuition_in_state = 12092,
  tuition_out_state = 39906,
  total_cost = 57879
WHERE name = 'University of Washington';

-- Update Ohio State University (Public - different in-state vs out-of-state)
UPDATE public.colleges_database_2025_10_06_01_15 
SET 
  tuition_in_state = 11936,
  tuition_out_state = 32061,
  total_cost = 47016
WHERE name = 'Ohio State University';

-- Update University of North Carolina at Chapel Hill (Public - different in-state vs out-of-state)
UPDATE public.colleges_database_2025_10_06_01_15 
SET 
  tuition_in_state = 7019,
  tuition_out_state = 36776,
  total_cost = 53180
WHERE name = 'University of North Carolina at Chapel Hill';

-- For private colleges, ensure in-state and out-of-state tuition are the same
UPDATE public.colleges_database_2025_10_06_01_15 
SET tuition_in_state = tuition_out_state
WHERE college_type IN ('ivy_league', 't20', 'liberal_arts', 'technical') 
  AND college_type != 'state_school'
  AND (tuition_in_state IS NULL OR tuition_in_state = 0 OR tuition_in_state != tuition_out_state);

-- Create a view for easy tuition verification
CREATE OR REPLACE VIEW college_tuition_verification AS
SELECT 
  name,
  state,
  college_type,
  tuition_in_state,
  tuition_out_state,
  total_cost,
  CASE 
    WHEN college_type = 'state_school' AND tuition_in_state > tuition_out_state THEN 'ERROR: In-state higher than out-of-state'
    WHEN college_type != 'state_school' AND tuition_in_state != tuition_out_state THEN 'WARNING: Private college with different tuitions'
    WHEN tuition_in_state IS NULL OR tuition_out_state IS NULL THEN 'WARNING: Missing tuition data'
    ELSE 'OK'
  END as validation_status
FROM public.colleges_database_2025_10_06_01_15
ORDER BY validation_status DESC, name;