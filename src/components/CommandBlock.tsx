"use client";

import { useState } from "react";

interface CommandBlockProps {
  command: string;
  showPrompt?: boolean;
}

export function CommandBlock({
  command,
  showPrompt = true,
}: CommandBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div
      style={{
        position: "relative",
        background: "#1C1C1A",
        borderRadius: "6px",
        padding: "14px 16px",
        paddingRight: "72px",
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        border: "1px solid #2A2A27",
      }}
    >
      {showPrompt && (
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "14px",
            color: "#3A3A38",
            userSelect: "none",
            flexShrink: 0,
            lineHeight: "22px",
          }}
        >
          $
        </span>
      )}
      <code
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          fontSize: "14px",
          color: "#C8C8C5",
          wordBreak: "break-all",
          lineHeight: "22px",
          flex: 1,
        }}
      >
        {command}
      </code>
      <button
        onClick={handleCopy}
        style={{
          position: "absolute",
          right: "12px",
          bottom: "10px",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px 6px",
          borderRadius: "4px",
          fontSize: "14px",
          fontWeight: 500,
          letterSpacing: "0.03em",
          color: copied ? "#FEE340" : "#4A4A47",
          transition: "color 0.15s ease",
          fontFamily: "var(--font-geist-sans)",
          whiteSpace: "nowrap",
        }}
        aria-label="Copiar comando"
      >
        {copied ? "Copiado ✓" : "Copiar"}
      </button>
    </div>
  );
}
