"use client";

import { useState, useEffect, ReactNode, CSSProperties } from "react";
import { AnimatedLogo } from "@/components/AnimatedLogo";
import { ClaudeMascot } from "@/components/ClaudeMascot";
import { CommandBlock } from "@/components/CommandBlock";

/* ─── Tokens ─── */
const T = {
  text:         "#E8E8E5",
  sec:          "#B8B8B5",
  muted:        "#888886",
  dim:          "#666663",
  dimmer:       "#3A3A38",
  surface:      "#171715",
  border:       "#2A2A27",
  sub:          "#1E1E1C",
  accent:       "#FEE340",
  accentBg:     "#1F1A00",
  accentBorder: "#4A3800",
  green:        "#22C55E",
};

/* ─── Data ─── */
const MCPS: { name: string; desc: string; cmd: string; token: boolean; note?: string }[] = [
  { name: "Secure Code Guardians", desc: "Analisa segurança do código",        cmd: 'claude mcp add secure-code-guardians --transport sse --url "https://mcp.securecodeguardians.io/sse"', token: false },
  { name: "Frontender-Web",         desc: "Padrões de UI e componentes",        cmd: 'claude mcp add frontender-web --transport sse --url "https://mcp.frontender.ai/sse"',              token: false },
  { name: "Documentation – Fury",   desc: "Documentação interna da Fury",       cmd: 'claude mcp add fury-docs --transport sse --url "https://fury-docs-mcp.melioffice.com/sse"',        token: false },
  { name: "BigQuery Insight",       desc: "Consultas e análise de dados",       cmd: 'claude mcp add bigquery-insight --transport sse --url "https://bq-insight-mcp.melioffice.com/sse"', token: false },
  { name: "Traffic Tracking",       desc: "Monitoramento de tráfego",           cmd: 'claude mcp add traffic-tracking --transport sse --url "https://traffic-mcp.melioffice.com/sse"',   token: false },
  { name: "Amplitude",              desc: "Analytics de produto e eventos",     cmd: 'claude mcp add amplitude --transport sse --url "https://amplitude-mcp.melioffice.com/sse"',         token: false },
  { name: "Figma",                  desc: "Acesso a designs e componentes",     cmd: 'claude mcp add figma --transport http --url "https://figma.com/api/mcp" --header "X-Figma-Token: SEU_TOKEN_AQUI"', token: true, note: "Substitua SEU_TOKEN_AQUI pelo seu Personal Access Token: Figma → Settings → Account → Personal access tokens." },
  { name: "GitHub",                 desc: "Repositórios, PRs e issues",         cmd: 'claude mcp add github --transport http --url "https://api.github.com/mcp" --header "Authorization: Bearer SEU_TOKEN_AQUI"', token: true, note: "Substitua SEU_TOKEN_AQUI pelo seu Personal Access Token: GitHub → Settings → Developer settings → Tokens." },
];

const CMDS = [
  { cmd: "claude",         func: "Abre o Claude no terminal",              ex: "claude" },
  { cmd: 'claude "tarefa"',func: "Executa uma tarefa e fecha",             ex: 'claude "refatora auth.go"' },
  { cmd: "claude commit",  func: "Cria um commit com suas mudanças",       ex: "claude commit" },
  { cmd: "/help",          func: "Lista todos os comandos disponíveis",    ex: "/help" },
  { cmd: "/clear",         func: "Apaga o histórico da sessão atual",      ex: "/clear" },
  { cmd: "/model",         func: "Muda o modelo (Sonnet, Opus, Haiku)",    ex: "/model sonnet" },
  { cmd: "/cost",          func: "Mostra o custo da sessão",               ex: "/cost" },
  { cmd: "/context",       func: "Mostra quanto contexto foi usado",       ex: "/context" },
];

const PRACTICES = [
  { icon: "◈", title: "CLAUDE.md",           desc: "Crie um arquivo CLAUDE.md em cada projeto. O Claude lê automaticamente ao iniciar — é como deixar uma explicação sobre o projeto antes de trabalhar." },
  { icon: "↺", title: "Limpe o contexto",    desc: "Use /clear com frequência. Conversas longas aumentam o custo e reduzem a qualidade. Sessões curtas e focadas funcionam melhor." },
  { icon: "⊘", title: "Cuidado com permissões", desc: "\"Allow Automatic\" apenas para ações seguras (git status, ls). Para apagar ou modificar arquivos importantes, revise antes de confirmar." },
  { icon: "⊕", title: "Use sub-agentes",     desc: "Para tarefas complexas, peça ao Claude para usar a ferramenta Task. Ele delega para outro agente — mais eficiente e sem contaminar o contexto." },
  { icon: "⊙", title: "Peça para pensar fundo", desc: "Para problemas difíceis, adicione \"think hard\" ou \"ultrathink\" na mensagem. O Claude vai raciocinar com mais profundidade antes de responder." },
  { icon: "◎", title: "Seja específico",     desc: "Quanto mais claro o pedido, melhor o resultado. Contexto desnecessário aumenta o custo sem melhorar a resposta." },
];

/* ─── Layout base de cada slide ─── */
function SlideLayout({ num, title, intro, children }: { num: string; title: string; intro?: string; children: ReactNode }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", maxWidth: "860px", margin: "0 auto", padding: "0 48px", width: "100%" }}>
      <div style={{ paddingTop: "40px", paddingBottom: "22px", flexShrink: 0 }}>
        <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "14px", color: T.dimmer, letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>
          {num}
        </span>
        <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 300, fontStyle: "italic", color: T.text, lineHeight: 1.2, margin: 0, marginBottom: intro ? "12px" : 0 }}>
          {title}
        </h2>
        {intro && <p style={{ fontSize: "16px", color: T.muted, lineHeight: 1.65, margin: 0 }}>{intro}</p>}
      </div>
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: "20px" }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Item de passo numerado ─── */
function StepItem({ num, children, command, last }: { num: number; children: ReactNode; command?: string; last?: boolean }) {
  return (
    <div style={{ display: "flex", gap: "20px", paddingBottom: last ? 0 : "20px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <span style={{ width: 30, height: 30, borderRadius: "50%", border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontFamily: "var(--font-jetbrains-mono)", color: "#4A4A47", flexShrink: 0 }}>
          {num}
        </span>
        {!last && <div style={{ width: 1, flex: 1, marginTop: 7, background: T.sub, minHeight: 14 }} />}
      </div>
      <div style={{ flex: 1, paddingBottom: 4 }}>
        <p style={{ fontSize: 15, color: T.sec, marginBottom: command ? 12 : 0, lineHeight: 1.65 }}>{children}</p>
        {command && <CommandBlock command={command} />}
      </div>
    </div>
  );
}

/* ─── Slide de instalação (precisa de state para tabs) ─── */
function InstallSlide() {
  const [tab, setTab] = useState<"macos" | "universal">("macos");
  return (
    <div>
      <div role="tablist" style={{ display: "inline-flex", borderBottom: `1px solid ${T.border}`, marginBottom: 22 }}>
        {(["macos", "universal"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "9px 18px", fontSize: 15, fontWeight: tab === t ? 500 : 400, color: tab === t ? T.text : "#5A5A57", borderBottom: tab === t ? `2px solid ${T.accent}` : "2px solid transparent", marginBottom: -1, transition: "all 0.15s ease", fontFamily: "inherit" }}>
            {t === "macos" ? "macOS (Brew)" : "Universal (curl)"}
          </button>
        ))}
      </div>
      {tab === "macos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{ fontSize: 15, color: T.dim }}>Requer o Homebrew instalado.</p>
          <CommandBlock command="brew install --cask claude-code" />
        </div>
      )}
      {tab === "universal" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{ fontSize: 15, color: T.dim }}>Funciona em qualquer sistema Unix-like.</p>
          <CommandBlock command="curl -fsSL https://claude.ai/install.sh | bash" />
        </div>
      )}
    </div>
  );
}

/* ─── Terminal mock ─── */
function TerminalMock({ title = "zsh", children }: { title?: string; children: ReactNode }) {
  return (
    <div style={{ background: "#0C0C0A", border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "10px 14px", borderBottom: `1px solid ${T.sub}`, display: "flex", alignItems: "center", gap: 6, background: "#111110", flexShrink: 0 }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57", flexShrink: 0 }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E", flexShrink: 0 }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840", flexShrink: 0 }} />
        <span style={{ flex: 1, textAlign: "center", fontSize: 11, color: T.dim, fontFamily: "var(--font-jetbrains-mono)" }}>{title}</span>
      </div>
      <div style={{ padding: "20px 24px", fontFamily: "var(--font-jetbrains-mono)", fontSize: 13, lineHeight: 1.85, color: T.text }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Browser mock ─── */
function BrowserMock({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, background: "#E8E8E8", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57", flexShrink: 0 }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E", flexShrink: 0 }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840", flexShrink: 0 }} />
        </div>
        <div style={{ display: "flex", gap: 8, color: "#999", fontSize: 13 }}>
          <span>←</span>
          <span>→</span>
        </div>
        <div style={{ flex: 1, background: "white", borderRadius: 5, padding: "4px 12px", fontSize: 11, color: "#555", fontFamily: "monospace", border: "1px solid #CCC", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          🔒 {url}
        </div>
      </div>
      <div style={{ padding: "28px 32px", background: "white", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Slide de autenticação com nav vertical ─── */
function AuthSlide() {
  const [active, setActive] = useState(0);

  const steps = [
    { label: "Iniciar o Claude",     desc: "Abre o Claude no terminal" },
    { label: "Escolher tema",        desc: "Aparência visual da interface" },
    { label: "Selecionar método",    desc: "Tipo de conta e billing" },
    { label: "Autorizar no browser", desc: "Confirmação de acesso OAuth" },
    { label: "Escolher organização", desc: "Conta do Mercado Pago" },
    { label: "Login concluído",      desc: "Aceitar termos e começar" },
  ];

  const Cursor = () => (
    <span style={{ display: "inline-block", width: 7, height: 14, background: T.muted, marginLeft: 1, verticalAlign: "middle", opacity: 0.8 }} />
  );

  const Prompt = () => (
    <>
      <span style={{ color: "#5A5A57" }}>~</span>
      <span style={{ color: T.dimmer }}> $ </span>
    </>
  );

  const MenuItem = ({ label, active: sel }: { label: string; active: boolean }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 8px", borderRadius: 4, background: sel ? T.accentBg : "none", marginBottom: 3 }}>
      <span style={{ fontSize: 12, color: sel ? T.accent : "transparent", width: 10, flexShrink: 0 }}>❯</span>
      <span style={{ fontSize: 13, color: sel ? T.text : T.dim, fontWeight: sel ? 500 : 400 }}>{label}</span>
    </div>
  );

  const mockups: ReactNode[] = [
    /* Passo 1 — terminal: `claude` */
    <TerminalMock key="1">
      <div>
        <Prompt />
        <span style={{ color: T.text }}>claude</span>
        <Cursor />
      </div>
    </TerminalMock>,

    /* Passo 2 — terminal: seleção de tema */
    <TerminalMock key="2" title="Claude Code">
      <div style={{ color: T.accent, marginBottom: 14 }}>Welcome to Claude Code!</div>
      <div style={{ color: T.muted, marginBottom: 10, fontSize: 12 }}>? Choose your preferred theme</div>
      <MenuItem label="Dark" active={true} />
      <MenuItem label="Dark (daltonism-friendly)" active={false} />
      <MenuItem label="Light" active={false} />
      <MenuItem label="System" active={false} />
    </TerminalMock>,

    /* Passo 3 — terminal: seleção de método */
    <TerminalMock key="3" title="Claude Code">
      <div style={{ color: T.muted, marginBottom: 10, fontSize: 12 }}>? Select login method</div>
      {[
        { name: "Method 1",  sub: "claude.ai (Pro/Max subscription)",          sel: false },
        { name: "Method 2",  sub: "Anthropic Console — API usage billing",      sel: true  },
        { name: "Method 3",  sub: "Enterprise SSO (Bedrock / Vertex AI)",       sel: false },
      ].map((m) => (
        <div key={m.name} style={{ display: "flex", alignItems: "baseline", gap: 8, padding: "4px 8px", borderRadius: 4, background: m.sel ? T.accentBg : "none", marginBottom: 3 }}>
          <span style={{ fontSize: 12, color: m.sel ? T.accent : "transparent", width: 10, flexShrink: 0 }}>❯</span>
          <span style={{ fontSize: 13, color: m.sel ? T.accent : T.dim, fontWeight: m.sel ? 600 : 400, flexShrink: 0 }}>{m.name}</span>
          <span style={{ fontSize: 12, color: T.dimmer }}>— {m.sub}</span>
        </div>
      ))}
    </TerminalMock>,

    /* Passo 4 — browser: autorização OAuth */
    <BrowserMock key="4" url="console.anthropic.com/oauth/authorize">
      <div style={{ textAlign: "center", maxWidth: 300 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 4, letterSpacing: "-0.02em", fontFamily: "system-ui" }}>Anthropic</div>
        <div style={{ width: 32, height: 2, background: "#E8E8E8", margin: "0 auto 20px" }} />
        <p style={{ fontSize: 15, fontWeight: 600, color: "#111", margin: "0 0 6px", fontFamily: "system-ui" }}>Claude Code requests access</p>
        <p style={{ fontSize: 13, color: "#777", margin: "0 0 24px", fontFamily: "system-ui" }}>to your Anthropic Console account</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button style={{ padding: "9px 20px", borderRadius: 6, border: "1px solid #D5D5D5", background: "white", color: "#444", fontSize: 14, cursor: "default", fontFamily: "system-ui" }}>Cancel</button>
          <button style={{ padding: "9px 22px", borderRadius: 6, border: "none", background: "#D97706", color: "white", fontSize: 14, fontWeight: 600, cursor: "default", fontFamily: "system-ui", boxShadow: "0 1px 3px rgba(0,0,0,0.18)" }}>Authorize</button>
        </div>
      </div>
    </BrowserMock>,

    /* Passo 5 — browser: seleção de organização */
    <BrowserMock key="5" url="console.anthropic.com/oauth/org-select">
      <div style={{ width: "100%", maxWidth: 320 }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: "#111", margin: "0 0 16px", textAlign: "center", fontFamily: "system-ui" }}>Select organization</p>
        {[
          { name: "Personal",                    sub: "seu.email@gmail.com",         sel: false },
          { name: "MercadoLibre Uruguay S.R.L",  sub: "mercadolibre.com",            sel: true  },
        ].map((org) => (
          <div key={org.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 8, border: org.sel ? "2px solid #D97706" : "1px solid #E5E5E5", marginBottom: 8, background: org.sel ? "#FFFBF0" : "white", cursor: "default" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: org.sel ? "#D97706" : "#D5D5D5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "white", flexShrink: 0, fontFamily: "system-ui" }}>
              {org.name[0]}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: org.sel ? 600 : 400, color: "#111", fontFamily: "system-ui" }}>{org.name}</div>
              <div style={{ fontSize: 12, color: "#888", fontFamily: "system-ui" }}>{org.sub}</div>
            </div>
            {org.sel && <span style={{ color: "#D97706", fontSize: 16, flexShrink: 0 }}>✓</span>}
          </div>
        ))}
        <button style={{ width: "100%", padding: "11px", borderRadius: 6, border: "none", background: "#D97706", color: "white", fontSize: 14, fontWeight: 600, marginTop: 6, cursor: "default", fontFamily: "system-ui" }}>
          Continue
        </button>
      </div>
    </BrowserMock>,

    /* Passo 6 — terminal: login successful */
    <TerminalMock key="6" title="Claude Code">
      <div style={{ display: "flex", alignItems: "center", gap: 8, color: T.green, marginBottom: 6 }}>
        <span>✓</span>
        <span style={{ fontWeight: 500 }}>Login successful</span>
      </div>
      <div style={{ color: T.dim, marginBottom: 18, fontSize: 12 }}>Logged in as bruno.goncalves@mercadolibre.com</div>
      <div style={{ color: T.muted, marginBottom: 8, fontSize: 12 }}>? Do you accept the Terms of Service?</div>
      <div style={{ display: "flex", gap: 12, marginBottom: 16, paddingLeft: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 10px", borderRadius: 4, background: T.accentBg }}>
          <span style={{ fontSize: 12, color: T.accent }}>❯</span>
          <span style={{ fontSize: 13, color: T.text }}>Yes, I accept</span>
        </div>
        <span style={{ fontSize: 13, color: T.dimmer, alignSelf: "center" }}>No</span>
      </div>
      <div>
        <Prompt />
        <span style={{ color: T.dimmer }}>█</span>
      </div>
    </TerminalMock>,
  ];

  return (
    <div style={{ display: "flex", gap: 28, minHeight: 300 }}>
      {/* Navegação vertical */}
      <div style={{ width: 185, flexShrink: 0, display: "flex", flexDirection: "column" }}>
        {steps.map((step, i) => {
          const isActive = i === active;
          const isDone   = i < active;
          return (
            <button key={i} onClick={() => setActive(i)}
              style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 10px", background: isActive ? T.accentBg : "none", border: "none", borderLeft: `2px solid ${isActive ? T.accent : "transparent"}`, cursor: "pointer", textAlign: "left", width: "100%", transition: "background 0.15s, border-color 0.15s", borderRadius: "0 4px 4px 0" }}>
              <span style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontFamily: "var(--font-jetbrains-mono)", background: isActive ? T.accent : isDone ? T.accentBg : T.sub, color: isActive ? "#0F0F0D" : isDone ? T.accent : T.dim, border: isDone && !isActive ? `1px solid ${T.accentBorder}` : "none", transition: "all 0.15s" }}>
                {isDone ? "✓" : i + 1}
              </span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: isActive ? 500 : 400, color: isActive ? T.text : isDone ? T.sec : T.muted, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {step.label}
                </div>
                {isActive && (
                  <div style={{ fontSize: 11, color: T.dim, marginTop: 2, lineHeight: 1.4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {step.desc}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Simulação da tela */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {mockups[active]}
      </div>
    </div>
  );
}

/* ─── Definição dos slides ─── */
type SlideRender = (ctx: { onNext: () => void }) => ReactNode;

const SLIDES: SlideRender[] = [
  /* 0 — Boas-vindas */
  ({ onNext }) => (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 48px", textAlign: "center", maxWidth: "720px", margin: "0 auto" }}>
      <p style={{ fontSize: 14, letterSpacing: "0.14em", textTransform: "uppercase", color: T.dimmer, fontWeight: 500, marginBottom: 44 }}>
        Mercado Pago · Onboarding Técnico
      </p>
      <h1 style={{ fontFamily: "'Pixelify Sans', sans-serif", fontSize: "clamp(42px, 6vw, 68px)", fontWeight: 500, letterSpacing: "-0.03em", color: "#4F4F4F", lineHeight: 1.1, margin: 0, marginBottom: 32 }}>
        Guia de Instalação
        <br />
        <span style={{ display: "inline-flex", alignItems: "center", gap: 14, marginTop: 6 }}>
          <span style={{ color: T.accent }}>Claude Meli</span>
          <AnimatedLogo style={{ height: "0.85em", width: "auto", display: "inline-block" }} />
        </span>
      </h1>
      <p style={{ fontSize: 18, color: T.muted, lineHeight: 1.7, maxWidth: 520, marginBottom: 52 }}>
        Vamos configurar tudo juntos, passo a passo. Em cerca de{" "}
        <span style={{ color: T.sec }}>10 minutos</span> o Claude Code estará funcionando no seu computador.
      </p>
      <button onClick={onNext}
        style={{ background: T.accent, color: "#0F0F0D", border: "none", borderRadius: 6, padding: "15px 32px", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 10 }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        Começar
        <svg viewBox="0 0 16 16" fill="none" style={{ width: 15, height: 15 }}>
          <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <p style={{ fontSize: 14, color: T.dimmer, marginTop: 20 }}>8 passos simples</p>
    </div>
  ),

  /* 1 — Pré-requisitos */
  () => (
    <SlideLayout num="00" title="Antes de começar" intro="Duas coisinhas antes de instalar:">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1px", background: T.border, border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden" }}>
        <div style={{ background: T.surface, padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <svg viewBox="0 0 16 16" fill="none" style={{ width: 15, height: 15, flexShrink: 0 }}>
              <path d="M13.5 4.5L6 12L2.5 8.5" stroke={T.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 15, fontWeight: 500, color: T.text }}>Node.js ≥ 18</span>
          </div>
          <p style={{ fontSize: 15, color: T.muted, marginBottom: 14, lineHeight: 1.6 }}>
            Uma ferramenta técnica que o Claude precisa para funcionar. Verifique se já está instalado:
          </p>
          <CommandBlock command="node --version" />
        </div>
        <div style={{ background: T.surface, padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <svg viewBox="0 0 16 16" fill="none" style={{ width: 15, height: 15, flexShrink: 0 }}>
              <path d="M13.5 4.5L6 12L2.5 8.5" stroke={T.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 15, fontWeight: 500, color: T.text }}>Licença ativa</span>
          </div>
          <p style={{ fontSize: 15, color: T.muted, marginBottom: 14, lineHeight: 1.6 }}>
            O time precisa habilitar seu acesso antes de instalar. Solicite pelo portal:
          </p>
          <a href="https://azir.adminml.com/licenses" target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 15, fontFamily: "var(--font-jetbrains-mono)", color: T.accent, textDecoration: "none", padding: "8px 12px", background: T.accentBg, borderRadius: 4, border: `1px solid ${T.accentBorder}` }}>
            azir.adminml.com/licenses
            <svg viewBox="0 0 12 12" fill="none" style={{ width: 11, height: 11 }}>
              <path d="M2 10L10 2M10 2H5M10 2V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", paddingTop: 52, paddingBottom: 4 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <ClaudeMascot style={{ height: 60, width: "auto" }} />
          <AnimatedLogo style={{ height: 52, width: "auto", marginTop: -6 }} />
        </div>
      </div>
    </SlideLayout>
  ),

  /* 2 — Instalação */
  () => (
    <SlideLayout num="01" title="Instalando o Claude Code" intro="Abra o terminal, cole o comando abaixo e aperte Enter:">
      <InstallSlide />
    </SlideLayout>
  ),

  /* 3 — Autenticação com nav vertical + simulações */
  () => (
    <SlideLayout num="02" title="Fazendo login" intro="Clique em cada passo para ver como é a tela:">
      <AuthSlide />
    </SlideLayout>
  ),

  /* 4 — VS Code */
  () => (
    <SlideLayout num="03" title="Conectando ao VS Code" intro="Se você usa o VS Code, o Claude consegue trabalhar direto dentro dele:">
      <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
        <StepItem num={1}>Abra o VS Code e instale a extensão <strong style={{ color: T.sec, fontWeight: 500 }}>"Claude Code for VS Code"</strong> no Marketplace.</StepItem>
        <StepItem num={2}>Clique no ícone do Claude (canto superior direito) → selecione <strong style={{ color: T.sec, fontWeight: 500 }}>"Anthropic Console"</strong>.</StepItem>
        <StepItem num={3} command="claude">No terminal integrado do VS Code, inicie o Claude:</StepItem>
        <StepItem num={4} last>Execute <strong style={{ color: T.sec, fontWeight: 500 }}>"Auto-connect to IDE"</strong> → ative → recarregue o terminal.</StepItem>
      </ol>
    </SlideLayout>
  ),

  /* 5 — MCPs */
  () => (
    <SlideLayout num="04" title="Expandindo o Claude" intro="Os MCPs são como apps extras — cada um adiciona uma nova habilidade ao Claude:">
      <div style={{ display: "flex", gap: 10, padding: "12px 16px", background: "#1A1607", border: "1px solid #3D3208", borderRadius: 6, marginBottom: 16 }}>
        <svg viewBox="0 0 16 16" fill="none" style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1 }}>
          <path fillRule="evenodd" clipRule="evenodd" d="M8 1.5a.5.5 0 0 1 .434.252l6.5 11A.5.5 0 0 1 14.5 13.5h-13a.5.5 0 0 1-.434-.748l6.5-11A.5.5 0 0 1 8 1.5ZM8 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 1 0v-3A.5.5 0 0 0 8 6Zm0 6.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" fill="#F59E0B" />
        </svg>
        <p style={{ fontSize: 14, color: "#D97706", lineHeight: 1.55, margin: 0 }}>
          <strong style={{ color: "#FCD34D" }}>Atenção com tokens:</strong> Substitua{" "}
          <code style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 13 }}>SEU_TOKEN_AQUI</code>{" "}
          pelo valor real antes de executar. Nunca compartilhe tokens.
        </p>
      </div>
      <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden" }}>
        {MCPS.map((mcp, i) => (
          <div key={mcp.name} style={{ padding: "16px 22px", borderBottom: i < MCPS.length - 1 ? `1px solid ${T.sub}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 500, color: T.text }}>{mcp.name}</span>
              <span style={{ fontSize: 14, color: T.dim, borderLeft: `1px solid ${T.border}`, paddingLeft: 12 }}>{mcp.desc}</span>
              {mcp.token && <span style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#D97706", background: "#252008", padding: "2px 7px", borderRadius: 3, marginLeft: "auto", flexShrink: 0 }}>token</span>}
            </div>
            <CommandBlock command={mcp.cmd} />
            {mcp.note && <p style={{ fontSize: 14, color: T.dim, marginTop: 8, lineHeight: 1.55 }}>{mcp.note}</p>}
          </div>
        ))}
      </div>
    </SlideLayout>
  ),

  /* 6 — Statusline */
  () => (
    <SlideLayout num="05" title="Monitorando o uso" intro="Configure uma barra que mostra modelo, tokens usados e projeto direto no terminal:">
      <CommandBlock command='/statusline "$CurrentModel | ProgressBar with Current % of Token Usage | $TokenUsed/MaxTokensContext | Current Folder / Project | $GitBranch"' showPrompt={false} />
      <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", marginTop: 18 }}>
        <div style={{ padding: "10px 16px", borderBottom: `1px solid ${T.sub}`, background: T.surface }}>
          <span style={{ fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4A4A47", fontWeight: 500 }}>O que cada campo significa</span>
        </div>
        {[
          { token: "$CurrentModel",              desc: "Qual modelo do Claude está ativo" },
          { token: "ProgressBar",                desc: "Barra visual mostrando % de contexto usado" },
          { token: "$TokenUsed/MaxTokensContext", desc: "Quantos tokens foram consumidos no total" },
          { token: "Current Folder / Project",   desc: "Em qual pasta você está trabalhando" },
          { token: "$GitBranch",                 desc: "Em qual branch do Git você está" },
        ].map((f, i, arr) => (
          <div key={f.token} style={{ display: "flex", alignItems: "center", gap: 16, padding: "11px 16px", borderBottom: i < arr.length - 1 ? `1px solid ${T.sub}` : "none" }}>
            <code style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 13, color: T.accent, background: T.accentBg, padding: "2px 7px", borderRadius: 3, whiteSpace: "nowrap", flexShrink: 0 }}>{f.token}</code>
            <span style={{ fontSize: 14, color: T.muted }}>{f.desc}</span>
          </div>
        ))}
      </div>
    </SlideLayout>
  ),

  /* 7 — Comandos */
  () => (
    <SlideLayout num="06" title="Comandos do dia a dia" intro="Os que você vai usar mais. Pode salvar como referência:">
      <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "190px 1fr 1fr", padding: "10px 20px", background: T.surface, borderBottom: `1px solid ${T.border}`, gap: 16 }}>
          {["Comando", "O que faz", "Exemplo"].map(h => (
            <span key={h} style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4A4A47", fontWeight: 500 }}>{h}</span>
          ))}
        </div>
        {CMDS.map((row, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "190px 1fr 1fr", padding: "12px 20px", borderBottom: i < CMDS.length - 1 ? `1px solid ${T.sub}` : "none", alignItems: "center", gap: 16 }}>
            <code style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 14, color: T.accent, background: T.accentBg, padding: "2px 8px", borderRadius: 3, whiteSpace: "nowrap", display: "inline-block" }}>{row.cmd}</code>
            <span style={{ fontSize: 14, color: T.sec }}>{row.func}</span>
            <code style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 14, color: "#4A4A47" }}>{row.ex}</code>
          </div>
        ))}
      </div>
    </SlideLayout>
  ),

  /* 8 — Boas Práticas */
  () => (
    <SlideLayout num="07" title="Dicas para usar bem" intro="Hábitos que fazem diferença no dia a dia:">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: T.border, border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden" }}>
        {PRACTICES.map(p => (
          <div key={p.title} style={{ background: T.surface, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 16, color: T.dimmer, fontWeight: 300, lineHeight: 1, width: 20, textAlign: "center", flexShrink: 0 }}>{p.icon}</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: T.text, letterSpacing: "0.01em" }}>{p.title}</span>
            </div>
            <p style={{ fontSize: 14, color: T.dim, lineHeight: 1.65, margin: 0 }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </SlideLayout>
  ),
];

/* ─── Indicador de progresso ─── */
function StepIndicator({ current, total, onGoTo }: { current: number; total: number; onGoTo: (i: number) => void }) {
  return (
    <div style={{ flexShrink: 0, padding: "0 48px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${T.sub}`, gap: 16 }}>
      <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
        {Array.from({ length: total }).map((_, i) => (
          <button key={i} onClick={() => onGoTo(i)}
            style={{ width: i === current ? 24 : 7, height: 7, borderRadius: 4, background: i === current ? T.accent : i < current ? "#3A3A38" : "#2A2A27", border: "none", cursor: "pointer", padding: 0, transition: "all 0.2s ease", flexShrink: 0 }}
          />
        ))}
      </div>
      <span style={{ fontSize: 13, fontFamily: "var(--font-jetbrains-mono)", color: T.dimmer, flexShrink: 0 }}>
        {current + 1} / {total}
      </span>
    </div>
  );
}

/* ─── Navegação inferior ─── */
function BottomNav({ current, total, onPrev, onNext }: { current: number; total: number; onPrev: () => void; onNext: () => void }) {
  const isFirst = current === 0;
  const isLast  = current === total - 1;

  const base: CSSProperties = { background: "none", border: `1px solid ${T.border}`, borderRadius: 6, padding: "11px 24px", fontSize: 15, color: T.sec, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 9, transition: "opacity 0.15s ease", letterSpacing: "0.01em" };

  return (
    <div style={{ flexShrink: 0, padding: "0 48px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${T.sub}` }}>
      <button onClick={onPrev} disabled={isFirst}
        style={{ ...base, borderColor: isFirst ? T.sub : T.border, color: isFirst ? "#2A2A27" : T.sec, cursor: isFirst ? "default" : "pointer" }}>
        <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
          <path d="M13 8H3M3 8L7 4M3 8L7 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Anterior
      </button>

      <button onClick={isLast ? undefined : onNext}
        style={{ ...base, background: T.accent, borderColor: T.accent, color: "#0F0F0D", fontWeight: 600, opacity: isLast ? 0.5 : 1, cursor: isLast ? "default" : "pointer" }}>
        {isLast ? "Concluído ✓" : "Próximo"}
        {!isLast && (
          <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
            <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </div>
  );
}

/* ─── Componente principal ─── */
export function SlideShow() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const total = SLIDES.length;
  const steps = total - 1; // exclui welcome

  const goTo = (i: number) => {
    if (i < 0 || i >= total) return;
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goTo(Math.min(current + 1, total - 1));
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   goTo(Math.max(current - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current]);

  const isWelcome = current === 0;
  const stepIdx   = current - 1;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {!isWelcome && (
        <StepIndicator current={stepIdx} total={steps} onGoTo={i => goTo(i + 1)} />
      )}

      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <div key={current} style={{ height: "100%", animation: `${direction === 1 ? "slideInFromRight" : "slideInFromLeft"} 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards` }}>
          {SLIDES[current]({ onNext: () => goTo(current + 1) })}
        </div>
      </div>

      {!isWelcome && (
        <BottomNav current={stepIdx} total={steps} onPrev={() => goTo(current - 1)} onNext={() => goTo(current + 1)} />
      )}
    </div>
  );
}
