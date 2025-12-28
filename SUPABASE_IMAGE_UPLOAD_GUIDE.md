# Supabase Image Upload Guide for Global Pathways

## 📸 **How to Upload Team Member Images**

### **Method 1: Supabase Dashboard (Recommended)**

1. **Go to Supabase Dashboard**
   - Open your Supabase project dashboard
   - Navigate to **Storage** in the left sidebar

2. **Access Team Images Bucket**
   - Click on **team-images** bucket
   - You'll see a folder structure

3. **Upload Images**
   - Click **Upload file** button
   - **Drag and drop** your JPG/PNG files directly
   - Or click **Browse** to select files

4. **Organize in Team Folder**
   - Create/navigate to **team** folder
   - Upload images with descriptive names like:
     - `sarah-johnson.jpg`
     - `michael-chen.jpg`
     - `maria-rodriguez.jpg`

5. **Update Team Member Record**
   - Go to **Table Editor** → `team_members_2025_10_14_03_00`
   - Find the team member row
   - Update `image_url` field with: `team/filename.jpg`
   - Example: `team/sarah-johnson.jpg`

### **Method 2: Direct URL Upload**

If you have images hosted elsewhere:
1. Go to team members table
2. Update `image_url` with full URL
3. Example: `https://example.com/photo.jpg`

## 🎯 **Image Requirements**

### **Recommended Specifications:**
- **Format**: JPG, PNG, WebP
- **Size**: 400x400px to 800x800px (square preferred)
- **File Size**: Under 5MB
- **Quality**: High resolution for crisp display

### **Best Practices:**
- Use square aspect ratio (1:1)
- Professional headshots work best
- Good lighting and clear background
- Consistent style across all team photos

## 📋 **Step-by-Step Example**

### **Adding New Team Member with Photo:**

1. **Upload Photo First**
   ```
   Supabase → Storage → team-images → team folder
   Upload: john-doe.jpg
   ```

2. **Add Team Member Record**
   ```sql
   INSERT INTO team_members_2025_10_14_03_00 (
     name,
     position,
     bio,
     image_url,
     email,
     linkedin_url,
     display_order,
     is_active
   ) VALUES (
     'John Doe',
     'Marketing Director',
     'John has 10 years of experience...',
     'team/john-doe.jpg',  -- This references the uploaded file
     'john@globalpathways.edu',
     'https://linkedin.com/in/johndoe',
     9,
     true
   );
   ```

### **Updating Existing Team Member Photo:**

1. **Upload New Photo**
   ```
   Upload to: team-images/team/sarah-new-photo.jpg
   ```

2. **Update Database Record**
   ```sql
   UPDATE team_members_2025_10_14_03_00 
   SET image_url = 'team/sarah-new-photo.jpg'
   WHERE name = 'Sarah Johnson';
   ```

## 🔧 **Storage Buckets Created**

### **team-images**
- **Purpose**: Team member profile photos
- **Access**: Public read, authenticated write
- **Limit**: 5MB per file
- **Formats**: JPG, PNG, WebP

### **website-images**
- **Purpose**: General website images (blog, hero, etc.)
- **Access**: Public read, authenticated write  
- **Limit**: 10MB per file
- **Formats**: JPG, PNG, WebP, GIF, SVG

## 🌐 **How Images Appear on Website**

The website automatically constructs the full URL:
```
https://your-project.supabase.co/storage/v1/object/public/team-images/team/filename.jpg
```

When you set `image_url = 'team/sarah-johnson.jpg'`, the website displays:
- Full URL: `https://[supabase-url]/storage/v1/object/public/team-images/team/sarah-johnson.jpg`
- Fallback: If image fails to load, shows default user icon

## ✅ **Quick Checklist**

- [ ] Upload image to Supabase Storage
- [ ] Use descriptive filename
- [ ] Update team member record with correct path
- [ ] Check image displays on website
- [ ] Verify image loads properly

## 🚨 **Troubleshooting**

### **Image Not Showing?**
1. Check file path in database matches uploaded file
2. Verify image is in `team-images` bucket
3. Ensure file is in `team/` folder
4. Check file permissions (should be public)

### **Upload Failed?**
1. Check file size (under 5MB for team images)
2. Verify file format (JPG, PNG, WebP only)
3. Ensure you're logged in to Supabase
4. Try refreshing the page

### **Wrong Image Size?**
1. Resize image to square format (400x400px recommended)
2. Compress if file size too large
3. Re-upload with same filename to replace

## 📱 **Mobile Optimization**

Images are automatically optimized for:
- Responsive display on all devices
- Fast loading with proper compression
- Fallback icons if images fail to load
- Hover effects and animations

Your team section now fills the full width at the bottom and supports drag-and-drop image uploads through Supabase Storage!