import * as axeCore from "axe-core";
import { expect } from "vitest";

export async function expectNoAccessibilityViolations(container: Element) {
  const { violations } = await axeCore.run(container);

  expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
}
