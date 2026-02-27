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
        background: "#F7F7F4",
        borderRadius: "6px",
        padding: "14px 16px",
        paddingRight: "72px",
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        border: "1px solid #EBEBЕ7",
      }}
    >
      {showPrompt && (
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "14px",
            color: "#BABAB6",
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
          color: "#1A1A18",
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
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px 6px",
          borderRadius: "4px",
          fontSize: "14px",
          fontWeight: 500,
          letterSpacing: "0.03em",
          color: copied ? "#1D4ED8" : "#9E9E9B",
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
