import { Line, Reveal } from "@/components/Reveal";
import { meta } from "@/lib/content";

export function Contact() {
  return (
    <Reveal
      as="footer"
      className="relative z-20 flex min-h-svh flex-col justify-between pt-[14vh] pb-10"
      id="contact"
    >
      <div className="shell">
        <p className="label mb-10">({meta.availability})</p>

        <h2 className="display text-[clamp(2.75rem,10vw,10rem)]">
          <Line>Let&apos;s build</Line>
          <Line delay={0.08}>
            <em className="italic text-signal">something worth</em>
          </Line>
          <Line delay={0.16}>using.</Line>
        </h2>

        <div className="mt-12 flex flex-col items-start gap-5">
          <a
            href={`mailto:${meta.email}`}
            className="fade inline-block border-b border-hairline pb-2 font-display text-[clamp(1.5rem,3.2vw,2.75rem)] transition-colors duration-500 hover:border-signal hover:text-signal"
            style={{ "--d": "0.3s" } as React.CSSProperties}
          >
            {meta.email}
          </a>

          <a
            href={`tel:${meta.phone.replace(/\s/g, "")}`}
            className="fade inline-block border-b border-hairline pb-2 font-display text-[clamp(1.25rem,2.4vw,2rem)] transition-colors duration-500 hover:border-signal hover:text-signal"
            style={{ "--d": "0.38s" } as React.CSSProperties}
          >
            {meta.phone}
          </a>
        </div>
      </div>

      <div className="shell mt-[10vh] flex flex-wrap items-center justify-between gap-6 border-t border-hairline pt-6">
        <span className="label">
          {meta.name} — {meta.location}
        </span>

        <nav className="label flex flex-wrap gap-8">
          <a
            className="hover-signal"
            href={meta.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn ↗
          </a>
          <a
            className="hover-signal"
            href={`mailto:${meta.email}`}
          >
            Email ↗
          </a>
          <a
            className="hover-signal"
            href={`tel:${meta.phone.replace(/\s/g, "")}`}
          >
            {meta.phone}
          </a>
        </nav>

        <span className="label">© {meta.since}—26</span>
      </div>
    </Reveal>
  );
}
