"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  MapPin,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { brand } from "@/lib/brand";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Our Services" },
  { href: "/referrals", label: "Admissions & Referrals" },
  { href: "/contact", label: "Contact Us" },
] as const;

export function PrimaryNavigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) {
        return;
      }

      const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
    menuButtonRef.current?.focus();
  }

  return (
    <>
      <div className="hidden items-center gap-1 rounded-full border border-slate-200 bg-white/80 p-1 shadow-inner xl:flex">
        {navItems.map((item) => {
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`whitespace-nowrap rounded-full px-3.5 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-rose-700 focus:ring-offset-2 ${
                isActive
                  ? "bg-slate-950 text-white shadow-sm"
                  : "text-slate-700 hover:bg-[#f8f5ef] hover:text-rose-900 hover:shadow-sm"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="hidden items-center gap-3 xl:flex">
        <a
          href={brand.phoneHref}
          className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-900 shadow-sm transition hover:border-rose-300 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-700 focus:ring-offset-2"
        >
          <Phone aria-hidden="true" size={18} />
          {brand.phone}
        </a>
        <Link
          href="/referrals"
          className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full bg-[#123f3c] px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-700 focus:ring-offset-2"
        >
          Make a Referral
          <ArrowRight aria-hidden="true" size={17} />
        </Link>
      </div>

      <button
        ref={menuButtonRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label="Open navigation menu"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-950 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-700 focus:ring-offset-2 xl:hidden"
      >
        <Menu aria-hidden="true" size={25} strokeWidth={2} />
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[80] xl:hidden">
          <button
            type="button"
            onClick={closeMenu}
            className="absolute inset-0 cursor-default bg-slate-950/55 backdrop-blur-sm"
            aria-label="Close navigation menu"
            tabIndex={-1}
          />
          <aside
            ref={panelRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="mobile-menu-panel absolute inset-y-0 right-0 flex w-[min(92vw,28rem)] flex-col overflow-y-auto border-l border-white/10 bg-[#101827] text-white shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-7">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex min-w-0 items-center gap-3 rounded-lg"
              >
                <Image
                  src="/images/mn-group-home-logo.svg"
                  alt=""
                  width={48}
                  height={48}
                  aria-hidden="true"
                  className="h-12 w-12 shrink-0 rounded-lg bg-white object-cover"
                />
                <span className="min-w-0">
                  <span className="block text-base font-bold">{brand.name}</span>
                  <span className="block text-xs font-bold uppercase tracking-[0.14em] text-rose-200">
                    Residential support
                  </span>
                </span>
              </Link>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeMenu}
                aria-label="Close navigation menu"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-white transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <X aria-hidden="true" size={25} />
              </button>
            </div>

            <nav
              aria-label="Mobile navigation"
              className="flex-1 px-4 py-5 sm:px-6"
            >
              <p className="px-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Explore
              </p>
              <div className="mt-3 grid gap-2">
                {navItems.map((item, index) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      aria-current={isActive ? "page" : undefined}
                      className={`group flex min-h-14 items-center justify-between gap-4 rounded-lg px-4 py-3 text-base font-bold transition focus:outline-none focus:ring-2 focus:ring-white ${
                        isActive
                          ? "bg-white text-slate-950"
                          : "text-slate-100 hover:bg-white/10"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`text-xs font-bold ${
                            isActive ? "text-rose-800" : "text-slate-500"
                          }`}
                        >
                          0{index + 1}
                        </span>
                        {item.label}
                      </span>
                      <ArrowRight
                        aria-hidden="true"
                        size={18}
                        className="transition group-hover:translate-x-1"
                      />
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="border-t border-white/10 bg-white/[0.04] px-5 py-5 sm:px-7">
              <div className="flex items-start gap-3 text-sm leading-6 text-slate-300">
                <MapPin
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-rose-200"
                  size={18}
                />
                <span>{brand.address}</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <a
                  href={brand.phoneHref}
                  onClick={() => setIsOpen(false)}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm font-bold text-white"
                >
                  <Phone aria-hidden="true" size={18} />
                  Call
                </a>
                <Link
                  href="/referrals"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-bold text-slate-950"
                >
                  Referral
                  <ArrowRight aria-hidden="true" size={18} />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
