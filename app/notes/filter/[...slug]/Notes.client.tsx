"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

import type { NotesResponse } from "@/types/api";

type Props = {
  tag?: string;
};

type NotesQueryParams = {
  page: number;
  perPage: number;
  search: string;
  tag?: string;
};

const PER_PAGE = 12;

async function fetchNotes({ page, perPage, search, tag }: NotesQueryParams): Promise<NotesResponse> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("perPage", String(perPage));

  const trimmed = search.trim();
  if (trimmed) params.set("search", trimmed);

  if (tag) params.set("tag", tag);

  const res = await fetch(`/api/notes?${params.toString()}`);
  if (!res.ok) throw new Error("Could not fetch the list of notes.");

  return res.json();
}

function NotesClientInner({ tag }: Props) {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(inputValue);
      setPage(1);
    }, 350);

    return () => clearTimeout(t);
  }, [inputValue]);

  const params = useMemo(
    () => ({ page, perPage: PER_PAGE, search, tag }),
    [page, search, tag]
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", params.page, params.perPage, params.search, params.tag ?? "all"],
    queryFn: () => fetchNotes(params),
    placeholderData: (prev) => prev,
  });

  if (isLoading) return null;
  if (isError) throw (error as Error);
  if (!data) return null;

  return (
    <>
      <div style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "center" }}>
        <SearchBox value={inputValue} onChange={setInputValue} />

        <button type="button" onClick={() => setIsModalOpen(true)}>
          Add note
        </button>
      </div>

      {data.totalPages > 1 && (
        <div style={{ marginBottom: 24 }}>
          <Pagination
            page={page}
            pageCount={data.totalPages}
            onChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}

      <NoteList notes={data.notes} />

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

export default function NotesClient({ tag }: Props) {
  return <NotesClientInner key={tag ?? "all"} tag={tag} />;
}
