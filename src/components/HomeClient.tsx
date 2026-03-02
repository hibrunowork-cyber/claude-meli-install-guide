"use client";

import { useState } from "react";
import { UnicornBackground } from "@/components/ui/unicorn-background";
import { SlideShow } from "@/components/SlideShow";
import { PasswordGate } from "@/components/PasswordGate";

export function HomeClient() {
  const [authed, setAuthed] = useState(false);

  return (
    <PasswordGate onAuth={() => setAuthed(true)}>
      <div style={{ background: "#0F0F0D", height: "100vh", overflow: "hidden" }}>
        {authed && <UnicornBackground />}
        <div style={{ position: "relative", zIndex: 1, height: "100%" }}>
          <SlideShow />
        </div>
      </div>
    </PasswordGate>
  );
}
