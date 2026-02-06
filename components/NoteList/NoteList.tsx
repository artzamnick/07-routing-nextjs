"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Note } from "@/types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

async function deleteNote(noteId: string): Promise<void> {
  const res = await fetch(`/api/notes/${noteId}`, { method: "DELETE" });

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new Error(data?.message || "Could not delete the note.");
  }
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const { mutate: onDelete, isPending, isError, error } = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return (
    <>
      {isError && (
        <p className={css.content}>
          {error instanceof Error ? error.message : "Could not delete the note."}
        </p>
      )}

      <ul className={css.list}>
        {notes.map((note) => (
          <li key={note.id} className={css.listItem}>
            <h2 className={css.title}>{note.title}</h2>

            <p className={css.content}>{note.content}</p>

            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>

              <div>
                <Link href={`/notes/${note.id}`} className={css.link}>
                  View details
                </Link>

                <button
                  type="button"
                  className={css.button}
                  onClick={() => onDelete(note.id)}
                  disabled={isPending}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
