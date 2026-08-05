"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { CartLine, Product, TenantConfig } from "@/core/types";

type Props = { tenant: TenantConfig };
type Drawer = "cart" | "assistant" | null;

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function Icon({ name }: { name: "bag" | "chat" | "close" | "plus" | "minus" | "arrow" }) {
  const paths = {
    bag: <><path d="M6 8h12l-1 12H7L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></>,
    chat: <><path d="M4 5h16v11H8l-4 4V5Z"/><path d="M8 9h8M8 12h5"/></>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    plus: <path d="M12 5v14M5 12h14"/>,
    minus: <path d="M5 12h14"/>,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5"/>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
}

export function Storefront({ tenant }: Props) {
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [category, setCategory] = useState<"todos" | "brownies" | "trufas">("todos");
  const [orderMode, setOrderMode] = useState<"Entrega" | "Retirada">("Entrega");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [assistantInput, setAssistantInput] = useState("");
  const [messages, setMessages] = useState<Array<{ from: "user" | "bot"; text: string }>>([
    { from: "bot", text: "Oi! Posso ajudar com cardápio, entrega, retirada e horário. O atendimento só abre quando você quiser." },
  ]);
  const [installEvent, setInstallEvent] = useState<Event & { prompt?: () => Promise<void> } | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(`cart:${tenant.slug}`);
    if (saved) {
      try { setCart(JSON.parse(saved) as CartLine[]); } catch { /* ignore invalid local data */ }
    }
    const onInstall = (event: Event) => { event.preventDefault(); setInstallEvent(event as Event & { prompt?: () => Promise<void> }); };
    window.addEventListener("beforeinstallprompt", onInstall);
    return () => window.removeEventListener("beforeinstallprompt", onInstall);
  }, [tenant.slug]);

  useEffect(() => { window.localStorage.setItem(`cart:${tenant.slug}`, JSON.stringify(cart)); }, [cart, tenant.slug]);

  const visibleProducts = tenant.products.filter((product) => product.available && (category === "todos" || product.category === category));
  const itemCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const total = cart.reduce((sum, line) => {
    const product = tenant.products.find((item) => item.id === line.productId);
    return sum + (product?.price ?? 0) * line.quantity;
  }, 0);

  const cartProducts = useMemo(() => cart.map((line) => ({ line, product: tenant.products.find((p) => p.id === line.productId) })).filter((entry): entry is { line: CartLine; product: Product } => Boolean(entry.product)), [cart, tenant.products]);

  function changeQuantity(productId: string, amount: number) {
    setCart((current) => {
      const existing = current.find((line) => line.productId === productId);
      if (!existing && amount > 0) return [...current, { productId, quantity: 1 }];
      return current.map((line) => line.productId === productId ? { ...line, quantity: Math.max(0, line.quantity + amount) } : line).filter((line) => line.quantity > 0);
    });
  }

  function checkout() {
    if (!cartProducts.length) return alert("Adicione pelo menos um produto ao pedido.");
    if (!name.trim()) return alert("Informe seu nome.");
    if (orderMode === "Entrega" && !address.trim()) return alert("Informe o endereço para calcular a taxa.");
    const lines = cartProducts.map(({ line, product }) => `• ${line.quantity}x ${product.name} — ${money.format(product.price * line.quantity)}`);
    const text = [
      `Olá, ${tenant.brand.name}! 🍫`,
      `Meu nome é ${name.trim()} e quero fazer este pedido:`, "", ...lines, "",
      `Total dos produtos: ${money.format(total)}`,
      `Modalidade: ${orderMode}`,
      orderMode === "Entrega" ? `Endereço: ${address.trim()}` : "",
      "", "Aguardo a confirmação da disponibilidade, prazo e taxa de entrega.",
    ].filter(Boolean).join("\n");
    if (!tenant.contact.whatsappNumber) {
      navigator.clipboard?.writeText(text);
      alert("O pedido foi copiado. Falta cadastrar o WhatsApp comercial para abrir a conversa automaticamente.");
      return;
    }
    window.open(`https://wa.me/${tenant.contact.whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  function ask(question: string) {
    const clean = question.trim(); if (!clean) return;
    setMessages((current) => [...current, { from: "user", text: clean }]);
    setAssistantInput("");
    const normalized = clean.toLocaleLowerCase("pt-BR");
    const match = tenant.faq.find((item) => item.keywords.some((keyword) => normalized.includes(keyword)));
    const response = match?.answer ?? "Posso ajudar com cardápio, preços, entrega, retirada e horário. Para encomendas ou pedidos empresariais, a equipe humana continua o atendimento.";
    window.setTimeout(() => setMessages((current) => [...current, { from: "bot", text: response }]), 250);
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#inicio"><Image src={tenant.brand.logo} width={48} height={48} alt={`Logo ${tenant.brand.name}`} /><span>{tenant.brand.name}</span></a>
        <nav aria-label="Navegação principal"><a href="#cardapio">Cardápio</a><a href="#entrega">Entrega</a><a href="#sobre">Sobre</a></nav>
        <div className="header-actions">
          {installEvent && <button className="install-button" onClick={() => installEvent.prompt?.()}>Instalar app</button>}
          <button className="cart-trigger" onClick={() => setDrawer("cart")}><Icon name="bag" /> Pedido <b>{itemCount}</b></button>
        </div>
      </header>

      <main>
        <section id="inicio" className="hero" style={{ "--hero-image": `url(${tenant.brand.heroImage})` } as React.CSSProperties}>
          <div className="hero-shade" />
          <div className="hero-content">
            <span className="eyebrow">Feito em Blumenau • {tenant.operation.hours}</span>
            <h1>Seu momento pede <em>chocolate de verdade.</em></h1>
            <p>{tenant.brand.description}</p>
            <div className="hero-buttons"><a className="button primary" href="#cardapio">Escolher agora <Icon name="arrow" /></a><a className="button ghost" href={tenant.contact.ifoodUrl} target="_blank" rel="noreferrer">Pedir no iFood</a></div>
            <div className="proof-row"><span>{tenant.operation.delivery}</span><span>Retirada no local</span><span>Produção artesanal</span></div>
          </div>
        </section>

        <section className="manifesto"><span>Casquinha delicada.</span><span>Centro úmido.</span><span>Vontade resolvida.</span></section>

        <section id="cardapio" className="section catalog-section">
          <div className="section-heading"><div><span className="eyebrow dark">Os favoritos da Melt</span><h2>Escolha o seu.</h2></div><p>Monte o pedido sem criar conta. A equipe confirma disponibilidade, prazo e taxa antes de produzir.</p></div>
          <div className="filters" aria-label="Filtrar cardápio">{(["todos", "brownies", "trufas"] as const).map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item === "todos" ? "Todos" : item[0].toUpperCase() + item.slice(1)}</button>)}</div>
          <div className="product-grid">{visibleProducts.map((product) => <article className="product-card" key={product.id}><div className="product-media"><Image src={product.image} alt={product.name} fill sizes="(max-width: 800px) 100vw, 33vw" />{product.badge && <span>{product.badge}</span>}</div><div className="product-copy"><div><h3>{product.name}</h3><p>{product.description}</p></div><strong>{money.format(product.price)}</strong><button onClick={() => { changeQuantity(product.id, 1); setDrawer("cart"); }}>Adicionar <Icon name="plus" /></button></div></article>)}</div>
        </section>

        <section className="feature"><div className="feature-photo"><Image src="/tenants/melt/brownie.svg" alt="Brownie Melt com casquinha fina" fill sizes="50vw" /></div><div className="feature-copy"><span className="eyebrow">Brownie Melt</span><h2>Intenso por dentro. Irresistível por fora.</h2><p>O site não tenta explicar demais: mostra o produto, reduz a distância até o pedido e deixa o atendimento disponível sem interromper a experiência.</p><a href="#cardapio">Escolher um brownie <Icon name="arrow" /></a></div></section>

        <section id="entrega" className="delivery"><div className="delivery-copy"><span className="eyebrow">Entrega e retirada</span><h2>Da Melt até você.</h2><p>{tenant.operation.delivery}. {tenant.operation.deliveryFeeNotice}</p><dl><div><dt>Atendimento</dt><dd>{tenant.operation.hours}</dd></div><div><dt>Região</dt><dd>{tenant.contact.city}</dd></div><div><dt>Canais</dt><dd>Site, WhatsApp e iFood</dd></div></dl></div><div className="delivery-photo"><Image src="/tenants/melt/truffle.svg" alt="Trufa artesanal Melt" fill sizes="50vw" /></div></section>

        <section id="sobre" className="section about"><span className="eyebrow dark">Sobre a Melt</span><h2>Doces que chegam com carinho e ficam na memória.</h2><p>A experiência digital foi desenhada para valorizar a textura, a identidade premium e a conveniência — sem esconder o produto atrás de cadastros, telas ou um chatbot invasivo.</p><a className="button dark-button" href={tenant.contact.instagramUrl} target="_blank" rel="noreferrer">Conhecer no Instagram</a></section>
      </main>

      <button className="assistant-trigger" onClick={() => setDrawer("assistant")} aria-label="Abrir ajuda"><Icon name="chat" /><span>Precisa de ajuda?</span></button>

      <footer><div><Image src={tenant.brand.logo} width={88} height={88} alt="" /><p>{tenant.brand.tagline}</p></div><div><b>Pedidos</b><a href="#cardapio">Cardápio</a><a href={tenant.contact.ifoodUrl}>iFood</a></div><div><b>Contato</b><a href={tenant.contact.instagramUrl}>{tenant.contact.instagramLabel}</a><span>{tenant.contact.city} • {tenant.contact.region}</span></div></footer>

      <div className={`backdrop ${drawer ? "visible" : ""}`} onClick={() => setDrawer(null)} />
      <aside className={`drawer ${drawer === "cart" ? "open" : ""}`} aria-hidden={drawer !== "cart"}><div className="drawer-head"><div><span className="eyebrow dark">Seu pedido</span><h2>Quase lá.</h2></div><button onClick={() => setDrawer(null)} aria-label="Fechar"><Icon name="close" /></button></div><div className="drawer-body">{cartProducts.length === 0 ? <div className="empty"><Icon name="bag" /><p>Seu pedido ainda está vazio.</p></div> : cartProducts.map(({ line, product }) => <div className="cart-line" key={product.id}><div><b>{product.name}</b><small>{money.format(product.price)} cada</small></div><div className="quantity"><button onClick={() => changeQuantity(product.id, -1)}><Icon name="minus" /></button><span>{line.quantity}</span><button onClick={() => changeQuantity(product.id, 1)}><Icon name="plus" /></button></div></div>)}</div><div className="drawer-footer"><div className="total"><span>Total dos produtos</span><b>{money.format(total)}</b></div><label>Modalidade<select value={orderMode} onChange={(event) => setOrderMode(event.target.value as "Entrega" | "Retirada")}><option>Entrega</option><option>Retirada</option></select></label><label>Nome<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Seu nome" /></label>{orderMode === "Entrega" && <label>Endereço<input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Rua, número e bairro" /></label>}<button className="button primary full" onClick={checkout}>Finalizar pelo WhatsApp</button><small>{tenant.operation.deliveryFeeNotice}</small></div></aside>

      <aside className={`drawer assistant-drawer ${drawer === "assistant" ? "open" : ""}`} aria-hidden={drawer !== "assistant"}><div className="drawer-head"><div><span className="eyebrow dark">Atendimento opcional</span><h2>Como posso ajudar?</h2></div><button onClick={() => setDrawer(null)} aria-label="Fechar"><Icon name="close" /></button></div><div className="messages">{messages.map((message, index) => <p key={`${message.from}-${index}`} className={message.from}>{message.text}</p>)}</div><div className="quick-questions">{tenant.faq.slice(0, 4).map((item) => <button key={item.question} onClick={() => ask(item.question)}>{item.question}</button>)}</div><form className="assistant-form" onSubmit={(event) => { event.preventDefault(); ask(assistantInput); }}><input value={assistantInput} onChange={(event) => setAssistantInput(event.target.value)} placeholder="Digite sua dúvida…" /><button>Enviar</button></form><p className="assistant-note">Nesta sprint, o assistente usa a base segura de perguntas frequentes. A IA real entra na Sprint 2, com transferência para atendimento humano.</p></aside>
    </>
  );
}
