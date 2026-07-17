"use client";

import { createContext } from "react";

import type { PortableImageRegistryEntry } from "@/features/content/portableImageRegistry";

export type PortableImageRegistry = { images: PortableImageRegistryEntry[] };

const ImageContext = createContext<PortableImageRegistry | null>(null);

export default ImageContext;
