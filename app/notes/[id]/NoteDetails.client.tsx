"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { getNoteById } from "@/lib/api";
import type { Note } from "@/types/note";

import css from "./NoteDetails.module.css";

interface Props {
  id: string;
}

export default function NoteDetails({ id }: Props) {
  const { data: note, isLoading, isError, error } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => getNoteById(id),
    enabled: Boolean(id),
    refetchOnMount: false,
    throwOnError: true,
  });

  if (isLoading) return null;
  if (isError) throw (error as Error);
  if (!note) return null;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
          <Link href="/notes/filter/all">Back to Notes</Link>
        </div>

        <span className={css.tag}>{note.tag}</span>

        <p className={css.content}>{note.content}</p>

        <p className={css.date}>
          {note.updatedAt ? note.updatedAt : note.createdAt}
        </p>
      </div>
    </div>
  );
}
