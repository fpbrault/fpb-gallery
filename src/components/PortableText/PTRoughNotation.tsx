import React, { useRef } from "react";
import { RoughNotation } from "react-rough-notation";
import { useInView } from "react-intersection-observer";

export function PTRoughNotation(props: any) {
  const { ref, inView } = useInView({
    triggerOnce: true, // Only trigger once
    rootMargin: "-100px 0px", // Adjust this margin based on your needs
    delay: 0
  });

  return (
    <span ref={ref}>
     {inView ?( <RoughNotation
        animate={props?.value?.animate ?? false}
        multiline={true}

        order={props?.value?.order ?? 1}
        color={props?.value?.color?.hex ?? null}
        type={props?.value?.type || "underline"}
        show={false}
      >
        {props.children}
      </RoughNotation>): (<>{props.children}</>)
    }
    </span>
  );
}
