# Publicação

## Fluxo oficial

O repositório `gabyto2/commerce-os-platform` é a fonte do código. Alterações são versionadas no GitHub e publicadas no projeto Netlify `melt-brownies`.

### Build

- Comando: `npm run build`
- Diretório: `.next`
- Node: `22.16.0`
- Tenant: `melt`

O arquivo `netlify.toml` mantém essas definições.

## Variáveis

```env
NEXT_PUBLIC_TENANT_SLUG=melt
NEXT_PUBLIC_WHATSAPP_NUMBER=5547XXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://melt-brownies.netlify.app
```

Use somente números no WhatsApp, incluindo `55` e o DDD. Supabase e OpenAI serão configurados na Sprint 2 e suas chaves secretas nunca devem entrar no GitHub.

## Processo de atualização

1. Alterar o núcleo compartilhado ou o tenant.
2. Enviar commit ao GitHub.
3. Criar deploy de produção no Netlify.
4. Validar versão móvel, carrinho, links e PWA.
