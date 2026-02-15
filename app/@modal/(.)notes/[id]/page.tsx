import { getNoteById } from "@/lib/api";
import NotePreviewClient from "./NotePreview.client";

type Props = {
  params: {
    id: string;
  };
};

export default async function NoteModalPage({ params }: Props) {
  const note = await getNoteById(params.id);
  return <NotePreviewClient note={note} />;
}

