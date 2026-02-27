# Claude Install Guide

Landing page técnica de onboarding para instalação e configuração do Claude Code no Mercado Pago.

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4** (configuração via CSS, não `tailwind.config.ts`)
- **shadcn/ui** (componentes: card, badge, button, tabs, table, alert, separator, tooltip)
- **Sonner** para toasts
- **Fonte**: Geist (body) + Geist Mono (código)

## Estrutura

```
src/
├── app/
│   ├── layout.tsx       # Root layout com TooltipProvider + Toaster
│   ├── page.tsx         # Página principal com nav lateral sticky
│   └── globals.css      # CSS base — tema dark forçado, paleta zinc
└── components/
    ├── ui/              # Componentes shadcn instalados
    ├── VideoPlaceholder.tsx
    ├── CommandBlock.tsx  # Code block com botão copy (usa sonner)
    ├── StepCard.tsx      # Card numerado de passo
    └── sections/
        ├── Hero.tsx
        ├── Prerequisites.tsx
        ├── Installation.tsx
        ├── Authentication.tsx
        ├── VSCodeIntegration.tsx
        ├── MCPs.tsx
        ├── StatusLine.tsx
        ├── Commands.tsx
        └── BestPractices.tsx
```

## Convenções

- **Tema**: dark forçado via CSS custom properties (sem toggle de tema)
- **Paleta**: `bg-zinc-950` (fundo), `bg-zinc-900` (cards), `zinc-800` (bordas), `zinc-50` (texto), `blue-500` (accent)
- **Componentes**: todos com `"use client"` apenas quando necessário (state/events)
- **IDs de âncora**: `pre-requisitos`, `instalacao`, `autenticacao`, `vscode`, `mcps`, `statusline`, `comandos`, `boas-praticas`
- **Conteúdo**: filtrado do PDF `saida.pdf` para o que é 100% técnico

## Comandos

```bash
npm run dev    # Servidor de desenvolvimento (localhost:3000)
npm run build  # Build de produção
```

## VideoPlaceholders

Os placeholders de vídeo têm `data-video-id` para identificação:
- `video-instalacao`
- `video-autenticacao`
- `video-vscode`

Para inserir vídeos reais, substitua o componente `VideoPlaceholder` por um `<iframe>` ou `<video>` mantendo o mesmo `data-video-id`.
