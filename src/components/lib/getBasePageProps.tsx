import { getClient } from '@/sanity/lib/client';
import { q } from 'groqd';
import { runQuery, indexQuery } from '../../pages';
import { getHeaderData } from '@/hooks/getHeaderData';

export async function getBasePageProps(context: any, query: any) {
  const preview = context.draftMode || false;
  const previewToken = preview ? process.env.SANITY_READ_TOKEN : ``;
  const client = getClient(previewToken);

  const headerData = await getHeaderData();


  const siteMetadataQuery = q("*", { isArray: true }).filter("_type == 'siteSettings'").slice(0).grab({
    siteTitle: q.string(),
    author: q.string(),
    description: q.string(),
    siteColors: q("siteColors").deref().grab(
      {
        "primary": q.object({
          hex: q.string(),
          rgb: q.object({
            r: q.number(), g: q.number(), b: q.number()
          }
          )
        }
        )
      }
    ),
    socialLinks: q("socialLinks")
  }

  );
  const siteMetadata = await runQuery(siteMetadataQuery);
  if (context.params) {
    context.params.locale = context?.locale
  }
  
  const data = await client.fetch(query, context.params);
  data.headerData = headerData;
  return { data, preview, previewToken, siteMetadata, headerData };
}
