import { SkillField } from "@/components/SkillField";
import { capabilities } from "@/lib/content";

/**
 * Four disciplines as four columns. The page trace does not reach here — it
 * belongs to the project plates — so this section carries its own interaction:
 * a `SkillField` that lights each skill by how close the cursor is.
 *
 * The list is never hidden. It has to stay readable with JS off, under reduced
 * motion, on touch, and to anything reading the page for keywords.
 */
export function Capabilities() {
  return (
    <section id="capabilities" className="relative z-20 py-[12vh]">
      {/* `data-line-end` is where the work section's trace terminates: its top
          edge is the hairline the line should touch, not overshoot or fall
          short of. See PageLine. */}
      <div
        data-line-end
        className="shell flex items-end justify-between border-t border-hairline pt-6"
      >
        <h2 className="label">Capabilities</h2>
        <span className="label">{capabilities.length} disciplines</span>
      </div>

      <SkillField>
        <ol className="shell mt-[8vh] grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((group) => (
            <li key={group.group} className="flex flex-col gap-5">
              <h3 className="display text-[clamp(1.75rem,2.6vw,2.5rem)] leading-none">
                {group.group}
              </h3>

              <ul className="flex flex-col gap-2.5 border-t border-hairline pt-5">
                {group.items.map((item) => (
                  <li key={item} data-skill className="skill-item label">
                    {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </SkillField>
    </section>
  );
}
