import type { NoteTag } from "@/types/note";
import NotesClient from "./Notes.client";

type Props = {
  params: { slug: string };
};

export default function FilteredNotesPage({ params }: Props) {
  const tag = params.slug === "all" ? undefined : (params.slug as NoteTag);

  return <NotesClient key={tag ?? "all"} tag={tag} />;
}
