type LocalizedStringEntry = {
  language?: string;
  value: string;
};

export function getLocalizedString(value: unknown, locale: "en" | "fr"): string {
  if (!Array.isArray(value)) return "";

  const entries = value.filter(
    (entry): entry is LocalizedStringEntry =>
      typeof entry === "object" &&
      entry !== null &&
      "value" in entry &&
      typeof entry.value === "string"
  );

  return entries.find((entry) => entry.language === locale)?.value ?? entries[0]?.value ?? "";
}
