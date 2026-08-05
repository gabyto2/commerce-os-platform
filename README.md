# Commerce OS Platform — Cliente 01: Melt Brownies

Plataforma reutilizável de storefront, carrinho, pedido por WhatsApp, PWA, atendimento opcional e cálculo de entrega própria.

## Sprint 1
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

## Entrega própria
A cotação usa o CEP de origem da loja e o CEP do cliente para estimar a distância pelas ruas. A taxa é obtida pelas faixas configuradas em `src/tenants/melt.ts`.

Faixas iniciais da Melt:
- Até 3 km: R$ 7,99
- Até 5 km: R$ 9,99
- Até 7 km: R$ 12,99
- Até 9 km: R$ 15,99
- Até 12 km: R$ 18,99

A estimativa usa pontos de referência dos CEPs e deve ser confirmada em casos de número distante, condomínio, bloqueio ou rota incomum.

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
2. Troque marca, contatos, operação, produtos, FAQ, origem e faixas de entrega.
3. Registre o tenant em `src/tenants/index.ts`.
4. Adicione os ativos em `public/tenants/<slug>`.
5. Defina `NEXT_PUBLIC_TENANT_SLUG=<slug>` no ambiente do deploy.

## Decisão técnica
A Sprint 1 usa CSS nativo com tokens, em vez de Tailwind. Isso reduz dependências e mantém o núcleo visual reutilizável. Supabase e IA entram quando houver operações reais para armazenar e automatizar.
