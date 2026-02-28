import { StepCard } from "@/components/StepCard";

const commands = [
  { cmd: "claude", func: "Inicia sessão interativa", example: "claude" },
  {
    cmd: 'claude "task"',
    func: "Executa tarefa e encerra",
    example: 'claude "refactor auth.go"',
  },
  {
    cmd: "claude commit",
    func: "Cria commit das mudanças em stage",
    example: "claude commit",
  },
  { cmd: "/help", func: "Referência de comandos internos", example: "/help" },
  { cmd: "/clear", func: "Limpa o contexto da sessão", example: "/clear" },
  {
    cmd: "/model",
    func: "Alterna entre Sonnet, Opus e Haiku",
    example: "/model sonnet",
  },
  {
    cmd: "/cost",
    func: "Exibe o custo da sessão atual",
    example: "/cost",
  },
  {
    cmd: "/context",
    func: "Detalhamento do uso da janela de contexto",
    example: "/context",
  },
];

export function Commands() {
  return (
    <StepCard step={6} title="Comandos Essenciais" id="comandos">
      <p style={{ fontSize: "14px", color: "#888886" }}>
        Referência rápida dos comandos mais usados no dia a dia.
      </p>

      <div
        style={{
          border: "1px solid #2A2A27",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "160px 1fr 1fr",
            padding: "8px 16px",
            background: "#171715",
            borderBottom: "1px solid #2A2A27",
            gap: "16px",
          }}
        >
          {["Comando", "Função", "Exemplo"].map((h) => (
            <span
              key={h}
              style={{
                fontSize: "14px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#4A4A47",
                fontWeight: 500,
              }}
            >
              {h}
            </span>
          ))}
        </div>

        {commands.map((row, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "160px 1fr 1fr",
              padding: "11px 16px",
              borderBottom: i < commands.length - 1 ? "1px solid #1E1E1C" : "none",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <code
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "14px",
                color: "#FEE340",
                background: "#1F1A00",
                padding: "2px 7px",
                borderRadius: "3px",
                whiteSpace: "nowrap",
                display: "inline-block",
              }}
            >
              {row.cmd}
            </code>
            <span style={{ fontSize: "14px", color: "#B8B8B5" }}>
              {row.func}
            </span>
            <code
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "14px",
                color: "#4A4A47",
              }}
            >
              {row.example}
            </code>
          </div>
        ))}
      </div>
    </StepCard>
  );
}
