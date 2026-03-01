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

## Pendente / Próximos passos

- [ ] Verificar URLs reais dos MCPs com a equipe (alguns podem estar fictícios)
- [ ] Verificar formato correto dos comandos `claude mcp add` (pode variar por versão)
- [ ] Adicionar simulações interativas aos outros slides (ex: VS Code, MCPs) — se desejado
- [ ] Animação de transição entre passos do AuthSlide (atualmente instantâneo)
- [ ] Deploy (Vercel ou servidor interno)
- [ ] Revisão de conteúdo com stakeholders do Mercado Pago

---

## Como rodar

```bash
cd "/Users/bsgoncalves/Desktop/Mercado Livre/Claude Meli/Claude Install Guide"
npm run dev
# Abrir http://localhost:3000
```
