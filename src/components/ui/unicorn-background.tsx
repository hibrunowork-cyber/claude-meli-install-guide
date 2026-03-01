"use client";

import { useEffect, useState } from "react";

export function UnicornBackground() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    if (!(window as any).UnicornStudio) {
      (window as any).UnicornStudio = { isInitialized: false };
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js";
      s.onload = () => {
        if (!(window as any).UnicornStudio.isInitialized) {
          (window as any).UnicornStudio.init();
          (window as any).UnicornStudio.isInitialized = true;
        }
      };
      (document.head || document.body).appendChild(s);
    }
    return () => {
      (window as any).UnicornStudio?.destroy?.();
    };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "none", opacity: visible ? 0.5 : 0, transition: "opacity 0.6s ease" }}>
      <div
        data-us-project="aNQ1HJcO2IvNyDCGls8J"
        data-us-scale="1"
        data-us-dpi="1.5"
        data-us-lazyload="true"
        data-us-production="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
}
