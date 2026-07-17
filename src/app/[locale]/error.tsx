"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(
      JSON.stringify({ event: "route_error", digest: error.digest, message: error.message })
    );
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-display">Something went wrong</h1>
      <button className="btn btn-primary" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
