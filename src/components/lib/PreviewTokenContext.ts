import React from 'react';

const PreviewTokenContext = React.createContext<null| string>(null);

export const PreviewTokenProvider = PreviewTokenContext.Provider;

export default PreviewTokenContext;