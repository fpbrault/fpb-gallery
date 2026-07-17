import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LocaleProvider } from "@/components/context/LocaleContext";
import { PTExternalLink } from "@/components/PortableText/PTExternalLink";
import { PTInternalLink } from "@/components/PortableText/PTInternalLink";

vi.mock("next/navigation", () => ({ usePathname: () => "/fr/blog" }));
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={String(href)} {...props}>
      {children}
    </a>
  )
}));

describe("Portable Text links", () => {
  it("localizes internal content links", () => {
    render(
      <LocaleProvider locale="fr">
        <PTInternalLink value={{ type: "post", slug: { current: "nouveau" } }}>
          Article
        </PTInternalLink>
      </LocaleProvider>
    );

    expect(screen.getByRole("link", { name: "Article" })).toHaveAttribute(
      "href",
      "/fr/blog/nouveau"
    );
  });

  it("opens external links in the requested browsing context", () => {
    const { rerender } = render(
      <PTExternalLink value={{ href: "https://example.com" }}>Example</PTExternalLink>
    );
    expect(screen.getByRole("link", { name: "Example" })).not.toHaveAttribute("target");

    rerender(
      <PTExternalLink value={{ blank: true, href: "https://example.com" }}>Example</PTExternalLink>
    );
    expect(screen.getByRole("link", { name: "Example" })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: "Example" })).toHaveAttribute(
      "rel",
      "noopener noreferrer"
    );
  });
});
