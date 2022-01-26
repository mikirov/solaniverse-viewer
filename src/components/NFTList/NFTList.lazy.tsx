import React, { lazy, Suspense } from 'react';

const LazyNFTList = lazy(() => import('./NFTList'));

const NFTList = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyNFTList {...props} />
  </Suspense>
);

export default NFTList;
