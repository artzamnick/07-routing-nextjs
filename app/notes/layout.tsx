import type { ReactNode } from "react";
import Link from "next/link";
import css from "./layout.module.css";

const TAGS = ["Todo", "Work", "Personal", "Meeting", "Shopping"] as const;

type Props = {
  children: ReactNode;
};

export default function NotesLayout({ children }: Props) {
  return (
    <div className={css.wrapper}>
      <aside className={css.sidebar}>
        <nav>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            <li style={{ marginBottom: 16 }}>
              <Link href="/notes">All notes</Link>
            </li>

            {TAGS.map((tag) => (
              <li key={tag} style={{ marginBottom: 16 }}>
                <Link href={`/notes/filter/${tag}`}>{tag}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className={css.content}>{children}</div>
    </div>
  );
}
