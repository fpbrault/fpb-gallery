import { useEffect } from "react";
import { getPublishedId, useDocumentOperation } from "sanity";
import { client } from "./lib/client";


export const ReferencedBy = (props: any) => {
  const { patch } = useDocumentOperation(
    props.document._id.replace('drafts.', ''),
    'post',
  );
  useEffect(() => {
    client
      .fetch(
        `*[_type == "translation.metadata"
         && references("${getPublishedId(props.document._id)}")] [0] {
      ...
    }`,
      )
      .then((document) => {
        patch.execute([{ set: { translation: document.title } }]);
      })
  }, [])
}