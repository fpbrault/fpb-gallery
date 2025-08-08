import React, { useRef } from "react";
import { useInView } from "react-intersection-observer";

export function PTRoughNotation(props: any) {
  const { ref, inView } = useInView({
    triggerOnce: true, // Only trigger once
    rootMargin: "-100px 0px", // Adjust this margin based on your needs
    delay: 0
  });

  return <span ref={ref}>{<>{props.children}</>}</span>;
}
