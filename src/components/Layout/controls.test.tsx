import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { LocaleProvider } from "@/components/context/LocaleContext";
import { expectNoAccessibilityViolations } from "@/test/accessibility";
import { LanguageSwitcher } from "./LanguageSwitcher";
import ThemeSelector from "./ThemeSelector";

vi.mock("next/navigation", () => ({ usePathname: () => "/gallery" }));
vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={String(href)} {...props}>
      {children}
    </a>
  )
}));

describe("site controls", () => {
  it("exposes the localized language destination", async () => {
    const view = render(
      <LocaleProvider locale="en">
        <LanguageSwitcher />
      </LocaleProvider>
    );
    expect(screen.getByRole("link", { name: "Switch language to French" })).toHaveAttribute(
      "href",
      "/fr/gallery"
    );
    await expectNoAccessibilityViolations(view.container);
  });

  it("labels and persists the theme control", async () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });
    const user = userEvent.setup();
    document.documentElement.dataset.theme = "light";
    const view = render(<ThemeSelector />);
    const control = screen.getByRole("checkbox", { name: "Toggle light and dark theme" });
    expect(control.parentElement).toHaveClass("toggle");
    expect(control).not.toHaveClass("toggle");
    await user.click(control);
    expect(localStorage.getItem("theme")).toBe("mytheme");
    expect(document.documentElement.dataset.theme).toBe("mytheme");
    await expectNoAccessibilityViolations(view.container);
  });
});
