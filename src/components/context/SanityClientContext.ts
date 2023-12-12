import { SanityClient } from 'next-sanity';
import React from 'react';

const SanityClientContext = React.createContext<SanityClient | null>(null);

export const SanityClientProvider = SanityClientContext.Provider;

export default SanityClientContext;