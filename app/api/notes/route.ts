import { NextResponse } from "next/server";
import { createNote, getHttpMessage, getNotes } from "@/lib/api";
import type { CreateNotePayload } from "@/types/note";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const page = Number(url.searchParams.get("page") ?? "1");
    const perPage = Number(url.searchParams.get("perPage") ?? "12");
    const search = url.searchParams.get("search") ?? "";

    const data = await getNotes({
      page: Number.isFinite(page) && page > 0 ? page : 1,
      perPage: Number.isFinite(perPage) && perPage > 0 ? perPage : 12,
      search,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: getHttpMessage(error) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<CreateNotePayload>;

    const title = (body.title ?? "").trim();
    const content = (body.content ?? "").trim();
    const tag = body.tag;

    if (!title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    if (!tag) {
      return NextResponse.json({ message: "Tag is required" }, { status: 400 });
    }

    const note = await createNote({
      title,
      content: content || undefined,
      tag,
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: getHttpMessage(error) },
      { status: 500 }
    );
  }
}
