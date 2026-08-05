# Modelo de dados previsto para a Sprint 2

- `tenants`: empresa, slug, marca, domínio, fuso horário
- `profiles`: usuário, tenant, papel
- `categories`: tenant, nome, ordem
- `products`: tenant, categoria, preço, disponibilidade, imagem
- `customers`: tenant, nome, telefone, consentimentos
- `orders`: tenant, cliente, canal, status, subtotal, taxa, total
- `order_items`: pedido, produto, quantidade, preço unitário
- `inventory_events`: produto, tipo, quantidade, origem
- `conversations`: cliente, canal, status, responsável
- `messages`: conversa, autor, conteúdo, modelo/automação
- `coupons`: regras, validade e limite
- `loyalty_ledger`: créditos e débitos de fidelidade

Todas as tabelas operacionais terão `tenant_id` e políticas de Row Level Security.
