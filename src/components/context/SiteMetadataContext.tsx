"use client";

import React, { createContext, useContext, type ReactNode } from "react";
import type { SiteMetadata } from "@/sanity/types";

const SiteMetadataContext = createContext<SiteMetadata>({} as SiteMetadata);

export const SiteMetadataProvider = ({
  siteMetadata,
  children
}: {
  siteMetadata: SiteMetadata;
  children: ReactNode;
}) => {
  return (
    <SiteMetadataContext.Provider value={siteMetadata}>{children}</SiteMetadataContext.Provider>
  );
};

export const useSiteMetadata = () => {
  return useContext(SiteMetadataContext);
};
