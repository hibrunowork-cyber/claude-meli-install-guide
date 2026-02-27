import { StepCard } from "@/components/StepCard";
import { CommandBlock } from "@/components/CommandBlock";
import { VideoPlaceholder } from "@/components/VideoPlaceholder";

const steps = [
  {
    num: 1,
    text: 'Instale a extensão "Claude Code for VS Code" no Marketplace.',
    command: null,
  },
  {
    num: 2,
    text: 'Clique no ícone Claude (canto superior direito) → selecione "Anthropic Console".',
    command: null,
  },
  {
    num: 3,
    text: "No terminal integrado do VS Code, inicie o Claude:",
    command: "claude",
  },
  {
    num: 4,
    text: '"Auto-connect to IDE" → ative → recarregue o terminal.',
    command: null,
  },
];

export function VSCodeIntegration() {
  return (
    <StepCard step={3} title="Integração VS Code" id="vscode">
      <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {steps.map((s, i) => (
          <li
            key={s.num}
            style={{
              display: "flex",
              gap: "20px",
              paddingBottom: i < steps.length - 1 ? "20px" : 0,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
              <span
                style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  border: "1px solid #E5E4E0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "14px",
                  fontFamily: "var(--font-jetbrains-mono)",
                  color: "#ABABAB",
                  flexShrink: 0,
                }}
              >
                {s.num}
              </span>
              {i < steps.length - 1 && (
                <div
                  style={{
                    width: "1px",
                    flex: 1,
                    marginTop: "6px",
                    background: "#EBEBЕ7",
                    minHeight: "16px",
                  }}
                />
              )}
            </div>
            <div style={{ paddingBottom: "4px", flex: 1 }}>
              <p style={{ fontSize: "14px", color: "#3A3A36", marginBottom: s.command ? "10px" : 0 }}>
                {s.text}
              </p>
              {s.command && <CommandBlock command={s.command} />}
            </div>
          </li>
        ))}
      </ol>
      <VideoPlaceholder
        label="Extensão instalada e auto-connect ativo"
        videoId="video-vscode"
      />
    </StepCard>
  );
}
