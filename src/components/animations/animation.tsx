'use client'

import React, { lazy, Suspense, useEffect, useState } from "react";

const LazyAnimation = lazy(() => import("lottie-react"));

interface IProps {
  fileName: string,
  className?: string
}

export default function Animation(Props: IProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  // This will be rendered on the client-side
  const AnimationImport = require(`../../../public/animations/${Props.fileName}`);

  return (
    <Suspense fallback={null}>
      <LazyAnimation animationData={AnimationImport}  className={Props.className} />
    </Suspense>
  );
}
