import type { TenantConfig } from "@/core/types";

export const meltTenant: TenantConfig = {
  slug: "melt",
  brand: {
    name: "Melt Brownies",
    shortName: "Melt",
    tagline: "Chocolate de verdade para qualquer hora.",
    description:
      "Brownies com casquinha fina, interior intenso e trufas artesanais, preparados em Blumenau.",
    logo: "/tenants/melt/logo.webp",
    heroImage: "/tenants/melt/hero.webp",
  },
  contact: {
    instagramUrl: "https://www.instagram.com/melt.browniesoficial",
    instagramLabel: "@melt.browniesoficial",
    ifoodUrl:
      "https://www.ifood.com.br/delivery/blumenau-sc/melt-brownies-e-doces-progresso/8bf2a558-dac5-4460-ab82-8951e763be65",
    whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    city: "Blumenau",
    region: "SC",
  },
  operation: {
    hours: "Das 8h às 2h",
    delivery: "Entrega própria em Blumenau",
    pickup: true,
    deliveryFeeNotice:
      "A taxa é estimada usando o CEP, o número e a distância percorrida nas ruas.",
    deliveryPricing: {
      origin: {
        address: "Rua Rui Barbosa, 785 — Progresso, Blumenau — SC",
        cep: "89026-601",
      },
      maxDistanceKm: 12,
      bands: [
        { upToKm: 3, fee: 7.99 },
        { upToKm: 5, fee: 9.99 },
        { upToKm: 7, fee: 12.99 },
        { upToKm: 9, fee: 15.99 },
        { upToKm: 12, fee: 18.99 },
      ],
      disclaimer:
        "A rota usa CEP e número. Condomínio, entrada, complemento, bloqueios e alterações viárias podem exigir confirmação pela equipe.",
    },
  },
  products: [
    {
      id: "brownie-p",
      name: "Brownie P",
      category: "brownies",
      description: "85 g, casquinha fina e interior intenso de chocolate.",
      price: 12.9,
      image: "/tenants/melt/brownie.webp",
      badge: "Individual",
      available: true,
    },
    {
      id: "brownie-g",
      name: "Brownie G",
      category: "brownies",
      description: "250 g para dividir — ou não. Uma dose maior de chocolate.",
      price: 24.9,
      image: "/tenants/melt/brownie.webp",
      badge: "Mais chocolate",
      available: true,
    },
    {
      id: "bites",
      name: "Bites de Brownie",
      category: "brownies",
      description: "Pacotinho de 80 g com pequenas doses de felicidade.",
      price: 9.9,
      image: "/tenants/melt/bites.webp",
      available: true,
    },
    {
      id: "trufa-maracuja",
      name: "Trufa de Maracujá",
      category: "trufas",
      description: "Casquinha de chocolate e recheio cremoso de maracujá.",
      price: 7,
      image: "/tenants/melt/truffle.webp",
      badge: "Cremosa",
      available: true,
    },
    {
      id: "trufa-chocolate",
      name: "Trufa de Chocolate",
      category: "trufas",
      description: "Chocolate intenso por fora e por dentro.",
      price: 7,
      image: "/tenants/melt/truffle.webp",
      available: true,
    },
    {
      id: "trufa-ninho",
      name: "Trufa de Leite Ninho",
      category: "trufas",
      description: "Recheio delicado de leite Ninho envolvido em chocolate.",
      price: 7,
      image: "/tenants/melt/truffle.webp",
      available: true,
    },
  ],
  faq: [
    {
      question: "Qual é o horário?",
      answer: "O atendimento funciona das 8h às 2h.",
      keywords: ["horário", "horario", "abre", "fecha", "funcionamento"],
    },
    {
      question: "Vocês entregam onde?",
      answer:
        "Fazemos entrega própria em Blumenau. No carrinho, informe o CEP e o número para receber uma estimativa da taxa pela distância da rota.",
      keywords: ["entrega", "bairro", "onde", "taxa", "frete", "cep"],
    },
    {
      question: "Posso retirar?",
      answer:
        "Sim. É possível retirar na Rua Rui Barbosa, 785, Progresso, após a confirmação do pedido.",
      keywords: ["retirar", "retirada", "buscar", "endereço", "endereco"],
    },
    {
      question: "Qual produto vocês recomendam?",
      answer:
        "Para uma vontade individual, o Brownie P funciona muito bem. Para dividir ou para uma vontade maior, escolha o Brownie G. Uma trufa completa o pedido.",
      keywords: ["recomenda", "sugestão", "sugestao", "indica"],
    },
  ],
};
