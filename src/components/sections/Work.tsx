"use client";

import { Line, Reveal } from "@/components/Reveal";
import { useTrack } from "@/components/webgl/registry";
import { projects, type Project } from "@/lib/content";

function ProjectRow({ project, i }: { project: Project; i: number }) {
  const { ref, hover } = useTrack(project);
  const flipped = i % 2 === 1;

  return (
    <Reveal as="li" className="shell grid gap-8 py-[8vh] md:grid-cols-12 md:gap-10">
      <div
        className="group contents"
        onPointerEnter={() => (hover.current = 1)}
        onPointerLeave={() => (hover.current = 0)}
      >
        {/* Anchor the WebGL plane. Transparent by design — the shader draws here. */}
        <div
          ref={ref}
          data-line-node
          className={`plate aspect-[4/3] w-full md:col-span-7 ${
            flipped ? "md:order-2 md:col-start-6" : ""
          }`}
        />

        <div
          className={`flex flex-col justify-end gap-5 md:col-span-4 ${
            flipped ? "md:order-1 md:col-start-1" : "md:col-start-9"
          }`}
        >
          <div className="fade flex items-baseline justify-between gap-4">
            <span className="label">({project.index})</span>
            <span className="label">{project.year}</span>
          </div>

          <h3 className="display text-[clamp(2.5rem,5.5vw,4.75rem)]">
            <Line>
              {project.href ? (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-start gap-3 transition-colors duration-500 group-hover:text-signal"
                >
                  {project.title}
                  <span className="label mt-2 text-current">↗</span>
                </a>
              ) : (
                <span className="transition-colors duration-500 group-hover:text-signal">
                  {project.title}
                </span>
              )}
            </Line>
          </h3>

          <p
            className="fade text-sm text-bone/90"
            style={{ "--d": "0.08s" } as React.CSSProperties}
          >
            {project.role}
          </p>

          <p
            className="fade max-w-prose text-mute"
            style={{ "--d": "0.14s" } as React.CSSProperties}
          >
            {project.blurb}
          </p>

          <ul
            className="fade flex flex-wrap gap-x-4 gap-y-2 border-t border-hairline pt-5"
            style={{ "--d": "0.2s" } as React.CSSProperties}
          >
            {project.stack.map((s) => (
              <li key={s} className="label">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}

export function Work() {
  return (
    <section id="work" className="relative z-20 py-[12vh]">
      <div className="shell mb-[6vh] flex items-end justify-between border-t border-hairline pt-6">
        <h2 className="label">Selected work</h2>
        <span className="label">{projects.length} of many</span>
      </div>

      <ul>
        {projects.map((project, i) => (
          <ProjectRow key={project.id} project={project} i={i} />
        ))}
      </ul>
    </section>
  );
}
