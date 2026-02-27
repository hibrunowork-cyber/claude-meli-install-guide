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
      <p style={{ fontSize: "14px", color: "#6E6E6A" }}>
        Referência rápida dos comandos mais usados no dia a dia.
      </p>

      <div
        style={{
          border: "1px solid #E5E4E0",
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
            background: "#FAFAF8",
            borderBottom: "1px solid #E5E4E0",
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
                color: "#ABABAB",
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
              borderBottom: i < commands.length - 1 ? "1px solid #F0F0ED" : "none",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <code
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "14px",
                color: "#1D4ED8",
                background: "#EEF2FF",
                padding: "2px 7px",
                borderRadius: "3px",
                whiteSpace: "nowrap",
                display: "inline-block",
              }}
            >
              {row.cmd}
            </code>
            <span style={{ fontSize: "14px", color: "#3A3A36" }}>
              {row.func}
            </span>
            <code
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "14px",
                color: "#9E9E9B",
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
