/**
 * Route-level loading UI. Rendered automatically by Next.js while a
 * route segment's data resolves -- skeleton bars rather than a spinner,
 * so the layout the user is about to see is already sketched in and the
 * content doesn't jump when it arrives.
 */
export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-20 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-6">
        <div className="bg-bg-3 h-10 w-2/3 rounded-md" />
        <div className="bg-bg-3 h-4 w-full rounded-sm" />
        <div className="bg-bg-3 h-4 w-5/6 rounded-sm" />
        <div className="grid gap-4 pt-6 sm:grid-cols-3">
          <div className="bg-bg-3 h-36 rounded-lg" />
          <div className="bg-bg-3 h-36 rounded-lg" />
          <div className="bg-bg-3 h-36 rounded-lg" />
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </main>
  );
}
