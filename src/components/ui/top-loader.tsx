"server-only";

import * as React from "react";
import { TopLoaderClient } from "./top-loader-client";

export function TopLoader() {
  return (
    <React.Suspense fallback={null}>
      <TopLoaderClient />
    </React.Suspense>
  );
}
