# Design Guide — Claude Install Guide

Guia visual do projeto para reuso e adaptação em outros projetos.

---

## Paleta de cores

### Fundamentos

| Token | Hex | Uso |
|---|---|---|
| `bg` | `#0F0F0D` | Fundo da página (mais escuro) |
| `surface` | `#171715` | Cards, painéis, áreas elevadas |
| `sub` | `#1E1E1C` | Superfície ligeiramente mais clara que surface (separadores internos) |
| `border` | `#2A2A27` | Bordas principais |

### Texto

| Token | Hex | Uso |
|---|---|---|
| `text` | `#E8E8E5` | Texto principal |
| `sec` | `#B8B8B5` | Texto secundário (labels, ênfases leves) |
| `muted` | `#888886` | Texto de apoio, subtítulos |
| `dim` | `#666663` | Texto terciário, placeholders |
| `dimmer` | `#3A3A38` | Texto muito apagado (decorativo, step numbers inativos) |

### Accent — Amarelo Meli

| Token | Hex | Uso |
|---|---|---|
| `accent` | `#FEE340` | Cor principal de destaque, CTAs, links, highlights |
| `accentBg` | `#1F1A00` | Fundo de elementos com accent (badges, code inline) |
| `accentBorder` | `#4A3800` | Borda de elementos com accent |

### Semântico

| Token | Hex | Uso |
|---|---|---|
| `green` | `#22C55E` | Sucesso, checkmarks, itens completos |
| `warning text` | `#D97706` | Texto de aviso |
| `warning strong` | `#FCD34D` | Texto de aviso em negrito |
| `warning bg` | `#1A1607` | Fundo de alertas de aviso |
| `warning border` | `#3D3208` | Borda de alertas de aviso |

### Selection

```css
::selection {
  background: #1F1A00;
  color: #FEE340;
}
```

---

## Tipografia

### Famílias

| Variável CSS | Família | Uso | Carregamento |
|---|---|---|---|
| `--font-geist-sans` | Geist | Corpo, UI geral | `next/font/google` |
| `--font-fraunces` | Fraunces | Headings display (italic, weight 300) | `next/font/google` |
| `--font-jetbrains-mono` | JetBrains Mono | Código, terminais, step numbers | `next/font/google` |
| `--font-pixelify-sans` | Pixelify Sans | Título hero (efeito pixel/retro) | Google Fonts CDN |

### Configuração Next.js (`layout.tsx`)

```ts
import { Geist, Geist_Mono } from "next/font/google";
import { Fraunces, JetBrains_Mono } from "next/font/google";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const fraunces  = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], style: ["normal", "italic"], display: "swap" });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"], weight: ["400", "500"] });
```

Pixelify Sans via `<link>` no `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap" rel="stylesheet" />
```

### Escala de tamanhos usados

| Contexto | Tamanho |
|---|---|
| Hero title | `clamp(42px, 6vw, 68px)` — Pixelify Sans |
| Slide heading (h2) | `clamp(26px, 3.5vw, 38px)` — Fraunces, weight 300, italic |
| Step label, body | `15px` — Geist |
| Intro paragraph | `16px` — Geist |
| Código inline, terminal | `13px` — JetBrains Mono |
| Labels uppercase | `12–13px`, `letter-spacing: 0.1em`, `text-transform: uppercase` |
| Step numbers (circle) | `11px` — JetBrains Mono |
| Muted hints | `11–12px` |

### Padrão de heading de seção

```
[step number — 14px, mono, #3A3A38, letter-spacing 0.1em]
[título — clamp(26px,3.5vw,38px), Fraunces, weight 300, italic, #E8E8E5]
[intro — 16px, Geist, #888886]
```

---

## Espaçamento

| Uso | Valor |
|---|---|
| Padding lateral do container | `48px` |
| `maxWidth` do conteúdo | `860px` |
| `paddingTop` do header de slide | `40px` |
| Gap entre step number e conteúdo | `20px` |
| Gap interno de cards | `24–28px` |
| Altura da barra de progresso (top) | `60px` |
| Altura do bottom nav | `72px` |

---

## Componentes e padrões

### Fundo animado (ripple)

- Componente: `BackgroundRippleEffect` — `position: fixed`, cobre 100vw × 100vh
- `z-0` no container → cria stacking context isolado
- Conteúdo acima com `position: relative; z-index: 1`
- Parâmetros atuais: `cellSize=56`, `opacity-45`, `borderColor=#333330`, `fillColor=#171715`
- Células têm animação `cell-ripple` com delay aleatório

### Code block

```
┌──────────────────────────────────────── [Copy] ─┐
│  $ comando aqui                                  │
└─────────────────────────────────────────────────┘
```

- Fundo: `#0C0C0A`, borda `#2A2A27`, radius `6px`
- Fonte: JetBrains Mono 13px, cor `#E8E8E5`
- Botão copy: fundo `#1F1A00`, cor `#FEE340` no hover, usa `sonner` para toast
- `$` prompt em `#666663`

### Terminal mock

```
┌── ● ● ●  título ───────────────────────────────┐  ← titlebar #111110
│                                                 │
│  conteúdo mono 13px                             │
│                                                 │
└─────────────────────────────────────────────────┘  ← bg #0C0C0A
```

- Dots: `#FF5F57` / `#FFBD2E` / `#28C840`
- Padding interno: `20px 24px`
- Border: `1px solid #2A2A27`, radius `10px`

### Browser mock

```
┌── ● ● ●  ← →  [ 🔒 url ] ─────────────────────┐  ← chrome #E8E8E8
│                                                 │
│  conteúdo com fundo branco                      │  ← bg #FFFFFF
│                                                 │
└─────────────────────────────────────────────────┘
```

- Usado para simular telas de browser (OAuth, org selection)
- Conteúdo com `system-ui`, cores light (#111, #666, #888)
- Botão primário no browser: `#D97706` (laranja Anthropic) — trocar pela cor primária do destino

### Cards em grid

```css
display: grid;
grid-template-columns: repeat(3, 1fr); /* ou repeat(2, 1fr) */
gap: 1px;
background: #2A2A27; /* a gap vira "borda" entre cards */
border: 1px solid #2A2A27;
border-radius: 8px;
overflow: hidden;

/* cada card: */
background: #171715;
padding: 24px;
```

Efeito: grid com linhas entre células sem bordas individuais por card.

### Botão primário (CTA)

```css
background: #FEE340;
color: #0F0F0D;
border: none;
border-radius: 6px;
padding: 15px 32px;
font-size: 16px;
font-weight: 600;
```

### Botão secundário

```css
background: none;
border: 1px solid #2A2A27;
border-radius: 6px;
padding: 11px 24px;
font-size: 15px;
color: #B8B8B5;
```

### Badge / label uppercase

```css
font-size: 11-12px;
letter-spacing: 0.06-0.1em;
text-transform: uppercase;
font-weight: 500;
color: #666663;           /* neutro */
/* ou accent: */
color: #FEE340;
background: #1F1A00;
padding: 2px 7px;
border-radius: 3px;
```

### Alerta de aviso

```css
display: flex;
gap: 10px;
padding: 12px 16px;
background: #1A1607;
border: 1px solid #3D3208;
border-radius: 6px;
color: #D97706;  /* texto */
```

### Indicador de passo numerado (circle)

```css
width: 24-30px;
height: 24-30px;
border-radius: 50%;
border: 1px solid #2A2A27;
font-family: JetBrains Mono;
font-size: 11-14px;
color: #4A4A47;

/* ativo: */
background: #FEE340;
color: #0F0F0D;

/* concluído: */
background: #1F1A00;
color: #FEE340;
border: 1px solid #4A3800;
```

---

## Animações

### Transições de slide (horizontal)

```css
@keyframes slideInFromRight {
  from { opacity: 0; transform: translateX(60px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes slideInFromLeft {
  from { opacity: 0; transform: translateX(-60px); }
  to   { opacity: 1; transform: translateX(0); }
}
```

Uso:
```js
animation: `${direction === 1 ? "slideInFromRight" : "slideInFromLeft"} 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards`
```

Trigger: `key={current}` no wrapper força remount e reinicia o keyframe.

### Ripple de células

```css
@keyframes cell-ripple {
  0%   { opacity: 0.4; }
  50%  { opacity: 0.8; }
  100% { opacity: 0.4; }
}
```

---

## globals.css (estrutura base)

```css
@import "tailwindcss";

@theme inline {
  --font-sans:    var(--font-geist-sans);
  --font-display: var(--font-fraunces);
  --font-mono:    var(--font-jetbrains-mono);

  --color-bg:            #0F0F0D;
  --color-surface:       #171715;
  --color-border:        #2A2A27;
  --color-text:          #E8E8E5;
  --color-muted:         #666663;
  --color-accent:        #FEE340;
  --color-accent-faint:  #1F1A00;
}

@layer base {
  body {
    background: #0F0F0D;
    color: #E8E8E5;
    font-family: var(--font-geist-sans), system-ui, sans-serif;
    font-size: 15px;
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
  }

  ::selection {
    background: #1F1A00;
    color: #FEE340;
  }
}
```

---

## Checklist para adaptar em outro projeto

- [ ] Trocar `#FEE340` pelo accent da nova marca
- [ ] Atualizar `#1F1A00` e `#4A3800` (versões faint/border do accent)
- [ ] Manter ou substituir Fraunces por outra display font com personalidade
- [ ] Manter JetBrains Mono para código (ou trocar por Fira Code, Geist Mono)
- [ ] Manter Pixelify Sans apenas se quiser o efeito pixel/retro no hero
- [ ] Revisar `bg` e `surface` se o tema não for tão escuro
- [ ] Atualizar cor do botão nos browser mocks (`#D97706` → cor da marca simulada)
- [ ] O padrão de grid com `gap: 1px; background: borderColor` funciona em qualquer palette
