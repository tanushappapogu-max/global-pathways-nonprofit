-- Create organized section-based tables for website content

-- FAFSA Section Table
CREATE TABLE IF NOT EXISTS public.fafsa_content_2025_10_14_03_00 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name TEXT NOT NULL,
  subsection_name TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section_name, subsection_name)
);

-- Scholarships Section Table
CREATE TABLE IF NOT EXISTS public.scholarships_content_2025_10_14_03_00 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name TEXT NOT NULL,
  subsection_name TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section_name, subsection_name)
);

-- Colleges Section Table
CREATE TABLE IF NOT EXISTS public.colleges_content_2025_10_14_03_00 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name TEXT NOT NULL,
  subsection_name TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section_name, subsection_name)
);

-- Homepage Section Table
CREATE TABLE IF NOT EXISTS public.homepage_content_2025_10_14_03_00 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name TEXT NOT NULL,
  subsection_name TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section_name, subsection_name)
);

-- General Pages Content Table
CREATE TABLE IF NOT EXISTS public.pages_content_2025_10_14_03_00 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name TEXT NOT NULL,
  section_name TEXT NOT NULL,
  subsection_name TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(page_name, section_name, subsection_name)
);

-- Enable RLS for all tables
ALTER TABLE public.fafsa_content_2025_10_14_03_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarships_content_2025_10_14_03_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges_content_2025_10_14_03_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_content_2025_10_14_03_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages_content_2025_10_14_03_00 ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can read FAFSA content" ON public.fafsa_content_2025_10_14_03_00
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read scholarships content" ON public.scholarships_content_2025_10_14_03_00
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read colleges content" ON public.colleges_content_2025_10_14_03_00
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read homepage content" ON public.homepage_content_2025_10_14_03_00
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read pages content" ON public.pages_content_2025_10_14_03_00
  FOR SELECT USING (true);

-- Create policies for authenticated users to update
CREATE POLICY "Authenticated users can update FAFSA content" ON public.fafsa_content_2025_10_14_03_00
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update scholarships content" ON public.scholarships_content_2025_10_14_03_00
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update colleges content" ON public.colleges_content_2025_10_14_03_00
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update homepage content" ON public.homepage_content_2025_10_14_03_00
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update pages content" ON public.pages_content_2025_10_14_03_00
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert FAFSA content sections
INSERT INTO public.fafsa_content_2025_10_14_03_00 (section_name, subsection_name, content, display_order) VALUES
('overview', 'introduction', '{
  "title": "What is FAFSA?",
  "description": "The Free Application for Federal Student Aid (FAFSA) is the key to unlocking federal financial aid for college.",
  "key_points": [
    "Free to complete - never pay for FAFSA help",
    "Required for federal grants, loans, and work-study",
    "Many states and colleges also use FAFSA for their aid programs",
    "Must be completed annually"
  ]
}', 1),

('overview', 'benefits', '{
  "title": "Why Complete the FAFSA?",
  "benefits": [
    {
      "title": "Federal Pell Grants",
      "description": "Up to $7,395 per year that you don''t have to pay back",
      "icon": "gift"
    },
    {
      "title": "Federal Student Loans",
      "description": "Low-interest loans with flexible repayment options",
      "icon": "credit-card"
    },
    {
      "title": "Work-Study Programs",
      "description": "Part-time jobs to help pay for education expenses",
      "icon": "briefcase"
    },
    {
      "title": "State and Institutional Aid",
      "description": "Many schools and states require FAFSA for their aid programs",
      "icon": "school"
    }
  ]
}', 2),

('eligibility', 'basic_requirements', '{
  "title": "Who Can Apply for FAFSA?",
  "requirements": [
    "Be a U.S. citizen or eligible non-citizen",
    "Have a valid Social Security number",
    "Be enrolled or accepted in an eligible degree program",
    "Maintain satisfactory academic progress",
    "Not be in default on federal student loans",
    "Not owe money on federal student grants"
  ]
}', 1),

('eligibility', 'dependency_status', '{
  "title": "Dependent vs. Independent Students",
  "dependent_criteria": [
    "Under 24 years old",
    "Unmarried",
    "Not a graduate student",
    "Not a veteran",
    "Don''t have children or dependents",
    "Not an orphan or ward of the court"
  ],
  "independent_criteria": [
    "24 years old or older",
    "Married",
    "Graduate or professional student",
    "Veteran or active military",
    "Have children or dependents",
    "Orphan, ward of the court, or homeless"
  ]
}', 2),

('how_to_apply', 'step_by_step', '{
  "title": "FAFSA Application Steps",
  "steps": [
    {
      "step": 1,
      "title": "Create FSA ID",
      "description": "Both student and parent need separate FSA IDs",
      "time_required": "10-15 minutes",
      "tips": ["Use a secure password", "Keep login information safe", "Verify email address"]
    },
    {
      "step": 2,
      "title": "Gather Required Documents",
      "description": "Collect tax returns, bank statements, and other financial documents",
      "time_required": "30-60 minutes",
      "tips": ["Use IRS Data Retrieval Tool when possible", "Have both student and parent documents ready"]
    },
    {
      "step": 3,
      "title": "Complete the FAFSA Form",
      "description": "Fill out all required sections accurately",
      "time_required": "45-90 minutes",
      "tips": ["Save your progress frequently", "Double-check all information", "List schools in order of preference"]
    },
    {
      "step": 4,
      "title": "Review and Submit",
      "description": "Check all information before submitting",
      "time_required": "10-15 minutes",
      "tips": ["Print confirmation page", "Note your confirmation number", "Check email for Student Aid Report"]
    }
  ]
}', 1),

('how_to_apply', 'required_documents', '{
  "title": "Documents You''ll Need",
  "student_documents": [
    "Social Security card",
    "Driver''s license or state ID",
    "Tax returns or tax transcripts",
    "Bank statements",
    "Investment records",
    "Records of untaxed income"
  ],
  "parent_documents": [
    "Social Security cards",
    "Tax returns or tax transcripts",
    "Bank statements",
    "Investment records",
    "Business records (if applicable)",
    "Records of untaxed income"
  ]
}', 2),

('deadlines', 'federal_deadlines', '{
  "title": "Important FAFSA Deadlines",
  "federal_deadline": "June 30, 2024 (for 2023-24 school year)",
  "priority_deadline": "Submit as early as possible after October 1",
  "note": "Earlier submission increases chances of receiving aid"
}', 1),

('deadlines', 'state_deadlines', '{
  "title": "State Priority Deadlines",
  "states": [
    {"state": "California", "deadline": "March 2, 2024"},
    {"state": "Illinois", "deadline": "As soon as possible after October 1"},
    {"state": "Texas", "deadline": "No state deadline"},
    {"state": "New York", "deadline": "May 1, 2024"},
    {"state": "Florida", "deadline": "May 15, 2024"}
  ],
  "note": "Check your state''s specific deadline as they vary"
}', 2);

-- Insert Scholarships content sections
INSERT INTO public.scholarships_content_2025_10_14_03_00 (section_name, subsection_name, content, display_order) VALUES
('overview', 'introduction', '{
  "title": "Scholarship Opportunities",
  "description": "Discover thousands of scholarships to help fund your education",
  "total_available": 10000,
  "total_value": "$2.5 billion",
  "categories": ["Academic Merit", "Need-Based", "Athletic", "Creative Arts", "Community Service", "Field of Study"]
}', 1),

('search_tips', 'effective_searching', '{
  "title": "How to Find Scholarships",
  "tips": [
    "Start early - begin searching in your junior year",
    "Cast a wide net - apply to many scholarships",
    "Look locally - check community organizations",
    "Use multiple search engines and databases",
    "Check with your school counselor",
    "Look at college-specific scholarships"
  ]
}', 1),

('application_tips', 'writing_essays', '{
  "title": "Writing Winning Scholarship Essays",
  "guidelines": [
    "Read the prompt carefully and answer exactly what''s asked",
    "Tell your unique story - what makes you different",
    "Show, don''t tell - use specific examples",
    "Proofread multiple times for errors",
    "Have others review your essay",
    "Stay within word limits"
  ]
}', 1),

('types', 'merit_based', '{
  "title": "Merit-Based Scholarships",
  "description": "Awarded based on academic, athletic, or artistic achievement",
  "examples": [
    "National Merit Scholarships",
    "Academic Excellence Awards",
    "Athletic Scholarships",
    "Music and Arts Scholarships"
  ]
}', 1),

('types', 'need_based', '{
  "title": "Need-Based Scholarships",
  "description": "Awarded based on financial need",
  "examples": [
    "Federal Pell Grants",
    "State Need-Based Grants",
    "Institutional Need-Based Aid",
    "Private Foundation Scholarships"
  ]
}', 2);

-- Insert Colleges content sections
INSERT INTO public.colleges_content_2025_10_14_03_00 (section_name, subsection_name, content, display_order) VALUES
('search_filters', 'location', '{
  "title": "Find Colleges by Location",
  "options": ["State", "Region", "Urban/Rural", "Climate", "Distance from Home"],
  "tips": ["Consider in-state vs out-of-state tuition", "Think about travel costs", "Consider cultural fit"]
}', 1),

('search_filters', 'academics', '{
  "title": "Academic Criteria",
  "factors": [
    "Majors and Programs Offered",
    "Class Size and Student-to-Faculty Ratio",
    "Research Opportunities",
    "Study Abroad Programs",
    "Honors Programs",
    "Graduate School Placement Rates"
  ]
}', 2),

('costs', 'understanding_costs', '{
  "title": "College Cost Breakdown",
  "components": [
    {"item": "Tuition and Fees", "description": "Cost of classes and mandatory fees"},
    {"item": "Room and Board", "description": "Housing and meal plan costs"},
    {"item": "Books and Supplies", "description": "Textbooks and course materials"},
    {"item": "Personal Expenses", "description": "Clothing, entertainment, miscellaneous"},
    {"item": "Transportation", "description": "Travel to/from home and local transportation"}
  ]
}', 1),

('application_process', 'timeline', '{
  "title": "College Application Timeline",
  "junior_year": [
    "Take PSAT/SAT/ACT",
    "Research colleges",
    "Visit campuses",
    "Meet with counselor"
  ],
  "senior_year": [
    "Finalize college list",
    "Complete applications",
    "Apply for financial aid",
    "Make final decision"
  ]
}', 1);

-- Insert Homepage content sections
INSERT INTO public.homepage_content_2025_10_14_03_00 (section_name, subsection_name, content, display_order) VALUES
('hero', 'main_content', '{
  "title": "Your Path to U.S. Higher Education",
  "subtitle": "Comprehensive guidance for international and underprivileged students with AI-powered scholarship matching and real-time updates.",
  "primary_button": {
    "text": "Try AI Scholarship Finder",
    "link": "/auto-scholarships"
  },
  "secondary_button": {
    "text": "Browse Scholarships",
    "link": "/scholarships"
  }
}', 1),

('stats', 'numbers', '{
  "stats": [
    {"number": 10000, "label": "Scholarships Available", "suffix": "+", "color": "text-blue-600"},
    {"number": 50, "label": "Partner Universities", "suffix": "+", "color": "text-green-600"},
    {"number": 95, "label": "Success Rate", "suffix": "%", "color": "text-purple-600"},
    {"number": 24, "label": "AI Support", "suffix": "/7", "color": "text-orange-600"}
  ]
}', 1),

('features', 'main_features', '{
  "title": "Powerful Tools for Your Success",
  "subtitle": "Everything you need to navigate the complex world of U.S. college admissions",
  "features": [
    {
      "title": "AI Scholarship Finder",
      "description": "Get personalized scholarship recommendations using advanced AI matching algorithms.",
      "icon": "Search",
      "color": "from-blue-500 to-blue-600",
      "link": "/auto-scholarships"
    },
    {
      "title": "Cost Calculator",
      "description": "Calculate your total education costs with our comprehensive financial planning tool.",
      "icon": "Calculator",
      "color": "from-green-500 to-green-600",
      "link": "/cost-calculator"
    },
    {
      "title": "College Database",
      "description": "Explore thousands of colleges with detailed information and comparison tools.",
      "icon": "GraduationCap",
      "color": "from-purple-500 to-purple-600",
      "link": "/colleges"
    }
  ]
}', 1);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fafsa_content_section ON public.fafsa_content_2025_10_14_03_00(section_name, subsection_name);
CREATE INDEX IF NOT EXISTS idx_scholarships_content_section ON public.scholarships_content_2025_10_14_03_00(section_name, subsection_name);
CREATE INDEX IF NOT EXISTS idx_colleges_content_section ON public.colleges_content_2025_10_14_03_00(section_name, subsection_name);
CREATE INDEX IF NOT EXISTS idx_homepage_content_section ON public.homepage_content_2025_10_14_03_00(section_name, subsection_name);
CREATE INDEX IF NOT EXISTS idx_pages_content_section ON public.pages_content_2025_10_14_03_00(page_name, section_name, subsection_name);