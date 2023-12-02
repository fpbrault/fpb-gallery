export namespace Layout {

export type SocialLink = { url: string; name: string; type: string;}

export type LayoutMetadata = {
    title: string;
    author: string;
    description: string;
    socialLinks: Array<SocialLink>
  }
}