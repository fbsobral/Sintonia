import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ptBR } from "@clerk/localizations";
import { dark } from "@clerk/themes";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  title: { default: "Sintonia", template: "%s · Sintonia" },
  description: "Entenda o momento dela e esteja em sintonia: ciclo, dicas diárias e astrologia para quem quer se relacionar melhor.",
  applicationName: "Sintonia",
  appleWebApp: { capable: true, title: "Sintonia", statusBarStyle: "black-translucent" },
};
export const viewport: Viewport = { themeColor: "#0b0919", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider localization={ptBR} appearance={{ theme: dark, variables: { colorPrimary: "#b9a8ff", colorBackground: "#1a1730" } }}>
      <html lang="pt-BR" className={`${inter.variable} ${fraunces.variable}`}>
        <body className="antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
