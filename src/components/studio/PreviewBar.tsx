import Link from 'next/link';

export function PreviewBar() {
  return (<div className="fixed clear-both w-32 px-4 mx-auto prose prose-lg text-center bg-red-500 rounded left-4 bottom-4 prose-blue">
    <Link href="/api/exit-preview">Exit preview</Link>
  </div>);
}
