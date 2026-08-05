import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import { getTenant } from "@/tenants";
import { PwaRegister } from "@/components/PwaRegister";
import "./globals.css";
import "./delivery.css";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});
const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});
const tenant = getTenant();

export const metadata: Metadata = {
  title: `${tenant.brand.name} — Brownies e trufas em Blumenau`,
  description: tenant.brand.description,
  applicationName: tenant.brand.name,
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: tenant.brand.shortName,
  },
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: tenant.brand.name,
    description: tenant.brand.description,
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: tenant.brand.heroImage,
        width: 1200,
        height: 800,
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0807",
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${sans.variable}`}
    >
      <body>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
