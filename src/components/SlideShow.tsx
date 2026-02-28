"use client";

import { useState, useEffect, ReactNode, CSSProperties } from "react";
import { AnimatedLogo } from "@/components/AnimatedLogo";
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
    <div style={{ height: "100%", display: "flex", flexDirection: "column", maxWidth: "700px", margin: "0 auto", padding: "0 32px", width: "100%" }}>
      <div style={{ paddingTop: "32px", paddingBottom: "18px", flexShrink: 0 }}>
        <span style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: "13px", color: T.dimmer, letterSpacing: "0.1em", display: "block", marginBottom: "6px" }}>
          {num}
        </span>
        <h2 style={{ fontFamily: "var(--font-fraunces)", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 300, fontStyle: "italic", color: T.text, lineHeight: 1.2, margin: 0, marginBottom: intro ? "10px" : 0 }}>
          {title}
        </h2>
        {intro && <p style={{ fontSize: "15px", color: T.muted, lineHeight: 1.65, margin: 0 }}>{intro}</p>}
      </div>
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: "16px" }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Item de passo numerado ─── */
function StepItem({ num, children, command, last }: { num: number; children: ReactNode; command?: string; last?: boolean }) {
  return (
    <div style={{ display: "flex", gap: "16px", paddingBottom: last ? 0 : "16px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <span style={{ width: 26, height: 26, borderRadius: "50%", border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontFamily: "var(--font-jetbrains-mono)", color: "#4A4A47", flexShrink: 0 }}>
          {num}
        </span>
        {!last && <div style={{ width: 1, flex: 1, marginTop: 6, background: T.sub, minHeight: 12 }} />}
      </div>
      <div style={{ flex: 1, paddingBottom: 4 }}>
        <p style={{ fontSize: 14, color: T.sec, marginBottom: command ? 10 : 0, lineHeight: 1.65 }}>{children}</p>
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
      <div role="tablist" style={{ display: "inline-flex", borderBottom: `1px solid ${T.border}`, marginBottom: 20 }}>
        {(["macos", "universal"] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 16px", fontSize: 14, fontWeight: tab === t ? 500 : 400, color: tab === t ? T.text : "#5A5A57", borderBottom: tab === t ? `2px solid ${T.accent}` : "2px solid transparent", marginBottom: -1, transition: "all 0.15s ease", fontFamily: "inherit" }}>
            {t === "macos" ? "macOS (Brew)" : "Universal (curl)"}
          </button>
        ))}
      </div>
      {tab === "macos" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <p style={{ fontSize: 14, color: T.dim }}>Requer o Homebrew instalado.</p>
          <CommandBlock command="brew install --cask claude-code" />
        </div>
      )}
      {tab === "universal" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <p style={{ fontSize: 14, color: T.dim }}>Funciona em qualquer sistema Unix-like.</p>
          <CommandBlock command="curl -fsSL https://claude.ai/install.sh | bash" />
        </div>
      )}
    </div>
  );
}

/* ─── Definição dos slides ─── */
type SlideRender = (ctx: { onNext: () => void }) => ReactNode;

const SLIDES: SlideRender[] = [
  /* 0 — Boas-vindas */
  ({ onNext }) => (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 32px", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
      <p style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: T.dimmer, fontWeight: 500, marginBottom: 36 }}>
        Mercado Pago · Onboarding Técnico
      </p>
      <h1 style={{ fontFamily: "'Pixelify Sans', sans-serif", fontSize: "clamp(34px, 5.5vw, 60px)", fontWeight: 500, letterSpacing: "-0.03em", color: "#4F4F4F", lineHeight: 1.1, margin: 0, marginBottom: 28 }}>
        Guia de Instalação
        <br />
        <span style={{ display: "inline-flex", alignItems: "center", gap: 12, marginTop: 4 }}>
          <span style={{ color: T.accent }}>Claude Meli</span>
          <AnimatedLogo style={{ height: "0.85em", width: "auto", display: "inline-block" }} />
        </span>
      </h1>
      <p style={{ fontSize: 16, color: T.muted, lineHeight: 1.7, maxWidth: 440, marginBottom: 44 }}>
        Vamos configurar tudo juntos, passo a passo. Em cerca de{" "}
        <span style={{ color: T.sec }}>10 minutos</span> o Claude Code estará funcionando no seu computador.
      </p>
      <button onClick={onNext}
        style={{ background: T.accent, color: "#0F0F0D", border: "none", borderRadius: 6, padding: "13px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 8 }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        Começar
        <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }}>
          <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <p style={{ fontSize: 13, color: T.dimmer, marginTop: 18 }}>8 passos simples</p>
    </div>
  ),

  /* 1 — Pré-requisitos */
  () => (
    <SlideLayout num="00" title="Antes de começar" intro="Duas coisinhas antes de instalar:">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1px", background: T.border, border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden" }}>
        <div style={{ background: T.surface, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14, flexShrink: 0 }}>
              <path d="M13.5 4.5L6 12L2.5 8.5" stroke={T.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 14, fontWeight: 500, color: T.text }}>Node.js ≥ 18</span>
          </div>
          <p style={{ fontSize: 14, color: T.muted, marginBottom: 12, lineHeight: 1.55 }}>
            Uma ferramenta técnica que o Claude precisa para funcionar. Verifique se já está instalado:
          </p>
          <CommandBlock command="node --version" />
        </div>
        <div style={{ background: T.surface, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14, flexShrink: 0 }}>
              <path d="M13.5 4.5L6 12L2.5 8.5" stroke={T.green} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 14, fontWeight: 500, color: T.text }}>Licença ativa</span>
          </div>
          <p style={{ fontSize: 14, color: T.muted, marginBottom: 12, lineHeight: 1.55 }}>
            O time precisa habilitar seu acesso antes de instalar. Solicite pelo portal:
          </p>
          <a href="https://azir.adminml.com/licenses" target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, fontFamily: "var(--font-jetbrains-mono)", color: T.accent, textDecoration: "none", padding: "7px 10px", background: T.accentBg, borderRadius: 4, border: `1px solid ${T.accentBorder}` }}>
            azir.adminml.com/licenses
            <svg viewBox="0 0 12 12" fill="none" style={{ width: 10, height: 10 }}>
              <path d="M2 10L10 2M10 2H5M10 2V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
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

  /* 3 — Autenticação */
  () => (
    <SlideLayout num="02" title="Fazendo login" intro="Agora vamos conectar sua conta. Siga a sequência:">
      <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
        <StepItem num={1} command="claude">No terminal, inicie o Claude:</StepItem>
        <StepItem num={2}>Escolha o tema visual de sua preferência.</StepItem>
        <StepItem num={3}>Selecione o <strong style={{ color: T.sec, fontWeight: 500 }}>Método 2</strong>: "Anthropic Console account – API usage billing".</StepItem>
        <StepItem num={4}>Um navegador vai abrir automaticamente. Clique em <strong style={{ color: T.sec, fontWeight: 500 }}>Authorize</strong>.</StepItem>
        <StepItem num={5}>Escolha a organização <strong style={{ color: T.sec, fontWeight: 500 }}>"MercadoLibre Uruguay S.R.L"</strong>.</StepItem>
        <StepItem num={6} last>De volta no terminal: aparecerá <strong style={{ color: T.sec, fontWeight: 500 }}>Login successful</strong>. Aceite os termos para continuar.</StepItem>
      </ol>
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
      <div style={{ display: "flex", gap: 10, padding: "11px 14px", background: "#1A1607", border: "1px solid #3D3208", borderRadius: 6, marginBottom: 14 }}>
        <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14, flexShrink: 0, marginTop: 1 }}>
          <path fillRule="evenodd" clipRule="evenodd" d="M8 1.5a.5.5 0 0 1 .434.252l6.5 11A.5.5 0 0 1 14.5 13.5h-13a.5.5 0 0 1-.434-.748l6.5-11A.5.5 0 0 1 8 1.5ZM8 6a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 1 0v-3A.5.5 0 0 0 8 6Zm0 6.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" fill="#F59E0B" />
        </svg>
        <p style={{ fontSize: 13, color: "#D97706", lineHeight: 1.5, margin: 0 }}>
          <strong style={{ color: "#FCD34D" }}>Atenção com tokens:</strong> Substitua{" "}
          <code style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 12 }}>SEU_TOKEN_AQUI</code>{" "}
          pelo valor real antes de executar. Nunca compartilhe tokens.
        </p>
      </div>
      <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden" }}>
        {MCPS.map((mcp, i) => (
          <div key={mcp.name} style={{ padding: "14px 18px", borderBottom: i < MCPS.length - 1 ? `1px solid ${T.sub}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: T.text }}>{mcp.name}</span>
              <span style={{ fontSize: 13, color: T.dim, borderLeft: `1px solid ${T.border}`, paddingLeft: 10 }}>{mcp.desc}</span>
              {mcp.token && <span style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#D97706", background: "#252008", padding: "2px 6px", borderRadius: 3, marginLeft: "auto", flexShrink: 0 }}>token</span>}
            </div>
            <CommandBlock command={mcp.cmd} />
            {mcp.note && <p style={{ fontSize: 13, color: T.dim, marginTop: 6, lineHeight: 1.5 }}>{mcp.note}</p>}
          </div>
        ))}
      </div>
    </SlideLayout>
  ),

  /* 6 — Statusline */
  () => (
    <SlideLayout num="05" title="Monitorando o uso" intro="Configure uma barra que mostra modelo, tokens usados e projeto direto no terminal:">
      <CommandBlock command='/statusline "$CurrentModel | ProgressBar with Current % of Token Usage | $TokenUsed/MaxTokensContext | Current Folder / Project | $GitBranch"' showPrompt={false} />
      <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", marginTop: 16 }}>
        <div style={{ padding: "8px 14px", borderBottom: `1px solid ${T.sub}`, background: T.surface }}>
          <span style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4A4A47", fontWeight: 500 }}>O que cada campo significa</span>
        </div>
        {[
          { token: "$CurrentModel",              desc: "Qual modelo do Claude está ativo" },
          { token: "ProgressBar",                desc: "Barra visual mostrando % de contexto usado" },
          { token: "$TokenUsed/MaxTokensContext", desc: "Quantos tokens foram consumidos no total" },
          { token: "Current Folder / Project",   desc: "Em qual pasta você está trabalhando" },
          { token: "$GitBranch",                 desc: "Em qual branch do Git você está" },
        ].map((f, i, arr) => (
          <div key={f.token} style={{ display: "flex", alignItems: "center", gap: 14, padding: "9px 14px", borderBottom: i < arr.length - 1 ? `1px solid ${T.sub}` : "none" }}>
            <code style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 12, color: T.accent, background: T.accentBg, padding: "2px 6px", borderRadius: 3, whiteSpace: "nowrap", flexShrink: 0 }}>{f.token}</code>
            <span style={{ fontSize: 13, color: T.muted }}>{f.desc}</span>
          </div>
        ))}
      </div>
    </SlideLayout>
  ),

  /* 7 — Comandos */
  () => (
    <SlideLayout num="06" title="Comandos do dia a dia" intro="Os que você vai usar mais. Pode salvar como referência:">
      <div style={{ border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr 1fr", padding: "8px 16px", background: T.surface, borderBottom: `1px solid ${T.border}`, gap: 16 }}>
          {["Comando", "O que faz", "Exemplo"].map(h => (
            <span key={h} style={{ fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "#4A4A47", fontWeight: 500 }}>{h}</span>
          ))}
        </div>
        {CMDS.map((row, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 1fr 1fr", padding: "10px 16px", borderBottom: i < CMDS.length - 1 ? `1px solid ${T.sub}` : "none", alignItems: "center", gap: 16 }}>
            <code style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 13, color: T.accent, background: T.accentBg, padding: "2px 7px", borderRadius: 3, whiteSpace: "nowrap", display: "inline-block" }}>{row.cmd}</code>
            <span style={{ fontSize: 13, color: T.sec }}>{row.func}</span>
            <code style={{ fontFamily: "var(--font-jetbrains-mono)", fontSize: 13, color: "#4A4A47" }}>{row.ex}</code>
          </div>
        ))}
      </div>
    </SlideLayout>
  ),

  /* 8 — Boas Práticas */
  () => (
    <SlideLayout num="07" title="Dicas para usar bem" intro="Hábitos que fazem diferença no dia a dia:">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1px", background: T.border, border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden" }}>
        {PRACTICES.map(p => (
          <div key={p.title} style={{ background: T.surface, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 15, color: T.dimmer, fontWeight: 300, lineHeight: 1, width: 18, textAlign: "center", flexShrink: 0 }}>{p.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: T.text, letterSpacing: "0.01em" }}>{p.title}</span>
            </div>
            <p style={{ fontSize: 13, color: T.dim, lineHeight: 1.6, margin: 0 }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </SlideLayout>
  ),
];

/* ─── Indicador de progresso ─── */
function StepIndicator({ current, total, onGoTo }: { current: number; total: number; onGoTo: (i: number) => void }) {
  return (
    <div style={{ flexShrink: 0, padding: "0 32px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${T.sub}`, gap: 16 }}>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {Array.from({ length: total }).map((_, i) => (
          <button key={i} onClick={() => onGoTo(i)}
            style={{ width: i === current ? 20 : 6, height: 6, borderRadius: 3, background: i === current ? T.accent : i < current ? "#3A3A38" : "#2A2A27", border: "none", cursor: "pointer", padding: 0, transition: "all 0.2s ease", flexShrink: 0 }}
          />
        ))}
      </div>
      <span style={{ fontSize: 12, fontFamily: "var(--font-jetbrains-mono)", color: T.dimmer, flexShrink: 0 }}>
        {current + 1} / {total}
      </span>
    </div>
  );
}

/* ─── Navegação inferior ─── */
function BottomNav({ current, total, onPrev, onNext }: { current: number; total: number; onPrev: () => void; onNext: () => void }) {
  const isFirst = current === 0;
  const isLast  = current === total - 1;

  const base: CSSProperties = { background: "none", border: `1px solid ${T.border}`, borderRadius: 6, padding: "9px 20px", fontSize: 14, color: T.sec, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 8, transition: "opacity 0.15s ease", letterSpacing: "0.01em" };

  return (
    <div style={{ flexShrink: 0, padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${T.sub}` }}>
      <button onClick={onPrev} disabled={isFirst}
        style={{ ...base, borderColor: isFirst ? T.sub : T.border, color: isFirst ? "#2A2A27" : T.sec, cursor: isFirst ? "default" : "pointer" }}>
        <svg viewBox="0 0 16 16" fill="none" style={{ width: 13, height: 13 }}>
          <path d="M13 8H3M3 8L7 4M3 8L7 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Anterior
      </button>

      <button onClick={isLast ? undefined : onNext}
        style={{ ...base, background: T.accent, borderColor: T.accent, color: "#0F0F0D", fontWeight: 600, opacity: isLast ? 0.5 : 1, cursor: isLast ? "default" : "pointer" }}>
        {isLast ? "Concluído ✓" : "Próximo"}
        {!isLast && (
          <svg viewBox="0 0 16 16" fill="none" style={{ width: 13, height: 13 }}>
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
  const total = SLIDES.length;
  const steps = total - 1; // exclui welcome

  const goTo = (i: number) => { if (i >= 0 && i < total) setCurrent(i); };

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
        <div key={current} style={{ height: "100%", animation: "slideFadeIn 0.3s ease forwards" }}>
          {SLIDES[current]({ onNext: () => goTo(current + 1) })}
        </div>
      </div>

      {!isWelcome && (
        <BottomNav current={stepIdx} total={steps} onPrev={() => goTo(current - 1)} onNext={() => goTo(current + 1)} />
      )}
    </div>
  );
}
