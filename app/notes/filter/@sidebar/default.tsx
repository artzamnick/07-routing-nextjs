"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import css from "./default.module.css";

import type { FetchTagNote } from "@/types/note";

const TAGS: FetchTagNote[] = [
  "all",
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

export default function Sidebar() {
  const activeTag = useSelectedLayoutSegment() ?? "all";

  return (
    <ul className={css.menuList}>
      {TAGS.map((tag) => (
        <li key={tag} className={css.menuItem}>
          <Link
            href={`/notes/filter/${tag}`}
            className={`${css.menuLink} ${
              activeTag === tag ? css.active : ""
            }`}
          >
            {tag === "all" ? "All notes" : tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
