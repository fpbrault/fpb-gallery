// usePageData.ts
import { client } from "@/sanity/lib/client";

export async function getHeaderData() {
  let headerData;
  try {
    const result = await client.fetch(`*[_type == "pageList" && defined(pages)][0]{
      showHome,
            "pages": pages[]{
               "title": coalesce(title, title),
               "title_fr": coalesce(title_fr, title),
              "slug": coalesce(slug.current, slug),
              "slug_fr": coalesce(slug_fr.current, slug)
              ,
              "_translations": {"_translations": *[_type == "translation.metadata" && references(^->._id)].translations[].value->{
                slug,
                title,
                language
              }
                        }
            }
          }`);
    headerData = result;
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return headerData;
}
