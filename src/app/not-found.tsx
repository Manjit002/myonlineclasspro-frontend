import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center gap-6 px-6 py-32 text-center">
      <p className="font-display gold-gradient-text text-7xl tracking-widest sm:text-8xl">
        404
      </p>
      <h1 className="section-h text-text-primary">Page not found</h1>
      <p className="text-text-secondary max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link href="/">
        <Button>Back to home</Button>
      </Link>
    </main>
  );
}
