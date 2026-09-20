import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/components/locale-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "boopaste · paste images as file paths, in your terminal",
  description:
    "A macOS daemon that turns clipboard images into real PNG file paths when you paste in Ghostty (and soon, other terminals). Open source, MIT licensed.",
  metadataBase: new URL("https://boopaste.dev"),
  openGraph: {
    title: "boopaste",
    description: "Paste images as file paths, only in your terminal.",
    type: "website",
  },
};

// Aplica o tema salvo (ou a preferência do sistema) antes do primeiro paint,
// pra evitar o flash de tema errado (FOUC) — roda síncrono, antes do React.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("boopaste-theme");
    var dark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
