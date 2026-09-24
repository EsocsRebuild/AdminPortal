import { Page } from "@/components/layout/page";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Page aria-busy>
      <div className="grid gap-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-page sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-32 rounded-card" />
        ))}
      </div>
      <Skeleton className="h-96 rounded-card" />
    </Page>
  );
}
