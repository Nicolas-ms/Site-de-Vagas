import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vagas.com - Encontre sua próxima oportunidade",
  description:
    "Portal de empregos com vagas atualizadas em diversas áreas: tecnologia, marketing, vendas e mais.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <nav className="nav">
          <div className="container nav-inner">
            <a href="/" className="nav-logo">
              Vagas<span>.com</span>
            </a>
            <a href="/vagas/nova" className="nav-link">
              Publicar vaga
            </a>
          </div>
        </nav>
        {children}
        <footer className="rodape">
          <div className="container">
            <p>Vagas.com &copy; {new Date().getFullYear()} - Portal de empregos</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
