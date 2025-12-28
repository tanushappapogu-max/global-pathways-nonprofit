-- Create comprehensive detailed website control tables

-- Website Global Settings (Logo, Colors, Fonts, etc.)
CREATE TABLE IF NOT EXISTS public.website_global_settings_2025_10_14_03_00 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_category TEXT NOT NULL,
  setting_name TEXT NOT NULL,
  setting_value JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(setting_category, setting_name)
);

-- Dynamic Blog Articles Table
CREATE TABLE IF NOT EXISTS public.blog_articles_2025_10_14_03_00 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author_name TEXT,
  author_bio TEXT,
  author_image TEXT,
  featured_image TEXT,
  category TEXT,
  tags TEXT[],
  meta_title TEXT,
  meta_description TEXT,
  reading_time INTEGER,
  is_published BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About Us Page Content
CREATE TABLE IF NOT EXISTS public.about_us_content_2025_10_14_03_00 (
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

-- Team Members Table
CREATE TABLE IF NOT EXISTS public.team_members_2025_10_14_03_00 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  email TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Navigation Menu Items
CREATE TABLE IF NOT EXISTS public.navigation_items_2025_10_14_03_00 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  path TEXT NOT NULL,
  icon TEXT,
  parent_id UUID REFERENCES public.navigation_items_2025_10_14_03_00(id),
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  requires_auth BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Footer Content
CREATE TABLE IF NOT EXISTS public.footer_content_2025_10_14_03_00 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section_name)
);

-- Enable RLS for all tables
ALTER TABLE public.website_global_settings_2025_10_14_03_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_articles_2025_10_14_03_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_us_content_2025_10_14_03_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members_2025_10_14_03_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items_2025_10_14_03_00 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.footer_content_2025_10_14_03_00 ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can read global settings" ON public.website_global_settings_2025_10_14_03_00
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read published blog articles" ON public.blog_articles_2025_10_14_03_00
  FOR SELECT USING (is_published = true);

CREATE POLICY "Anyone can read about us content" ON public.about_us_content_2025_10_14_03_00
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read active team members" ON public.team_members_2025_10_14_03_00
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can read active navigation items" ON public.navigation_items_2025_10_14_03_00
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can read footer content" ON public.footer_content_2025_10_14_03_00
  FOR SELECT USING (true);

-- Create policies for authenticated users to update
CREATE POLICY "Authenticated users can manage global settings" ON public.website_global_settings_2025_10_14_03_00
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage blog articles" ON public.blog_articles_2025_10_14_03_00
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage about us content" ON public.about_us_content_2025_10_14_03_00
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage team members" ON public.team_members_2025_10_14_03_00
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage navigation items" ON public.navigation_items_2025_10_14_03_00
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage footer content" ON public.footer_content_2025_10_14_03_00
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert Global Settings (Logo, Colors, Fonts, etc.)
INSERT INTO public.website_global_settings_2025_10_14_03_00 (setting_category, setting_name, setting_value, description) VALUES
('branding', 'logo', '{
  "text": "Global Pathways",
  "subtitle": "Your Path to Success",
  "icon": "GraduationCap",
  "icon_color": "#3b82f6",
  "text_color": "#1f2937",
  "subtitle_color": "#6b7280",
  "show_icon": true,
  "show_subtitle": true,
  "size": "large"
}', 'Main website logo and branding'),

('colors', 'primary_palette', '{
  "primary": "#3b82f6",
  "primary_hover": "#2563eb",
  "secondary": "#8b5cf6",
  "secondary_hover": "#7c3aed",
  "accent": "#06b6d4",
  "accent_hover": "#0891b2",
  "success": "#10b981",
  "warning": "#f59e0b",
  "error": "#ef4444",
  "info": "#3b82f6"
}', 'Primary color palette for the website'),

('colors', 'background_gradients', '{
  "hero_gradient": "from-blue-50 via-white to-purple-50",
  "section_gradient": "from-gray-50 to-blue-50",
  "card_gradient": "from-white to-gray-50",
  "button_gradient": "from-blue-600 to-purple-600"
}', 'Background gradients used throughout the site'),

('typography', 'fonts', '{
  "heading_font": "Inter",
  "body_font": "Inter",
  "mono_font": "JetBrains Mono",
  "heading_sizes": {
    "h1": "text-4xl md:text-6xl",
    "h2": "text-3xl md:text-4xl",
    "h3": "text-2xl md:text-3xl",
    "h4": "text-xl md:text-2xl"
  }
}', 'Typography settings for the website'),

('layout', 'spacing', '{
  "container_max_width": "max-w-7xl",
  "section_padding": "py-16",
  "card_padding": "p-6",
  "button_padding": "px-6 py-3"
}', 'Layout and spacing configurations'),

('animations', 'settings', '{
  "enable_animations": true,
  "animation_duration": "300ms",
  "hover_scale": "1.05",
  "transition_timing": "cubic-bezier(0.4, 0, 0.2, 1)"
}', 'Animation settings for ReactBits and interactions');

-- Insert Navigation Items
INSERT INTO public.navigation_items_2025_10_14_03_00 (label, path, icon, display_order, requires_auth) VALUES
('Home', '/', '🏠', 1, false),
('FAFSA', '/fafsa', '📋', 2, false),
('Scholarships', '/scholarships', '🔍', 3, false),
('AI Finder', '/auto-scholarships', '🤖', 4, false),
('Calculator', '/cost-calculator', '💰', 5, false),
('Colleges', '/colleges', '🏫', 6, false),
('Compare', '/college-comparison', '⚖️', 7, false),
('Dashboard', '/dashboard', '📊', 8, true),
('Timeline', '/timeline', '📅', 9, true),
('Blog', '/blog', '📝', 10, false),
('Stories', '/success-stories', '🌟', 11, false),
('Counselors', '/counselor-portal', '👨‍🏫', 12, false),
('Partners', '/partners', '🤝', 13, false),
('About', '/about', 'ℹ️', 14, false);

-- Insert About Us Content
INSERT INTO public.about_us_content_2025_10_14_03_00 (section_name, subsection_name, content, display_order) VALUES
('hero', 'main_content', '{
  "title": "About Global Pathways",
  "subtitle": "Empowering Students Worldwide to Achieve Their U.S. Higher Education Dreams",
  "description": "We are dedicated to breaking down barriers and creating opportunities for international and underprivileged students to access quality higher education in the United States.",
  "background_image": "/images/about-hero-bg.jpg",
  "cta_button": {
    "text": "Join Our Mission",
    "link": "/signup"
  }
}', 1),

('mission', 'our_mission', '{
  "title": "Our Mission",
  "content": "To democratize access to U.S. higher education by providing comprehensive guidance, AI-powered tools, and personalized support to students who need it most. We believe that every student, regardless of their background or financial situation, deserves the opportunity to pursue their educational dreams.",
  "icon": "target",
  "highlight_color": "text-blue-600"
}', 1),

('vision', 'our_vision', '{
  "title": "Our Vision",
  "content": "A world where geographic location, economic status, or social background never limits a student''s ability to access world-class education. We envision a future where our platform serves as the bridge connecting talented students globally with the opportunities they deserve.",
  "icon": "eye",
  "highlight_color": "text-purple-600"
}', 2),

('values', 'core_values', '{
  "title": "Our Core Values",
  "values": [
    {
      "title": "Accessibility",
      "description": "Making higher education guidance available to everyone, everywhere.",
      "icon": "universal-access"
    },
    {
      "title": "Innovation",
      "description": "Leveraging cutting-edge AI technology to personalize the student experience.",
      "icon": "lightbulb"
    },
    {
      "title": "Integrity",
      "description": "Providing honest, transparent, and reliable information and guidance.",
      "icon": "shield-check"
    },
    {
      "title": "Empowerment",
      "description": "Giving students the tools and knowledge to take control of their educational journey.",
      "icon": "trending-up"
    }
  ]
}', 3),

('story', 'our_story', '{
  "title": "Our Story",
  "content": "Global Pathways was founded in 2023 by a team of educators, technologists, and former international students who experienced firsthand the challenges of navigating the U.S. higher education system. Frustrated by the lack of accessible, comprehensive resources, we set out to create a platform that would level the playing field for all students.\n\nWhat started as a simple scholarship database has evolved into a comprehensive ecosystem of tools, resources, and support systems. Today, we serve thousands of students worldwide, helping them discover opportunities, understand complex processes, and achieve their educational goals.\n\nOur AI-powered scholarship matching system has helped students secure over $50 million in financial aid, while our step-by-step guides have simplified the FAFSA process for countless families.",
  "timeline": [
    {
      "year": "2023",
      "milestone": "Global Pathways Founded",
      "description": "Started with a vision to democratize college access"
    },
    {
      "year": "2023",
      "milestone": "First 1,000 Students Served",
      "description": "Reached our first major milestone in student support"
    },
    {
      "year": "2024",
      "milestone": "AI Scholarship Finder Launched",
      "description": "Introduced revolutionary AI-powered matching technology"
    },
    {
      "year": "2024",
      "milestone": "$50M+ in Aid Secured",
      "description": "Our students have secured over $50 million in financial aid"
    }
  ]
}', 4),

('impact', 'our_impact', '{
  "title": "Our Impact",
  "stats": [
    {
      "number": 25000,
      "label": "Students Helped",
      "suffix": "+",
      "description": "Students who have used our platform to advance their education"
    },
    {
      "number": 50,
      "label": "Million in Aid",
      "prefix": "$",
      "suffix": "M+",
      "description": "Total financial aid secured by our students"
    },
    {
      "number": 150,
      "label": "Countries Served",
      "suffix": "+",
      "description": "Countries where our students come from"
    },
    {
      "number": 95,
      "label": "Success Rate",
      "suffix": "%",
      "description": "Of students who follow our guidance get accepted"
    }
  ]
}', 5);

-- Insert Team Members
INSERT INTO public.team_members_2025_10_14_03_00 (name, position, bio, image_url, email, linkedin_url, display_order) VALUES
('Sarah Johnson', 'CEO & Co-Founder', 'Former international student from Kenya, Sarah holds an MBA from Harvard Business School. She is passionate about breaking down barriers to education and has helped over 10,000 students navigate the U.S. college system.', '/images/team/sarah-johnson.jpg', 'sarah@globalpathways.edu', 'https://linkedin.com/in/sarahjohnson', 1),

('Dr. Michael Chen', 'CTO & Co-Founder', 'Former Google engineer with a PhD in Computer Science from MIT. Michael leads our AI development team and has created the algorithms that power our scholarship matching system.', '/images/team/michael-chen.jpg', 'michael@globalpathways.edu', 'https://linkedin.com/in/michaelchen', 2),

('Maria Rodriguez', 'Head of Student Success', 'Former college counselor with 15 years of experience. Maria oversees our student support programs and has personally guided thousands of students through the college application process.', '/images/team/maria-rodriguez.jpg', 'maria@globalpathways.edu', 'https://linkedin.com/in/mariarodriguez', 3),

('James Thompson', 'Director of Partnerships', 'Former admissions officer at several top universities. James manages our relationships with colleges and scholarship providers, ensuring our students have access to the best opportunities.', '/images/team/james-thompson.jpg', 'james@globalpathways.edu', 'https://linkedin.com/in/jamesthompson', 4);

-- Insert Blog Articles
INSERT INTO public.blog_articles_2025_10_14_03_00 (slug, title, excerpt, content, author_name, author_bio, category, tags, is_published, is_featured, published_at) VALUES
('complete-fafsa-guide-2024', 'Complete FAFSA Guide for 2024: Everything You Need to Know', 'A comprehensive step-by-step guide to completing your FAFSA application successfully and maximizing your financial aid.', 
'# Complete FAFSA Guide for 2024: Everything You Need to Know

The Free Application for Federal Student Aid (FAFSA) is your gateway to federal financial aid for college. This comprehensive guide will walk you through every step of the process, ensuring you maximize your aid opportunities.

## What is FAFSA?

The FAFSA is a form that determines your eligibility for federal student aid, including grants, loans, and work-study programs. Many states and colleges also use FAFSA information to award their own aid.

## Key Benefits of Filing FAFSA

- **Federal Pell Grants**: Up to $7,395 per year that you don''t have to repay
- **Federal Student Loans**: Low-interest loans with flexible repayment options
- **Work-Study Programs**: Part-time employment opportunities
- **State and Institutional Aid**: Many require FAFSA for consideration

## Step-by-Step FAFSA Process

### Step 1: Create Your FSA ID
Both students and parents need separate FSA IDs to sign the FAFSA electronically.

### Step 2: Gather Required Documents
- Social Security cards
- Tax returns or tax transcripts
- Bank statements
- Investment records
- Records of untaxed income

### Step 3: Complete the FAFSA Form
Fill out all required sections accurately and completely.

### Step 4: Review and Submit
Double-check all information before submitting.

## Important Deadlines

- **Federal Deadline**: June 30, 2024
- **Priority Deadline**: Submit as early as possible after October 1
- **State Deadlines**: Vary by state - check your specific requirements

## Common Mistakes to Avoid

1. Missing deadlines
2. Providing incorrect information
3. Not using the IRS Data Retrieval Tool
4. Forgetting to sign the form
5. Not listing schools in order of preference

## Tips for Success

- Start early and don''t wait until tax returns are filed
- Use the IRS Data Retrieval Tool when possible
- Keep copies of all documents
- Follow up on your Student Aid Report (SAR)
- Contact schools directly with questions

## Conclusion

Filing the FAFSA is one of the most important steps in making college affordable. By following this guide and starting early, you''ll be well on your way to securing the financial aid you need for your education.

Remember, the FAFSA is free to complete - never pay anyone to help you file it. If you need assistance, contact your school counselor or the Federal Student Aid Information Center.',
'Sarah Johnson', 'CEO & Co-Founder of Global Pathways, former international student advocate', 'Financial Aid', ARRAY['FAFSA', 'Financial Aid', 'College Planning'], true, true, NOW()),

('top-scholarships-international-students', 'Top 10 Scholarships for International Students in 2024', 'Discover the best scholarship opportunities available for international students pursuing higher education in the United States.', 
'# Top 10 Scholarships for International Students in 2024

As an international student, finding funding for your U.S. education can be challenging. Here are the top 10 scholarships specifically available for international students.

## 1. Fulbright Foreign Student Program
- **Award Amount**: Full funding including tuition, living expenses, and travel
- **Eligibility**: Graduate students from participating countries
- **Deadline**: Varies by country
- **Application**: Through your home country''s Fulbright office

## 2. Hubert Humphrey Fellowship Program
- **Award Amount**: Full funding for one academic year
- **Eligibility**: Mid-career professionals from designated countries
- **Focus**: Leadership development and professional exchange

## 3. AAUW International Fellowships
- **Award Amount**: $18,000 - $30,000
- **Eligibility**: Women pursuing graduate or postgraduate studies
- **Deadline**: December 1

## 4. Joint Japan/World Bank Graduate Scholarship Program
- **Award Amount**: Full tuition, living allowance, travel expenses
- **Eligibility**: Students from World Bank member countries
- **Focus**: Development-related fields

## 5. Rotary Peace Fellowships
- **Award Amount**: Full funding for master''s or certificate programs
- **Eligibility**: Professionals with experience in peace and conflict resolution
- **Duration**: 15-24 months

## 6. Inlaks Scholarships
- **Award Amount**: Up to $100,000
- **Eligibility**: Indian citizens under 30
- **Focus**: Various fields at top U.S. universities

## 7. Aga Khan Foundation International Scholarship Programme
- **Award Amount**: 50% grant, 50% loan
- **Eligibility**: Students from select developing countries
- **Focus**: Postgraduate studies

## 8. Mastercard Foundation Scholars Program
- **Award Amount**: Full funding including living expenses
- **Eligibility**: African students with leadership potential
- **Partner Universities**: Various top U.S. institutions

## 9. Knight-Hennessy Scholars at Stanford
- **Award Amount**: Full funding for up to three years
- **Eligibility**: Graduate students in any field
- **Focus**: Leadership development

## 10. Yale World Fellows Program
- **Award Amount**: Full funding for one semester
- **Eligibility**: Mid-career professionals with leadership potential
- **Focus**: Leadership and global affairs

## Application Tips

1. **Start Early**: Many applications are due 6-12 months in advance
2. **Tailor Your Application**: Customize each application to the specific scholarship
3. **Strong Essays**: Tell your unique story and demonstrate impact
4. **Letters of Recommendation**: Choose recommenders who know you well
5. **Follow Instructions**: Pay attention to all requirements and deadlines

## Conclusion

These scholarships represent some of the best opportunities for international students. Remember that competition is fierce, so apply to multiple scholarships and start your applications early.

For more scholarship opportunities and personalized matching, use our AI Scholarship Finder tool.',
'Maria Rodriguez', 'Head of Student Success, former college counselor with 15 years of experience', 'Scholarships', ARRAY['International Students', 'Scholarships', 'Funding'], true, true, NOW() - INTERVAL '2 days'),

('college-application-timeline', 'The Ultimate College Application Timeline: Junior and Senior Year', 'A month-by-month breakdown of everything you need to do during junior and senior year to ensure a successful college application process.', 
'# The Ultimate College Application Timeline: Junior and Senior Year

Planning your college application process can feel overwhelming. This comprehensive timeline breaks down exactly what you need to do and when, ensuring you don''t miss any critical deadlines.

## Junior Year Timeline

### Fall Semester (September - December)

**September**
- Meet with your school counselor
- Begin researching colleges and universities
- Start building your extracurricular profile
- Consider taking the PSAT

**October**
- Take the PSAT (National Merit Scholarship Qualifying Test)
- Attend college fairs and information sessions
- Begin visiting colleges if possible

**November**
- Continue college research
- Start building relationships with teachers for future recommendation letters
- Focus on maintaining strong grades

**December**
- Reflect on your interests and potential majors
- Begin creating a preliminary college list
- Consider standardized test prep

### Spring Semester (January - May)

**January**
- Register for spring standardized tests (SAT/ACT)
- Continue college visits
- Research summer programs and opportunities

**February**
- Receive PSAT scores and National Merit information
- Begin serious standardized test preparation
- Attend local college information sessions

**March**
- Take SAT or ACT (first attempt)
- Continue college visits during spring break
- Research scholarship opportunities

**April**
- Analyze standardized test scores
- Plan summer activities (jobs, internships, volunteer work)
- Begin narrowing down college list

**May**
- Take AP exams
- Plan college visits for summer
- Consider retaking standardized tests if needed

## Senior Year Timeline

### Fall Semester (September - December)

**August**
- Finalize college list (reach, match, safety schools)
- Request transcripts and recommendation letters
- Begin working on college essays

**September**
- Submit early applications if applying early decision/action
- Continue working on regular decision applications
- Retake standardized tests if necessary

**October**
- Complete FAFSA (available October 1)
- Submit early decision/action applications
- Continue working on regular decision applications

**November**
- Submit remaining applications
- Apply for scholarships
- Complete CSS Profile if required

**December**
- Receive early decision/action results
- Submit any remaining applications
- Continue scholarship applications

### Spring Semester (January - May)

**January**
- Submit any final applications
- Continue scholarship search and applications
- Maintain strong grades (avoid senioritis!)

**February**
- Complete any missing financial aid documents
- Continue scholarship applications
- Prepare for potential college interviews

**March**
- Receive regular decision results
- Compare financial aid offers
- Visit admitted student days

**April**
- Make final college decision
- Submit enrollment deposit by May 1
- Notify other schools of your decision

**May**
- Take AP exams
- Send final transcripts to chosen college
- Prepare for graduation and transition

## Key Tips for Success

1. **Stay Organized**: Use a calendar or planner to track deadlines
2. **Start Early**: Don''t wait until the last minute
3. **Keep Copies**: Save copies of all applications and documents
4. **Follow Up**: Ensure all materials are received
5. **Ask for Help**: Don''t hesitate to reach out to counselors and teachers

## Conclusion

Following this timeline will help ensure you don''t miss any important deadlines or opportunities. Remember, the college application process is a marathon, not a sprint. Stay organized, start early, and don''t be afraid to ask for help along the way.',
'James Thompson', 'Director of Partnerships, former admissions officer at top universities', 'College Planning', ARRAY['College Applications', 'Timeline', 'Planning'], true, false, NOW() - INTERVAL '5 days');

-- Insert Footer Content
INSERT INTO public.footer_content_2025_10_14_03_00 (section_name, content, display_order) VALUES
('company_info', '{
  "name": "Global Pathways",
  "description": "Empowering students worldwide to achieve their U.S. higher education dreams through comprehensive guidance and AI-powered tools.",
  "logo": {
    "text": "Global Pathways",
    "icon": "GraduationCap"
  }
}', 1),

('contact_info', '{
  "email": "support@globalpathways.edu",
  "phone": "+1 (555) 123-4567",
  "address": "123 Education Street, Learning City, LC 12345",
  "office_hours": "Monday - Friday: 9:00 AM - 6:00 PM EST"
}', 2),

('quick_links', '{
  "links": [
    {"label": "About Us", "path": "/about"},
    {"label": "Contact", "path": "/contact"},
    {"label": "Privacy Policy", "path": "/privacy-policy"},
    {"label": "Terms of Service", "path": "/terms"},
    {"label": "Help Center", "path": "/help"}
  ]
}', 3),

('social_links', '{
  "links": [
    {"platform": "Twitter", "url": "https://twitter.com/globalpathways", "icon": "twitter"},
    {"platform": "Facebook", "url": "https://facebook.com/globalpathways", "icon": "facebook"},
    {"platform": "LinkedIn", "url": "https://linkedin.com/company/globalpathways", "icon": "linkedin"},
    {"platform": "Instagram", "url": "https://instagram.com/globalpathways", "icon": "instagram"}
  ]
}', 4),

('newsletter', '{
  "title": "Stay Updated",
  "description": "Get the latest scholarship opportunities and college guidance tips delivered to your inbox.",
  "placeholder": "Enter your email address",
  "button_text": "Subscribe"
}', 5);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_global_settings_category ON public.website_global_settings_2025_10_14_03_00(setting_category, setting_name);
CREATE INDEX IF NOT EXISTS idx_blog_articles_slug ON public.blog_articles_2025_10_14_03_00(slug);
CREATE INDEX IF NOT EXISTS idx_blog_articles_published ON public.blog_articles_2025_10_14_03_00(is_published, published_at);
CREATE INDEX IF NOT EXISTS idx_about_content_section ON public.about_us_content_2025_10_14_03_00(section_name, subsection_name);
CREATE INDEX IF NOT EXISTS idx_team_members_order ON public.team_members_2025_10_14_03_00(display_order);
CREATE INDEX IF NOT EXISTS idx_navigation_items_order ON public.navigation_items_2025_10_14_03_00(display_order);
CREATE INDEX IF NOT EXISTS idx_footer_content_order ON public.footer_content_2025_10_14_03_00(display_order);