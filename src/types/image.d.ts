export type CustomImage = {
  src: string;
  width: number;
  height: number;
  _key?: string;
  title?: string;
  thumbnailSrc?: string;
  placeholders?: { metadata: { lqip: string } };
};
