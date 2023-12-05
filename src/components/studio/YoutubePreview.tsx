import type { PreviewProps } from "sanity";
import YouTubePlayer from "react-player/youtube";

interface PreviewYouTubeProps extends PreviewProps {
  selection?: {
    url: string;
  };
}

export function YouTubePreview(props: PreviewYouTubeProps) {
  const { selection } = props;
  const url = selection?.url;
  return <>{url ? <YouTubePlayer url={url} /> : <span>Add a YouTube URL</span>}</>;
}
