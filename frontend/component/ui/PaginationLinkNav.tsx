"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function PaginationLinkNav({
  currentPage,
  totalPages,
  isLoading,
}: {
  currentPage: number;
  totalPages: number;
  isLoading?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pageInput, setPageInput] = useState(String(currentPage));

  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  if (totalPages <= 1) {
    return null;
  }

  const goToPage = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    const params = new URLSearchParams(searchParams.toString());

    if (nextPage === 1) {
      params.delete("page");
    } else {
      params.set("page", String(nextPage));
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    commitPageInput();
  };

  const commitPageInput = () => {
    const parsedPage = Number(pageInput);

    if (!Number.isFinite(parsedPage)) {
      setPageInput(String(currentPage));
      return;
    }

    goToPage(parsedPage);
  };

  return (
    <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-[11px] uppercase tracking-[0.2em]">
      <button
        type="button"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1 || isLoading}
        className="rounded-xl border border-card-border px-4 py-2 text-text-sub transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:text-text-sub/40"
      >
        Previous
      </button>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 text-text-sub">
        <span>Page</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={pageInput}
          onChange={(event) => setPageInput(event.target.value)}
          onBlur={commitPageInput}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitPageInput();
            }
          }}
          disabled={isLoading}
          className="w-20 rounded-xl border border-card-border bg-background px-3 py-2 text-center text-text-main outline-none transition focus:border-accent disabled:cursor-not-allowed disabled:text-text-sub/40"
        />
        <span>of {totalPages}</span>
      </form>
      <button
        type="button"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages || isLoading}
        className="rounded-xl border border-card-border px-4 py-2 text-text-sub transition hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:text-text-sub/40"
      >
        Next
      </button>
    </div>
  );
}
