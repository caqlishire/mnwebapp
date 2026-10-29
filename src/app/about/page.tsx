import Image from "next/image";
import { HeartHandshake, ShieldCheck, Sparkles, Users } from "lucide-react";
import { brand } from "@/lib/brand";

const homePhoto = {
  src: "/images/about/mn-group-home-collage.jpg",
  alt: "MN Group Home living room, bathroom, dining area, kitchen, and exterior",
  title: "MN Group Home Residential Setting",
};

export default function AboutPage() {
  return (
    <main id="main-content" className="flex-1 text-slate-950">
      <section className="page-band bg-white">
        <div className="page-shell grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">
              About {brand.name}
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              A residential care team focused on dignity, stability, and growth
            </h1>
          </div>
          <div className="grid content-end gap-5">
            <p className="text-lg leading-8 text-slate-700">
              {brand.name} provides Community Residential Services in{" "}
              {brand.city} with a person-centered approach that respects
              choice, safety, health needs, culture, and each person’s right to
              a meaningful home life.
            </p>
            <div className="hidden gap-3 border-t border-slate-200 pt-5 text-sm font-bold text-slate-700 sm:grid sm:grid-cols-3">
              <p>
                <span className="block text-2xl text-slate-950">Richfield</span>
                Minnesota
              </p>
              <p>
                <span className="block text-2xl text-slate-950">245D</span>
                Service focus
              </p>
              <p>
                <span className="block text-2xl text-slate-950">CRS</span>
                Residential support
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        className="page-band bg-[#f1f4ed]"
        aria-labelledby="home-gallery"
      >
        <div className="page-shell">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
            <div>
              <p className="eyebrow">
                Our residential setting
              </p>
              <h2
                id="home-gallery"
                className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl"
              >
                A clean, comfortable home environment for everyday living
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-700">
                {brand.name} offers a welcoming community residential
                setting with shared spaces for meals, relaxation, routines, and
                connection, along with private areas that support rest and
                dignity.
              </p>
            </div>
            <figure>
              <Image
                src={homePhoto.src}
                alt={homePhoto.alt}
                width={1179}
                height={680}
                sizes="(min-width: 1024px) 55vw, 92vw"
                className="aspect-[1179/680] w-full rounded-lg border border-white object-cover shadow-2xl shadow-slate-300"
                priority
              />
              <figcaption className="mt-2 text-sm font-semibold text-slate-700">
                {homePhoto.title}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="page-band bg-white">
        <div className="page-shell grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: HeartHandshake,
              title: "Mission",
              body: "To provide dependable residential care that helps people feel safe, respected, connected, and supported to build meaningful daily routines.",
            },
            {
              icon: Users,
              title: "Vision",
              body: "A community where people receiving services are known by their strengths, included in everyday life, and supported to move toward greater independence.",
            },
            {
              icon: ShieldCheck,
              title: "Our Approach",
              body: "Experienced staff and individualized support practices enable us to provide high-quality care with professionalism, compassion, and accountability.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="premium-card p-6 last:sm:col-span-2 last:lg:col-span-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-50 text-rose-700 ring-1 ring-rose-100">
                  <Icon aria-hidden="true" size={28} />
                </div>
                <h2 className="mt-5 text-2xl font-bold">{item.title}</h2>
                <p className="mt-3 text-base leading-7 text-slate-700">
                  {item.body}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="page-band bg-[#101827] text-white">
        <div className="page-shell grid gap-10 md:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-rose-200">
              What sets us apart
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Support that balances stability, skill-building, and belonging
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              {
                icon: Sparkles,
                title: "Growth-Focused Daily Support",
                body: "We help people practice routines, make choices, build confidence, and participate in household and community life.",
              },
              {
                icon: ShieldCheck,
                title: "Safe Home-Like Settings",
                body: "Our residential model emphasizes comfort, supervision, respectful boundaries, and a steady environment.",
              },
              {
                icon: HeartHandshake,
                title: "Whole-Person Care",
                body: "Care considers health, relationships, emotional well-being, preferences, culture, and long-term goals.",
              },
              {
                icon: Users,
                title: "Team Communication",
                body: "We coordinate with case managers, families, guardians, and providers so support remains consistent.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-lg bg-white/10 p-6 ring-1 ring-white/15"
                >
                  <Icon
                    aria-hidden="true"
                    className="text-rose-200"
                    size={28}
                  />
                  <h3 className="mt-4 text-xl font-bold">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-slate-200">
                    {item.body}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
