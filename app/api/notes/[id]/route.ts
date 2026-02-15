import { NextResponse } from "next/server";
import {
  deleteNoteById,
  getHttpMessage,
  getHttpStatus,
  getNoteById,
} from "@/lib/api";

type Params = Promise<{ id: string }>;

export async function GET(
  _: Request,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const note = await getNoteById(id);
    return NextResponse.json(note);
  } catch (err) {
    return NextResponse.json(
      { message: getHttpMessage(err) },
      { status: getHttpStatus(err) }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Params }
) {
  try {
    const { id } = await params;
    const result = await deleteNoteById(id);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { message: getHttpMessage(err) },
      { status: getHttpStatus(err) }
    );
  }
}
