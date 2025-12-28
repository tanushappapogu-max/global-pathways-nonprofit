# Global Pathways Website Content Management Guide

## 📋 Table of Contents
1. [Global Settings](#global-settings)
2. [Blog Articles](#blog-articles)
3. [About Us Content](#about-us-content)
4. [Team Members](#team-members)
5. [Navigation Items](#navigation-items)
6. [Footer Content](#footer-content)
7. [Page-Specific Content](#page-specific-content)
8. [Quick Reference](#quick-reference)

---

## 🌐 Global Settings
**Table:** `website_global_settings_2025_10_14_03_00`

### What This Controls:
- Website logo and branding
- Color scheme throughout the site
- Typography and fonts
- Layout spacing
- Animation settings

### How to Edit:

#### Logo & Branding
```
setting_category: 'branding'
setting_name: 'logo'
setting_value: {
  "text": "Your Company Name",           // Main logo text
  "subtitle": "Your Tagline",        // Subtitle under logo
  "icon": "GraduationCap",          // Lucide icon name
  "icon_color": "#3b82f6",          // Icon color (hex)
  "text_color": "#1f2937",          // Logo text color
  "subtitle_color": "#6b7280",      // Subtitle color
  "show_icon": true,                // Show/hide icon
  "show_subtitle": true,            // Show/hide subtitle
  "size": "large"                   // Size: small, medium, large
}
```

#### Color Palette
```
setting_category: 'colors'
setting_name: 'primary_palette'
setting_value: {
  "primary": "#3b82f6",             // Main brand color
  "primary_hover": "#2563eb",       // Hover state
  "secondary": "#8b5cf6",           // Secondary color
  "secondary_hover": "#7c3aed",     // Secondary hover
  "accent": "#06b6d4",              // Accent color
  "success": "#10b981",             // Success messages
  "warning": "#f59e0b",             // Warning messages
  "error": "#ef4444"                // Error messages
}
```

#### Background Gradients
```
setting_category: 'colors'
setting_name: 'background_gradients'
setting_value: {
  "hero_gradient": "from-blue-50 via-white to-purple-50",
  "section_gradient": "from-gray-50 to-blue-50",
  "card_gradient": "from-white to-gray-50",
  "button_gradient": "from-blue-600 to-purple-600"
}
```

#### Typography
```
setting_category: 'typography'
setting_name: 'fonts'
setting_value: {
  "heading_font": "Inter",          // Font for headings
  "body_font": "Inter",             // Font for body text
  "heading_sizes": {
    "h1": "text-4xl md:text-6xl",   // Main heading size
    "h2": "text-3xl md:text-4xl",   // Section heading size
    "h3": "text-2xl md:text-3xl",   // Subsection heading
    "h4": "text-xl md:text-2xl"     // Small heading
  }
}
```

---

## 📝 Blog Articles
**Table:** `blog_articles_2025_10_14_03_00`

### What This Controls:
- All blog posts and articles
- Individual article pages at `/blog/[slug]`
- Blog listing page
- Featured articles

### How to Edit:

#### Create New Article
```sql
INSERT INTO blog_articles_2025_10_14_03_00 (
  slug,                    -- URL slug (e.g., 'my-article-title')
  title,                   -- Article title
  excerpt,                 -- Short description for previews
  content,                 -- Full article content (Markdown supported)
  author_name,             -- Author's name
  author_bio,              -- Author's bio
  author_image,            -- Author's photo URL
  featured_image,          -- Article header image URL
  category,                -- Article category
  tags,                    -- Array of tags: ARRAY['tag1', 'tag2']
  meta_title,              -- SEO title
  meta_description,        -- SEO description
  reading_time,            -- Estimated reading time in minutes
  is_published,            -- true/false - show on website
  is_featured,             -- true/false - show in featured section
  published_at             -- Publication date
) VALUES (
  'your-article-slug',
  'Your Article Title',
  'Brief description of your article...',
  '# Your Article Title\n\nYour full article content here...',
  'Author Name',
  'Author bio here',
  '/images/authors/author.jpg',
  '/images/articles/featured-image.jpg',
  'Category Name',
  ARRAY['tag1', 'tag2', 'tag3'],
  'SEO Title for Search Engines',
  'SEO description for search results',
  5,
  true,
  false,
  NOW()
);
```

#### Update Existing Article
```sql
UPDATE blog_articles_2025_10_14_03_00 
SET 
  title = 'Updated Title',
  content = 'Updated content...',
  is_published = true
WHERE slug = 'article-slug';
```

---

## 👥 About Us Content
**Table:** `about_us_content_2025_10_14_03_00`

### What This Controls:
- About Us page sections
- Mission, Vision, Values
- Company story and timeline
- Impact statistics

### How to Edit:

#### Hero Section
```
section_name: 'hero'
subsection_name: 'main_content'
content: {
  "title": "About Your Company",
  "subtitle": "Your company tagline",
  "description": "Detailed description of your company...",
  "background_image": "/images/about-hero.jpg",
  "cta_button": {
    "text": "Button Text",
    "link": "/signup"
  }
}
```

#### Mission Statement
```
section_name: 'mission'
subsection_name: 'our_mission'
content: {
  "title": "Our Mission",
  "content": "Your mission statement here...",
  "icon": "target",                 // Lucide icon name
  "highlight_color": "text-blue-600"
}
```

#### Core Values
```
section_name: 'values'
subsection_name: 'core_values'
content: {
  "title": "Our Core Values",
  "values": [
    {
      "title": "Value Name",
      "description": "Value description...",
      "icon": "icon-name"           // Lucide icon name
    }
  ]
}
```

#### Impact Statistics
```
section_name: 'impact'
subsection_name: 'our_impact'
content: {
  "title": "Our Impact",
  "stats": [
    {
      "number": 25000,              // The number to display
      "label": "Students Helped",   // Label below number
      "suffix": "+",                // Text after number
      "prefix": "$",                // Text before number (optional)
      "description": "Description of this stat"
    }
  ]
}
```

---

## 👨‍💼 Team Members
**Table:** `team_members_2025_10_14_03_00`

### What This Controls:
- Team member profiles on About Us page
- Staff directory
- Contact information

### How to Edit:

#### Add New Team Member
```sql
INSERT INTO team_members_2025_10_14_03_00 (
  name,                    -- Full name
  position,                -- Job title
  bio,                     -- Biography
  image_url,               -- Profile photo URL
  email,                   -- Email address
  linkedin_url,            -- LinkedIn profile URL
  twitter_url,             -- Twitter profile URL (optional)
  display_order,           -- Order on page (1, 2, 3...)
  is_active                -- true/false - show on website
) VALUES (
  'John Doe',
  'CEO & Founder',
  'John has 15 years of experience in education...',
  '/images/team/john-doe.jpg',
  'john@company.com',
  'https://linkedin.com/in/johndoe',
  'https://twitter.com/johndoe',
  1,
  true
);
```

#### Update Team Member
```sql
UPDATE team_members_2025_10_14_03_00 
SET 
  position = 'New Job Title',
  bio = 'Updated biography...'
WHERE name = 'John Doe';
```

---

## 🧭 Navigation Items
**Table:** `navigation_items_2025_10_14_03_00`

### What This Controls:
- Main navigation menu
- Menu item order
- Icons and labels
- Authentication requirements

### How to Edit:

#### Add New Menu Item
```sql
INSERT INTO navigation_items_2025_10_14_03_00 (
  label,                   -- Display text
  path,                    -- URL path
  icon,                    -- Emoji or icon
  display_order,           -- Position in menu
  is_active,               -- Show/hide item
  requires_auth            -- Requires login to see
) VALUES (
  'New Page',
  '/new-page',
  '📄',
  15,
  true,
  false
);
```

#### Update Menu Item
```sql
UPDATE navigation_items_2025_10_14_03_00 
SET 
  label = 'Updated Label',
  icon = '🆕'
WHERE path = '/new-page';
```

#### Reorder Menu Items
```sql
UPDATE navigation_items_2025_10_14_03_00 
SET display_order = 5 
WHERE path = '/important-page';
```

---

## 🦶 Footer Content
**Table:** `footer_content_2025_10_14_03_00`

### What This Controls:
- Footer sections
- Contact information
- Social media links
- Newsletter signup

### How to Edit:

#### Company Information
```
section_name: 'company_info'
content: {
  "name": "Your Company Name",
  "description": "Company description for footer...",
  "logo": {
    "text": "Company Name",
    "icon": "GraduationCap"
  }
}
```

#### Contact Information
```
section_name: 'contact_info'
content: {
  "email": "contact@yourcompany.com",
  "phone": "+1 (555) 123-4567",
  "address": "123 Main St, City, State 12345",
  "office_hours": "Monday - Friday: 9:00 AM - 6:00 PM"
}
```

#### Social Media Links
```
section_name: 'social_links'
content: {
  "links": [
    {
      "platform": "Twitter",
      "url": "https://twitter.com/yourcompany",
      "icon": "twitter"
    },
    {
      "platform": "LinkedIn",
      "url": "https://linkedin.com/company/yourcompany",
      "icon": "linkedin"
    }
  ]
}
```

#### Quick Links
```
section_name: 'quick_links'
content: {
  "links": [
    {"label": "Privacy Policy", "path": "/privacy"},
    {"label": "Terms of Service", "path": "/terms"},
    {"label": "Contact Us", "path": "/contact"}
  ]
}
```

---

## 📄 Page-Specific Content

### FAFSA Page Content
**Table:** `fafsa_content_2025_10_14_03_00`

#### Overview Section
```
section_name: 'overview'
subsection_name: 'introduction'
content: {
  "title": "What is FAFSA?",
  "description": "FAFSA description...",
  "key_points": [
    "Point 1",
    "Point 2",
    "Point 3"
  ]
}
```

### Scholarships Page Content
**Table:** `scholarships_content_2025_10_14_03_00`

#### Search Tips
```
section_name: 'search_tips'
subsection_name: 'effective_searching'
content: {
  "title": "How to Find Scholarships",
  "tips": [
    "Tip 1",
    "Tip 2",
    "Tip 3"
  ]
}
```

### Homepage Content
**Table:** `homepage_content_2025_10_14_03_00`

#### Hero Section
```
section_name: 'hero'
subsection_name: 'main_content'
content: {
  "title": "Your Main Headline",
  "subtitle": "Supporting text...",
  "primary_button": {
    "text": "Primary Action",
    "link": "/action-page"
  },
  "secondary_button": {
    "text": "Secondary Action",
    "link": "/other-page"
  }
}
```

---

## 🔍 Quick Reference

### Common Tasks:

#### Change Website Logo
1. Go to `website_global_settings_2025_10_14_03_00`
2. Find row: `setting_category = 'branding'` AND `setting_name = 'logo'`
3. Update `setting_value` JSON

#### Add New Blog Post
1. Go to `blog_articles_2025_10_14_03_00`
2. Insert new row with all required fields
3. Set `is_published = true` to make it live

#### Update About Us Page
1. Go to `about_us_content_2025_10_14_03_00`
2. Find the section you want to edit
3. Update the `content` JSON field

#### Change Contact Information
1. Go to `footer_content_2025_10_14_03_00`
2. Find row: `section_name = 'contact_info'`
3. Update the `content` JSON

#### Add Team Member
1. Go to `team_members_2025_10_14_03_00`
2. Insert new row with member details
3. Set appropriate `display_order`

### Important Notes:
- **JSON Format**: All content fields use JSON format
- **Live Updates**: Changes appear immediately on website
- **Backup**: Always backup before major changes
- **Testing**: Test changes on staging before production
- **Images**: Upload images to `/public/images/` directory first

### Need Help?
- Check JSON syntax if changes don't appear
- Ensure `is_active = true` for content to show
- Verify `is_published = true` for blog articles
- Contact support for complex customizations