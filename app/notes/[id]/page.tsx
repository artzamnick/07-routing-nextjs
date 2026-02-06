import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import NoteDetails from "./NoteDetails.client";
import css from "./page.module.css";
import { getNoteById } from "@/lib/api";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NoteDetailsPage({ params }: Props) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => getNoteById(id),
  });

  return (
    <main className={css.main}>
      <div className={css.container}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <NoteDetails id={id} />
        </HydrationBoundary>
      </div>
    </main>
  );
}
