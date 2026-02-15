import axios, { AxiosError } from "axios";
import type { CreateNotePayload, Note } from "@/types/note";
import type { FetchNotesParams, NotesResponse } from "@/types/api";

const API_BASE = "https://notehub-public.goit.study/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export class ApiError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getToken(): string {
  const token =
    process.env.NEXT_PUBLIC_NOTEHUB_TOKEN ?? process.env.NOTEHUB_TOKEN;

  if (!token) {
    throw new Error("Missing NOTEHUB_TOKEN or NEXT_PUBLIC_NOTEHUB_TOKEN in env");
  }

  return token;
}

function getAuthHeaders(): { Authorization: string } {
  return {
    Authorization: `Bearer ${getToken()}`,
  };
}

function toApiError(err: unknown): ApiError {
  if (axios.isAxiosError(err)) {
    const axErr = err as AxiosError<{ message?: string }>;
    const status = axErr.response?.status ?? 500;

    const message =
      axErr.response?.data?.message ??
      axErr.message ??
      `Request failed with status ${status}`;

    return new ApiError(message, status);
  }

  if (err instanceof Error) {
    return new ApiError(err.message, 500);
  }

  return new ApiError("Unknown error", 500);
}

export function getHttpMessage(error: unknown): string {
  return toApiError(error).message;
}

export function getHttpStatus(error: unknown): number {
  return toApiError(error).status;
}

export async function getNotes(params: FetchNotesParams = {}): Promise<NotesResponse> {
  try {
    const page = params.page ?? 1;
    const perPage = params.perPage ?? 12;

    const response = await api.get<NotesResponse>("/notes", {
      params: {
        page,
        perPage,
        ...(params.search ? { search: params.search } : {}),
        ...(params.tag ? { tag: params.tag } : {}), 
      },
      headers: getAuthHeaders(),
    });

    return response.data;
  } catch (err) {
    throw toApiError(err);
  }
}

export async function getNoteById(id: string): Promise<Note> {
  if (!id) throw new Error("Note id is required");

  try {
    const response = await api.get<Note>(`/notes/${id}`, {
      headers: getAuthHeaders(),
    });

    return response.data;
  } catch (err) {
    throw toApiError(err);
  }
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  try {
    const response = await api.post<Note>("/notes", payload, {
      headers: getAuthHeaders(),
    });

    return response.data;
  } catch (err) {
    throw toApiError(err);
  }
}

export async function deleteNoteById(id: string): Promise<Note> {
  if (!id) throw new Error("Note id is required");

  try {
    const response = await api.delete<Note>(`/notes/${id}`, {
      headers: getAuthHeaders(),
    });

    return response.data;
  } catch (err) {
    throw toApiError(err);
  }
}