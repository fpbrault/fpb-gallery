"use client";

import { useCallback, type ComponentProps } from "react";
import Link from "next/link";
import { useIsPresentationTool } from "next-sanity/hooks";
import { VisualEditing } from "next-sanity/visual-editing";

import { refreshPreview } from "@/lib/previewRefresh";

type Refresh = NonNullable<ComponentProps<typeof VisualEditing>["refresh"]>;

export function VisualEditingPreview() {
  const isPresentationTool = useIsPresentationTool();
  const refresh = useCallback<Refresh>(async (payload) => {
    const documentType = payload.source === "mutation" ? payload.document?._type : undefined;
    await refreshPreview(documentType);
    if (payload.source === "mutation") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await refreshPreview(documentType);
    }
  }, []);

  return (
    <>
      <VisualEditing refresh={refresh} />
      {!isPresentationTool && (
        <Link
          className="btn btn-primary fixed right-4 bottom-4 z-50 shadow-lg"
          href="/api/exit-preview"
          prefetch={false}
        >
          Exit preview
        </Link>
      )}
    </>
  );
}
