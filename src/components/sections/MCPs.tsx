import { StepCard } from "@/components/StepCard";
import { CommandBlock } from "@/components/CommandBlock";

const mcps = [
  {
    name: "Secure Code Guardians",
    desc: "Análise de segurança de código",
    command:
      'claude mcp add secure-code-guardians --transport sse --url "https://mcp.securecodeguardians.io/sse"',
    token: false,
  },
  {
    name: "Frontender-Web",
    desc: "Componentes e padrões de UI",
    command:
      'claude mcp add frontender-web --transport sse --url "https://mcp.frontender.ai/sse"',
    token: false,
  },
  {
    name: "Documentation – Fury Docs",
    desc: "Documentação interna da plataforma Fury",
    command:
      'claude mcp add fury-docs --transport sse --url "https://fury-docs-mcp.melioffice.com/sse"',
    token: false,
  },
  {
    name: "BigQuery Insight",
    desc: "Consultas e análise de dados",
    command:
      'claude mcp add bigquery-insight --transport sse --url "https://bq-insight-mcp.melioffice.com/sse"',
    token: false,
  },
  {
    name: "Traffic Tracking",
    desc: "Monitoramento de tráfego",
    command:
      'claude mcp add traffic-tracking --transport sse --url "https://traffic-mcp.melioffice.com/sse"',
    token: false,
  },
  {
    name: "Amplitude",
    desc: "Analytics de produto e eventos",
    command:
      'claude mcp add amplitude --transport sse --url "https://amplitude-mcp.melioffice.com/sse"',
    token: false,
  },
  {
    name: "Figma",
    desc: "Acesso a designs e componentes",
    command:
      'claude mcp add figma --transport http --url "https://figma.com/api/mcp" --header "X-Figma-Token: SEU_TOKEN_AQUI"',
    token: true,
    tokenNote:
      "Substitua SEU_TOKEN_AQUI pelo seu Personal Access Token do Figma → Settings → Account → Personal access tokens.",
  },
  {
    name: "GitHub",
    desc: "Repositórios, PRs e issues",
    command:
      'claude mcp add github --transport http --url "https://api.github.com/mcp" --header "Authorization: Bearer SEU_TOKEN_AQUI"',
    token: true,
    tokenNote:
      "Substitua SEU_TOKEN_AQUI pelo seu Personal Access Token do GitHub → Settings → Developer settings → Tokens.",
  },
];

export function MCPs() {
  return (
    <StepCard step={4} title="MCPs" id="mcps">
      {/* Warning */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          padding: "14px 16px",
          background: "#FFFBEB",
          border: "1px solid #FDE68A",
          borderRadius: "6px",
        }}
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          style={{ width: 15, height: 15, flexShrink: 0, marginTop: "1px" }}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 1.5a.5.5 0 0 1 .434.252l6.5 11A.5.5 0 0 1 14.5 13.5h-13a.5.5 0 0 1-.434-.748l6.5-11A.5.5 0 0 1 8 1.5ZM8 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 1 0v-3A.5.5 0 0 0 8 6Zm0 6.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
            fill="#D97706"
          />
        </svg>
        <div>
          <p style={{ fontSize: "14px", fontWeight: 500, color: "#92400E", marginBottom: "2px" }}>
            Atenção — Tokens de API
          </p>
          <p style={{ fontSize: "14px", color: "#B45309", lineHeight: 1.55 }}>
            Nunca exponha tokens em repositórios ou histórico de chat. Substitua{" "}
            <code style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "14px" }}>
              SEU_TOKEN_AQUI
            </code>{" "}
            pelo valor real antes de executar.
          </p>
        </div>
      </div>

      {/* MCP list */}
      <div
        style={{
          border: "1px solid #E5E4E0",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {mcps.map((mcp, i) => (
          <div
            key={mcp.name}
            style={{
              padding: "20px",
              borderBottom: i < mcps.length - 1 ? "1px solid #F0F0ED" : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: 500, color: "#1A1A18" }}>
                {mcp.name}
              </span>
              <span
                style={{
                  fontSize: "14px",
                  color: "#9E9E9B",
                  borderLeft: "1px solid #E5E4E0",
                  paddingLeft: "10px",
                }}
              >
                {mcp.desc}
              </span>
              {mcp.token && (
                <span
                  style={{
                    fontSize: "14px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#B45309",
                    background: "#FEF3C7",
                    padding: "2px 6px",
                    borderRadius: "3px",
                    marginLeft: "auto",
                    flexShrink: 0,
                  }}
                >
                  token
                </span>
              )}
            </div>
            <CommandBlock command={mcp.command} />
            {mcp.token && mcp.tokenNote && (
              <p
                style={{
                  fontSize: "14px",
                  color: "#9E9E9B",
                  marginTop: "8px",
                  lineHeight: 1.5,
                }}
              >
                {mcp.tokenNote}
              </p>
            )}
          </div>
        ))}
      </div>
    </StepCard>
  );
}
