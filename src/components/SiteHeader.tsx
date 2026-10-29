import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Phone } from "lucide-react";
import { PrimaryNavigation } from "@/components/PrimaryNavigation";
import { brand } from "@/lib/brand";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm shadow-slate-200/60">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-slate-950 focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>
      <div className="hidden border-b border-slate-200/80 bg-slate-950 text-white xl:block">
        <div className="page-shell flex min-h-9 items-center justify-between gap-6 text-xs font-bold uppercase tracking-[0.16em] text-slate-200">
          <span>245D waiver service focus</span>
          <span>{brand.address}</span>
          <span>Referral inquiries reviewed directly</span>
        </div>
      </div>
      <nav
        aria-label="Primary navigation"
        className="page-shell flex min-h-[4.75rem] items-center justify-between gap-4 sm:min-h-[5.25rem]"
      >
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg outline-none focus:ring-2 focus:ring-rose-700 focus:ring-offset-4"
          aria-label={`${brand.name} home`}
        >
          <Image
            src="/images/mn-group-home-logo.svg"
            alt=""
            width={52}
            height={52}
            aria-hidden="true"
            className="h-12 w-12 rounded-lg object-cover shadow-sm ring-1 ring-slate-200 sm:h-14 sm:w-14"
            priority
          />
          <span className="leading-tight">
            <span className="block whitespace-nowrap text-base font-bold text-slate-950 sm:text-lg">
              {brand.name}
            </span>
            <span className="block text-[0.68rem] font-bold uppercase tracking-[0.14em] text-rose-800 max-[359px]:hidden sm:text-xs sm:tracking-[0.18em]">
              {brand.tagline}
            </span>
          </span>
        </Link>

        <PrimaryNavigation />
      </nav>
      <div className="mobile-action-bar fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-3 pt-3 shadow-2xl backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
          <a
            href={brand.phoneHref}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-950 shadow-sm"
          >
            <Phone aria-hidden="true" size={17} />
            Call
          </a>
          <Link
            href="/referrals"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#123f3c] px-4 py-3 text-sm font-bold text-white shadow-sm"
          >
            Referral
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </div>
    </header>
  );
}
