import {
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Mail,
  MessageSquareText,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { ReferralForm } from "@/components/ReferralForm";
import { brand } from "@/lib/brand";

const prepItems = [
  "Current living setting and target move timeline",
  "County of financial responsibility",
  "Guardian or representative contact information",
  "Primary support needs, routines, risks, and wellness considerations",
  "Support Plan, CSSP, or related referral document when available",
];

const processSteps = [
  {
    icon: ClipboardCheck,
    title: "Submit focused details",
    body: "The form collects contact, applicant, urgency, and support information so the inquiry starts with useful context.",
  },
  {
    icon: FileText,
    title: "Attach planning documents",
    body: "Upload a support plan, CSSP, or related document when available to reduce follow-up and clarify service fit.",
  },
  {
    icon: MessageSquareText,
    title: "Expect direct follow-up",
    body: "A team member follows up using the preferred contact method to discuss fit, timing, and next steps.",
  },
];

export default function ReferralsPage() {
  return (
    <main id="main-content" className="flex-1 text-slate-950">
      <section className="page-band bg-white">
        <div className="page-shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="eyebrow">
              Admissions & Referrals
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Start a referral for residential support
            </h1>
          </div>
          <div className="grid content-end gap-6">
            <p className="text-lg leading-8 text-slate-700">
              Families, social workers, and county case managers can share the
              person’s current needs, timing, and support goals. Our team will
              review the inquiry and follow up to discuss fit, next steps, and
              available care coordination.
            </p>
            <div className="grid gap-3 text-base font-bold text-slate-950 sm:grid-cols-2">
              <a
                href={brand.phoneHref}
                className="inline-flex min-h-12 min-w-0 items-center gap-3 rounded-full border border-slate-300 bg-white px-4 py-3 shadow-sm hover:border-rose-300 hover:bg-rose-50"
              >
                <Phone aria-hidden="true" size={19} />
                {brand.phone}
              </a>
              <a
                href={brand.emailHref}
                className="inline-flex min-h-12 min-w-0 items-center gap-3 rounded-full border border-slate-300 bg-white px-4 py-3 shadow-sm hover:border-rose-300 hover:bg-rose-50"
              >
                <Mail aria-hidden="true" size={19} />
                <span className="min-w-0 break-all">{brand.email}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#101827] py-12 text-white sm:py-16">
        <div className="page-shell grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <article
                key={step.title}
                className="glass-panel p-5 last:sm:col-span-2 last:lg:col-span-1"
              >
                <div className="flex items-center justify-between gap-4">
                  <Icon aria-hidden="true" className="text-rose-100" size={27} />
                  <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-300">
                    {index + 1}
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-bold">{step.title}</h2>
                <p className="mt-2 text-base leading-7 text-slate-200">
                  {step.body}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="page-band bg-white" aria-labelledby="prepare-referral">
        <div className="page-shell grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="eyebrow">
              Referral readiness
            </p>
            <h2
              id="prepare-referral"
              className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl"
            >
              Details that help us review faster
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-700">
              You can submit the form with the information you have today.
              These items simply help the follow-up conversation move more
              quickly.
            </p>
          </div>
          <div className="premium-card bg-[#f8f5ef] p-5 sm:p-6">
            <ul className="grid gap-3">
              {prepItems.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4 text-base font-semibold leading-7 text-slate-800"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-emerald-700"
                    size={20}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex gap-3 rounded-lg border border-rose-100 bg-rose-50 p-4 text-sm leading-6 text-rose-950">
              <ShieldCheck aria-hidden="true" className="mt-1 shrink-0" size={20} />
              <p>
                Please do not send Social Security numbers or full medical
                records through the website form.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-band bg-[#f1f4ed]">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-10">
          <ReferralForm />
        </div>
      </section>
    </main>
  );
}
