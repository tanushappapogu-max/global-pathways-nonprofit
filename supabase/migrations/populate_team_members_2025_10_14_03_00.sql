-- Clear existing data and insert fresh team members
DELETE FROM public.team_members_2025_10_14_03_00;

-- Insert comprehensive team members data
INSERT INTO public.team_members_2025_10_14_03_00 (name, position, bio, image_url, email, linkedin_url, display_order, is_active) VALUES
('Sarah Johnson', 'CEO & Co-Founder', 'Former international student from Kenya, Sarah holds an MBA from Harvard Business School. She is passionate about breaking down barriers to education and has helped over 10,000 students navigate the U.S. college system.', '/images/team/sarah-johnson.jpg', 'sarah@globalpathways.edu', 'https://linkedin.com/in/sarahjohnson', 1, true),

('Dr. Michael Chen', 'CTO & Co-Founder', 'Former Google engineer with a PhD in Computer Science from MIT. Michael leads our AI development team and has created the algorithms that power our scholarship matching system.', '/images/team/michael-chen.jpg', 'michael@globalpathways.edu', 'https://linkedin.com/in/michaelchen', 2, true),

('Maria Rodriguez', 'Head of Student Success', 'Former college counselor with 15 years of experience. Maria oversees our student support programs and has personally guided thousands of students through the college application process.', '/images/team/maria-rodriguez.jpg', 'maria@globalpathways.edu', 'https://linkedin.com/in/mariarodriguez', 3, true),

('James Thompson', 'Director of Partnerships', 'Former admissions officer at several top universities. James manages our relationships with colleges and scholarship providers, ensuring our students have access to the best opportunities.', '/images/team/james-thompson.jpg', 'james@globalpathways.edu', 'https://linkedin.com/in/jamesthompson', 4, true),

('Dr. Lisa Wang', 'Head of Research', 'PhD in Education Policy from Stanford. Lisa conducts research on college access and affordability, ensuring our platform is backed by the latest academic insights.', '/images/team/lisa-wang.jpg', 'lisa@globalpathways.edu', 'https://linkedin.com/in/lisawang', 5, true),

('Ahmed Hassan', 'International Student Advisor', 'Former international student from Egypt who now helps other international students navigate the complex U.S. education system. Fluent in Arabic, English, and French.', '/images/team/ahmed-hassan.jpg', 'ahmed@globalpathways.edu', 'https://linkedin.com/in/ahmedhassan', 6, true),

('Jennifer Kim', 'Financial Aid Specialist', 'Former FAFSA processor with 10+ years experience. Jennifer helps students understand financial aid processes and maximize their funding opportunities.', '/images/team/jennifer-kim.jpg', 'jennifer@globalpathways.edu', 'https://linkedin.com/in/jenniferkim', 7, true),

('Carlos Mendoza', 'Community Outreach Manager', 'First-generation college graduate who now helps underrepresented students access higher education. Specializes in Hispanic/Latino student support.', '/images/team/carlos-mendoza.jpg', 'carlos@globalpathways.edu', 'https://linkedin.com/in/carlosmendoza', 8, true);