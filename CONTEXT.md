# CONTEXT.md — Claude Install Guide

## Estado Atual

**Status**: Versão slideshow completa — rodando em `localhost:3000`

---

## O que foi feito (sessão 2026-02-27 — inicial)

- Projeto criado com `create-next-app` → Next.js 16, Tailwind v4, TypeScript
- Pasta renomeada para "Claude Install Guide"
- Estrutura `src/` criada manualmente
- `tsconfig.json` atualizado para path alias `@/*` → `./src/*`
- shadcn/ui inicializado e componentes instalados: card, badge, button, tabs, table, alert, separator, tooltip
- Sonner instalado para toasts nos botões copy
- `globals.css` reescrito com tema dark forçado (paleta zinc)
- `layout.tsx` atualizado com metadados, TooltipProvider e Toaster
- Todos os componentes criados (VideoPlaceholder, CommandBlock, StepCard, todas as seções)
- `page.tsx` montado com nav lateral sticky

---

## O que foi feito (sessão 2026-02-28 — dark mode + slideshow)

### Redesign completo dark mode
- `globals.css`: paleta reescrita com `#0F0F0D` (bg), `#171715` (surface), `#FEE340` (accent), `#E8E8E5` (text)
- Todos os componentes de seção convertidos para cores inline (sem classes Tailwind)
- `::selection` com fundo/texto no amarelo Meli

### Background ripple (Aceternity UI)
- `src/components/ui/background-ripple-effect.tsx` criado e adaptado
- `position: fixed`, cobertura total da viewport via `useEffect` + `window.innerWidth/Height`
- `z-0` no container para stacking context isolado (evita sobreposição no conteúdo)
- Opacity final: 45% | cellSize: 56px | borderColor: `#333330` | fillColor: `#171715`

### Accent amarelo Meli
- Substituído todo azul (`#5B8EF5`, etc.) por `#FEE340` / `#1F1A00` / `#4A3800`
- "Claude Meli" em `#FEE340`, "Guia de Instalação" em `#4F4F4F`

### Git backup
- Versão dark mode + accent amarelo commitada e pushada

### Slideshow (`src/components/SlideShow.tsx`)
- Navegação horizontal com 9 slides (1 welcome + 8 passos)
- Slide 0: tela de boas-vindas com botão "Começar"
- Slides 1–8: SlideLayout com step number, título Fraunces italic, intro e conteúdo scrollável
- `StepIndicator` (bolinhas clicáveis + contador) e `BottomNav` (Anterior / Próximo)
- Navegação por teclado (ArrowLeft/Right/Up/Down)
- Animação direcional: `slideInFromRight` (avançar) / `slideInFromLeft` (voltar), `key={current}` para trigger
- `page.tsx` simplificado: BackgroundRippleEffect + SlideShow

### Proporcional aumentada (2026-02-28)
- `maxWidth` do SlideLayout: 700 → **860px**, padding lateral: 32 → **48px**
- Fonte h2: `clamp(22,3vw,32)` → **`clamp(26,3.5vw,38)`**
- StepItem: círculo 26→30px, fonte 14→15px
- Welcome: título `clamp(34,5.5vw,60)` → **`clamp(42,6vw,68)`**, subtítulo 16→18px
- BottomNav: altura 64→72px | StepIndicator: altura 52→60px

### Slide "Fazendo login" — simulações interativas
- Navegação vertical clicável com 6 passos (esquerda, 185px)
- Passo ativo: destaque amarelo + borda esquerda + descrição expandida
- Passos visitados: ✓ em amarelo
- Mockup estático por passo (direita):
  1. Terminal: `$ claude` com cursor
  2. Terminal: seletor de tema (Dark em destaque)
  3. Terminal: seletor de método (Method 2 em destaque)
  4. Browser light: tela OAuth Anthropic com botão "Authorize"
  5. Browser light: seletor de organização (MercadoLibre Uruguay S.R.L marcado)
  6. Terminal: `✓ Login successful` + prompt de aceite dos termos

---

## Decisões Técnicas

- **Tailwind v4**: instalado pelo CLI. shadcn/ui compatível. Mantido sem downgrade.
- **Next.js 16**: versão atual. Compatível com tudo.
- **Inline styles em vez de classes Tailwind**: evita conflitos com v4 e dá controle total de cor.
- **Tema dark forçado via CSS variables**: sem toggle, é um guia técnico interno.
- **SlideShow em vez de scroll**: navegação horizontal por slide é mais adequada para onboarding passo a passo (decisão tomada na sessão 2026-02-28).
- **Animação direcional**: `key={current}` força remount do wrapper, dispara keyframe correto com base em `direction state`.
- **Stacking context ripple**: `z-0` no container do ripple isola o `z-[3]` interno, evitando sobrepor o conteúdo.

---

## Arquivos principais

| Arquivo | Responsabilidade |
|---|---|
| `src/app/page.tsx` | Composição: BackgroundRippleEffect + SlideShow |
| `src/app/globals.css` | Paleta dark, keyframes (ripple, slide transitions) |
| `src/app/layout.tsx` | Fontes (Geist, Fraunces, JetBrains Mono, Pixelify Sans), TooltipProvider, Toaster |
| `src/components/SlideShow.tsx` | **Componente principal** — todos os slides, AuthSlide, TerminalMock, BrowserMock |
| `src/components/ui/background-ripple-effect.tsx` | BG animado fixo, cobre viewport inteiro |
| `src/components/AnimatedLogo.tsx` | Logo pixelado animado (welcome slide) |
| `src/components/CommandBlock.tsx` | Code block com botão copy (sonner toast) |

---

## O que foi feito (sessão 2026-02-28 — ajustes finais)

- Grid do slide "Dicas para usar bem" fixado em 3 colunas × 2 linhas (`repeat(3, 1fr)`)
- `DESIGN_GUIDE.md` criado na raiz: paleta, tipografia, espaçamento, componentes, animações e checklist de adaptação para outros projetos

## O que foi feito (sessão 2026-03-01 — mascote + ajustes)

- `ClaudeMascot.tsx` criado: pixel art blob laranja (cor Anthropic `#D96030`) com olhos, brilho, tentáculos animados e sombra dinâmica — mesmo estilo e ritmo (380ms) do `AnimatedLogo`
  - Animação: corpo faz bob (sobe/desce), tentáculos abrem/fecham alternadamente
- Slide "Antes de começar": mascote posicionado em cima do `AnimatedLogo` (logo do Meli), empilhados verticalmente com `marginTop: -6` — efeito de "pulando em cima"
- Tamanhos: ClaudeMascot `height: 60px`, AnimatedLogo `height: 52px`
- Posição vertical ajustada com `paddingTop: 52px`

## O que foi feito (sessão 2026-03-01 — pixel reveal + UnicornStudio)

- Background `BackgroundRippleEffect` substituído por `UnicornBackground` (UnicornStudio WebGL)
  - Projeto: `aNQ1HJcO2IvNyDCGls8J`, script v1.4.29, opacity 0.5
- Slide de instalação (`InstallSlideWithTerminal`) reestruturado como layout standalone flex-row
  - Título/subtítulo movidos para dentro da coluna esquerda (antes cobriam largura total)
- Slide de boas-vindas (`WelcomeSlide`) agora é ponto de entrada (state inicia em `0`)
  - CTA "Começar" em branco
  - BottomNav com `isFirst = false` — botão Anterior sempre visível (volta para welcome)
- Pixel reveal no H1 "Guia de Instalação Claude Meli" (depois removido — ver sessão abaixo):
  - 240 tiles (ROWS=10, COLS=24) com `clip-path: polygon(...)` e fade-in opacity 0→1
  - Fix de performance: `<AnimatedLogo frame={0} />` nos tiles — 0 timers nos tiles vs. 240 anteriores
  - `AnimatedLogo.tsx` atualizado: aceita prop `frame` opcional (quando definido, não inicia interval)

## O que foi feito (sessão 2026-03-01 — fade + dots no footer)

- **Pixel reveal removido** — efeito descartado por decisão de design
- **WelcomeSlide**: H1 agora usa fade sequencial simples
  - Linha 1 ("Guia de Instalação"): aparece em `opacity + translateY` após 120ms
  - Linha 2 ("Claude Meli" + logo): aparece após 480ms
  - Transição: `opacity 0.55s ease, transform 0.55s ease`
- **Dots de navegação movidos para o footer** (padrão para todos os slides 1–8)
  - `StepIndicator` (barra do topo com dots + contador) removido completamente
  - `BottomNav` atualizado: recebe prop `onGoTo`, renderiza dots no centro entre os dois botões
  - Dot ativo: amarelo (`T.accent`) com largura expandida (24px); anteriores: cinza escuro; futuros: mais escuro ainda

## O que foi feito (sessão 2026-03-01 — layout duas colunas + label)

### Layout duas colunas aplicado a todos os slides (menos capa e slide 1)
- Novo componente `TwoColSlide`: `maxWidth: 1080px`, `display: flex`, duas colunas separadas por divisória, conteúdo da direita centralizado verticalmente
- Header (num + título + intro) fixo no topo da coluna esquerda; conteúdo scrollável abaixo
- `AuthSlide` reestruturado: header movido para `TwoColSlide`, nav vertical fica na esquerda, mockups na direita
- Slides convertidos:
  - **02 — Instalação**: já era duas colunas (sem mudança)
  - **02 — Fazendo login**: nav vertical (esq) + mockups terminal/browser (dir)
  - **03 — VS Code**: steps (esq) + VS Code window mock com terminal (dir)
  - **04 — MCPs**: alerta de token (esq) + lista completa de MCPs scrollável (dir)
  - **05 — Statusline**: comando + tabela de campos (esq) + terminal com preview do statusline (dir)
  - **06 — Comandos**: lista de comandos (esq) + terminal mostrando comandos em uso (dir)
  - **07 — Boas práticas**: 4 cards (esq) + 2 cards (dir)
- Slide **00 — Antes de começar** mantido no layout original (`SlideLayout`, grid 2 colunas, mascote + logo embaixo)

### label.png adicionado à capa
- `label.png` movido da raiz para `public/label.png`
- Adicionado na linha do H1 da `WelcomeSlide`, após o `AnimatedLogo` (logo do Meli)
- Alinhado em `inline-flex` com `height: "0.85em"` — mesmo tamanho relativo dos outros ícones da linha

### Fade de entrada exclusivo para a capa
- `UnicornBackground`: inicia com `opacity: 0`, transição para `0.5` ao montar (600ms)
- `WelcomeSlide`: recebe prop `contentDelay` (350ms no load inicial, 0 em retorno)
- Container da capa: `opacity: 0 → 1` após `contentDelay` ms, transição 500ms
- Linha 1 e linha 2 do H1: stagger relativo ao `contentDelay` (+120ms e +480ms)
- Slides 1–8: continuam usando animação horizontal (slideInFromRight/Left)
- Retorno à capa via "Anterior": usa slideInFromLeft normalmente (sem fade lento)

## O que foi feito (sessão 2026-03-01 — ajustes finais da capa)

- **"Antes de começar"**: conteúdo centralizado horizontalmente (`centered` prop no `SlideLayout` → `alignItems: center, textAlign: center`)
- **Divisória removida** de todos os slides: `TwoColSlide` e `InstallSlideWithTerminal` (linha `1px` entre colunas excluída)
- **`Logo_Reveal.mp4`** movido para `public/Logo_Reveal.mp4`
  - Adicionado na `WelcomeSlide`, canto inferior direito (`position: absolute`, `bottom: 80`, `right: 48`, `width: 176px`)
  - Play automático após 1100ms do início do fade (depois que linha 2 do H1 termina de aparecer)
  - Sem loop, sem controles
  - Fundo preto removido via **SVG luma key filter** (`feColorMatrix` — pixels próximos ao preto viram transparentes, sem depender de `mix-blend-mode` que falha por causa dos stacking contexts dos wrappers)
  - `mix-blend-mode: screen` descartado — não funcionou corretamente por causa do isolamento de stacking context no SlideShow
- **`label.png` removido** do H1 da capa (ficava após o logo do Meli)

## O que foi feito (sessão 2026-03-01 — ajustes de polimento + AuthSlide interativo)

### Ajustes de polimento no terminal (Instalação)
- `vault66-crt-effect` instalado (`npm install vault66-crt-effect`)
- `TerminalTyper` no slide de instalação: conteúdo envolto por `<CRTEffect>` com `theme="custom"`, `scanlineOpacity={0.02}`, `scanlineColor="rgba(200,200,200,0.02)"`, sem vignette
- Texto do terminal restaurado para cores originais: `#D8D8D5` (texto), `#5A5A57` (dim), `#FEE340` (prompt), bg `#0E0E0C`
- Vídeo `Logo_Reveal.mp4`: tamanho reduzido de 220px → 176px → 158px

### Botões ghost amarelos
- CTA da capa ("Começar"): `background: transparent`, `color: T.accent`, `border: 0.3px solid T.accent`, `fontWeight: 400`
- Botão "Próximo" no `BottomNav`: mesmo estilo ghost (antes era fundo amarelo cheio)

### AuthSlide — refactor completo
- **Espaçamento dos steps aumentado**: `padding: 14px 10px`, `marginBottom: 8` (era 10px + 2)
- **BG amarelo removido** do step ativo — destaque apenas via borda esquerda e cor do texto/círculo
- **Navegação obrigatória por passo**: tipo `Interceptor` adicionado; `SlideShow` expõe `interceptRef` para `AuthSlide`
  - Seta direita / "Próximo" avança entre os 6 passos antes de ir pro próximo slide
  - Seta esquerda / "Anterior" volta entre os passos antes de ir pro slide anterior
- **Animações criadas** para cada step (componentes: `AuthTermShell`, `AuthStep1–6`):
  1. `AuthStep1Terminal` — digita `claude`, output de startup linha a linha, loop
  2. `AuthStep2Terminal` — menu de tema, cursor anima para "Dark", confirma com ✓
  3. `AuthStep3Terminal` — cursor vai de Method 1 → Method 2, confirma com ✓
  4. `AuthStep4Browser` — botão "Authorize" clicado (escurece + scale), tela de sucesso ✓
  5. `AuthStep5Browser` — MercadoLibre selecionado com borda laranja, "Continue" clicado
  6. `AuthStep6Terminal` — linhas aparecem uma a uma, aceite dos termos, "Welcome!" final
- `AuthTermShell`: wrapper de terminal compartilhado (sem CRT) para os steps da autenticação

---

## Pendente / Próximos passos

- [ ] Verificar URLs reais dos MCPs com a equipe (alguns podem estar fictícios)
- [ ] Verificar formato correto dos comandos `claude mcp add` (pode variar por versão)
- [ ] Adicionar simulações interativas aos outros slides (ex: VS Code, MCPs) — se desejado
- [ ] Deploy (Vercel ou servidor interno)
- [ ] Revisão de conteúdo com stakeholders do Mercado Pago

---

## Como rodar

```bash
cd "/Users/bsgoncalves/Desktop/Mercado Livre/Claude Meli/Claude Install Guide"
npm run dev
# Abrir http://localhost:3000
```
