# 🎬 Hero Slideshow Feature

## 🎉 Complete Feature Implemented!

Your homepage now has a stunning, fully customizable hero slideshow that admin can manage! Images automatically transition every 5 seconds with beautiful animations.

---

## ✨ Features

### 1. **Admin Management** 👑
Full control panel at `/admin/hero-slides` with:
- **Upload Images** - Direct image upload (no external hosting needed!)
- **Add Titles & Subtitles** - Customize messaging for each slide
- **Call-to-Action Buttons** - Optional button with custom text and link
- **Display Order** - Control the sequence of slides
- **Active/Hidden Toggle** - Show or hide slides without deleting
- **Edit & Delete** - Full CRUD operations

### 2. **Auto-Sliding Carousel** 🎠
- **5-second intervals** - Automatically changes slides
- **Smooth transitions** - 1-second fade effect
- **Pause on hover** - Stops auto-play when user hovers
- **Navigation arrows** - Appear on hover for manual control
- **Dot indicators** - Show current slide position
- **Infinite loop** - Cycles through all slides continuously

### 3. **Beautiful Design** 💝
- **Full-screen hero** - 70vh minimum height
- **Image backgrounds** - Large, stunning visuals
- **Gradient overlays** - Professional dark overlay for text readability
- **White text** - Bold, large typography that stands out
- **Smooth animations** - Text slides up elegantly
- **Responsive** - Works perfectly on all screen sizes

### 4. **Fallback Content** ✨
When no slides are added yet:
- Shows default welcome message
- Beautiful gradient background
- "Noosh Tuft" branding
- Call-to-action button

---

## 🎨 Slideshow Features

### Visual Elements:
```
┌─────────────────────────────────────────┐
│  [Full-Width Background Image]          │
│                                          │
│  Large Title (up to 7xl)                │
│  Subtitle (optional)                     │
│  [Button] (optional)                     │
│                                          │
│  ← →  (Navigation on hover)             │
│  ● ● ●  (Dot indicators)                │
└─────────────────────────────────────────┘
```

### Slide Data:
- **Title** (required) - Main heading
- **Subtitle** (optional) - Supporting text
- **Image** (required) - Background photo
- **Button Text** (optional) - CTA button label
- **Button Link** (optional) - Where button goes
- **Order** (number) - Display sequence
- **Active** (boolean) - Show/hide toggle

---

## 🔧 Backend API

### Get All Slides
```http
GET /api/hero-slides
GET /api/hero-slides?include_inactive=true
```

### Create Slide (Admin)
```http
POST /api/hero-slides
Authorization: Bearer {token}

Body:
{
  "title": "Handcrafted with Love",
  "subtitle": "Discover unique artisanal creations",
  "image_url": "data:image/jpeg;base64,...",
  "button_text": "Shop Now",
  "button_link": "/products",
  "order_index": 0,
  "is_active": true
}
```

### Update Slide (Admin)
```http
PUT /api/hero-slides/{slide_id}
Authorization: Bearer {token}

Body: (all fields optional)
{
  "title": "New Title",
  "is_active": false
}
```

### Delete Slide (Admin)
```http
DELETE /api/hero-slides/{slide_id}
Authorization: Bearer {token}
```

---

## 💾 Database Schema

### HeroSlide Table:
```sql
- id (Primary Key)
- title (String, required)
- subtitle (String, optional)
- image_url (String, required)
- button_text (String, optional)
- button_link (String, optional)
- order_index (Integer, default 0)
- is_active (Boolean, default true)
- created_at (DateTime)
- updated_at (DateTime)
```

---

## 👨‍💼 Admin Guide

### Creating Your First Slide:

1. **Login as Admin**
2. **Go to Admin Dashboard** (`/admin`)
3. **Click "🎬 Hero Slides"**
4. **Click "✨ Add New Slide"**
5. **Fill in the form:**
   - **Title**: e.g., "Handcrafted with Love"
   - **Subtitle**: e.g., "Unique tufted & embroidered pieces"
   - **Image**: Click to upload a beautiful photo
   - **Button Text**: e.g., "Shop Now" (optional)
   - **Button Link**: e.g., "/products" (optional)
   - **Order**: 0 for first slide, 1 for second, etc.
   - **Active**: Check to show immediately
6. **Click "✨ Create Slide"**
7. **Visit Homepage** to see it live!

### Best Practices:

#### Image Requirements:
- **Size**: Minimum 1920x1080px (Full HD)
- **Format**: JPG or PNG
- **File Size**: Under 5MB
- **Aspect Ratio**: 16:9 or wider
- **Subject**: Center-focused (text overlays on left)

#### Content Tips:
- **Title**: Keep it short (3-7 words)
- **Subtitle**: One line, 50 characters max
- **Button**: Clear action verb ("Shop Now", "Explore", "Discover")
- **Images**: High-quality, professional photos
- **Variety**: Mix close-ups and wide shots

#### Optimal Setup:
- **3-5 slides** - Sweet spot for engagement
- **Update monthly** - Keep content fresh
- **Test on mobile** - Ensure text is readable
- **Use high contrast** - Dark images work best

---

## 🎯 User Experience

### On Homepage:
1. **Large hero section** loads at top
2. **First slide appears** with fade-in
3. **After 5 seconds** - Automatically transitions to next
4. **Hover to pause** - User can read at their own pace
5. **Click arrows** - Manual navigation
6. **Click dots** - Jump to specific slide
7. **Click button** - Navigate to featured content

### Slideshow Behavior:
- ✅ Auto-plays on page load
- ✅ Pauses when user hovers
- ✅ Resumes when mouse leaves
- ✅ Loops infinitely
- ✅ Smooth 1-second transitions
- ✅ Shows navigation on hover
- ✅ Responsive on all devices

---

## 📱 Responsive Design

### Desktop (1200px+):
- Full-width slideshow
- Large text (7xl)
- Hover controls visible
- Optimal viewing experience

### Tablet (768px-1199px):
- Full-width slideshow
- Medium text (5xl)
- Touch-friendly controls
- Good readability

### Mobile (< 768px):
- Full-width slideshow
- Smaller text (responsive)
- Swipe to navigate (future feature)
- Optimized layout

---

## 🚀 Getting Started

### 1. Start Backend:
```bash
cd server
python -m uvicorn api.main:app --reload
```
The `hero_slides` table will auto-create!

### 2. Start Frontend:
```bash
cd client
npm run dev
```

### 3. Create Slides:
- Login as admin
- Go to `/admin/hero-slides`
- Add your first slide
- Visit homepage to see it!

---

## ✨ Example Slides

### Slide 1: Welcome
- **Title**: "Handcrafted with Love"
- **Subtitle**: "Discover unique tufted & embroidered pieces"
- **Button**: "Shop Now" → `/products`
- **Image**: Workshop photo with colorful yarns

### Slide 2: Featured Collection
- **Title**: "New Spring Collection"
- **Subtitle**: "Fresh designs for your home"
- **Button**: "Explore" → `/products?category=new`
- **Image**: Beautiful finished tufted rug

### Slide 3: Craftsmanship
- **Title**: "Made by Hand, Made with Heart"
- **Subtitle**: "Every piece tells a story"
- **Button**: "Our Process" → `/handcrafts`
- **Image**: Close-up of hands working

---

## 🎁 What You Get

✅ **Admin slideshow manager** with full CRUD  
✅ **Image upload** with Base64 encoding  
✅ **Auto-play carousel** (5-second intervals)  
✅ **Manual navigation** (arrows & dots)  
✅ **Pause on hover** functionality  
✅ **Smooth transitions** and animations  
✅ **Responsive design** for all devices  
✅ **Active/hidden toggle** for slides  
✅ **Custom ordering** system  
✅ **Optional CTA buttons** with links  
✅ **Professional gradient overlays**  
✅ **Fallback content** when no slides  

---

## 💡 Tips for Success

### Content Strategy:
1. **Tell a story** - Each slide should connect
2. **Highlight benefits** - Show what makes you unique
3. **Create urgency** - Limited collections, new arrivals
4. **Show your work** - Behind-the-scenes photos
5. **Seasonal updates** - Change with holidays/seasons

### Technical Tips:
- Use compressed images for faster loading
- Test on different devices
- Update regularly to keep interest
- Track which slides get more clicks
- A/B test different messages

### Design Tips:
- Use high-quality photography
- Maintain consistent branding
- Ensure text is always readable
- Don't overcrowd with text
- Let images breathe

---

Your homepage is now a dynamic, engaging experience that you can customize anytime! 🎬✨💝
