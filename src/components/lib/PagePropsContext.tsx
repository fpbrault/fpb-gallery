import React, { createContext, useContext } from "react";

const PagePropsContext = createContext<any>({} as any);

export const PagePropsProvider = ({ pageProps, children }: { pageProps: any; children: any }) => {
  return <PagePropsContext.Provider value={pageProps}>{children}</PagePropsContext.Provider>;
};

export const usePageProps = () => {
  return useContext(PagePropsContext);
};
