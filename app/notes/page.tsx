import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import NotesClient from "./Notes.client";
import css from "./page.module.css";
import { getNotes } from "@/lib/api";

type Props = {
  searchParams?: Record<string, string | string[] | undefined>;
};

function pickFirst(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function NotesPage({ searchParams }: Props) {
  const sp = searchParams ?? {};

  const page = Number(pickFirst(sp.page) ?? "1");
  const perPage = Number(pickFirst(sp.perPage) ?? "12");
  const search = pickFirst(sp.search) ?? "";

  const initialPage = Number.isFinite(page) && page > 0 ? page : 1;
  const initialPerPage = Number.isFinite(perPage) && perPage > 0 ? perPage : 12;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", initialPage, initialPerPage, search],
    queryFn: () => getNotes({ page: initialPage, perPage: initialPerPage, search }),
  });

  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Notes</h1>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <NotesClient
            initialPage={initialPage}
            initialPerPage={initialPerPage}
            initialSearch={search}
          />
        </HydrationBoundary>
      </div>
    </main>
  );
}
