import { Mail, MapPin, Phone } from "lucide-react";
import { brand } from "@/lib/brand";

export default function ContactPage() {
  return (
    <main id="main-content" className="flex-1 text-slate-950">
      <section className="page-band bg-white">
        <div className="page-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">
              Contact Us
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Connect with {brand.name}
            </h1>
          </div>
          <p className="self-end text-lg leading-8 text-slate-700">
            Reach out to discuss Community Residential Services, 245D waiver
            supports, referrals, or care coordination for someone who may
            benefit from a safe and supportive home setting.
          </p>
        </div>
      </section>

      <section className="page-band bg-[#f1f4ed]">
        <div className="page-shell grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <div className="premium-card p-6">
            <h2 className="text-2xl font-bold">Business Information</h2>
            <address className="mt-6 grid gap-4 not-italic text-base leading-7 text-slate-700">
              <p className="font-bold text-slate-950">{brand.name}</p>
              <p className="flex gap-3">
                <MapPin
                  aria-hidden="true"
                  className="mt-1 text-rose-700"
                  size={20}
                />
                <span>{brand.address}</span>
              </p>
              <a
                className="flex gap-3 font-bold text-rose-900 underline decoration-rose-200 underline-offset-4 hover:text-rose-700"
                href={brand.phoneHref}
              >
                <Phone
                  aria-hidden="true"
                  className="mt-1 text-rose-700"
                  size={20}
                />
                <span>{brand.phone}</span>
              </a>
              <a
                className="flex gap-3 font-bold text-rose-900 underline decoration-rose-200 underline-offset-4 hover:text-rose-700"
                href={brand.emailHref}
              >
                <Mail
                  aria-hidden="true"
                  className="mt-1 text-rose-700"
                  size={20}
                />
                <span className="min-w-0 break-all">{brand.email}</span>
              </a>
            </address>
          </div>
          <iframe
            title={`Map showing ${brand.address}`}
            className="min-h-[320px] w-full rounded-lg border border-white shadow-2xl shadow-slate-300 sm:min-h-[420px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={brand.mapEmbedSrc}
          />
        </div>
      </section>
    </main>
  );
}
