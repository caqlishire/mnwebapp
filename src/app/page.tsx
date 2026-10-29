import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  ClipboardCheck,
  FileText,
  HeartHandshake,
  Home as HomeIcon,
  MapPin,
  MessageSquareText,
  Pill,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { brand } from "@/lib/brand";

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Minnesota 245D Focus",
    body: "Services are grounded in rights-based support, documentation, staff training, and person-centered planning.",
  },
  {
    icon: HeartHandshake,
    title: "Professional Daily Support",
    body: "Experienced staff support medication routines, health observation, and communication with care teams.",
  },
  {
    icon: Users,
    title: "Person-Centered Planning",
    body: "Each plan reflects the person’s strengths, preferences, culture, goals, and desired level of independence.",
  },
];

const services = [
  {
    icon: HomeIcon,
    title: "Community Residential Services",
    body: "Safe, structured support in a comfortable home-like setting.",
  },
  {
    icon: Pill,
    title: "Medication & Wellness",
    body: "Medication administration, health monitoring, and appointment coordination.",
  },
  {
    icon: Activity,
    title: "24-Hour Daily Support",
    body: "Around-the-clock assistance with supervision, routines, and urgent needs.",
  },
  {
    icon: Sparkles,
    title: "Life Skills & Community",
    body: "Skill-building, household participation, social connection, and community engagement.",
  },
];

const audienceCards = [
  {
    icon: Users,
    title: "For families and guardians",
    body: "See whether the home, support model, routines, and communication approach may fit your loved one.",
  },
  {
    icon: ClipboardCheck,
    title: "For case managers",
    body: "Send a focused referral inquiry with county, setting, urgency, support needs, and optional planning documents.",
  },
  {
    icon: HeartHandshake,
    title: "For care partners",
    body: "Coordinate around wellness, daily structure, appointments, medication routines, and long-term support goals.",
  },
];

const intakeSteps = [
  {
    icon: MessageSquareText,
    title: "Referral review",
    body: "We review the inquiry, timing, current setting, and primary support needs.",
  },
  {
    icon: SearchCheck,
    title: "Fit conversation",
    body: "We follow up with the submitter to discuss service fit, documents, and next questions.",
  },
  {
    icon: CalendarCheck,
    title: "Care coordination",
    body: "When appropriate, next steps may include team communication, planning, and transition coordination.",
  },
];

const fitItems = [
  "Community Residential Services in a home-like setting",
  "245D waiver service coordination and documentation awareness",
  "24-hour support needs, routines, supervision, and wellness follow-up",
  "Communication with families, guardians, county teams, and providers",
];

const faqItems = [
  {
    question: "Who can submit a referral?",
    answer:
      "Families, guardians, county case managers, social workers, discharge planners, and other representatives can start an inquiry.",
  },
  {
    question: "What information helps speed up review?",
    answer:
      "Current living setting, county, urgency, support needs, guardian or representative contact, and any relevant support plan or CSSP details are helpful.",
  },
  {
    question: "Can I call before submitting a form?",
    answer: `Yes. You can call ${brand.phone} to ask about fit, timing, and next steps before sending a referral inquiry.`,
  },
];

const heroHighlights = [
  "Real residential home setting",
  "Referral document upload available",
  "Family and care-team coordination",
];

export default function Home() {
  return (
    <main id="main-content" className="flex-1 text-slate-950">
      <section className="relative isolate overflow-hidden bg-slate-950 text-white">
        <Image
          src="/images/about/mn-group-home-collage.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-20 object-cover opacity-60"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(15,23,42,0.95),rgba(18,63,60,0.82)_48%,rgba(15,23,42,0.34))]"
          aria-hidden="true"
        />
        <div className="page-shell grid min-h-[calc(100svh-4.75rem)] items-center gap-10 py-12 sm:min-h-[42rem] sm:py-16 lg:grid-cols-[0.92fr_0.68fr] xl:min-h-[calc(100svh-8rem)]">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-amber-100 backdrop-blur">
              Community Residential Services in {brand.serviceArea}
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
              {brand.name}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100 sm:text-xl">
              A supportive residential setting in Richfield where dignity,
              daily structure, wellness coordination, and community connection
              come together.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/referrals"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-base font-bold text-slate-950 shadow-sm transition hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Make a Referral
                <ArrowRight aria-hidden="true" size={19} />
              </Link>
              <a
                href={brand.phoneHref}
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 py-3 text-base font-bold text-white backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-950"
              >
                Call {brand.phone}
              </a>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-sm font-bold text-slate-100">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 backdrop-blur">
                <Clock3 aria-hidden="true" size={17} />
                Fast referral follow-up
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 backdrop-blur">
                <MapPin aria-hidden="true" size={17} />
                Richfield home setting
              </span>
            </div>
            <ul className="mt-10 hidden max-w-2xl gap-4 border-t border-white/20 pt-6 text-sm font-semibold text-slate-100 sm:grid sm:grid-cols-3">
              <li>
                <span className="block text-2xl font-bold text-white">
                  24-Hour
                </span>
                Residential support options
              </li>
              <li>
                <span className="block text-2xl font-bold text-white">
                  245D
                </span>
                Waiver service focus
              </li>
              <li>
                <span className="block text-2xl font-bold text-white">
                  Local
                </span>
                Richfield home setting
              </li>
            </ul>
          </div>
          <aside className="glass-panel hidden p-5 lg:block" aria-label="Referral snapshot">
            <div className="rounded-lg bg-white p-5 text-slate-950 shadow-xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-rose-800">
                Referral Snapshot
              </p>
              <h2 className="mt-3 text-2xl font-bold">
                A clearer first step for families and care teams
              </h2>
              <div className="mt-5 grid gap-3">
                {heroHighlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 bg-[#f8f5ef] p-3"
                  >
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-emerald-700"
                      size={19}
                    />
                    <span className="text-sm font-semibold leading-6 text-slate-800">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-950 p-4 text-white">
                  <span className="block text-2xl font-bold">245D</span>
                  <span className="text-sm font-semibold text-slate-300">
                    Service focus
                  </span>
                </div>
                <div className="rounded-lg bg-[#123f3c] p-4 text-white">
                  <span className="block text-2xl font-bold">CRS</span>
                  <span className="text-sm font-semibold text-emerald-50">
                    Residential support
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="page-shell grid divide-y divide-slate-200 md:grid-cols-3 md:divide-x md:divide-y-0">
          {[
            ["Home Setting", "A real residential home in Richfield"],
            ["Support Model", "Daily routines, wellness, and coordination"],
            ["Referral Path", "Fast follow-up for families and care teams"],
          ].map(([title, body]) => (
            <div key={title} className="py-6 md:px-6 first:md:pl-0 last:md:pr-0">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-rose-800">
                {title}
              </p>
              <p className="mt-2 text-base font-semibold leading-7 text-slate-800">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-band">
        <div className="page-shell">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {audienceCards.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="premium-card p-6 last:sm:col-span-2 last:lg:col-span-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-50 text-rose-700 ring-1 ring-rose-100">
                    <Icon aria-hidden="true" size={27} />
                  </div>
                  <h2 className="mt-5 text-xl font-bold text-slate-950">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-slate-700">
                    {item.body}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="trust-heading"
        className="page-band bg-white"
      >
        <div className="page-shell">
          <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="eyebrow">
                Trusted care standards
              </p>
              <h2
                id="trust-heading"
                className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl"
              >
                Professional support for individuals, families, and care teams
              </h2>
            </div>
            <p className="text-lg leading-8 text-slate-700">
              Reliable residential care works best when the environment feels
              calm, communication is clear, and every person’s rights and daily
              routines are respected.
            </p>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="premium-card bg-[#f8f5ef] p-6 last:sm:col-span-2 last:lg:col-span-1"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-rose-700 ring-1 ring-slate-200">
                    <Icon aria-hidden="true" size={28} />
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

      <section
        aria-labelledby="services-heading"
        className="page-band bg-[#f1f4ed]"
      >
        <div className="page-shell">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="eyebrow">
                Quick services overview
              </p>
              <h2
                id="services-heading"
                className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl"
              >
                Residential support that honors everyday life
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-700">
                Our services are designed for people who need consistent
                residential support, skill-building, wellness oversight, and
                encouragement to participate in everyday community life.
              </p>
              <Link
                href="/services"
                className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full border border-[#123f3c] bg-white px-5 py-3 text-base font-bold text-[#123f3c] shadow-sm hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:ring-offset-2"
              >
                Explore Services
                <ArrowRight aria-hidden="true" size={19} />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((service, index) => {
                const Icon = service.icon;
                const featured = index === 0;
                return (
                  <article
                    key={service.title}
                    className={`rounded-lg border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                      featured
                        ? "border-slate-900 bg-slate-950 text-white sm:col-span-2"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-lg ring-1 ${
                        featured
                          ? "bg-white/10 text-rose-100 ring-white/15"
                          : "bg-emerald-50 text-emerald-800 ring-emerald-100"
                      }`}
                    >
                      <Icon aria-hidden="true" size={26} />
                    </div>
                    <h3
                      className={`mt-4 text-lg font-bold ${
                        featured ? "text-white" : "text-slate-950"
                      }`}
                    >
                      {service.title}
                    </h3>
                    <p
                      className={`mt-2 text-base leading-7 ${
                        featured ? "text-slate-200" : "text-slate-700"
                      }`}
                    >
                      {service.body}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="fit-heading"
        className="page-band bg-white"
      >
        <div className="page-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">
              Service fit
            </p>
            <h2
              id="fit-heading"
              className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl"
            >
              A clear way to understand whether MN Group Home may be a match
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-700">
              Strong residential providers make it easy for families and care
              teams to understand what kind of support is available before they
              call. These are the core fit signals we ask about during referral
              review.
            </p>
            <Link
              href="/referrals"
              className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#123f3c] px-5 py-3 text-base font-bold text-white shadow-sm hover:bg-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-700 focus:ring-offset-2"
            >
              Check Referral Fit
              <ArrowRight aria-hidden="true" size={19} />
            </Link>
          </div>
          <div className="premium-card bg-[#f8f5ef] p-5 sm:p-6">
            <div className="grid gap-3">
              {fitItems.map((item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-emerald-700"
                    size={21}
                  />
                  <p className="text-base font-semibold leading-7 text-slate-800">
                    {item}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-lg bg-[#123f3c] p-5 text-white">
              <FileText aria-hidden="true" className="text-rose-100" size={28} />
              <h3 className="mt-4 text-xl font-bold">
                Planning documents can be uploaded
              </h3>
              <p className="mt-2 text-base leading-7 text-slate-200">
                The referral form accepts a support plan, CSSP, or related
                referral document so care teams can share the right context
                from the start.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="approach-heading"
        className="page-band bg-[#101827] text-white"
      >
        <div className="page-shell grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-amber-100">
              {brand.name} approach
            </p>
            <h2
              id="approach-heading"
              className="mt-3 text-3xl font-bold sm:text-4xl"
            >
              Calm, coordinated care with clinical awareness
            </h2>
          </div>
          <div className="grid gap-5">
            <p className="text-lg leading-8 text-amber-50">
              {brand.name} combines residential care experience with a
              professional support model, helping staff respond thoughtfully to
              daily living needs, medication routines, wellness changes,
              community activities, and each person’s goals for independence.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-white/10 p-5 ring-1 ring-white/15">
                <ClipboardCheck aria-hidden="true" size={28} />
                <h3 className="mt-4 text-lg font-bold">Clear Coordination</h3>
                <p className="mt-2 text-sm leading-6 text-amber-50">
                  Communication with families, county case managers, and care
                  teams helps support continuity and accountability.
                </p>
              </div>
              <div className="rounded-lg bg-white/10 p-5 ring-1 ring-white/15">
                <HeartHandshake aria-hidden="true" size={28} />
                <h3 className="mt-4 text-lg font-bold">Dignity First</h3>
                <p className="mt-2 text-sm leading-6 text-amber-50">
                  Support is grounded in respect, choice, privacy, and each
                  person’s goals for a meaningful home life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="intake-heading"
        className="page-band"
      >
        <div className="page-shell">
          <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="eyebrow">
                Referral pathway
              </p>
              <h2
                id="intake-heading"
                className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl"
              >
                What happens after you reach out
              </h2>
            </div>
            <p className="text-lg leading-8 text-slate-700">
              A clear intake process helps families, case managers, and
              providers know what to expect without extra back-and-forth.
            </p>
          </div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {intakeSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <article
                  key={step.title}
                  className="premium-card p-6 last:sm:col-span-2 last:lg:col-span-1"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-50 text-rose-700 ring-1 ring-rose-100">
                      <Icon aria-hidden="true" size={27} />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
                      Step {index + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-950">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-slate-700">
                    {step.body}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="page-band bg-white" aria-labelledby="faq-heading">
        <div className="page-shell grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="eyebrow">
              Referral FAQ
            </p>
            <h2
              id="faq-heading"
              className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl"
            >
              Quick answers before you submit
            </h2>
          </div>
          <div className="grid gap-4">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-lg border border-slate-200 bg-[#fbfaf7] p-5 shadow-sm"
              >
                <summary className="cursor-pointer text-lg font-bold text-slate-950 marker:text-rose-700">
                  {item.question}
                </summary>
                <p className="mt-3 text-base leading-7 text-slate-700">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section
        className="page-band bg-[#fff7ed]"
        aria-labelledby="referral-heading"
      >
        <div className="mx-auto max-w-5xl px-5 text-center sm:px-8">
          <h2
            id="referral-heading"
            className="text-3xl font-bold text-slate-950 sm:text-4xl"
          >
            Start a referral inquiry with {brand.name}
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-700">
            Families, social workers, and county case managers can connect with
            us to discuss residential support needs and next steps.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/referrals"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-base font-bold text-white hover:bg-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-700 focus:ring-offset-2"
            >
              Admissions & Referrals
              <ArrowRight aria-hidden="true" size={19} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-base font-bold text-slate-950 hover:border-rose-700 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-700 focus:ring-offset-2"
            >
              General Contact
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
