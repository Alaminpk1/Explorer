import { splitOnMatch } from "@/lib/workspace";
import styles from "./HighlightedText.module.scss";

// React nodes, not an HTML string. File names are user input, so innerHTML here
// would be unsafe.
export function HighlightedText({ text, query }: { text: string; query: string }) {
  const segments = splitOnMatch(text, query);

  return (
    <>
      {segments.map((segment, index) =>
        segment.matched ? (
          <mark key={index} className={styles.match}>
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </>
  );
}
