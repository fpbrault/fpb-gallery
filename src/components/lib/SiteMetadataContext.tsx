import React, { createContext, useContext } from "react";
import { CustomSiteMetadata, SiteMetadata } from "./getBasePageProps";

const SiteMetadataContext = createContext<CustomSiteMetadata>({} as CustomSiteMetadata);

export const SiteMetadataProvider = ({
  siteMetadata,
  children
}: {
  siteMetadata: CustomSiteMetadata;
  children: any;
}) => {
  return (
    <SiteMetadataContext.Provider value={siteMetadata}>{children}</SiteMetadataContext.Provider>
  );
};

export const useSiteMetadata = () => {
  return useContext(SiteMetadataContext);
};
