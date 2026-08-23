import { HoverLetters } from "@/components/HoverLetters";
import { Line, Reveal } from "@/components/Reveal";
import { meta } from "@/lib/content";

export function Hero() {
  return (
    <Reveal
      as="header"
      className="relative z-20 flex min-h-svh flex-col justify-between pt-8 pb-10"
    >
      <div className="shell flex items-start justify-between gap-8">
        <span className="label">
          {meta.name} / {meta.location}
        </span>
        <nav className="label flex gap-6">
          <a className="hover-signal" href="#work">
            <HoverLetters text="Work" />
          </a>
          <a className="hover-signal" href="#about">
            <HoverLetters text="About" />
          </a>
          <a className="hover-signal" href="#contact">
            <HoverLetters text="Contact" />
          </a>
        </nav>
      </div>

      <div className="shell">
        <h1 className="display text-[clamp(3.25rem,12.5vw,13rem)]">
          <Line delay={0.05}>{meta.tagline[0]}</Line>
          <Line delay={0.15}>
            <em className="italic text-signal">{meta.tagline[1]}</em>
          </Line>
          <Line delay={0.25}>{meta.tagline[2]}</Line>
        </h1>
      </div>

      <div className="shell grid gap-8 md:grid-cols-12">
        <p
          className="fade label md:col-span-3"
          style={{ "--d": "0.5s" } as React.CSSProperties}
        >
          (07) years
          <br />
          in production
        </p>
        <p
          className="fade max-w-prose text-mute md:col-span-5 md:col-start-8"
          style={{ "--d": "0.6s" } as React.CSSProperties}
        >
          <span className="text-bone">{meta.role}.</span> {meta.focus} —{" "}
          {meta.discipline.toLowerCase()}. Currently senior engineer & tech lead at Xavia
          Solutions, leading cross-functional teams across fintech, ERP, and AI.
        </p>
      </div>
    </Reveal>
  );
}
