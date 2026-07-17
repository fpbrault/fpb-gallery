"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import PostList from "@/components/Blog/PostList";
import type { Locale, PostSummary } from "@/sanity/types";

export function BlogIndex({
  initialPosts,
  locale,
  totalCount
}: {
  initialPosts: PostSummary[];
  locale: Locale;
  totalCount: number;
}) {
  const [posts, setPosts] = useState(initialPosts);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const [nextCursor, setNextCursor] = useState(initialPosts.at(-1)?.publishDate ?? null);
  const requestRef = useRef<AbortController | null>(null);

  useEffect(() => () => requestRef.current?.abort(), []);

  const loadMore = () => {
    if (!nextCursor) return;

    startTransition(async () => {
      setError(undefined);
      requestRef.current?.abort();
      const controller = new AbortController();
      requestRef.current = controller;
      try {
        const response = await fetch(
          `/api/blog/posts?locale=${locale}&cursor=${encodeURIComponent(nextCursor)}&limit=3`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error(`Request failed with ${response.status}`);
        const payload = (await response.json()) as {
          items: PostSummary[];
          nextCursor: string | null;
        };
        setPosts((current) => [...current, ...payload.items]);
        setNextCursor(payload.nextCursor);
      } catch (cause) {
        if (!(cause instanceof DOMException && cause.name === "AbortError")) {
          setError(cause instanceof Error ? cause.message : "Unable to load more posts");
        }
      } finally {
        if (requestRef.current === controller) requestRef.current = null;
      }
    });
  };

  return (
    <>
      <PostList posts={posts} />
      {error && (
        <p role="alert" className="mt-4 text-error">
          {error}
        </p>
      )}
      {posts.length < totalCount && (
        <button
          className="mx-auto mt-12 mb-2 btn btn-primary"
          disabled={isPending}
          onClick={loadMore}
        >
          {isPending ? "Loading…" : "Load More"}
        </button>
      )}
    </>
  );
}
