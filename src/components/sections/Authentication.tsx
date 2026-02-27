import { StepCard } from "@/components/StepCard";
import { CommandBlock } from "@/components/CommandBlock";
import { VideoPlaceholder } from "@/components/VideoPlaceholder";

const steps = [
  { num: 1, text: "No terminal, inicie o Claude:", command: "claude" },
  { num: 2, text: "Escolha o tema visual de sua preferência.", command: null },
  {
    num: 3,
    text: 'Selecione o Método 2: "Anthropic Console account – API usage billing".',
    command: null,
  },
  {
    num: 4,
    text: "No browser que abrirá automaticamente, clique em Authorize.",
    command: null,
  },
  {
    num: 5,
    text: 'Selecione a organização: "MercadoLibre Uruguay S.R.L".',
    command: null,
  },
  {
    num: 6,
    text: "No terminal: Login successful. Aceite os termos para continuar.",
    command: null,
  },
];

export function Authentication() {
  return (
    <StepCard step={2} title="Autenticação" id="autenticacao">
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
            {/* Step indicator */}
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
            {/* Content */}
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
        label="Fluxo completo de autenticação OAuth"
        videoId="video-autenticacao"
      />
    </StepCard>
  );
}
