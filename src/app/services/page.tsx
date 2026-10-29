import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  HeartHandshake,
  Home,
  MessageSquareText,
  ShieldCheck,
  Users,
} from "lucide-react";
import { brand } from "@/lib/brand";

const primaryServices = [
  {
    icon: Home,
    title: "Community Residential Services",
    body: "Structured support in a community residential setting for people who benefit from dependable staffing, individualized routines, and a safe place to build daily stability.",
  },
  {
    icon: ShieldCheck,
    title: "245D Waiver Services",
    body: "Person-centered services delivered with attention to Minnesota 245D expectations, individual rights, documentation, staff training, and coordinated support planning.",
  },
];

const approachItems = [
  "Individualized support plans built around strengths, needs, culture, preferences, and goals.",
  "Safe, respectful residential settings where people can feel known, included, and supported.",
  "Daily assistance that encourages greater independence while keeping dependable support nearby.",
  "Regular communication with families, guardians, county case managers, and healthcare providers.",
];

const supportCategories = [
  {
    title: "Daily living routines",
    items: ["Meals and household participation", "Personal routines", "Skill-building practice"],
  },
  {
    title: "Health and wellness coordination",
    items: ["Medication routines", "Appointment follow-up", "Health observation"],
  },
  {
    title: "Community and relationships",
    items: ["Community participation", "Family communication", "Social connection"],
  },
];

const coordinationItems = [
  {
    icon: Users,
    title: "Family and guardian communication",
    body: "Clear follow-up helps families and representatives stay informed about routines, changes, and next steps.",
  },
  {
    icon: MessageSquareText,
    title: "County and care-team coordination",
    body: "We communicate with case managers and providers to support continuity around goals, plans, and service needs.",
  },
  {
    icon: FileText,
    title: "Documentation-aware support",
    body: "Referral details and planning documents help the team understand current needs before moving forward.",
  },
];

export default function ServicesPage() {
  return (
    <main id="main-content" className="flex-1 text-slate-950">
      <section className="page-band bg-white">
        <div className="page-shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="eyebrow">
              Our Services
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Community residential support and 245D waiver services
            </h1>
          </div>
          <div className="grid content-end gap-6">
            <p className="text-lg leading-8 text-slate-700">
              {brand.name} provides compassionate, person-centered support for
              individuals who need a stable community residential setting,
              reliable daily assistance, and coordinated services that promote
              dignity, safety, and greater independence.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/referrals"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#123f3c] px-6 py-3 text-base font-bold text-white shadow-sm hover:bg-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-700 focus:ring-offset-2"
              >
                Start a Referral
                <ArrowRight aria-hidden="true" size={19} />
              </Link>
              <a
                href={brand.phoneHref}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-950 hover:border-rose-700 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-700 focus:ring-offset-2"
              >
                Call {brand.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="page-band bg-[#f1f4ed]" aria-labelledby="primary-services">
        <div className="page-shell">
          <div className="max-w-3xl">
            <p className="eyebrow">
              Service focus
            </p>
            <h2
              id="primary-services"
              className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl"
            >
              Support designed around each person’s needs and goals
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-700">
              Our services are built to help individuals live with stability,
              dignity, community connection, and an appropriate level of daily
              support.
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {primaryServices.map((service) => {
              const Icon = service.icon;
              return (
                <article
                  key={service.title}
                  className="premium-card p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-50 text-rose-700 ring-1 ring-rose-100">
                    <Icon aria-hidden="true" size={28} />
                  </div>
                  <h3 className="mt-5 text-xl font-bold">{service.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-700">
                    {service.body}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="page-band bg-white" aria-labelledby="support-categories">
        <div className="page-shell">
          <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="eyebrow">
                Support categories
              </p>
              <h2
                id="support-categories"
                className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl"
              >
                The everyday areas families and care teams ask about most
              </h2>
            </div>
            <p className="text-lg leading-8 text-slate-700">
              Referral conversations often come down to practical questions:
              what daily support is available, how wellness is coordinated, and
              how the person stays connected to home and community life.
            </p>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {supportCategories.map((category) => (
              <article
                key={category.title}
                className="premium-card bg-[#f8f5ef] p-6 last:sm:col-span-2 last:lg:col-span-1"
              >
                <h3 className="text-xl font-bold text-slate-950">
                  {category.title}
                </h3>
                <ul className="mt-5 grid gap-3">
                  {category.items.map((item) => (
                    <li key={item} className="flex gap-3 text-base leading-7 text-slate-700">
                      <CheckCircle2
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-emerald-700"
                        size={20}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="page-band bg-[#101827] text-white"
        aria-labelledby="care-plan"
      >
        <div className="page-shell grid gap-10 md:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-100">
              Person-centered planning
            </p>
            <h2 id="care-plan" className="mt-3 text-3xl font-bold sm:text-4xl">
              Support plans that grow with the person
            </h2>
            <p className="mt-5 text-lg leading-8 text-amber-50">
              {brand.name} builds support around the individual’s goals
              and adjusts as needs change.
            </p>
          </div>
          <div className="glass-panel p-6">
            <ul className="grid gap-4">
              {approachItems.map((item) => (
                <li key={item} className="flex gap-3 text-base leading-7">
                  <ClipboardCheck
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-amber-100"
                    size={20}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="page-band bg-[#f1f4ed]" aria-labelledby="coordination">
        <div className="page-shell grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p className="eyebrow">
              Coordination model
            </p>
            <h2
              id="coordination"
              className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl"
            >
              Built for modern referral and care-team workflows
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-700">
              Similar providers increasingly make intake easier for case
              managers and families. {brand.name} supports that with clear
              contact paths, document upload, and focused referral questions.
            </p>
            <div className="premium-card mt-6 p-5">
              <CalendarCheck aria-hidden="true" className="text-rose-700" size={28} />
              <h3 className="mt-4 text-xl font-bold text-slate-950">
                Referral inquiries are reviewed for fit and timing
              </h3>
              <p className="mt-2 text-base leading-7 text-slate-700">
                Share current setting, county, urgency, and support needs so
                the first follow-up conversation is more productive.
              </p>
            </div>
          </div>
          <div className="grid gap-5">
            {coordinationItems.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="premium-card p-6"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-50 text-rose-700 ring-1 ring-rose-100">
                    <Icon aria-hidden="true" size={27} />
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-slate-700">
                    {item.body}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="page-band bg-white" aria-labelledby="next-step">
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
          <HeartHandshake
            aria-hidden="true"
            className="mx-auto text-rose-700"
            size={36}
          />
          <h2
            id="next-step"
            className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl"
          >
            Let’s talk through the right level of support
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-700">
            Case managers, families, and representatives can use the referral
            form to share current needs, timing, and care considerations.
          </p>
          <Link
            href="/referrals"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-base font-bold text-white hover:bg-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-700 focus:ring-offset-2"
          >
            Submit a Referral Inquiry
            <ArrowRight aria-hidden="true" size={19} />
          </Link>
        </div>
      </section>
    </main>
  );
}
