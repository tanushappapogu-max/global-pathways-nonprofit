-- Restore complete scholarships table structure
-- Add any missing columns that are required for the automated ingestion system

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add source column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scholarships' AND column_name = 'source') THEN
        ALTER TABLE public.scholarships ADD COLUMN source TEXT NOT NULL DEFAULT 'unknown';
    END IF;

    -- Add source_id column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scholarships' AND column_name = 'source_id') THEN
        ALTER TABLE public.scholarships ADD COLUMN source_id TEXT;
    END IF;

    -- Add name column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scholarships' AND column_name = 'name') THEN
        ALTER TABLE public.scholarships ADD COLUMN name TEXT NOT NULL DEFAULT 'Unnamed Scholarship';
    END IF;

    -- Add amount column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scholarships' AND column_name = 'amount') THEN
        ALTER TABLE public.scholarships ADD COLUMN amount TEXT;
    END IF;

    -- Add eligibility column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scholarships' AND column_name = 'eligibility') THEN
        ALTER TABLE public.scholarships ADD COLUMN eligibility TEXT;
    END IF;

    -- Add deadline column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scholarships' AND column_name = 'deadline') THEN
        ALTER TABLE public.scholarships ADD COLUMN deadline DATE;
    END IF;

    -- Add link column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scholarships' AND column_name = 'link') THEN
        ALTER TABLE public.scholarships ADD COLUMN link TEXT;
    END IF;

    -- Add region column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scholarships' AND column_name = 'region') THEN
        ALTER TABLE public.scholarships ADD COLUMN region TEXT;
    END IF;

    -- Add category column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scholarships' AND column_name = 'category') THEN
        ALTER TABLE public.scholarships ADD COLUMN category TEXT;
    END IF;

    -- Add raw_json column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scholarships' AND column_name = 'raw_json') THEN
        ALTER TABLE public.scholarships ADD COLUMN raw_json JSONB;
    END IF;

    -- Add last_checked column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scholarships' AND column_name = 'last_checked') THEN
        ALTER TABLE public.scholarships ADD COLUMN last_checked TIMESTAMPTZ DEFAULT NOW();
    END IF;

    -- Add last_updated column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scholarships' AND column_name = 'last_updated') THEN
        ALTER TABLE public.scholarships ADD COLUMN last_updated TIMESTAMPTZ DEFAULT NOW();
    END IF;

    -- Add expired column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scholarships' AND column_name = 'expired') THEN
        ALTER TABLE public.scholarships ADD COLUMN expired BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add link_broken column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scholarships' AND column_name = 'link_broken') THEN
        ALTER TABLE public.scholarships ADD COLUMN link_broken BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add needs_review column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scholarships' AND column_name = 'needs_review') THEN
        ALTER TABLE public.scholarships ADD COLUMN needs_review BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add created_at column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scholarships' AND column_name = 'created_at') THEN
        ALTER TABLE public.scholarships ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;

    -- Add id column if missing (should be primary key)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'scholarships' AND column_name = 'id') THEN
        ALTER TABLE public.scholarships ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid();
    END IF;

END $$;

-- Ensure proper indexes exist
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON public.scholarships(deadline);
CREATE INDEX IF NOT EXISTS idx_scholarships_source ON public.scholarships(source);
CREATE INDEX IF NOT EXISTS idx_scholarships_category ON public.scholarships(category);
CREATE INDEX IF NOT EXISTS idx_scholarships_region ON public.scholarships(region);
CREATE INDEX IF NOT EXISTS idx_scholarships_expired ON public.scholarships(expired);
CREATE INDEX IF NOT EXISTS idx_scholarships_needs_review ON public.scholarships(needs_review);

-- Ensure RLS is enabled
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

-- Recreate policies if they don't exist
DROP POLICY IF EXISTS "Anyone can view active scholarships" ON public.scholarships;
CREATE POLICY "Anyone can view active scholarships" ON public.scholarships
  FOR SELECT USING (NOT expired AND NOT needs_review);

DROP POLICY IF EXISTS "Service role can manage all scholarships" ON public.scholarships;
CREATE POLICY "Service role can manage all scholarships" ON public.scholarships
  FOR ALL USING (auth.role() = 'service_role');

-- Insert some sample data if table is empty
INSERT INTO public.scholarships (
  source, source_id, name, amount, eligibility, deadline, link, region, category, raw_json
) 
SELECT 
  'sample_source', 
  'sample_001', 
  'Merit Excellence Scholarship', 
  '$5,000', 
  'GPA 3.5+, US Citizens', 
  '2025-03-15', 
  'https://example.com/apply', 
  'National', 
  'Merit', 
  '{"provider": "sample", "id": "sample_001"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.scholarships WHERE source = 'sample_source' AND source_id = 'sample_001');

INSERT INTO public.scholarships (
  source, source_id, name, amount, eligibility, deadline, link, region, category, raw_json
) 
SELECT 
  'sample_source', 
  'sample_002', 
  'STEM Innovation Award', 
  '$10,000', 
  'STEM majors, All students', 
  '2025-04-30', 
  'https://example.com/stem', 
  'National', 
  'STEM', 
  '{"provider": "sample", "id": "sample_002"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.scholarships WHERE source = 'sample_source' AND source_id = 'sample_002');

INSERT INTO public.scholarships (
  source, source_id, name, amount, eligibility, deadline, link, region, category, raw_json
) 
SELECT 
  'sample_source', 
  'sample_003', 
  'First Generation College Grant', 
  '$3,000', 
  'First-generation college students', 
  '2025-02-28', 
  'https://example.com/firstgen', 
  'National', 
  'FirstGen', 
  '{"provider": "sample", "id": "sample_003"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.scholarships WHERE source = 'sample_source' AND source_id = 'sample_003');

-- Show final table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'scholarships' 
AND table_schema = 'public'
ORDER BY ordinal_position;