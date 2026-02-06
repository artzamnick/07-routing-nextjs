"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { Note } from "@/types/note";
import css from "./NoteDetails.module.css";

interface Props {
  id: string;
}

async function fetchNote(id: string): Promise<Note> {
  const res = await fetch(`/api/notes/${id}`);

  if (!res.ok) {
    throw new Error("Could not fetch note details.");
  }

  return res.json();
}

export default function NoteDetails({ id }: Props) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNote(id),
    enabled: Boolean(id),

    refetchOnMount: false,
  });

  if (isLoading) return null;
  if (isError) throw error;
  if (!data) return null;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{data.title}</h2>
          <Link href="/notes">Back to Notes</Link>
        </div>

        <span className={css.tag}>{data.tag}</span>

        <p className={css.content}>{data.content}</p>

        <p className={css.date}>{new Date(data.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
