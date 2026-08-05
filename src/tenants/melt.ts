import type { TenantConfig } from "@/core/types";

export const meltTenant: TenantConfig = {
  slug: "melt",
  brand: {
    name: "Melt Brownies",
    shortName: "Melt",
    tagline: "Chocolate de verdade para qualquer hora.",
    description:
      "Brownies com casquinha fina, interior intenso e trufas artesanais, preparados em Blumenau.",
    logo: "/tenants/melt/logo.svg",
    heroImage: "/tenants/melt/hero.svg",
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
    delivery: "Entrega em toda Blumenau",
    pickup: true,
    deliveryFeeNotice: "A taxa é calculada conforme o endereço e confirmada pela equipe.",
  },
  products: [
    {
      id: "brownie-p",
      name: "Brownie P",
      category: "brownies",
      description: "85 g, casquinha fina e interior intenso de chocolate.",
      price: 12.9,
      image: "/tenants/melt/brownie.svg",
      badge: "Individual",
      available: true,
    },
    {
      id: "brownie-g",
      name: "Brownie G",
      category: "brownies",
      description: "250 g para dividir — ou não. Uma dose maior de chocolate.",
      price: 24.9,
      image: "/tenants/melt/brownie.svg",
      badge: "Mais chocolate",
      available: true,
    },
    {
      id: "bites",
      name: "Bites de Brownie",
      category: "brownies",
      description: "Pacotinho de 80 g com pequenas doses de felicidade.",
      price: 9.9,
      image: "/tenants/melt/bites.svg",
      available: true,
    },
    {
      id: "trufa-maracuja",
      name: "Trufa de Maracujá",
      category: "trufas",
      description: "Casquinha de chocolate e recheio cremoso de maracujá.",
      price: 7,
      image: "/tenants/melt/truffle.svg",
      badge: "Cremosa",
      available: true,
    },
    {
      id: "trufa-chocolate",
      name: "Trufa de Chocolate",
      category: "trufas",
      description: "Chocolate intenso por fora e por dentro.",
      price: 7,
      image: "/tenants/melt/truffle.svg",
      available: true,
    },
    {
      id: "trufa-ninho",
      name: "Trufa de Leite Ninho",
      category: "trufas",
      description: "Recheio delicado de leite Ninho envolvido em chocolate.",
      price: 7,
      image: "/tenants/melt/truffle.svg",
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
      answer: "Entregamos em toda Blumenau. A taxa é calculada conforme o endereço.",
      keywords: ["entrega", "bairro", "onde", "taxa"],
    },
    {
      question: "Posso retirar?",
      answer: "Sim. É possível retirar no local após a confirmação do pedido pela equipe.",
      keywords: ["retirar", "retirada", "buscar"],
    },
    {
      question: "Qual produto vocês recomendam?",
      answer:
        "Para uma vontade individual, o Brownie P funciona muito bem. Para dividir ou para uma vontade maior, escolha o Brownie G. Uma trufa completa o pedido.",
      keywords: ["recomenda", "sugestão", "sugestao", "indica"],
    },
  ],
};
