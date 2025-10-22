-- Create storage bucket for team member images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'team-images',
  'team-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies for team images
CREATE POLICY "Anyone can view team images" ON storage.objects
  FOR SELECT USING (bucket_id = 'team-images');

CREATE POLICY "Authenticated users can upload team images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'team-images' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = 'team'
  );

CREATE POLICY "Authenticated users can update team images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'team-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete team images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'team-images' AND
    auth.role() = 'authenticated'
  );

-- Create additional storage bucket for general website images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'website-images',
  'website-images', 
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies for website images
CREATE POLICY "Anyone can view website images" ON storage.objects
  FOR SELECT USING (bucket_id = 'website-images');

CREATE POLICY "Authenticated users can upload website images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'website-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update website images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'website-images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete website images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'website-images' AND
    auth.role() = 'authenticated'
  );