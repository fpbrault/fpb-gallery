import { useCallback, useState } from "react";
import { Card, Select, Stack, Text } from "@sanity/ui";
import { set, unset, type StringInputProps } from "sanity";

const fontFamilies: Record<string, string> = {
  comfortaa: "Comfortaa, sans-serif",
  dmSans: "DM Sans, sans-serif",
  dosis: "Dosis, sans-serif",
  inter: "Inter, sans-serif",
  josefinSans: "Josefin Sans, sans-serif",
  libreFranklin: "Libre Franklin, sans-serif",
  montserrat: "Montserrat, sans-serif",
  nunito: "Nunito, sans-serif",
  raleway: "Raleway, sans-serif",
  rokkitt: "Rokkitt, serif",
  spaceGrotesk: "Space Grotesk, sans-serif",
  vollkorn: "Vollkorn, serif"
};

export default function FontPreview(props: StringInputProps) {
  const { onChange, value = "" } = props;
  const [testText, setTestText] = useState("My voice is my passport");
  const fontFamily = fontFamilies[value] ?? fontFamilies.raleway;
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const nextValue = event.currentTarget.value;
      onChange(nextValue ? set(nextValue) : unset());
    },
    [onChange]
  );

  return (
    <Stack space={3}>
      <Select onChange={handleChange} value={value}>
        {(props.schemaType.options?.list ?? []).map((option) =>
          typeof option === "string" ? (
            <option key={option} value={option}>
              {option}
            </option>
          ) : (
            <option key={option.value} value={option.value}>
              {option.title}
            </option>
          )
        )}
      </Select>
      <label htmlFor="textPreviewInput">Font preview</label>
      <input
        id="textPreviewInput"
        style={{
          background: "white",
          borderRadius: 6,
          color: "black",
          fontFamily,
          fontSize: 24,
          padding: 16,
          width: "100%"
        }}
        value={testText}
        onChange={(event) => setTestText(event.target.value)}
      />
      <Card padding={4} style={{ fontFamily, textAlign: "center" }}>
        <Text size={4}>{testText}</Text>
      </Card>
    </Stack>
  );
}
