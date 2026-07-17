import type { PreviewProps } from "sanity";
import ReactPlayer from "react-player";

interface PreviewYouTubeProps extends PreviewProps {
  selection?: {
    url: string;
  };
}

export function YouTubePreview(props: PreviewYouTubeProps) {
  const { selection } = props;
  const url = selection?.url;
  return <>{url ? <ReactPlayer src={url} /> : <span>Add a YouTube URL</span>}</>;
}
