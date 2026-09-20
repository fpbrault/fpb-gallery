import type { StegaBranded } from "next-sanity";

export type SanityData<T> = T | StegaBranded<T>;
