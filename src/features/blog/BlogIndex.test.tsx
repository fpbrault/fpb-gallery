import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { PostSummary } from "@/features/blog/models";
import { BlogIndex } from "./BlogIndex";

vi.mock("@/components/Blog/PostList", () => ({
  default: ({ posts }: { posts: PostSummary[] }) => (
    <ul data-testid="posts">
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}));

const firstPost = {
  id: "post-1",
  coverImage: null,
  excerpt: "First excerpt",
  publishDate: "2026-07-17T00:00:00.000Z",
  slug: "first",
  title: "First post"
} satisfies PostSummary;

const secondPost = {
  id: "post-2",
  coverImage: null,
  excerpt: "Second excerpt",
  publishDate: "2026-07-16T00:00:00.000Z",
  slug: "second",
  title: "Second post"
} satisfies PostSummary;

describe("BlogIndex", () => {
  beforeEach(() => vi.restoreAllMocks());
  afterEach(() => vi.unstubAllGlobals());

  it("loads the next page, appends posts, and removes the control at the end", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ items: [secondPost], nextCursor: null }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      })
    );
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();

    render(
      <BlogIndex
        initialPosts={[firstPost]}
        initialCursor="cursor-1"
        locale="fr"
        totalCount={2}
      />
    );

    await user.click(screen.getByRole("button", { name: "Load More" }));

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/blog/posts?locale=fr&cursor=cursor-1&limit=3",
      expect.objectContaining({ signal: expect.any(AbortSignal) })
    );
    expect(await screen.findByText("Second post")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Load More" })).not.toBeInTheDocument();
  });

  it("surfaces API failures and keeps the user able to retry", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 503 })));
    const user = userEvent.setup();

    render(
      <BlogIndex
        initialPosts={[firstPost]}
        initialCursor="cursor-1"
        locale="en"
        totalCount={2}
      />
    );

    await user.click(screen.getByRole("button", { name: "Load More" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Request failed with 503");
    expect(screen.getByRole("button", { name: "Load More" })).toBeEnabled();
  });

  it("aborts an in-flight request when the component unmounts", async () => {
    let requestSignal: AbortSignal | undefined;
    vi.stubGlobal(
      "fetch",
      vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
        requestSignal = init?.signal ?? undefined;
        return new Promise<Response>((_resolve, reject) => {
          requestSignal?.addEventListener("abort", () => {
            reject(new DOMException("Aborted", "AbortError"));
          });
        });
      })
    );
    const user = userEvent.setup();

    const view = render(
      <BlogIndex
        initialPosts={[firstPost]}
        initialCursor="cursor-1"
        locale="en"
        totalCount={2}
      />
    );

    await user.click(screen.getByRole("button", { name: "Load More" }));
    await waitFor(() => expect(requestSignal).toBeDefined());

    view.unmount();

    expect(requestSignal?.aborted).toBe(true);
  });
});
