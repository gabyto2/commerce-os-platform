# Commerce OS Platform — Cliente 01: Melt Brownies

Plataforma reutilizável de storefront, carrinho, pedido por WhatsApp, PWA e atendimento opcional.

## Sprint 1 concluída
- Next.js App Router + TypeScript
- Configuração multiempresa por `tenant`
- Identidade e catálogo da Melt separados do núcleo
- Layout responsivo e orientado à conversão
- Carrinho persistente no navegador
- Pedido estruturado por WhatsApp
- PWA instalável e cache básico offline
- Atendimento opcional por FAQ, sem interromper a compra
- Rotas de SEO e metadados
- Reserva da rota `/admin` para a Sprint 2

## Rodar localmente
```bash
npm install
npm run dev
```

## Configurar WhatsApp
Crie `.env.local`:
```env
NEXT_PUBLIC_WHATSAPP_NUMBER=5547XXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://melt-brownies.netlify.app
```
Use somente números, com país e DDD.

## Novo cliente
1. Copie `src/tenants/melt.ts`.
2. Troque marca, contatos, operação, produtos e FAQ.
3. Registre o tenant em `src/tenants/index.ts`.
4. Adicione os ativos em `public/tenants/<slug>`.
5. Defina `NEXT_PUBLIC_TENANT_SLUG=<slug>` no ambiente do deploy.

## Decisão técnica
A Sprint 1 usa CSS nativo com tokens, em vez de Tailwind. Isso reduz dependências e mantém o núcleo visual reutilizável. Supabase e IA entram apenas quando houver operações reais para armazenar e automatizar.
