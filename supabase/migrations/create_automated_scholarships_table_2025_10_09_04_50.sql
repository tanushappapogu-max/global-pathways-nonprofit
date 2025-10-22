-- Create automated scholarships table for ingestion pipeline
CREATE TABLE IF NOT EXISTS public.scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,         -- source id or provider name
  source_id TEXT,               -- provider's unique id (if available)
  name TEXT NOT NULL,
  amount TEXT,
  eligibility TEXT,
  deadline DATE,
  link TEXT,
  region TEXT,
  category TEXT,
  raw_json JSONB,               -- raw provider payload for audit
  last_checked TIMESTAMPTZ DEFAULT NOW(),
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  expired BOOLEAN DEFAULT FALSE,
  link_broken BOOLEAN DEFAULT FALSE,
  needs_review BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_scholarships_deadline ON public.scholarships(deadline);
CREATE INDEX IF NOT EXISTS idx_scholarships_source ON public.scholarships(source);
CREATE INDEX IF NOT EXISTS idx_scholarships_category ON public.scholarships(category);
CREATE INDEX IF NOT EXISTS idx_scholarships_region ON public.scholarships(region);
CREATE INDEX IF NOT EXISTS idx_scholarships_expired ON public.scholarships(expired);
CREATE INDEX IF NOT EXISTS idx_scholarships_needs_review ON public.scholarships(needs_review);

-- Enable RLS
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view active scholarships" ON public.scholarships
  FOR SELECT USING (NOT expired AND NOT needs_review);

CREATE POLICY "Service role can manage all scholarships" ON public.scholarships
  FOR ALL USING (auth.role() = 'service_role');

-- Create reports table for user feedback and ingestion errors
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scholarship_id UUID REFERENCES public.scholarships(id),
  issue TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ingestion reports table for monitoring
CREATE TABLE IF NOT EXISTS public.ingest_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  status TEXT NOT NULL, -- 'success', 'error', 'warning'
  message TEXT,
  items_processed INTEGER DEFAULT 0,
  items_added INTEGER DEFAULT 0,
  items_updated INTEGER DEFAULT 0,
  items_flagged INTEGER DEFAULT 0,
  error TEXT,
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for reports tables
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingest_reports ENABLE ROW LEVEL SECURITY;

-- Policies for reports
CREATE POLICY "Anyone can insert reports" ON public.reports
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can view all reports" ON public.reports
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage ingest reports" ON public.ingest_reports
  FOR ALL USING (auth.role() = 'service_role');

-- Insert some sample data to test the system
INSERT INTO public.scholarships (
  source, source_id, name, amount, eligibility, deadline, link, region, category, raw_json
) VALUES
('sample_source', 'sample_001', 'Merit Excellence Scholarship', '$5,000', 'GPA 3.5+, US Citizens', '2025-03-15', 'https://example.com/apply', 'National', 'Merit', '{"provider": "sample", "id": "sample_001"}'),
('sample_source', 'sample_002', 'STEM Innovation Award', '$10,000', 'STEM majors, All students', '2025-04-30', 'https://example.com/stem', 'National', 'STEM', '{"provider": "sample", "id": "sample_002"}'),
('sample_source', 'sample_003', 'First Generation College Grant', '$3,000', 'First-generation college students', '2025-02-28', 'https://example.com/firstgen', 'National', 'FirstGen', '{"provider": "sample", "id": "sample_003"}');