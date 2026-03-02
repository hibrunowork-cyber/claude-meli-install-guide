"use client";

import { useState, useEffect, useRef } from "react";

const PASSWORD = "claudemeli";
const STORAGE_KEY = "claude-guide-auth";

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed]     = useState(false);
  const [fading, setFading]     = useState(false);
  const [value, setValue]       = useState("");
  const [error, setError]       = useState(false);
  const [mounted, setMounted]   = useState(false);
  const inputRef                = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem(STORAGE_KEY) === "1") {
      setAuthed(true);
    } else {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setFading(true);
      setTimeout(() => setAuthed(true), 500);
    } else {
      setError(true);
      setValue("");
      setTimeout(() => setError(false), 1200);
      inputRef.current?.focus();
    }
  }

  // Antes de montar no cliente, não renderiza nada para evitar flash
  if (!mounted) return null;

  return (
    <>
      {/* Slideshow sempre renderizado atrás */}
      {children}

      {/* Overlay de senha */}
      {!authed && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "#0F0F0D",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 32,
            opacity: fading ? 0 : 1,
            transition: "opacity 0.5s ease",
            pointerEvents: fading ? "none" : "auto",
          }}
        >
          {/* Logo / ícone */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: "#1A1A18",
              border: "1px solid #2A2A27",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg viewBox="0 0 24 24" fill="none" style={{ width: 22, height: 22 }}>
                <rect x="5" y="11" width="14" height="10" rx="2" stroke="#4A4A47" strokeWidth="1.5" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#4A4A47" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{ fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "#4A4A47", letterSpacing: "0.08em" }}>
              ACESSO RESTRITO
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: 280 }}>
            <input
              ref={inputRef}
              type="password"
              value={value}
              onChange={e => { setValue(e.target.value); setError(false); }}
              placeholder="senha"
              autoComplete="off"
              style={{
                width: "100%",
                background: "#171715",
                border: `1px solid ${error ? "#E74C3C" : "#2A2A27"}`,
                borderRadius: 8,
                padding: "12px 16px",
                fontSize: 15,
                fontFamily: "var(--font-jetbrains-mono)",
                color: "#E8E8E5",
                textAlign: "center",
                outline: "none",
                letterSpacing: "0.15em",
                transition: "border-color 0.2s ease",
              }}
            />
            {error && (
              <span style={{ fontSize: 12, color: "#E74C3C", letterSpacing: "0.04em" }}>
                senha incorreta
              </span>
            )}
            <button
              type="submit"
              style={{
                width: "100%",
                background: "#FEE340",
                border: "none",
                borderRadius: 8,
                padding: "11px 16px",
                fontSize: 13,
                fontWeight: 600,
                color: "#0F0F0D",
                cursor: "pointer",
                letterSpacing: "0.06em",
                fontFamily: "var(--font-geist-sans)",
              }}
            >
              Entrar
            </button>
          </form>
        </div>
      )}
    </>
  );
}
