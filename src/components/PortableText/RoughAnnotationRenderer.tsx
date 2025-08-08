const RoughAnnotationRenderer = (props: { value: any; renderDefault: any }) => {
  const { value, renderDefault } = props;

  return <span className="text-primary-content">{renderDefault(props)}</span>;
};

export default RoughAnnotationRenderer;
