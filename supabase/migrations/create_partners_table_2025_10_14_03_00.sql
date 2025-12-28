-- Create updated partners table
CREATE TABLE IF NOT EXISTS public.partners_2025_10_14_03_00 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_name TEXT NOT NULL,
  partner_type TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  contact_email TEXT,
  location TEXT,
  partnership_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.partners_2025_10_14_03_00 ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read active partners" ON public.partners_2025_10_14_03_00
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can manage partners" ON public.partners_2025_10_14_03_00
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert sample partners data
INSERT INTO public.partners_2025_10_14_03_00 (partner_name, partner_type, description, website_url, contact_email, location, display_order) VALUES
-- Universities
('Harvard University', 'university', 'Prestigious Ivy League institution offering need-blind admissions and generous financial aid.', 'https://harvard.edu', 'admissions@harvard.edu', 'Cambridge, MA', 1),
('Stanford University', 'university', 'Leading research university with comprehensive financial aid programs.', 'https://stanford.edu', 'admission@stanford.edu', 'Stanford, CA', 2),
('MIT', 'university', 'World-renowned technology institute with need-blind admissions.', 'https://mit.edu', 'admissions@mit.edu', 'Cambridge, MA', 3),
('University of California System', 'university', 'Public university system serving diverse student populations.', 'https://universityofcalifornia.edu', 'info@ucop.edu', 'Oakland, CA', 4),

-- High Schools
('Lincoln High School', 'high_school', 'Urban public high school serving first-generation college students.', 'https://lincolnhs.edu', 'counseling@lincolnhs.edu', 'Los Angeles, CA', 5),
('Roosevelt Academy', 'high_school', 'Charter school focused on college preparation for underserved communities.', 'https://rooseveltacademy.org', 'info@rooseveltacademy.org', 'Chicago, IL', 6),
('International Prep School', 'high_school', 'Specialized school supporting international and immigrant students.', 'https://intlprep.edu', 'support@intlprep.edu', 'New York, NY', 7),

-- Nonprofits
('College Possible', 'nonprofit', 'National nonprofit making college admission and success possible for low-income students.', 'https://collegepossible.org', 'info@collegepossible.org', 'Minneapolis, MN', 8),
('United Way Education', 'nonprofit', 'Community-based organization supporting educational initiatives.', 'https://unitedway.org', 'education@unitedway.org', 'Alexandria, VA', 9),
('Boys & Girls Clubs', 'nonprofit', 'Youth development organization providing college readiness programs.', 'https://bgca.org', 'info@bgca.org', 'Atlanta, GA', 10),

-- Libraries
('New York Public Library', 'library', 'Public library system offering college planning workshops and resources.', 'https://nypl.org', 'education@nypl.org', 'New York, NY', 11),
('Chicago Public Library', 'library', 'Community library providing free college preparation resources.', 'https://chipublib.org', 'programs@chipublib.org', 'Chicago, IL', 12),

-- Community Centers
('Mission Community Center', 'community_center', 'Local community center serving Hispanic/Latino families.', 'https://missioncc.org', 'programs@missioncc.org', 'San Francisco, CA', 13),
('Eastside Community Center', 'community_center', 'Neighborhood center providing educational support services.', 'https://eastsidecc.org', 'info@eastsidecc.org', 'Detroit, MI', 14),

-- Scholarship Organizations
('Gates Millennium Scholars', 'scholarship_org', 'Program providing scholarships to outstanding minority students.', 'https://gmsp.org', 'info@gmsp.org', 'Washington, DC', 15),
('Hispanic Scholarship Fund', 'scholarship_org', 'Largest provider of scholarships to Hispanic students in the US.', 'https://hsf.net', 'info@hsf.net', 'Gardena, CA', 16);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_partners_type ON public.partners_2025_10_14_03_00(partner_type);
CREATE INDEX IF NOT EXISTS idx_partners_active ON public.partners_2025_10_14_03_00(is_active);
CREATE INDEX IF NOT EXISTS idx_partners_order ON public.partners_2025_10_14_03_00(display_order);