import { Reveal } from "@/components/Reveal";
import { education, experience, meta } from "@/lib/content";

export function About() {
  return (
    <Reveal as="section" className="relative z-20 py-[14vh]">
      <div className="shell grid gap-10 border-t border-hairline pt-6 md:grid-cols-12">
        <h2 className="label md:col-span-3" id="about">
          (Track record)
        </h2>

        <p className="fade max-w-2xl text-[clamp(1.15rem,1.9vw,1.6rem)] leading-snug md:col-span-9">
          {meta.summary}
        </p>
      </div>

      <ol className="shell mt-[8vh]">
        {experience.map((job, i) => (
          <li
            key={job.company}
            className="fade group grid grid-cols-12 items-baseline gap-4 border-t border-hairline py-7 transition-colors duration-500 hover:border-signal"
            style={{ "--d": `${i * 0.06}s` } as React.CSSProperties}
          >
            <span className="label col-span-12 md:col-span-2">{job.period}</span>

            <h3 className="col-span-12 font-display text-[clamp(1.6rem,3vw,2.5rem)] leading-none transition-colors duration-500 group-hover:text-signal md:col-span-4">
              {job.company}
            </h3>

            <p className="col-span-12 text-sm text-bone/90 md:col-span-3">{job.role}</p>

            <p className="col-span-12 text-sm text-mute md:col-span-3">{job.note}</p>
          </li>
        ))}
      </ol>

      {education.length > 0 && (
        <div className="shell mt-[10vh]">
          <h2 className="label border-t border-hairline pt-6">(Education)</h2>

          <ol className="mt-8">
            {education.map((entry, i) => (
              <li
                key={`${entry.school}-${entry.credential}`}
                className="fade group grid grid-cols-12 items-baseline gap-4 border-t border-hairline py-7 transition-colors duration-500 hover:border-signal"
                style={{ "--d": `${i * 0.06}s` } as React.CSSProperties}
              >
                <span className="label col-span-12 md:col-span-2">{entry.period}</span>

                <h3 className="col-span-12 font-display text-[clamp(1.6rem,3vw,2.5rem)] leading-none transition-colors duration-500 group-hover:text-signal md:col-span-4">
                  {entry.school}
                </h3>

                <p className="col-span-12 text-sm text-bone/90 md:col-span-3">
                  {entry.credential}
                </p>

                <p className="col-span-12 text-sm text-mute md:col-span-3">
                  {entry.note}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Reveal>
  );
}
