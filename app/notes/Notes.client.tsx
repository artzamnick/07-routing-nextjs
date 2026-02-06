"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

import type { NotesResponse } from "@/types/api";

interface NoteClientProps {
  initialPage: number;
  initialPerPage: number;
  initialSearch: string;
}

interface NotesQueryParams {
  page: number;
  perPage: number;
  search: string;
}

async function fetchNotes({ page, perPage, search }: NotesQueryParams): Promise<NotesResponse> {
  const url = new URL("/api/notes", window.location.origin);
  url.searchParams.set("page", String(page));
  url.searchParams.set("perPage", String(perPage));

  const trimmed = search.trim();
  if (trimmed) url.searchParams.set("search", trimmed);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Could not fetch the list of notes.");

  return res.json();
}

export default function NotesClient({
  initialPage,
  initialPerPage,
  initialSearch,
}: NoteClientProps) {
  const [page, setPage] = useState(initialPage);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [inputValue, setInputValue] = useState(initialSearch);
  const [search, setSearch] = useState(initialSearch);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(inputValue);
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const params = useMemo(
    () => ({ page, perPage: initialPerPage, search }),
    [page, initialPerPage, search]
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", params.page, params.perPage, params.search],
    queryFn: () => fetchNotes(params),

    placeholderData: (prev) => prev,
  });

  if (isLoading) return null;
  if (isError) throw error;
  if (!data) return null;

  return (
    <>
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <SearchBox value={inputValue} onChange={setInputValue} />

        <button type="button" onClick={() => setIsModalOpen(true)}>
          Add note
        </button>
      </div>

      <NoteList notes={data.notes} />

      {}
      {data.totalPages > 1 && (
        <Pagination
          page={page}
          pageCount={data.totalPages}
          onChange={(newPage) => setPage(newPage)}
        />
      )}

      {}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <NoteForm
            onCancel={() => setIsModalOpen(false)}
            onSuccess={() => {
              setIsModalOpen(false);
              setPage(1);
            }}
          />
        </Modal>
      )}
    </>
  );
}
