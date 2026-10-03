"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/**
 * App-level error boundary. Next.js renders this in place of the route
 * when a render throws, keeping the shell (nav/footer) intact rather
 * than blanking the whole page.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Surfaced in the browser console / server logs so the failure is
    // diagnosable rather than silently swallowed.
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-6 py-32 text-center">
      <h1 className="section-h text-text-primary">Something went wrong</h1>
      <p className="text-text-secondary max-w-md">
        An unexpected error occurred. You can try again, or head back to the
        homepage.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="secondary" onClick={() => router.push("/")}>
          Go home
        </Button>
      </div>
    </main>
  );
}
