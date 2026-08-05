# Arquitetura

## Princípio
O código do comércio é separado dos dados e identidade de cada cliente.

```text
src/core          tipos e regras comuns
src/components    storefront, carrinho, PWA e atendimento
src/tenants       configuração específica de cada empresa
public/tenants    imagens e ativos por empresa
src/app           rotas Next.js
```

## Evolução prevista
Na Sprint 2, `src/tenants` deixa de ser a fonte operacional e passa a funcionar como seed/fallback. Produtos, horários e disponibilidade virão do Supabase. Dados secretos nunca serão enviados ao navegador.

## Fronteiras
- Storefront não confirma estoque, taxa ou prazo sem uma fonte operacional.
- IA não inventa preço, promoção ou disponibilidade.
- WhatsApp recebe um resumo; a equipe confirma o pedido.
- Chat é uma ação voluntária do visitante.
