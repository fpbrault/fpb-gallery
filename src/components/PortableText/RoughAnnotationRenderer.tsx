import { RoughNotation } from "react-rough-notation";

const RoughAnnotationRenderer = (props: { value: any; renderDefault: any }) => {
  const { value, renderDefault } = props;

  return (
    <span className="text-primary-content">
      <RoughNotation
        animate={value?.animate ?? null}
        multiline={true}
        color={value?.color?.hex ?? null}
        type={value?.type || "underline"}
        show={true}
      >
        {renderDefault(props)}
      </RoughNotation>
    </span>
  );
};

export default RoughAnnotationRenderer;
