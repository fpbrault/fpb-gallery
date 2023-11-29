import { revalidatePath } from "next/cache";
import { useMemo, useState } from "react";

export function createAsyncPublishAction(originalAction : any, context: any) {
    const client = context.getClient({ apiVersion: '2022-11-29'})
    const AsyncPublishAction = (props: any) => {
      const originalResult = originalAction(props)
      const [status, setStatus] = useState("pending");
  
      const label = useMemo(() => {
        switch (status) {
          case "success":
            return "Updated";
          case "error":
            return "Something went wrong";
          default:
            return "Update blog";
        }
      }, [status]);
    
      if (props.type !== "post") {
        return null;
      }
      return {
        ...originalResult,
        onHandle: async () => {
            try {
                console.log(props.draft.slug.current)
              const rev = await fetch(`/api/revalidate?slug=${props.draft.slug.current}`);
      console.log(rev, "test")
              setStatus("success");
            } catch (err) {
                console.log(err)
              setStatus("error");
            } finally {
              // Signal that the action is completed
              props.onComplete();
            }
          originalResult.onHandle()
        },
      }
    }
    return AsyncPublishAction
  }

export function PostUpdate(props: { type: string; onComplete: () => void; }) {
    const [status, setStatus] = useState("pending");
  
    const label = useMemo(() => {
      switch (status) {
        case "success":
          return "Updated";
        case "error":
          return "Something went wrong";
        default:
          return "Update blog";
      }
    }, [status]);
  
    if (props.type !== "post") {
      return null;
    }
  
    return {
      label,
      onHandle: async () => {
        // this gets called when the button is clicked
        try {
            console.log(props)
          //await revalidatePath(`/blog/${props.published.slug.current}`);
  
          setStatus("success");
        } catch (err) {
          setStatus("error");
        } finally {
          // Signal that the action is completed
          props.onComplete();
        }
      },
    };
  }