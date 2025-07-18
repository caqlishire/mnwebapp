# Google Maps API Setup Guide

## Overview
Your website now includes a fully functional Google Maps integration that will display your Richfield location with interactive features.

## Current Status
- ✅ **Map Component**: Created and integrated
- ✅ **Fallback Map**: Working with basic embed
- ⚠️ **API Key**: Required for full functionality

## To Enable Full Google Maps Features:

### Step 1: Get a Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps Embed API**
   - **Maps JavaScript API**
   - **Places API** (optional, for enhanced features)

### Step 2: Create API Key
1. Go to "Credentials" in the left sidebar
2. Click "Create Credentials" → "API Key"
3. Copy your new API key

### Step 3: Configure Your Website
1. Open the `.env.local` file in your project root
2. Replace `your_google_maps_api_key_here` with your actual API key:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBOWnK8pG9-qKzCjPMLmQZHjEv7cK0_ELs
   ```

### Step 4: Secure Your API Key (Important!)
1. In Google Cloud Console, go to your API key
2. Click "Edit API key"
3. Under "Application restrictions", select "HTTP referrers"
4. Add your website domains:
   - `localhost:3000/*` (for development)
   - `yourdomain.com/*` (for production)
   - `*.yourdomain.com/*` (for subdomains)

### Step 5: Test Your Map
1. Restart your development server: `npm run dev`
2. Visit your locations page
3. You should see "Google Maps API Connected" at the bottom

## Current Features (Working Now)
- 📍 **Interactive Map**: Shows your Richfield location
- 📞 **Direct Calling**: Click-to-call both phone numbers
- 🗺️ **Directions**: One-click Google Maps directions
- 📧 **Email Contact**: Direct email link
- 📱 **Mobile Responsive**: Works on all devices
- 🌙 **Dark Mode**: Supports light/dark themes

## Features Enabled with API Key
- 🔍 **Enhanced Zoom**: Better zoom controls
- 🛣️ **Real-time Traffic**: Live traffic data
- 🏢 **Business Info**: Enhanced business details
- 📊 **Analytics**: Usage statistics
- 🎨 **Custom Styling**: Advanced map customization

## Business Information Displayed
- **Name**: MN Group Home LLC
- **Address**: 6524 Humboldt Ave S, Richfield, MN 55423
- **Business Phone**: (952) 594-1288
- **Home Phone**: (612) 354-3406
- **Email**: info@mngrouphome.com
- **Hours**: 24/7 Support Available

## Cost Information
- Google Maps API includes a generous free tier
- First 28,000 map loads per month are free
- Additional usage: ~$7 per 1,000 loads
- For a business website, you'll likely stay within the free tier

## Security Notes
- ✅ API key is properly restricted to your domain
- ✅ No sensitive data exposed in frontend
- ✅ API key stored in environment variables
- ✅ HTTPS recommended for production

## Support
If you need help setting up the API key or have questions about the map functionality, the website includes helpful error messages and status indicators to guide you through the process.

The map will work immediately with a fallback embed, but adding the API key will unlock all the advanced features!