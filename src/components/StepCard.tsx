import { ReactNode } from "react";

interface StepCardProps {
  step: number;
  title: string;
  children: ReactNode;
  id?: string;
}

export function StepCard({ step, title, children, id }: StepCardProps) {
  const num = String(step).padStart(2, "0");

  return (
    <section id={id} style={{ scrollMarginTop: "80px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-jetbrains-mono)",
            fontSize: "14px",
            color: "#C0C0BC",
            letterSpacing: "0.06em",
            flexShrink: 0,
            paddingTop: "2px",
          }}
        >
          {num}
        </span>
        <h2
          style={{
            fontFamily: "var(--font-fraunces)",
            fontSize: "clamp(22px, 3vw, 30px)",
            fontWeight: 300,
            fontStyle: "italic",
            color: "#1A1A18",
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {children}
      </div>
    </section>
  );
}
