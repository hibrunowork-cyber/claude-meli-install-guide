import { CommandBlock } from "@/components/CommandBlock";

export function Prerequisites() {
  return (
    <section id="pre-requisitos" style={{ scrollMarginTop: "80px", paddingBottom: "56px" }}>
      <p
        style={{
          fontSize: "14px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#ABABAB",
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
          background: "#EBEBЕ7",
          border: "1px solid #EBEBЕ7",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {/* Node.js */}
        <div style={{ background: "#FFFFFF", padding: "24px" }}>
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
                stroke="#16A34A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#1A1A18",
              }}
            >
              Node.js ≥ 18.0.0
            </span>
          </div>
          <p style={{ fontSize: "14px", color: "#9E9E9B", marginBottom: "12px" }}>
            Verifique sua versão:
          </p>
          <CommandBlock command="node --version" />
        </div>

        {/* Licença */}
        <div style={{ background: "#FFFFFF", padding: "24px" }}>
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
                stroke="#16A34A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#1A1A18",
              }}
            >
              Licença via Azir
            </span>
          </div>
          <p style={{ fontSize: "14px", color: "#9E9E9B", marginBottom: "12px" }}>
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
              color: "#1D4ED8",
              textDecoration: "none",
              padding: "7px 10px",
              background: "#F0F5FF",
              borderRadius: "4px",
              border: "1px solid #C7D8FF",
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
