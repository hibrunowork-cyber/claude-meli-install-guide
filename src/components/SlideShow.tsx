"use client";

import { useState, useEffect, useRef, ReactNode, CSSProperties } from "react";
import CRTEffect from "vault66-crt-effect";
import "vault66-crt-effect/dist/vault66-crt-effect.css";
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
  { name: "Figma",                  desc: "Acesso a designs e componentes",     cmd: 'claude mcp add figma --transport http --url "https://figma.com/api/mcp" --header "X-Figma-Token: SEU_TOKEN_AQUI"', token: true, note: "Substitua SEU_TOKEN_AQUI pelo seu Personal Access Token: Figma → Settings → Account → Personal access tokens." },
  { name: "GitHub",                 desc: "Repositórios, PRs e issues",         cmd: 'claude mcp add github --transport http --url "https://api.github.com/mcp" --header "Authorization: Bearer SEU_TOKEN_AQUI"', token: true, note: "Substitua SEU_TOKEN_AQUI pelo seu Personal Access Token: GitHub → Settings → Developer settings → Tokens." },
  { name: "Secure Code Guardians", desc: "Analisa segurança do código",        cmd: 'claude mcp add secure-code-guardians --transport sse --url "https://mcp.securecodeguardians.io/sse"', token: false },
  { name: "Frontender-Web",         desc: "Padrões de UI e componentes",        cmd: 'claude mcp add frontender-web --transport sse --url "https://mcp.frontender.ai/sse"',              token: false },
  { name: "Documentation – Fury",   desc: "Documentação interna da Fury",       cmd: 'claude mcp add fury-docs --transport sse --url "https://fury-docs-mcp.melioffice.com/sse"',        token: false },
  { name: "BigQuery Insight",       desc: "Consultas e análise de dados",       cmd: 'claude mcp add bigquery-insight --transport sse --url "https://bq-insight-mcp.melioffice.com/sse"', token: false },
  { name: "Traffic Tracking",       desc: "Monitoramento de tráfego",           cmd: 'claude mcp add traffic-tracking --transport sse --url "https://traffic-mcp.melioffice.com/sse"',   token: false },
  { name: "Amplitude",              desc: "Analytics de produto e eventos",     cmd: 'claude mcp add amplitude --transport sse --url "https://amplitude-mcp.melioffice.com/sse"',         token: false },
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
function SlideLayout({ num, title, intro, children, maxWidth = "1080px", centered = false, noScroll = false }: { num: string; title: string; intro?: string; children: ReactNode; maxWidth?: string; centered?: boolean; noScroll?: boolean }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", maxWidth, margin: "0 auto", padding: "0 48px", width: "100%", ...(centered && { justifyContent: "center", alignItems: "center", textAlign: "center" }) }}>
      <div style={{ paddingTop: centered ? 0 : "40px", paddingBottom: centered ? "12px" : "22px", flexShrink: 0 }}>
        <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "14px", color: T.dimmer, letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>
          {num}
        </span>
        <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 300, fontStyle: "italic", color: T.text, lineHeight: 1.2, margin: 0, marginBottom: intro ? "12px" : 0 }}>
          {title}
        </h2>
        {intro && <p style={{ fontSize: "16px", color: T.muted, lineHeight: 1.65, margin: 0 }}>{intro}</p>}
      </div>
      <div style={{ ...(centered ? {} : { flex: 1 }), ...(noScroll ? { overflow: "hidden", display: "flex", flexDirection: "column", minHeight: 0 } : { overflowY: "auto" }), paddingBottom: noScroll ? 0 : "20px", width: "100%" }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Layout duas colunas (padrão slides 1–8) ─── */
function TwoColSlide({ num, title, intro, left, right, maxWidth = "1080px" }: { num: string; title: string; intro?: string; left: ReactNode; right: ReactNode; maxWidth?: string }) {
  return (
    <div style={{ height: "100%", display: "flex", maxWidth, margin: "0 auto", padding: "0 48px", width: "100%" }}>
      <div style={{ flex: 1, minWidth: 0, paddingRight: 48, display: "flex", flexDirection: "column", overflow: "hidden", justifyContent: "center" }}>
        <div style={{ flexShrink: 0, marginBottom: 24 }}>
          <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "14px", color: T.dimmer, letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>{num}</span>
          <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 300, fontStyle: "italic", color: T.text, lineHeight: 1.2, margin: 0, marginBottom: intro ? "12px" : 0, whiteSpace: "pre-line" }}>{title}</h2>
          {intro && <p style={{ fontSize: "16px", color: T.muted, lineHeight: 1.65, margin: 0, whiteSpace: "pre-line" }}>{intro}</p>}
        </div>
        <div style={{ flex: "0 0 auto", overflowY: "auto", paddingBottom: "4px" }}>
          {left}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0, paddingLeft: 48, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {right}
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

/* ─── Terminal animado (typing loop) ─── */
const INSTALL_CMDS = {
  macos:     "brew install --cask claude-code",
  universal: "curl -fsSL https://claude.ai/install.sh | bash",
};
const INSTALL_OUTPUT: Record<"macos" | "universal", string[]> = {
  macos: [
    "==> Downloading claude-code...",
    "==> Verifying SHA-256 checksum...",
    "==> Installing Cask...",
    "🍺  claude-code installed successfully!",
  ],
  universal: [
    "  % Connecting to claude.ai...",
    "  Downloading installer...",
    "  Installing claude-code...",
    "✓  claude-code installed successfully!",
  ],
};

function TerminalTyper({ cmd, output }: { cmd: string; output: string[] }) {
  const [chars,  setChars]  = useState(0);
  const [lines,  setLines]  = useState(0);
  const [phase,  setPhase]  = useState<"typing" | "executing" | "done">("typing");
  const [blink,  setBlink]  = useState(true);

  useEffect(() => {
    const id = setInterval(() => setBlink(b => !b), 530);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (phase !== "typing") return;
    if (chars < cmd.length) {
      const id = setTimeout(() => setChars(c => c + 1), 52);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setPhase("executing"), 480);
    return () => clearTimeout(id);
  }, [phase, chars, cmd]);

  useEffect(() => {
    if (phase !== "executing") return;
    if (lines < output.length) {
      const id = setTimeout(() => setLines(l => l + 1), 360);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => setPhase("done"), 1600);
    return () => clearTimeout(id);
  }, [phase, lines, output]);

  useEffect(() => {
    if (phase !== "done") return;
    const id = setTimeout(() => { setChars(0); setLines(0); setPhase("typing"); }, 1400);
    return () => clearTimeout(id);
  }, [phase]);

  const P = "#D8D8D5";
  const PDim = "#5A5A57";

  const Cursor = () => (
    <span style={{ display: "inline-block", width: 2, height: "1em", background: P, marginLeft: 1, opacity: blink ? 1 : 0, verticalAlign: "text-bottom" }} />
  );

  return (
    <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #222220" }}>
      {/* Title bar — sem filtro */}
      <div style={{ padding: "12px 16px", background: "#161614", display: "flex", alignItems: "center", gap: 7, borderBottom: "1px solid #1C1C1A" }}>
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57", flexShrink: 0 }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E", flexShrink: 0 }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840", flexShrink: 0 }} />
        <span style={{ flex: 1, textAlign: "center", fontSize: 12, color: "#4A4A47", fontFamily: "var(--font-jetbrains-mono)" }}>zsh</span>
      </div>
      {/* Content — CRT effect */}
      <CRTEffect theme="custom" scanlineColor="rgba(200,200,200,0.02)" enableSweep sweepDuration={8} sweepStyle="soft" enableFlicker flickerIntensity="low" flickerSpeed="high" scanlineOpacity={0.02}>
      <div style={{ padding: "22px 26px", minHeight: 190, fontFamily: "var(--font-jetbrains-mono)", fontSize: 13, lineHeight: 1.9, color: P, background: "#0E0E0C" }}>
        {/* Prompt + comando */}
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <span style={{ color: "#FEE340", marginRight: 9, flexShrink: 0, lineHeight: 1.9 }}>❯</span>
          <span style={{ wordBreak: "break-all" }}>
            {cmd.slice(0, chars)}
            {phase === "typing" && <Cursor />}
          </span>
        </div>
        {/* Output */}
        {phase !== "typing" && (
          <div style={{ marginTop: 10 }}>
            {output.slice(0, lines).map((line, i) => (
              <div key={i} style={{ color: i === output.length - 1 ? P : PDim }}>{line}</div>
            ))}
          </div>
        )}
        {/* Novo prompt após concluir */}
        {phase === "done" && (
          <div style={{ display: "flex", alignItems: "flex-start", marginTop: 10 }}>
            <span style={{ color: P, marginRight: 9, flexShrink: 0 }}>❯</span>
            <Cursor />
          </div>
        )}
      </div>
      </CRTEffect>
    </div>
  );
}

/* ─── Slide de instalação com terminal animado — layout autônomo ─── */
function InstallSlideWithTerminal() {
  const [tab, setTab] = useState<"macos" | "universal">("macos");

  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", maxWidth: "1080px", margin: "0 auto", padding: "0 48px", width: "100%" }}>
      {/* Coluna esquerda: cabeçalho + tabs + comando */}
      <div style={{ flex: 1, minWidth: 0, paddingRight: 48 }}>
        <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "14px", color: T.dimmer, letterSpacing: "0.1em", display: "block", marginBottom: "8px" }}>01</span>
        <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 300, fontStyle: "italic", color: T.text, lineHeight: 1.2, margin: 0, marginBottom: "12px" }}>
          Instalando o Claude Code
        </h2>
        <p style={{ fontSize: "16px", color: T.muted, lineHeight: 1.65, margin: 0, marginBottom: 28 }}>
          Abra o terminal, cole o comando abaixo e aperte Enter:
        </p>

        <div role="tablist" style={{ display: "inline-flex", borderBottom: `1px solid ${T.border}`, marginBottom: 20 }}>
          {(["macos", "universal"] as const).map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "9px 18px", fontSize: 15, fontWeight: tab === t ? 500 : 400, color: tab === t ? T.text : "#5A5A57", borderBottom: tab === t ? `2px solid ${T.accent}` : "2px solid transparent", marginBottom: -1, transition: "all 0.15s ease", fontFamily: "inherit" }}>
              {t === "macos" ? "macOS (Brew)" : "Universal (curl)"}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <p style={{ fontSize: 15, color: T.dim, margin: 0 }}>
            {tab === "macos" ? "Requer o Homebrew instalado." : "Funciona em qualquer sistema Unix-like."}
          </p>
          <CommandBlock command={INSTALL_CMDS[tab]} />
        </div>
      </div>

      {/* Divisória */}

      {/* Coluna direita: terminal animado */}
      <div style={{ flex: 1, minWidth: 0, paddingLeft: 48 }}>
        <TerminalTyper key={tab} cmd={INSTALL_CMDS[tab]} output={INSTALL_OUTPUT[tab]} />
      </div>
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

/* ─── Tipo para interceptação de navegação ─── */
type Interceptor = { next: () => boolean; prev: () => boolean };

/* ─── Terminal shell compartilhado (auth steps) ─── */
function AuthTermShell({ title = "zsh", children }: { title?: string; children: ReactNode }) {
  return (
    <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #222220", width: "100%" }}>
      <div style={{ padding: "12px 16px", background: "#161614", display: "flex", alignItems: "center", gap: 7, borderBottom: "1px solid #1C1C1A" }}>
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57", flexShrink: 0 }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD2E", flexShrink: 0 }} />
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840", flexShrink: 0 }} />
        <span style={{ flex: 1, textAlign: "center", fontSize: 12, color: "#4A4A47", fontFamily: "var(--font-jetbrains-mono)" }}>{title}</span>
      </div>
      <CRTEffect theme="custom" scanlineColor="rgba(200,200,200,0.02)" enableSweep sweepDuration={8} sweepStyle="soft" enableFlicker flickerIntensity="low" flickerSpeed="high" scanlineOpacity={0.02}>
        <div style={{ padding: "22px 26px", minHeight: 160, fontFamily: "var(--font-jetbrains-mono)", fontSize: 13, lineHeight: 1.9, color: "#D8D8D5", background: "#0E0E0C" }}>
          {children}
        </div>
      </CRTEffect>
    </div>
  );
}

/* ─── Auth Step 1 — digita "claude" + startup ─── */
function AuthStep1Terminal() {
  const [chars, setChars] = useState(0);
  const [lines, setLines] = useState(0);
  const [phase, setPhase] = useState<"typing"|"output"|"done">("typing");
  const [blink, setBlink] = useState(true);
  const outColors = ["#5A5A57", T.green, "#5A5A57"];

  useEffect(() => { const id = setInterval(() => setBlink(b => !b), 530); return () => clearInterval(id); }, []);
  useEffect(() => {
    if (phase !== "typing") return;
    if (chars < 6) { const t = setTimeout(() => setChars(c => c + 1), 65); return () => clearTimeout(t); }
    const t = setTimeout(() => setPhase("output"), 380); return () => clearTimeout(t);
  }, [phase, chars]);
  useEffect(() => {
    if (phase !== "output") return;
    if (lines < 3) { const t = setTimeout(() => setLines(l => l + 1), 400); return () => clearTimeout(t); }
    const t = setTimeout(() => setPhase("done"), 2000); return () => clearTimeout(t);
  }, [phase, lines]);
  useEffect(() => {
    if (phase !== "done") return;
    const t = setTimeout(() => { setPhase("typing"); setChars(0); setLines(0); }, 1200); return () => clearTimeout(t);
  }, [phase]);

  const P = "#D8D8D5";
  const Cursor = () => <span style={{ display: "inline-block", width: 2, height: "1em", background: P, marginLeft: 1, opacity: blink ? 1 : 0, verticalAlign: "text-bottom" }} />;
  const output = ["⠋  Initializing Claude Code…", "✓  Claude Code ready", "   Type /help for commands"];
  const cmd = "claude";

  return (
    <AuthTermShell>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <span style={{ color: "#FEE340", marginRight: 9, flexShrink: 0, lineHeight: 1.9 }}>❯</span>
        <span>{cmd.slice(0, chars)}{phase === "typing" && <Cursor />}</span>
      </div>
      {phase !== "typing" && (
        <div style={{ marginTop: 8 }}>
          {output.slice(0, lines).map((line, i) => (
            <div key={i} style={{ color: outColors[i] }}>{line}</div>
          ))}
        </div>
      )}
      {phase === "done" && (
        <div style={{ display: "flex", marginTop: 8 }}>
          <span style={{ color: "#FEE340", marginRight: 9 }}>❯</span>
          <Cursor />
        </div>
      )}
    </AuthTermShell>
  );
}

/* ─── Auth Step 2 — seleção de tema ─── */
function AuthStep2Terminal() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (phase === 0) { const t = setTimeout(() => setPhase(1), 600); return () => clearTimeout(t); }
    if (phase === 1) { const t = setTimeout(() => setPhase(2), 1400); return () => clearTimeout(t); }
    if (phase === 2) { const t = setTimeout(() => setPhase(3), 2200); return () => clearTimeout(t); }
    if (phase === 3) { const t = setTimeout(() => setPhase(0), 300); return () => clearTimeout(t); }
  }, [phase]);
  const themes = ["Dark", "Dark (daltonism-friendly)", "Light", "System"];
  return (
    <AuthTermShell title="Claude Code">
      <div style={{ color: T.accent, marginBottom: 14 }}>Welcome to Claude Code!</div>
      <div style={{ color: "#5A5A57", marginBottom: 10, fontSize: 12 }}>? Choose your preferred theme</div>
      {phase < 2 ? themes.map((theme, i) => {
        const hi = i === 0 && phase === 1;
        return (
          <div key={theme} style={{ display: "flex", alignItems: "center", gap: 10, padding: "3px 8px", borderRadius: 4, background: hi ? T.accentBg : "none", marginBottom: 3, transition: "background 0.25s ease" }}>
            <span style={{ fontSize: 12, color: hi ? T.accent : "transparent", width: 10, flexShrink: 0 }}>❯</span>
            <span style={{ fontSize: 13, color: hi ? T.text : "#5A5A57", fontWeight: hi ? 500 : 400, transition: "color 0.25s ease" }}>{theme}</span>
          </div>
        );
      }) : (
        <div style={{ display: "flex", alignItems: "center", gap: 9, color: T.green, marginTop: 4 }}>
          <span>✓</span><span style={{ fontWeight: 500 }}>Dark mode selected</span>
        </div>
      )}
    </AuthTermShell>
  );
}

/* ─── Auth Step 3 — seleção de método ─── */
function AuthStep3Terminal() {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (phase === 0) { const t = setTimeout(() => setPhase(1), 700); return () => clearTimeout(t); }
    if (phase === 1) { const t = setTimeout(() => setPhase(2), 1600); return () => clearTimeout(t); }
    if (phase === 2) { const t = setTimeout(() => setPhase(3), 2400); return () => clearTimeout(t); }
    if (phase === 3) { const t = setTimeout(() => setPhase(0), 300); return () => clearTimeout(t); }
  }, [phase]);
  const methods = [
    { name: "Method 1", sub: "claude.ai — Pro / Max subscription" },
    { name: "Method 2", sub: "Anthropic Console — API billing" },
    { name: "Method 3", sub: "Enterprise SSO (Bedrock / Vertex)" },
  ];
  const selIdx = phase === 0 ? 0 : 1;
  return (
    <AuthTermShell title="Claude Code">
      <div style={{ color: "#5A5A57", marginBottom: 10, fontSize: 12 }}>? Select login method</div>
      {phase < 2 ? methods.map((m, i) => {
        const isSel = i === selIdx;
        return (
          <div key={m.name} style={{ display: "flex", alignItems: "baseline", gap: 8, padding: "4px 8px", borderRadius: 4, background: isSel ? T.accentBg : "none", marginBottom: 3, transition: "background 0.25s ease" }}>
            <span style={{ fontSize: 12, color: isSel ? T.accent : "transparent", width: 10, flexShrink: 0 }}>❯</span>
            <span style={{ fontSize: 13, color: isSel ? T.accent : "#5A5A57", fontWeight: isSel ? 600 : 400, flexShrink: 0, transition: "color 0.25s ease" }}>{m.name}</span>
            <span style={{ fontSize: 12, color: "#3A3A37" }}>— {m.sub}</span>
          </div>
        );
      }) : (
        <div style={{ display: "flex", alignItems: "center", gap: 9, color: T.green }}>
          <span>✓</span><span style={{ fontWeight: 500 }}>Method 2 selected</span>
        </div>
      )}
    </AuthTermShell>
  );
}

/* ─── Auth Step 4 — browser OAuth com botão animado ─── */
function AuthStep4Browser() {
  const [phase, setPhase] = useState<0|1|2>(0);
  useEffect(() => {
    if (phase === 0) { const t = setTimeout(() => setPhase(1), 1500); return () => clearTimeout(t); }
    if (phase === 1) { const t = setTimeout(() => setPhase(2), 500); return () => clearTimeout(t); }
    if (phase === 2) { const t = setTimeout(() => setPhase(0), 3000); return () => clearTimeout(t); }
  }, [phase]);
  return (
    <BrowserMock url="console.anthropic.com/oauth/authorize">
      {phase < 2 ? (
        <div style={{ textAlign: "center", maxWidth: 300 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 4, letterSpacing: "-0.02em", fontFamily: "system-ui" }}>Anthropic</div>
          <div style={{ width: 32, height: 2, background: "#E8E8E8", margin: "0 auto 20px" }} />
          <p style={{ fontSize: 15, fontWeight: 600, color: "#111", margin: "0 0 6px", fontFamily: "system-ui" }}>Claude Code requests access</p>
          <p style={{ fontSize: 13, color: "#777", margin: "0 0 24px", fontFamily: "system-ui" }}>to your Anthropic Console account</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button style={{ padding: "9px 20px", borderRadius: 6, border: "1px solid #D5D5D5", background: "white", color: "#444", fontSize: 14, cursor: "default", fontFamily: "system-ui" }}>Cancel</button>
            <button style={{ padding: "9px 22px", borderRadius: 6, border: "none", background: phase === 1 ? "#B85D00" : "#D97706", color: "white", fontSize: 14, fontWeight: 600, cursor: "default", fontFamily: "system-ui", boxShadow: phase === 1 ? "none" : "0 1px 3px rgba(0,0,0,0.18)", transform: phase === 1 ? "scale(0.97)" : "scale(1)", transition: "all 0.12s ease" }}>Authorize</button>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 38, marginBottom: 12, color: "#22C55E" }}>✓</div>
          <p style={{ fontSize: 15, fontWeight: 600, color: "#111", margin: "0 0 6px", fontFamily: "system-ui" }}>Authorization successful</p>
          <p style={{ fontSize: 13, color: "#888", margin: 0, fontFamily: "system-ui" }}>Redirecting back to Claude Code…</p>
        </div>
      )}
    </BrowserMock>
  );
}

/* ─── Auth Step 5 — seleção de organização ─── */
function AuthStep5Browser() {
  const [phase, setPhase] = useState<0|1|2>(0);
  useEffect(() => {
    if (phase === 0) { const t = setTimeout(() => setPhase(1), 700); return () => clearTimeout(t); }
    if (phase === 1) { const t = setTimeout(() => setPhase(2), 1800); return () => clearTimeout(t); }
    if (phase === 2) { const t = setTimeout(() => setPhase(0), 2800); return () => clearTimeout(t); }
  }, [phase]);
  const orgs = [
    { name: "Personal", sub: "seu.email@gmail.com" },
    { name: "MercadoLibre Uruguay S.R.L", sub: "mercadolibre.com" },
  ];
  return (
    <BrowserMock url="console.anthropic.com/oauth/org-select">
      <div style={{ width: "100%", maxWidth: 320 }}>
        <p style={{ fontSize: 15, fontWeight: 600, color: "#111", margin: "0 0 16px", textAlign: "center", fontFamily: "system-ui" }}>Select organization</p>
        {orgs.map((org, i) => {
          const isSel = i === 1 && phase >= 1;
          return (
            <div key={org.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 8, border: isSel ? "2px solid #D97706" : "1px solid #E5E5E5", marginBottom: 8, background: isSel ? "#FFFBF0" : "white", cursor: "default", transition: "all 0.25s ease" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: isSel ? "#D97706" : "#D5D5D5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "white", flexShrink: 0, fontFamily: "system-ui", transition: "background 0.25s ease" }}>
                {org.name[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: isSel ? 600 : 400, color: "#111", fontFamily: "system-ui" }}>{org.name}</div>
                <div style={{ fontSize: 12, color: "#888", fontFamily: "system-ui" }}>{org.sub}</div>
              </div>
              {isSel && <span style={{ color: "#D97706", fontSize: 16, flexShrink: 0 }}>✓</span>}
            </div>
          );
        })}
        <button style={{ width: "100%", padding: "11px", borderRadius: 6, border: "none", background: phase >= 1 ? (phase === 2 ? "#B85D00" : "#D97706") : "#E5E5E5", color: phase >= 1 ? "white" : "#aaa", fontSize: 14, fontWeight: 600, marginTop: 6, cursor: "default", fontFamily: "system-ui", transition: "all 0.25s ease", transform: phase === 2 ? "scale(0.98)" : "scale(1)" }}>
          Continue
        </button>
      </div>
    </BrowserMock>
  );
}

/* ─── Auth Step 6 — login concluído ─── */
function AuthStep6Terminal() {
  const [visibleLines, setVisibleLines] = useState(0);
  const [phase, setPhase] = useState<"lines"|"select"|"done"|"reset">("lines");
  useEffect(() => {
    if (phase === "lines") {
      if (visibleLines < 4) { const t = setTimeout(() => setVisibleLines(l => l + 1), visibleLines === 0 ? 0 : 400); return () => clearTimeout(t); }
      const t = setTimeout(() => setPhase("select"), 600); return () => clearTimeout(t);
    }
    if (phase === "select") { const t = setTimeout(() => setPhase("done"), 1400); return () => clearTimeout(t); }
    if (phase === "done") { const t = setTimeout(() => setPhase("reset"), 2400); return () => clearTimeout(t); }
    if (phase === "reset") { const t = setTimeout(() => { setVisibleLines(0); setPhase("lines"); }, 300); return () => clearTimeout(t); }
  }, [phase, visibleLines]);
  const allLines = [
    { text: "✓  Login successful", color: T.green },
    { text: "   Logged in as bruno.goncalves@mercadolibre.com", color: "#5A5A57" },
    { text: "\u00A0", color: "" },
    { text: "? Do you accept the Terms of Service?", color: "#5A5A57" },
  ];
  return (
    <AuthTermShell title="Claude Code">
      {allLines.slice(0, visibleLines).map((line, i) => (
        <div key={i} style={{ color: line.color }}>{line.text}</div>
      ))}
      {(phase === "select" || phase === "done") && (
        <div style={{ display: "flex", gap: 14, marginTop: 8, paddingLeft: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 10px", borderRadius: 4, background: T.accentBg }}>
            <span style={{ fontSize: 12, color: T.accent }}>❯</span>
            <span style={{ fontSize: 13, color: T.text }}>Yes, I accept</span>
          </div>
          <span style={{ fontSize: 13, color: "#3A3A37", alignSelf: "center" }}>No</span>
        </div>
      )}
      {phase === "done" && (
        <div style={{ display: "flex", alignItems: "center", gap: 9, color: T.green, marginTop: 12 }}>
          <span>✓</span><span style={{ fontWeight: 500 }}>Terms accepted. Welcome to Claude Code!</span>
        </div>
      )}
    </AuthTermShell>
  );
}

/* ─── Slide de autenticação com nav vertical ─── */
function AuthSlide({ interceptRef }: { interceptRef?: { current: Interceptor | null } }) {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [markerPos, setMarkerPos] = useState({ top: 0, left: 0, width: 0, height: 0 });

  useEffect(() => {
    const el = stepRefs.current[active];
    if (el) setMarkerPos({ top: el.offsetTop, left: el.offsetLeft, width: el.offsetWidth, height: el.offsetHeight });
  }, [active]);

  useEffect(() => {
    if (!interceptRef) return;
    interceptRef.current = {
      next: () => { if (active < 5) { setActive(a => Math.min(a + 1, 5)); return true; } return false; },
      prev: () => { if (active > 0) { setActive(a => Math.max(a - 1, 0)); return true; } return false; },
    };
  }, [active, interceptRef]);

  useEffect(() => {
    if (!interceptRef) return;
    return () => { interceptRef.current = null; };
  }, [interceptRef]);

  const steps = [
    { label: "Iniciar o Claude",     desc: "Abre o Claude no terminal" },
    { label: "Escolher tema",        desc: "Aparência visual da interface" },
    { label: "Selecionar método",    desc: "Tipo de conta e billing" },
    { label: "Autorizar no browser", desc: "Confirmação de acesso OAuth" },
    { label: "Escolher organização", desc: "Conta do Mercado Pago" },
    { label: "Login concluído",      desc: "Aceitar termos e começar" },
  ];

  const mockups: ReactNode[] = [
    <AuthStep1Terminal key="s1" />,
    <AuthStep2Terminal key="s2" />,
    <AuthStep3Terminal key="s3" />,
    <AuthStep4Browser  key="s4" />,
    <AuthStep5Browser  key="s5" />,
    <AuthStep6Terminal key="s6" />,
  ];

  const stepNav = (
    <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, alignItems: "start" }}>
      {/* Marcador amarelo animado */}
      <div style={{
        position: "absolute",
        top: markerPos.top, left: markerPos.left,
        width: markerPos.width, height: markerPos.height,
        border: `1px solid ${T.accentBorder}`,
        borderLeft: `2px solid ${T.accent}`,
        borderRadius: 6,
        transition: "top 0.38s cubic-bezier(0.4, 0, 0.2, 1), left 0.38s cubic-bezier(0.4, 0, 0.2, 1), width 0.38s cubic-bezier(0.4, 0, 0.2, 1), height 0.38s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: "none",
      }} />
      {steps.map((step, i) => {
        const isActive = i === active;
        const isDone   = i < active;
        return (
          <button key={i} ref={el => { stepRefs.current[i] = el; }} onClick={() => setActive(i)}
            style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "16px 14px", background: "none", border: "none", cursor: "pointer", textAlign: "left", width: "100%", borderRadius: 6 }}>
            <span style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, marginTop: 1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontFamily: "var(--font-jetbrains-mono)", background: isDone ? T.accentBg : "transparent", color: isActive ? T.accent : isDone ? T.accent : T.dimmer, border: isActive ? `1px solid ${T.accent}` : isDone ? `1px solid ${T.accentBorder}` : `1px solid ${T.border}`, transition: "all 0.3s ease" }}>
              {isDone ? "✓" : i + 1}
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: isActive ? 500 : 400, color: isActive ? T.text : isDone ? T.sec : T.muted, lineHeight: 1.3, marginBottom: 4, transition: "color 0.2s ease" }}>
                {step.label}
              </div>
              <div style={{ fontSize: 12, color: isActive ? T.dim : T.dimmer, lineHeight: 1.5, transition: "color 0.2s ease" }}>
                {step.desc}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <TwoColSlide
      num="02"
      title="Fazendo login"
      intro="Use as setas ou Próximo para avançar passo a passo:"
      left={stepNav}
      right={mockups[active]}
    />
  );
}

/* ─── Slide de boas-vindas com fade por linha ─── */
function WelcomeSlide({ onNext, contentDelay = 0 }: { onNext: () => void; contentDelay?: number }) {
  const [ready, setReady] = useState(contentDelay === 0);
  const [line1, setLine1] = useState(false);
  const [line2, setLine2] = useState(false);
  const [videoVisible, setVideoVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const t0 = contentDelay > 0 ? setTimeout(() => setReady(true), contentDelay) : null;
    const t1 = setTimeout(() => setLine1(true), contentDelay + 120);
    const t2 = setTimeout(() => setLine2(true), contentDelay + 480);
    const t3 = setTimeout(() => {
      setVideoVisible(true);
      videoRef.current?.play();
    }, contentDelay + 1100);
    return () => { if (t0) clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const h1Style: CSSProperties = {
    fontFamily: "'Pixelify Sans', sans-serif",
    fontSize: "clamp(42px, 6vw, 68px)",
    fontWeight: 500,
    letterSpacing: "-0.03em",
    lineHeight: 1.1,
    margin: 0,
    marginBottom: 32,
  };

  return (
    <div style={{ position: "relative", height: "100%" }}>
      {/* SVG luma key: pixels próximos ao preto viram transparentes */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="luma-key">
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  5 5 5 0 -1" />
          </filter>
        </defs>
      </svg>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        src="/Logo_Reveal.mp4"
        muted
        playsInline
        style={{ position: "absolute", bottom: 80, right: 48, width: 158, filter: "url(#luma-key)", opacity: videoVisible ? 1 : 0, transition: "opacity 0.4s ease", pointerEvents: "none" }}
      />
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 48px", textAlign: "center", maxWidth: "1080px", margin: "0 auto", opacity: ready ? 1 : 0, transition: "opacity 0.5s ease" }}>
      <p style={{ fontSize: 14, letterSpacing: "0.14em", textTransform: "uppercase", color: T.dimmer, fontWeight: 500, marginBottom: 44 }}>
        Mercado Pago · Onboarding Técnico
      </p>

      <h1 style={h1Style}>
        <span style={{ display: "block", color: T.text, opacity: line1 ? 1 : 0, transform: line1 ? "translateY(0)" : "translateY(8px)", transition: "opacity 0.55s ease, transform 0.55s ease" }}>
          Guia de Instalação
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 14, marginTop: 6, opacity: line2 ? 1 : 0, transform: line2 ? "translateY(0)" : "translateY(8px)", transition: "opacity 0.55s ease, transform 0.55s ease" }}>
          <span style={{ color: T.accent }}>Claude Meli</span>
          <AnimatedLogo style={{ height: "0.85em", width: "auto", display: "inline-block" }} />
        </span>
      </h1>

      <p style={{ fontSize: 18, color: T.muted, lineHeight: 1.7, maxWidth: 520, marginBottom: 52 }}>
        Vamos configurar tudo juntos, passo a passo. Em cerca de{" "}
        <span style={{ color: T.sec }}>10 minutos</span> o Claude Code estará funcionando no seu computador.
      </p>
      <button onClick={onNext}
        style={{ background: "transparent", color: T.accent, border: `0.3px solid ${T.accent}`, borderRadius: 6, padding: "15px 32px", fontSize: 16, fontWeight: 400, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 10 }}
        onMouseEnter={e => { e.currentTarget.style.background = T.accentBg; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
      >
        Começar
        <svg viewBox="0 0 16 16" fill="none" style={{ width: 15, height: 15 }}>
          <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <p style={{ fontSize: 14, color: T.dimmer, marginTop: 20 }}>8 passos simples</p>
    </div>
    </div>
  );
}

/* ─── Mock painel Figma animado ─── */
function FigmaTokenMock() {
  type Phase = "idle" | "typing" | "clicking" | "revealed" | "copied" | "reset";
  const TOKEN_LABEL = "Claude Code";
  const FAKE_TOKEN = "figd_xK9mP2qR7vL4nT8wA3cE6jY1";

  const [phase, setPhase]   = useState<Phase>("idle");
  const [chars, setChars]   = useState(0);
  const [blink, setBlink]   = useState(true);

  // cursor blink
  useEffect(() => { const id = setInterval(() => setBlink(b => !b), 530); return () => clearInterval(id); }, []);

  // phase chain
  useEffect(() => {
    if (phase === "idle") {
      const t = setTimeout(() => { setChars(0); setPhase("typing"); }, 1200);
      return () => clearTimeout(t);
    }
    if (phase === "typing") {
      if (chars < TOKEN_LABEL.length) {
        const t = setTimeout(() => setChars(c => c + 1), 80);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("clicking"), 600);
      return () => clearTimeout(t);
    }
    if (phase === "clicking") {
      const t = setTimeout(() => setPhase("revealed"), 400);
      return () => clearTimeout(t);
    }
    if (phase === "revealed") {
      const t = setTimeout(() => setPhase("copied"), 1800);
      return () => clearTimeout(t);
    }
    if (phase === "copied") {
      const t = setTimeout(() => { setPhase("reset"); }, 1600);
      return () => clearTimeout(t);
    }
    if (phase === "reset") {
      const t = setTimeout(() => { setChars(0); setPhase("idle"); }, 800);
      return () => clearTimeout(t);
    }
  }, [phase, chars]);

  const showInput    = phase === "typing" || phase === "clicking";
  const showToken    = phase === "revealed" || phase === "copied" || phase === "reset";
  const btnActive    = phase === "clicking";
  const copied       = phase === "copied";

  const FigmaLogo = () => (
    <svg viewBox="0 0 38 57" fill="none" style={{ width: 16, height: 16, flexShrink: 0 }}>
      <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" fill="#1ABCFE"/>
      <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 0 1-19 0z" fill="#0ACF83"/>
      <path d="M19 0v19h9.5a9.5 9.5 0 0 0 0-19H19z" fill="#FF7262"/>
      <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#F24E1E"/>
      <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" fill="#A259FF"/>
    </svg>
  );

  return (
    <div style={{ background: "#1E1E1E", borderRadius: 10, border: "1px solid #333", overflow: "hidden", fontFamily: "system-ui, sans-serif", fontSize: 13 }}>
      {/* Topbar */}
      <div style={{ background: "#2C2C2C", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #3A3A3A" }}>
        <FigmaLogo />
        <span style={{ color: "#CCC", fontSize: 12 }}>Figma — Settings</span>
      </div>

      {/* Sidebar + content */}
      <div style={{ display: "flex" }}>
        <div style={{ width: 140, borderRight: "1px solid #2A2A2A", padding: "16px 0", flexShrink: 0 }}>
          {["Account", "Security", "Notifications", "Plans", "Integrations"].map((item, i) => (
            <div key={item} style={{ padding: "7px 16px", fontSize: 12, color: i === 0 ? "#FFF" : "#666", background: i === 0 ? "#3A3A3A" : "transparent" }}>{item}</div>
          ))}
        </div>

        <div style={{ flex: 1, padding: "20px 20px 16px", minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#FFF", marginBottom: 16 }}>Account</div>

          <div style={{ borderTop: "1px solid #2A2A2A", paddingTop: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#CCC", marginBottom: 10, letterSpacing: "0.04em" }}>Personal access tokens</div>

            {/* Token gerado — aparece após click */}
            {showToken && (
              <div style={{ background: "#2A2A2A", borderRadius: 6, padding: "10px 12px", marginBottom: 10, display: "flex", alignItems: "center", gap: 10, animation: "fadeIn 0.3s ease" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: "#EEE", marginBottom: 4 }}>Claude Code</div>
                  <div style={{ fontSize: 11, color: copied ? "#22C55E" : "#888", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", transition: "color 0.3s ease" }}>
                    {copied ? "✓ Copiado!" : FAKE_TOKEN}
                  </div>
                </div>
                <div style={{ fontSize: 10, color: copied ? "#22C55E" : "#1472FF", background: copied ? "#0D1F12" : "#0D1A2D", padding: "3px 7px", borderRadius: 4, flexShrink: 0, transition: "all 0.3s ease" }}>
                  {copied ? "✓" : "Copy"}
                </div>
              </div>
            )}

            {/* Input de nome — visível durante digitação */}
            {showInput && (
              <div style={{ marginBottom: 10, animation: "fadeIn 0.2s ease" }}>
                <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>Token name</div>
                <div style={{ background: "#111", border: "1px solid #1472FF", borderRadius: 5, padding: "6px 10px", fontSize: 12, fontFamily: "monospace", color: "#EEE", display: "flex", alignItems: "center" }}>
                  <span>{TOKEN_LABEL.slice(0, chars)}</span>
                  <span style={{ display: "inline-block", width: 2, height: 14, background: blink ? "#1472FF" : "transparent", marginLeft: 1, transition: "background 0.1s" }} />
                </div>
              </div>
            )}

            {/* Botão Generate */}
            <button style={{ background: btnActive ? "#0E5ACC" : "#1472FF", border: "none", borderRadius: 6, padding: "8px 14px", fontSize: 12, color: "#FFF", cursor: "default", fontWeight: 500, transform: btnActive ? "scale(0.96)" : "scale(1)", transition: "all 0.15s ease" }}>
              + Generate new token
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── VS Code terminal animado ─── */
function VSCodeTerminalAnim() {
  const [chars, setChars] = useState(0);
  const [phase, setPhase] = useState<"typing"|"connecting"|"connected"|"ready">("typing");
  const [blink, setBlink] = useState(true);
  const [dotCount, setDotCount] = useState(0);
  const cmd = "claude";

  useEffect(() => { const id = setInterval(() => setBlink(b => !b), 530); return () => clearInterval(id); }, []);

  useEffect(() => {
    if (phase !== "typing") return;
    if (chars < cmd.length) { const t = setTimeout(() => setChars(c => c + 1), 65); return () => clearTimeout(t); }
    const t = setTimeout(() => setPhase("connecting"), 380); return () => clearTimeout(t);
  }, [phase, chars]);

  useEffect(() => {
    if (phase !== "connecting") return;
    if (dotCount < 3) { const t = setTimeout(() => setDotCount(d => d + 1), 500); return () => clearTimeout(t); }
    const t = setTimeout(() => setPhase("connected"), 400); return () => clearTimeout(t);
  }, [phase, dotCount]);

  useEffect(() => {
    if (phase !== "connected") return;
    const t = setTimeout(() => setPhase("ready"), 1000); return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== "ready") return;
    const t = setTimeout(() => { setPhase("typing"); setChars(0); setDotCount(0); }, 2500); return () => clearTimeout(t);
  }, [phase]);

  const Cursor = () => <span style={{ display: "inline-block", width: 2, height: "1em", background: "#D8D8D5", marginLeft: 1, opacity: blink ? 1 : 0, verticalAlign: "text-bottom" }} />;

  return (
    <div style={{ background: "#1E1E1E", border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden", width: "100%" }}>
      <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", gap: 6, background: "#2D2D2D", borderBottom: "1px solid #3A3A3A" }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57", flexShrink: 0 }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E", flexShrink: 0 }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840", flexShrink: 0 }} />
        <span style={{ flex: 1, textAlign: "center", fontSize: 12, color: "#999", fontFamily: "system-ui" }}>VS Code</span>
      </div>
      <div style={{ display: "flex", height: 220 }}>
        <div style={{ width: 44, background: "#252526", borderRight: "1px solid #3A3A3A", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 12, gap: 14, flexShrink: 0 }}>
          {["⬛", "🔍", "🌿", "⚙️"].map((ic, i) => (
            <span key={i} style={{ fontSize: 13, opacity: 0.35 }}>{ic}</span>
          ))}
          <div style={{ marginTop: "auto", marginBottom: 12, background: T.accent, borderRadius: 4, padding: "3px 5px", fontSize: 10, fontWeight: 700, color: "#0F0F0D", fontFamily: "system-ui", lineHeight: 1 }}>CC</div>
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <CRTEffect theme="custom" scanlineColor="rgba(200,200,200,0.02)" enableSweep sweepDuration={8} sweepStyle="soft" enableFlicker flickerIntensity="low" flickerSpeed="high" scanlineOpacity={0.02}>
            <div style={{ padding: "12px 16px", background: "#1E1E1E", fontFamily: "var(--font-jetbrains-mono)", fontSize: 12, display: "flex", flexDirection: "column", minHeight: 188, height: "100%", boxSizing: "border-box" }}>
              <div style={{ fontSize: 10, color: "#555", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>Terminal</div>
              <div style={{ color: "#666", marginBottom: 4 }}>
                ~/my-project <span style={{ color: T.accent }}>$</span>{" "}
                {cmd.slice(0, chars)}{phase === "typing" && <Cursor />}
              </div>
              {phase !== "typing" && (
                <div style={{ color: "#555", marginBottom: 8, fontSize: 11 }}>
                  ▸ Auto-connect to IDE{phase === "connecting" ? ".".repeat(dotCount) : "..."}
                </div>
              )}
              {(phase === "connected" || phase === "ready") && (
                <div style={{ color: T.green, marginBottom: 4 }}>✓ Conectado ao VS Code</div>
              )}
              {phase === "ready" && (
                <div style={{ color: "#666", marginTop: "auto" }}>
                  ~/my-project <span style={{ color: T.accent }}>$</span>{" "}<Cursor />
                </div>
              )}
            </div>
          </CRTEffect>
        </div>
      </div>
    </div>
  );
}

/* ─── Token input standalone (fora do MCPsSlide para evitar remount a cada keystroke) ─── */
function MCPTokenInput({ name, value, onChange }: { name: string; value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1, minWidth: 0 }}>
      <span style={{ fontSize: 11, color: "#D97706", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500 }}>{name}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <input
          type="text"
          placeholder="Cole seu token"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{
            flex: 1, minWidth: 0,
            background: "#0F0D02",
            border: `1px solid ${value.trim() ? T.accentBorder : "#3D3208"}`,
            borderRadius: 4,
            padding: "5px 10px",
            fontSize: 12,
            fontFamily: "var(--font-jetbrains-mono)",
            color: T.text,
            outline: "none",
            transition: "border-color 0.2s ease",
          }}
        />
        {value.trim() && (
          <svg viewBox="0 0 12 12" fill="none" style={{ width: 12, height: 12, flexShrink: 0 }}>
            <path d="M2 6L5 9L10 3" stroke={T.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </div>
  );
}

/* ─── Slide MCPs com inputs de token e scroll ─── */
function MCPsSlide() {
  const [tokens, setTokens] = useState<Record<string, string>>({});

  const getCmd = (mcp: typeof MCPS[0]) => {
    if (!mcp.token) return mcp.cmd;
    const val = tokens[mcp.name]?.trim();
    return val ? mcp.cmd.replace("SEU_TOKEN_AQUI", val) : mcp.cmd;
  };

  const tokenMcps = MCPS.filter(m => m.token);

  return (
    <SlideLayout num="04" title="Expandindo o Claude" intro="Os MCPs são como apps extras — cada um adiciona uma nova habilidade ao Claude:" noScroll>
      {/* Barra de aviso + inputs de token na mesma linha */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 16px", background: "#1A1607", border: "1px solid #3D3208", borderRadius: 6, marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, flex: 1, minWidth: 0 }}>
          <svg viewBox="0 0 16 16" fill="none" style={{ width: 15, height: 15, flexShrink: 0, marginTop: 1 }}>
            <path fillRule="evenodd" clipRule="evenodd" d="M8 1.5a.5.5 0 0 1 .434.252l6.5 11A.5.5 0 0 1 14.5 13.5h-13a.5.5 0 0 1-.434-.748l6.5-11A.5.5 0 0 1 8 1.5ZM8 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 1 0v-3A.5.5 0 0 0 8 6Zm0 6.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" fill="#F59E0B" />
          </svg>
          <p style={{ fontSize: 13, color: "#D97706", lineHeight: 1.5, margin: 0 }}>
            <strong style={{ color: "#FCD34D" }}>Token necessário?</strong><br />Cole ao lado — o comando é atualizado automaticamente.
          </p>
        </div>
        <div style={{ width: 1, alignSelf: "stretch", background: "#3D3208", flexShrink: 0 }} />
        <div style={{ display: "flex", gap: 12, flex: 1, minWidth: 0 }}>
          {tokenMcps.map(mcp => (
            <MCPTokenInput
              key={mcp.name}
              name={mcp.name}
              value={tokens[mcp.name] || ""}
              onChange={v => setTokens(t => ({ ...t, [mcp.name]: v }))}
            />
          ))}
        </div>
      </div>

      <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", flex: 1, overflowY: "auto", marginBottom: 16 }}>
        {MCPS.map((mcp, i) => (
          <div key={mcp.name} style={{ padding: "16px 18px", borderBottom: i < MCPS.length - 1 ? `1px solid ${T.sub}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{mcp.name}</span>
              <span style={{ fontSize: 13, color: T.dim, borderLeft: `1px solid ${T.border}`, paddingLeft: 10 }}>{mcp.desc}</span>
              {mcp.token && <span style={{ fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: "#D97706", background: "#252008", padding: "2px 6px", borderRadius: 3, marginLeft: "auto", flexShrink: 0 }}>token</span>}
            </div>
            <CommandBlock command={getCmd(mcp)} />
            {mcp.note && <p style={{ fontSize: 13, color: T.dim, marginTop: 8, lineHeight: 1.55 }}>{mcp.note}</p>}
          </div>
        ))}
      </div>
    </SlideLayout>
  );
}

/* ─── Definição dos slides ─── */
type SlideRender = (ctx: { onNext: () => void; interceptRef: { current: Interceptor | null } }) => ReactNode;

const SLIDES: SlideRender[] = [
  /* 0 — Boas-vindas */
  ({ onNext }) => <WelcomeSlide onNext={onNext} />,

  /* 1 — Pré-requisitos */
  () => (
    <SlideLayout num="00" title="Antes de começar" intro="Duas coisinhas antes de instalar:" maxWidth="1080px" centered>
      <div style={{ width: "100%" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1px", background: T.border, border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", width: "100%" }}>
        <div style={{ background: T.surface, padding: 28, textAlign: "left" }}>
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
        <div style={{ background: T.surface, padding: 28, textAlign: "left" }}>
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
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", fontSize: 14, fontFamily: "var(--font-jetbrains-mono)", color: T.accent, textDecoration: "none", padding: "14px 16px", background: T.accentBg, borderRadius: 6, border: `1px solid ${T.accentBorder}`, lineHeight: "22px", boxSizing: "border-box" }}>
            azir.adminml.com/licenses
            <svg viewBox="0 0 12 12" fill="none" style={{ width: 11, height: 11, flexShrink: 0 }}>
              <path d="M2 10L10 2M10 2H5M10 2V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 52, paddingBottom: 4, width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <ClaudeMascot style={{ height: 60, width: "auto" }} />
          <AnimatedLogo style={{ height: 52, width: "auto", marginTop: -6 }} />
        </div>
      </div>
      </div>
    </SlideLayout>
  ),

  /* 2 — Instalação */
  () => (
    <div style={{ height: "100%" }}>
      <InstallSlideWithTerminal />
    </div>
  ),

  /* 3 — Autenticação com nav vertical + simulações */
  ({ interceptRef }) => <AuthSlide interceptRef={interceptRef} />,

  /* 4 — VS Code */
  () => (
    <TwoColSlide
      num="03"
      title="Conectando ao VS Code"
      intro="Se você usa o VS Code, o Claude consegue trabalhar direto dentro dele:"
      left={
        <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <StepItem num={1}>Abra o VS Code e instale a extensão <strong style={{ color: T.sec, fontWeight: 500 }}>"Claude Code for VS Code"</strong> no Marketplace.</StepItem>
          <StepItem num={2}>Clique no ícone do Claude (canto superior direito) → selecione <strong style={{ color: T.sec, fontWeight: 500 }}>"Anthropic Console"</strong>.</StepItem>
          <StepItem num={3} command="claude">No terminal integrado do VS Code, inicie o Claude:</StepItem>
          <StepItem num={4} last>Execute <strong style={{ color: T.sec, fontWeight: 500 }}>"Auto-connect to IDE"</strong> → ative → recarregue o terminal.</StepItem>
        </ol>
      }
      right={<VSCodeTerminalAnim />}
    />
  ),

  /* 5 — Token Figma */
  () => (
    <TwoColSlide
      num="04"
      title={"Gerando seu\ntoken do Figma"}
      intro="Gere um Personal Access Token:"
      left={
        <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <StepItem num={1}>Acesse <strong style={{ color: T.sec, fontWeight: 500 }}>figma.com</strong> e faça login com sua conta Meli.</StepItem>
          <StepItem num={2}>Clique no seu <strong style={{ color: T.sec, fontWeight: 500 }}>avatar</strong> (canto superior direito) → <strong style={{ color: T.sec, fontWeight: 500 }}>Settings</strong>.</StepItem>
          <StepItem num={3}>Na aba <strong style={{ color: T.sec, fontWeight: 500 }}>Account</strong>, role até <strong style={{ color: T.sec, fontWeight: 500 }}>Personal access tokens</strong>.</StepItem>
          <StepItem num={4}>Clique em <strong style={{ color: T.sec, fontWeight: 500 }}>Generate new token</strong>, dê um nome (ex: <code style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 12, color: T.accent }}>Claude Code</code>) e confirme.</StepItem>
          <StepItem num={5} last><strong style={{ color: T.accent, fontWeight: 500 }}>Copie o token gerado</strong> — ele aparece uma única vez. Cole na próxima tela.</StepItem>
        </ol>
      }
      right={<FigmaTokenMock />}
    />
  ),

  /* 6 — MCPs */
  () => <MCPsSlide />,

  /* 7 — Statusline */
  () => (
    <TwoColSlide
      num="05"
      title="Monitorando o uso"
      intro="Configure uma barra que mostra modelo, tokens e projeto direto no terminal:"
      left={
        <>
          <CommandBlock command='/statusline "$CurrentModel | ProgressBar with Current % of Token Usage | $TokenUsed/MaxTokensContext | Current Folder / Project | $GitBranch"' showPrompt={false} />
          <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", marginTop: 18 }}>
            <div style={{ padding: "10px 16px", borderBottom: `1px solid ${T.sub}`, background: T.surface }}>
              <span style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4A4A47", fontWeight: 500 }}>O que cada campo significa</span>
            </div>
            {[
              { token: "$CurrentModel",              desc: "Modelo ativo" },
              { token: "ProgressBar",                desc: "% de contexto usado" },
              { token: "$TokenUsed/MaxTokensContext", desc: "Tokens consumidos" },
              { token: "Current Folder / Project",   desc: "Pasta atual" },
              { token: "$GitBranch",                 desc: "Branch do Git" },
            ].map((f, i, arr) => (
              <div key={f.token} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: i < arr.length - 1 ? `1px solid ${T.sub}` : "none" }}>
                <code style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 12, color: T.accent, background: T.accentBg, padding: "2px 6px", borderRadius: 3, whiteSpace: "nowrap", flexShrink: 0 }}>{f.token}</code>
                <span style={{ fontSize: 13, color: T.muted }}>{f.desc}</span>
              </div>
            ))}
          </div>
        </>
      }
      right={
        <TerminalMock title="Claude Code">
          <div style={{ color: T.muted, fontSize: 11, marginBottom: 14 }}>Statusline ativa — exemplo de output:</div>
          <div style={{ background: T.sub, borderRadius: 6, padding: "10px 14px", marginBottom: 16, fontSize: 12 }}>
            <span style={{ color: T.accent }}>claude-sonnet-4-6</span>
            <span style={{ color: T.dimmer }}> | </span>
            <span style={{ color: T.sec }}>████████░░</span>
            <span style={{ color: T.dimmer }}> 78% | </span>
            <span style={{ color: T.muted }}>15.2k/200k</span>
            <span style={{ color: T.dimmer }}> | </span>
            <span style={{ color: T.sec }}>my-project</span>
            <span style={{ color: T.dimmer }}> | </span>
            <span style={{ color: "#22A7F0" }}>main</span>
          </div>
          <div style={{ color: "#5A5A57" }}>~</div>
          <div><span style={{ color: "#5A5A57" }}>~</span><span style={{ color: T.dimmer }}> $ </span><span style={{ color: T.text }}>claude</span></div>
          <div style={{ color: T.accent, marginTop: 6 }}>✓ Claude Code pronto</div>
          <div style={{ marginTop: 8 }}><span style={{ color: "#5A5A57" }}>~</span><span style={{ color: T.dimmer }}> $ </span><span style={{ display: "inline-block", width: 7, height: 14, background: T.muted, verticalAlign: "middle", opacity: 0.8 }} /></div>
        </TerminalMock>
      }
    />
  ),

  /* 8 — Comandos */
  () => (
    <TwoColSlide
      num="06"
      title="Comandos do dia a dia"
      intro="Os que você vai usar mais:"
      left={
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { cmd: "claude",          desc: "Abre o Claude no terminal" },
            { cmd: 'claude "tarefa"', desc: "Executa uma tarefa e fecha" },
            { cmd: "claude commit",   desc: "Cria um commit com suas mudanças" },
          ].map(({ cmd, desc }) => (
            <div key={cmd} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <code style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 13, color: T.accent, background: T.accentBg, padding: "3px 8px", borderRadius: 3, whiteSpace: "nowrap", flexShrink: 0 }}>{cmd}</code>
              <span style={{ fontSize: 14, color: T.muted, lineHeight: 1.5, paddingTop: 3 }}>{desc}</span>
            </div>
          ))}
          <div style={{ height: 1, background: T.border, margin: "4px 0" }} />
          {[
            { cmd: "/help",    desc: "Lista todos os comandos disponíveis" },
            { cmd: "/clear",   desc: "Apaga o histórico da sessão atual" },
            { cmd: "/model",   desc: "Muda o modelo (Sonnet, Opus, Haiku)" },
            { cmd: "/cost",    desc: "Mostra o custo da sessão" },
            { cmd: "/context", desc: "Mostra quanto contexto foi usado" },
          ].map(({ cmd, desc }) => (
            <div key={cmd} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <code style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 13, color: T.sec, background: T.surface, padding: "3px 8px", borderRadius: 3, whiteSpace: "nowrap", flexShrink: 0, border: `1px solid ${T.border}` }}>{cmd}</code>
              <span style={{ fontSize: 14, color: T.muted, lineHeight: 1.5, paddingTop: 3 }}>{desc}</span>
            </div>
          ))}
        </div>
      }
      right={
        <TerminalMock title="Claude Code">
          <div style={{ marginBottom: 4 }}><span style={{ color: "#5A5A57" }}>~</span><span style={{ color: T.dimmer }}> $ </span><span style={{ color: T.accent }}>claude commit</span></div>
          <div style={{ color: T.muted, marginBottom: 14, fontSize: 12 }}>Analisando mudanças em stage...</div>
          <div style={{ color: T.sec, marginBottom: 6, fontSize: 12 }}>feat: add user authentication flow</div>
          <div style={{ color: T.dim, marginBottom: 14, fontSize: 11 }}>Co-Authored-By: Claude Sonnet 4.6</div>
          <div style={{ color: T.green, marginBottom: 12 }}>✓ Commit criado com sucesso</div>
          <div style={{ height: 1, background: T.sub, marginBottom: 12 }} />
          <div style={{ marginBottom: 4 }}><span style={{ color: "#5A5A57" }}>~</span><span style={{ color: T.dimmer }}> $ </span><span style={{ color: T.accent }}>/model</span></div>
          <div style={{ color: T.muted, fontSize: 12, marginBottom: 6 }}>Modelo atual: claude-sonnet-4-6</div>
          <div style={{ color: T.dim, fontSize: 12 }}>&gt; claude-opus-4-6 / claude-haiku-4-5</div>
        </TerminalMock>
      }
    />
  ),

  /* 9 — Boas Práticas */
  () => (
    <SlideLayout num="07" title="Dicas para usar bem" intro="Hábitos que fazem diferença no dia a dia:" centered>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: T.border, border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden" }}>
        {PRACTICES.map(p => (
          <div key={p.title} style={{ background: T.surface, padding: 20, textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: T.dimmer, fontWeight: 300, lineHeight: 1, width: 18, textAlign: "center", flexShrink: 0 }}>{p.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{p.title}</span>
            </div>
            <p style={{ fontSize: 13, color: T.dim, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </SlideLayout>
  ),
];

/* ─── Navegação inferior com dots centralizados ─── */
function BottomNav({ current, total, onPrev, onNext, onGoTo }: { current: number; total: number; onPrev: () => void; onNext: () => void; onGoTo: (i: number) => void }) {
  const isLast = current === total - 1;

  const base: CSSProperties = { background: "none", border: `1px solid ${T.border}`, borderRadius: 6, padding: "11px 24px", fontSize: 15, color: T.sec, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 9, transition: "opacity 0.15s ease", letterSpacing: "0.01em" };

  return (
    <div style={{ flexShrink: 0, padding: "0 48px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${T.sub}` }}>
      <button onClick={onPrev}
        style={{ ...base }}>
        <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
          <path d="M13 8H3M3 8L7 4M3 8L7 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Anterior
      </button>

      <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
        {Array.from({ length: total }).map((_, i) => (
          <button key={i} onClick={() => onGoTo(i)}
            style={{ width: i === current ? 24 : 7, height: 7, borderRadius: 4, background: i === current ? T.accent : i < current ? "#3A3A38" : "#2A2A27", border: "none", cursor: "pointer", padding: 0, transition: "all 0.2s ease", flexShrink: 0 }}
          />
        ))}
      </div>

      <button onClick={isLast ? undefined : onNext}
        style={{ ...base, background: "transparent", borderColor: T.accent, color: T.accent, fontWeight: 400, borderWidth: "0.3px", opacity: isLast ? 0.5 : 1, cursor: isLast ? "default" : "pointer" }}>
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
  const hasNavigated = useRef(false);
  const interceptRef = useRef<Interceptor | null>(null);
  const total = SLIDES.length;
  const steps = total - 1; // exclui welcome

  const goTo = (i: number) => {
    if (i < 0 || i >= total) return;
    hasNavigated.current = true;
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
  };

  const handleNext = () => {
    if (interceptRef.current?.next()) return;
    goTo(Math.min(current + 1, total - 1));
  };

  const handlePrev = () => {
    if (interceptRef.current?.prev()) return;
    goTo(Math.max(current - 1, 0));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") handleNext();
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   handlePrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current]);

  const isWelcome        = current === 0;
  const isInitialWelcome = current === 0 && !hasNavigated.current;
  const stepIdx          = current - 1;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
        <div key={current} style={{ height: "100%", animation: isInitialWelcome ? "none" : `${direction === 1 ? "slideInFromRight" : "slideInFromLeft"} 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards` }}>
          {current === 0
            ? <WelcomeSlide onNext={() => goTo(1)} contentDelay={isInitialWelcome ? 350 : 0} />
            : SLIDES[current]({ onNext: () => goTo(current + 1), interceptRef })
          }
        </div>
      </div>

      {!isWelcome && (
        <BottomNav current={stepIdx} total={steps} onPrev={handlePrev} onNext={handleNext} onGoTo={i => goTo(i + 1)} />
      )}
    </div>
  );
}
