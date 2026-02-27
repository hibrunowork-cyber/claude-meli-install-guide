import { StepCard } from "@/components/StepCard";

const practices = [
  {
    title: "CLAUDE.md",
    desc: "Crie um arquivo CLAUDE.md em cada projeto com contexto, stack e convenções. O Claude lê automaticamente ao iniciar uma sessão.",
    icon: "◈",
  },
  {
    title: "Reset de Contexto",
    desc: "Use /clear com frequência. Um contexto longo aumenta o custo da sessão e pode degradar a qualidade das respostas.",
    icon: "↺",
  },
  {
    title: "Permissões",
    desc: '"Allow Automatic" apenas para leitura segura (git status, ls). Para ações destrutivas, sempre revise antes de confirmar.',
    icon: "⊘",
  },
  {
    title: "Sub-agentes",
    desc: "Delegue tarefas complexas para sub-agentes (Task tool). Evita contaminação do contexto principal e melhora o resultado.",
    icon: "⊕",
  },
  {
    title: "Raciocínio Estendido",
    desc: 'Para problemas de lógica ou arquitetura complexos, instrua: "think hard" ou "ultrathink". Ativa raciocínio mais profundo.',
    icon: "⊙",
  },
  {
    title: "Eficiência de Tokens",
    desc: "Seja específico nas instruções. Contexto desnecessário e arquivos grandes aumentam o custo sem melhorar o resultado.",
    icon: "◎",
  },
];

export function BestPractices() {
  return (
    <StepCard step={7} title="Boas Práticas" id="boas-praticas">
      <p style={{ fontSize: "14px", color: "#6E6E6A" }}>
        Dicas para usar o Claude Code com eficiência, segurança e menor custo.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1px",
          background: "#E5E4E0",
          border: "1px solid #E5E4E0",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {practices.map((p) => (
          <div
            key={p.title}
            style={{
              background: "#FFFFFF",
              padding: "22px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  color: "#C0C0BC",
                  fontWeight: 300,
                  lineHeight: 1,
                  width: "18px",
                  textAlign: "center",
                  flexShrink: 0,
                }}
              >
                {p.icon}
              </span>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1A1A18",
                  letterSpacing: "0.01em",
                }}
              >
                {p.title}
              </span>
            </div>
            <p style={{ fontSize: "14px", color: "#6E6E6A", lineHeight: 1.6, margin: 0 }}>
              {p.desc}
            </p>
          </div>
        ))}
      </div>
    </StepCard>
  );
}
