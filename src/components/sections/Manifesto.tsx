import { Counter } from "@/components/Counter";
import { Line, Reveal } from "@/components/Reveal";
import { numbers } from "@/lib/content";

export function Manifesto() {
  return (
    <Reveal as="section" className="relative z-20 py-[16vh]">
      <div className="shell grid gap-10 md:grid-cols-12">
        <p className="label md:col-span-3">(Approach)</p>

        <h2 className="display text-[clamp(2rem,4.6vw,4rem)] md:col-span-9">
          <Line>The code is the easy part.</Line>
          <Line delay={0.08}>
            <em className="italic text-mute">The hard part is the surface</em>
          </Line>
          <Line delay={0.16}>
            <em className="italic text-mute">a person has to trust.</em>
          </Line>
        </h2>
      </div>

      <div className="shell mt-[10vh] grid gap-px border-t border-hairline sm:grid-cols-2 lg:grid-cols-4">
        {numbers.map((n, i) => (
          <div
            key={n.label}
            className="fade border-b border-hairline py-8 pr-6"
            style={{ "--d": `${i * 0.08}s` } as React.CSSProperties}
          >
            <p className="display text-[clamp(3rem,6vw,5.5rem)] text-signal">
              <Counter value={n.value} delay={i * 0.08} />
            </p>
            <p className="label mt-3">{n.label}</p>
          </div>
        ))}
      </div>
    </Reveal>
  );
}
