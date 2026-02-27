import { StepCard } from "@/components/StepCard";
import { CommandBlock } from "@/components/CommandBlock";

const fields = [
  { token: "$CurrentModel", desc: "Modelo Claude em uso" },
  { token: "ProgressBar", desc: "Barra visual de % de tokens usados" },
  { token: "$TokenUsed/MaxTokensContext", desc: "Contador de tokens sobre o total" },
  { token: "Current Folder / Project", desc: "Pasta atual do projeto" },
  { token: "$GitBranch", desc: "Branch Git ativa" },
];

const command =
  '/statusline "$CurrentModel | ProgressBar with Current % of Token Usage | $TokenUsed/MaxTokensContext | Current Folder / Project | $GitBranch"';

export function StatusLine() {
  return (
    <StepCard step={5} title="Statusline" id="statusline">
      <p style={{ fontSize: "14px", color: "#6E6E6A" }}>
        Configure a statusline para exibir modelo, uso de tokens, projeto e
        branch Git de forma compacta no terminal.
      </p>

      <CommandBlock command={command} showPrompt={false} />

      {/* Fields reference */}
      <div
        style={{
          border: "1px solid #E5E4E0",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "10px 16px",
            borderBottom: "1px solid #F0F0ED",
            background: "#FAFAF8",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#ABABAB",
              fontWeight: 500,
            }}
          >
            Campos
          </span>
        </div>
        {fields.map((f, i) => (
          <div
            key={f.token}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "10px 16px",
              borderBottom: i < fields.length - 1 ? "1px solid #F0F0ED" : "none",
            }}
          >
            <code
              style={{
                fontFamily: "var(--font-jetbrains-mono)",
                fontSize: "14px",
                color: "#1D4ED8",
                background: "#EEF2FF",
                padding: "2px 6px",
                borderRadius: "3px",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {f.token}
            </code>
            <span style={{ fontSize: "14px", color: "#6E6E6A" }}>{f.desc}</span>
          </div>
        ))}
      </div>
    </StepCard>
  );
}
