# MN Group Home Website Deployment Guide

## Overview
This guide will help you deploy your website to Vercel and connect your Namecheap domain (mngrouphome.org).

## Prerequisites
- ✅ Website code is ready
- ✅ Domain: mngrouphome.org (from Namecheap)
- ✅ Vercel account (free tier available)
- ✅ GitHub account (for code repository)

## Step 1: Prepare for Deployment

### 1.1 Create Production Environment File
Create `.env.production` for production-specific settings:

```bash
# Google Maps API Key (get from Google Cloud Console)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_production_api_key_here

# Analytics (optional)
NEXT_PUBLIC_GA_TRACKING_ID=your_google_analytics_id

# Domain Configuration
NEXT_PUBLIC_DOMAIN=mngrouphome.org
NEXT_PUBLIC_SITE_URL=https://mngrouphome.org
```

### 1.2 Update Next.js Configuration
Your `next.config.ts` is already optimized for production.

### 1.3 Test Production Build Locally
```bash
npm run build
npm run start
```

## Step 2: Deploy to Vercel

### 2.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (recommended)
3. Verify your email address

### 2.2 Deploy from GitHub (Recommended)

#### Option A: Push to GitHub First
1. Create a new repository on GitHub
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit - MN Group Home website"
git branch -M main
git remote add origin https://github.com/yourusername/mngrouphome-website.git
git push -u origin main
```

#### Option B: Deploy from Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

### 2.3 Connect GitHub to Vercel
1. In Vercel dashboard, click "New Project"
2. Import your GitHub repository
3. Configure build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 2.4 Configure Environment Variables
In Vercel dashboard → Project Settings → Environment Variables:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = your_api_key_here
NEXT_PUBLIC_DOMAIN = mngrouphome.org
NEXT_PUBLIC_SITE_URL = https://mngrouphome.org
```

## Step 3: Connect Your Namecheap Domain

### 3.1 Get Vercel DNS Settings
1. In Vercel dashboard → Project → Settings → Domains
2. Add your domain: `mngrouphome.org`
3. Vercel will provide DNS settings

### 3.2 Update Namecheap DNS
1. Log in to [Namecheap](https://namecheap.com)
2. Go to Domain List → Manage
3. Go to Advanced DNS tab
4. Delete existing A and CNAME records
5. Add new records:

**For Vercel (recommended):**
```
Type: A Record
Host: @
Value: 76.76.19.61
TTL: Automatic

Type: CNAME Record  
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

**Alternative method:**
```
Type: CNAME Record
Host: @
Value: your-project.vercel.app
TTL: Automatic

Type: CNAME Record
Host: www  
Value: your-project.vercel.app
TTL: Automatic
```

### 3.3 Wait for DNS Propagation
- DNS changes take 24-48 hours to fully propagate
- You can check status at [whatsmydns.net](https://whatsmydns.net)

## Step 4: SSL Certificate & Security

### 4.1 Automatic SSL
- Vercel automatically provides SSL certificates
- Your site will be available at `https://mngrouphome.org`

### 4.2 Security Headers
Your site already includes security headers in `next.config.ts`

## Step 5: Final Configuration

### 5.1 Update Google Maps API Key Restrictions
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. APIs & Services → Credentials
3. Edit your API key
4. Add HTTP referrers:
   - `mngrouphome.org/*`
   - `*.mngrouphome.org/*`
   - `localhost:3000/*` (for development)

### 5.2 Test Your Live Site
Visit your domain and verify:
- ✅ Site loads correctly
- ✅ All pages work
- ✅ Maps display properly
- ✅ Contact forms function
- ✅ Phone numbers are clickable
- ✅ SSL certificate is active

## Step 6: Set Up Continuous Deployment

### 6.1 Automatic Deployments
- Every push to your main branch will trigger a new deployment
- Vercel will build and deploy automatically

### 6.2 Preview Deployments
- Every pull request gets a preview URL
- Test changes before merging to main

## Step 7: Performance Optimization

### 7.1 Vercel Analytics (Optional)
```bash
npm install @vercel/analytics
```

Add to your `layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 7.2 Enable Speed Insights
In Vercel dashboard → Project → Settings → Speed Insights → Enable

## Troubleshooting

### Common Issues:

**1. Domain not connecting:**
- Check DNS settings in Namecheap
- Wait 24-48 hours for propagation
- Use `dig mngrouphome.org` to check DNS

**2. Build failures:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Fix any TypeScript errors

**3. Environment variables not working:**
- Redeploy after adding variables
- Check variable names (case-sensitive)
- Ensure NEXT_PUBLIC_ prefix for client-side variables

**4. Maps not loading:**
- Verify API key is correct
- Check domain restrictions
- Ensure billing is enabled in Google Cloud

## Support Commands

```bash
# Check deployment status
vercel --prod

# View logs
vercel logs your-project-url

# Force redeploy
vercel --force

# Check DNS
nslookup mngrouphome.org
```

## Post-Deployment Checklist

- [ ] Site loads at https://mngrouphome.org
- [ ] All pages accessible
- [ ] Contact forms work
- [ ] Phone links work
- [ ] Email links work
- [ ] Maps display correctly
- [ ] SSL certificate active
- [ ] Mobile responsive
- [ ] Search engines can index site

## Cost Information

### Vercel (Free Tier Limits):
- 100GB bandwidth/month
- 1,000 serverless function invocations/day
- 6,000 build minutes/month
- Custom domains included

### Namecheap:
- Domain registration: ~$10-15/year
- DNS is included

### Google Maps:
- 28,000 map loads/month free
- Additional: ~$7 per 1,000 loads

## Your Website URLs
- **Primary**: https://mngrouphome.org
- **WWW**: https://www.mngrouphome.org
- **Vercel**: https://your-project.vercel.app (backup)

## Next Steps After Deployment
1. Set up Google Analytics
2. Submit sitemap to Google Search Console
3. Add Google My Business listing
4. Set up social media links
5. Monitor performance with Vercel Analytics

## Contact Information for Site
- **Business Phone**: (952) 594-1288
- **Home Phone**: (612) 354-3406
- **Email**: info@mngrouphome.com
- **Address**: 6524 Humboldt Ave S, Richfield, MN 55423

Your website is now ready for professional deployment! 🚀