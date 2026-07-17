import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  isPresentationTool: false,
  refreshPreview: vi.fn()
}));

vi.mock("next-sanity/hooks", () => ({
  useIsPresentationTool: () => mocks.isPresentationTool
}));
vi.mock("@/lib/previewRefresh", () => ({ refreshPreview: mocks.refreshPreview }));
vi.mock("next-sanity/visual-editing", () => ({
  VisualEditing: ({ refresh }: { refresh: (payload: { source: string }) => Promise<void> }) => (
    <button data-testid="visual-editing" onClick={() => void refresh({ source: "mutation" })} />
  )
}));

import { VisualEditingPreview } from "@/components/VisualEditingPreview";

describe("VisualEditingPreview", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mocks.isPresentationTool = false;
    mocks.refreshPreview.mockReset().mockResolvedValue(undefined);
  });

  afterEach(() => vi.useRealTimers());

  it("refreshes immediately and after the mutation consistency window", async () => {
    render(<VisualEditingPreview />);
    fireEvent.click(screen.getByTestId("visual-editing"));

    expect(mocks.refreshPreview).toHaveBeenCalledTimes(1);
    await act(() => vi.advanceTimersByTimeAsync(1000));
    expect(mocks.refreshPreview).toHaveBeenCalledTimes(2);
  });

  it("shows the exit link only outside Presentation", () => {
    const { rerender } = render(<VisualEditingPreview />);
    expect(screen.getByRole("link", { name: "Exit preview" })).toHaveAttribute(
      "href",
      "/api/exit-preview"
    );

    mocks.isPresentationTool = true;
    rerender(<VisualEditingPreview />);
    expect(screen.queryByRole("link", { name: "Exit preview" })).not.toBeInTheDocument();
  });
});
