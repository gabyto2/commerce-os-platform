import type { Metadata } from "next";

export const metadata: Metadata = { title: "Painel — em construção", robots: { index: false, follow: false } };

const modules = ["Pedidos", "Produtos", "Clientes", "Estoque", "Cupons", "Fidelidade", "Marketing", "Relatórios", "IA", "Configurações"];

export default function AdminPage() {
  return (
    <main className="admin-shell">
      <section className="admin-card">
        <span className="eyebrow">Sprint 2</span>
        <h1>Painel operacional</h1>
        <p>Esta rota já está reservada. Login, banco de dados e operações reais entram após a validação do storefront.</p>
        <div className="admin-grid">{modules.map((module) => <div key={module}>{module}<small>planejado</small></div>)}</div>
        <a href="/">Voltar para a loja</a>
      </section>
    </main>
  );
}
