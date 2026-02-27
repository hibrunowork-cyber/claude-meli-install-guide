"use client";

import { useState } from "react";
import { StepCard } from "@/components/StepCard";
import { CommandBlock } from "@/components/CommandBlock";


export function Installation() {
  const [tab, setTab] = useState<"macos" | "universal">("macos");

  return (
    <StepCard step={1} title="Instalação" id="instalacao">
      <p style={{ fontSize: "14px", color: "#6E6E6A" }}>
        Escolha o método de instalação conforme seu sistema.
      </p>

      {/* Tabs */}
      <div>
        <div
          role="tablist"
          style={{
            display: "inline-flex",
            borderBottom: "1px solid #E5E4E0",
            marginBottom: "20px",
            gap: "0",
          }}
        >
          {(["macos", "universal"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: tab === t ? 500 : 400,
                color: tab === t ? "#1A1A18" : "#9E9E9B",
                borderBottom: tab === t ? "2px solid #1D4ED8" : "2px solid transparent",
                marginBottom: "-1px",
                transition: "all 0.15s ease",
                fontFamily: "inherit",
              }}
            >
              {t === "macos" ? "macOS (Brew)" : "Universal (curl)"}
            </button>
          ))}
        </div>

        {tab === "macos" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <p style={{ fontSize: "14px", color: "#9E9E9B" }}>
              Requer Homebrew instalado.
            </p>
            <CommandBlock command="brew install --cask claude-code" />
          </div>
        )}
        {tab === "universal" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <p style={{ fontSize: "14px", color: "#9E9E9B" }}>
              Funciona em qualquer sistema Unix-like.
            </p>
            <CommandBlock command="curl -fsSL https://claude.ai/install.sh | bash" />
          </div>
        )}
      </div>

      <video
        src="/videos/001.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: "100%",
          borderRadius: "8px",
          border: "1px solid #E5E4E0",
          display: "block",
        }}
      />
    </StepCard>
  );
}
