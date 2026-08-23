/**
 * Splits a short label into per-letter spans so hover can stagger across it.
 * The whole timing lives in CSS (`.letters` in globals.css) — this only supplies
 * the index each letter animates on.
 *
 * Only for short labels. The split text is hidden from assistive tech and the
 * intact string is exposed via `aria-label`.
 */
export function HoverLetters({ text }: { text: string }) {
  return (
    <span className="letters" aria-label={text}>
      {Array.from(text).map((char, i) => (
        <span
          key={`${char}-${i}`}
          className="letter"
          style={{ "--i": i } as React.CSSProperties}
          aria-hidden
        >
          {char === " " ? " " : char}
        </span>
      ))}
    </span>
  );
}
