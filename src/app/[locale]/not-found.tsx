import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-5xl font-display">Page not found</h1>
      <Link className="btn btn-primary" href="/">
        Return home
      </Link>
    </div>
  );
}
