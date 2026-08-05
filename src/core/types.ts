export type ProductCategory = "brownies" | "trufas" | "combos" | "outros";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  image: string;
  badge?: string;
  available: boolean;
};

export type TenantConfig = {
  slug: string;
  brand: {
    name: string;
    shortName: string;
    tagline: string;
    description: string;
    logo: string;
    heroImage: string;
  };
  contact: {
    instagramUrl: string;
    instagramLabel: string;
    ifoodUrl: string;
    whatsappNumber?: string;
    city: string;
    region: string;
  };
  operation: {
    hours: string;
    delivery: string;
    pickup: boolean;
    deliveryFeeNotice: string;
  };
  products: Product[];
  faq: Array<{ question: string; answer: string; keywords: string[] }>;
};

export type CartLine = { productId: string; quantity: number };
