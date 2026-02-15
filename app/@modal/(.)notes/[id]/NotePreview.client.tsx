"use client";

import { useRouter } from "next/navigation";
import Modal from "@/components/Modal/Modal";
import type { Note } from "@/types/note";

type Props = {
  note: Note;
};

export default function NotePreviewClient({ note }: Props) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <Modal isOpen={true} onClose={handleClose}>
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
