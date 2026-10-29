# MN Group Home Website

Modern Next.js website for MN Group Home, a Community Residential Services
provider in Richfield, Minnesota.

## Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
npm run lint
npm run build
npm run start
```

## Current Foundation

- Responsive Home page with hero, trust indicators, services overview, care approach, and referral CTA.
- Shared accessible navigation and footer.
- Initial route pages for About, Services, Admissions & Referrals, and Contact.
- Referral inquiry form that sends submissions to `info@mngrouphome.org` when SMTP environment variables are configured.
- Local hero image asset at `public/images/residential-care-hero.png`.

## Referral Email Setup

Copy `.env.example` to `.env.local` and set the SMTP values from your email
provider. The form posts to `/api/referrals` and sends email to
`REFERRAL_TO_EMAIL`, which defaults to `info@mngrouphome.org`.

Use a HIPAA-ready email or form provider before collecting highly sensitive
medical records, Social Security numbers, or full clinical documents.
