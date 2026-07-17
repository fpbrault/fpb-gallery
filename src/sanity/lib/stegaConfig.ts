export function createStegaConfig(enabled: boolean) {
  return { enabled, studioUrl: "/studio" } as const;
}
