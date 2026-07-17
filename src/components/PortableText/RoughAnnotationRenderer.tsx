import type { BlockAnnotationProps } from "sanity";

const RoughAnnotationRenderer = (props: BlockAnnotationProps) => {
  const { renderDefault } = props;

  return <span className="text-primary-content">{renderDefault(props)}</span>;
};

export default RoughAnnotationRenderer;
