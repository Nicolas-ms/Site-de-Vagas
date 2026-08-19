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
  title: "Agregador de Vagas - TI em um só lugar",
  description:
    "Indexamos vagas de tecnologia e TI de várias fontes em um único lugar.",
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
          </div>
        </nav>
        {children}
        <footer className="rodape">
          <div className="container">
            <p>Vagas.com &copy; {new Date().getFullYear()} - Agregador de vagas</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
