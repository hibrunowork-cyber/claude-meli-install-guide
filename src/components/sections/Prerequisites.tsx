import { CommandBlock } from "@/components/CommandBlock";

export function Prerequisites() {
  return (
    <section id="pre-requisitos" style={{ scrollMarginTop: "80px", paddingBottom: "56px" }}>
      <p
        style={{
          fontSize: "14px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#4A4A47",
          fontWeight: 500,
          marginBottom: "24px",
        }}
      >
        Antes de começar
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1px",
          background: "#2A2A27",
          border: "1px solid #2A2A27",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {/* Node.js */}
        <div style={{ background: "#171715", padding: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
              <path
                d="M13.5 4.5L6 12L2.5 8.5"
                stroke="#22C55E"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#E8E8E5",
              }}
            >
              Node.js ≥ 18.0.0
            </span>
          </div>
          <p style={{ fontSize: "14px", color: "#666663", marginBottom: "12px" }}>
            Verifique sua versão:
          </p>
          <CommandBlock command="node --version" />
        </div>

        {/* Licença */}
        <div style={{ background: "#171715", padding: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
              <path
                d="M13.5 4.5L6 12L2.5 8.5"
                stroke="#22C55E"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#E8E8E5",
              }}
            >
              Licença via Azir
            </span>
          </div>
          <p style={{ fontSize: "14px", color: "#666663", marginBottom: "12px" }}>
            Solicite acesso no portal:
          </p>
          <a
            href="https://azir.adminml.com/licenses"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              fontFamily: "var(--font-jetbrains-mono)",
              color: "#FEE340",
              textDecoration: "none",
              padding: "7px 10px",
              background: "#1F1A00",
              borderRadius: "4px",
              border: "1px solid #4A3800",
            }}
          >
            azir.adminml.com/licenses
            <svg viewBox="0 0 12 12" fill="none" style={{ width: 10, height: 10 }}>
              <path
                d="M2 10L10 2M10 2H5M10 2V7"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
