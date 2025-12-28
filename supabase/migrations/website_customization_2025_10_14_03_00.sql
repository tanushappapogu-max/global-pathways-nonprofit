-- Create comprehensive website customization table
CREATE TABLE IF NOT EXISTS public.website_customization_2025_10_14_03_00 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_name TEXT NOT NULL UNIQUE,
  content JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.website_customization_2025_10_14_03_00 ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can read website customization" ON public.website_customization_2025_10_14_03_00
  FOR SELECT USING (true);

-- Create policy for authenticated users to update (admin functionality)
CREATE POLICY "Authenticated users can update customization" ON public.website_customization_2025_10_14_03_00
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert default website content that can be customized
INSERT INTO public.website_customization_2025_10_14_03_00 (section_name, content) VALUES
('hero_section', '{
  "title": "Your Path to U.S. Higher Education",
  "subtitle": "Comprehensive guidance for international and underprivileged students with AI-powered scholarship matching and real-time updates.",
  "primary_button_text": "Try AI Scholarship Finder",
  "secondary_button_text": "Browse Scholarships",
  "background_color": "from-blue-50 via-white to-purple-50"
}'),

('stats_section', '{
  "stats": [
    {"number": 10000, "label": "Scholarships Available", "suffix": "+", "color": "text-blue-600"},
    {"number": 50, "label": "Partner Universities", "suffix": "+", "color": "text-green-600"},
    {"number": 95, "label": "Success Rate", "suffix": "%", "color": "text-purple-600"},
    {"number": 24, "label": "AI Support", "suffix": "/7", "color": "text-orange-600"}
  ]
}'),

('navigation', '{
  "logo_text": "Global Pathways",
  "logo_subtitle": "Your Path to Success",
  "nav_items": [
    {"path": "/", "label": "Home", "icon": "🏠"},
    {"path": "/fafsa", "label": "FAFSA", "icon": "📋"},
    {"path": "/scholarships", "label": "Scholarships", "icon": "🔍"},
    {"path": "/auto-scholarships", "label": "AI Finder", "icon": "🤖"},
    {"path": "/cost-calculator", "label": "Calculator", "icon": "💰"},
    {"path": "/colleges", "label": "Colleges", "icon": "🏫"},
    {"path": "/college-comparison", "label": "Compare", "icon": "⚖️"},
    {"path": "/blog", "label": "Blog", "icon": "📝"},
    {"path": "/success-stories", "label": "Stories", "icon": "🌟"},
    {"path": "/counselor-portal", "label": "Counselors", "icon": "👨‍🏫"},
    {"path": "/partners", "label": "Partners", "icon": "🤝"},
    {"path": "/about", "label": "About", "icon": "ℹ️"}
  ]
}'),

('features_section', '{
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
}'),

('footer_content', '{
  "company_name": "Global Pathways",
  "description": "Empowering students worldwide to achieve their U.S. higher education dreams.",
  "contact_email": "info@globalpathways.edu",
  "social_links": {
    "twitter": "https://twitter.com/globalpathways",
    "facebook": "https://facebook.com/globalpathways",
    "linkedin": "https://linkedin.com/company/globalpathways"
  },
  "quick_links": [
    {"label": "About Us", "path": "/about"},
    {"label": "Contact", "path": "/contact"},
    {"label": "Privacy Policy", "path": "/privacy-policy"},
    {"label": "Terms of Service", "path": "/terms"}
  ]
}'),

('colors_theme', '{
  "primary_color": "#3b82f6",
  "secondary_color": "#8b5cf6",
  "accent_color": "#06b6d4",
  "success_color": "#10b981",
  "warning_color": "#f59e0b",
  "error_color": "#ef4444",
  "background_gradient": "from-blue-50 via-white to-purple-50"
}'),

('seo_settings', '{
  "site_title": "Global Pathways - Your Path to U.S. Higher Education",
  "meta_description": "Comprehensive guidance for international and underprivileged students with AI-powered scholarship matching and real-time updates.",
  "keywords": "scholarships, college admissions, international students, FAFSA, financial aid, U.S. education",
  "og_image": "/images/global-pathways-og.jpg"
}'),

('contact_info', '{
  "phone": "+1 (555) 123-4567",
  "email": "support@globalpathways.edu",
  "address": "123 Education Street, Learning City, LC 12345",
  "office_hours": "Monday - Friday: 9:00 AM - 6:00 PM EST",
  "support_chat": true
}');

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_website_customization_section ON public.website_customization_2025_10_14_03_00(section_name);
CREATE INDEX IF NOT EXISTS idx_website_customization_active ON public.website_customization_2025_10_14_03_00(is_active);