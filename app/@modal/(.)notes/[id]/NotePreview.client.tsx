"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import Modal from "@/components/Modal/Modal";
import { getNoteById } from "@/lib/api";
import type { Note } from "@/types/note";

type Props = {
  id: string;
};

export default function NotePreviewClient({ id }: Props) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  const { data: note, isLoading, isError, error } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => getNoteById(id),
    throwOnError: true,
  });

  if (isLoading) return null;
  if (isError) throw (error as Error);
  if (!note) return null;

  return (
    <Modal onClose={handleClose}>
      <article style={{ padding: 8, maxWidth: 500 }}>
        <h2 style={{ marginBottom: 12 }}>{note.title}</h2>

        {note.content ? (
          <p style={{ marginBottom: 12, whiteSpace: "pre-wrap" }}>
            {note.content}
          </p>
        ) : null}

        <p style={{ marginBottom: 16 }}>
          <b>Tag:</b> {note.tag}
        </p>

        <button type="button" onClick={handleClose}>
          Close
        </button>
      </article>
    </Modal>
  );
}

