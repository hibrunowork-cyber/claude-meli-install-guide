# CONTEXT.md — Claude Install Guide

## Estado Atual

**Status**: MVP completo — pronto para `npm run dev`

## O que foi feito (sessão 2026-02-27)

- Projeto criado com `create-next-app` → Next.js 16, Tailwind v4, TypeScript
- Pasta renomeada para "Claude Install Guide"
- Estrutura `src/` criada manualmente (o CLI criou sem src-dir)
- `tsconfig.json` atualizado para path alias `@/*` → `./src/*`
- shadcn/ui inicializado e componentes instalados: card, badge, button, tabs, table, alert, separator, tooltip
- Sonner instalado para toasts nos botões copy
- `globals.css` reescrito com tema dark forçado (paleta zinc)
- `layout.tsx` atualizado com metadados, TooltipProvider e Toaster
- Todos os componentes criados:
  - `VideoPlaceholder.tsx`
  - `CommandBlock.tsx`
  - `StepCard.tsx`
  - Seções: Hero, Prerequisites, Installation, Authentication, VSCodeIntegration, MCPs, StatusLine, Commands, BestPractices
- `page.tsx` montado com nav lateral sticky (oculta em mobile)

## Decisões Técnicas

- **Tailwind v4 em vez de v3**: O `create-next-app` instalou a versão mais recente. shadcn/ui já suporta v4. Mantido sem downgrade.
- **Next.js 16 em vez de 14**: Mesma razão. Compatível com tudo planejado.
- **Tema dark forçado via CSS variables**: Mais simples que toggle de tema para um guia técnico interno.
- **Nav lateral sem scroll-spy**: Implementada com anchors simples. Scroll-spy requereria `useEffect` + IntersectionObserver — pode ser adicionado depois se necessário.

## Pendente / Próximos passos

- [ ] Inserir vídeos reais nos 3 VideoPlaceholders (`video-instalacao`, `video-autenticacao`, `video-vscode`)
- [ ] Verificar/atualizar URLs reais dos MCPs (alguns podem estar fictícios — confirmar com equipe)
- [ ] Checar se os comandos de instalação dos MCPs estão corretos (formato pode variar)
- [ ] Adicionar scroll-spy na nav lateral se necessário
- [ ] Deploy (Vercel ou servidor interno)
- [ ] Revisar conteúdo com stakeholders do Mercado Pago

## Como rodar

```bash
cd "/Users/bsgoncalves/Desktop/Mercado Livre/Claude Meli/Claude Install Guide"
npm run dev
# Abrir http://localhost:3000
```
