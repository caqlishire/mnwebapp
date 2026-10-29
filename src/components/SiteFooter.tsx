import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { brand } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-[#101827] text-white">
      <div className="page-shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr]">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <Image
              src="/images/mn-group-home-logo.svg"
              alt=""
              width={44}
              height={44}
              aria-hidden="true"
              className="h-11 w-11 rounded-lg bg-white object-cover ring-1 ring-white/20"
            />
            <div>
              <p className="text-lg font-bold">{brand.name}</p>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-200">
                {brand.tagline}
              </p>
            </div>
          </div>
          <p className="mt-3 max-w-md text-sm leading-7 text-slate-300">
            Community Residential Setting in {brand.serviceArea}, focused on
            safe homes, meaningful days, and person-centered support.
          </p>
          <a
            href={brand.phoneHref}
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-amber-50"
          >
            <Phone aria-hidden="true" size={17} />
            {brand.phone}
          </a>
        </div>
        <address className="not-italic">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-rose-200">
            Contact
          </p>
          <a
            href={brand.mapHref}
            className="mt-4 flex gap-2 text-sm leading-6 text-slate-300 hover:text-white"
          >
            <MapPin aria-hidden="true" className="mt-1 shrink-0" size={17} />
            <span>{brand.address}</span>
          </a>
          <a
            href={brand.phoneHref}
            className="mt-3 flex gap-2 text-sm leading-6 text-slate-300 hover:text-white"
          >
            <Phone aria-hidden="true" className="mt-1 shrink-0" size={17} />
            <span>{brand.phone}</span>
          </a>
          <a
            href={brand.emailHref}
            className="mt-3 flex gap-2 text-sm leading-6 text-slate-300 hover:text-white"
          >
            <Mail aria-hidden="true" className="mt-1 shrink-0" size={17} />
            <span className="min-w-0 break-all">{brand.email}</span>
          </a>
        </address>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-rose-200">
            Quick Links
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link href="/about" className="text-slate-300 hover:text-white">
              About Us
            </Link>
            <Link href="/services" className="text-slate-300 hover:text-white">
              Our Services
            </Link>
            <Link href="/referrals" className="text-slate-300 hover:text-white">
              Admissions & Referrals
            </Link>
            <Link href="/contact" className="text-slate-300 hover:text-white">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="page-shell flex flex-col gap-3 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {brand.name}. All rights reserved.</span>
          <span>Community Residential Services in {brand.serviceArea}</span>
        </div>
      </div>
    </footer>
  );
}
