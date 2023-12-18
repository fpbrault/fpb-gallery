import dynamic from "next/dynamic";
import React from "react";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export function PTYoutube(value: any) {
  return (
    <div className="flex justify-center py-2">
      <div className="w-full ">
        <ReactPlayer
          wrapper={({ children }) => {
            return (
              <div className="max-w-3xl mx-auto overflow-hidden aspect-video rounded-2xl nm-concave-slate-800-sm">
                {children}
              </div>
            );
          }}
          url={value?.url ?? ""}
        />
      </div>
    </div>
  );
}
