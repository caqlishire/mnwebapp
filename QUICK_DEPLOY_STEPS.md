# Quick Deployment Steps for MN Group Home Website

## 🚀 Fast Track Deployment (30 minutes)

### Step 1: Test Your Site (2 minutes)
```bash
cd /Users/pw/Desktop/web/crs-website
npm run build
npm run start
```
Visit http://localhost:3000 to verify everything works.

### Step 2: Deploy to Vercel (5 minutes)
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Import Git Repository"
5. Choose your project folder
6. Click "Deploy"

### Step 3: Add Your Domain (5 minutes)
1. In Vercel dashboard → Project → Settings → Domains
2. Add domain: `mngrouphome.org`
3. Add domain: `www.mngrouphome.org`
4. Note the DNS settings Vercel provides

### Step 4: Update Namecheap DNS (10 minutes)
1. Log in to [Namecheap](https://namecheap.com)
2. Go to Domain List → Manage → Advanced DNS
3. Delete existing A and CNAME records
4. Add these records:

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

### Step 5: Add Environment Variables (5 minutes)
In Vercel dashboard → Project → Settings → Environment Variables:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = your_google_maps_api_key
NEXT_PUBLIC_DOMAIN = mngrouphome.org
NEXT_PUBLIC_SITE_URL = https://mngrouphome.org
```

### Step 6: Wait & Test (3 minutes)
- Wait 5-10 minutes for deployment
- Visit https://mngrouphome.org
- Test all features

## 🎯 That's It!
Your website should now be live at https://mngrouphome.org

## 🔧 If You Need Help:
1. Check the full `DEPLOYMENT_GUIDE.md` for detailed instructions
2. Contact Vercel support if needed
3. Check Namecheap DNS propagation (can take 24-48 hours)

## 📞 Your Live Website Will Include:
- ✅ Professional healthcare website
- ✅ Interactive Google Maps
- ✅ Contact forms with your phone numbers
- ✅ Modern 2025 design features
- ✅ AI-powered components
- ✅ Mobile responsive
- ✅ SSL security
- ✅ Fast loading speeds

## 🏆 You're Ready to Go Live!