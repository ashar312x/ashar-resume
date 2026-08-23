import type { Metadata } from "next";
import { Familjen_Grotesk, Instrument_Serif, Martian_Mono } from "next/font/google";
import { PageLine } from "@/components/PageLine";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CanvasRoot } from "@/components/webgl/CanvasRoot";
import { meta } from "@/lib/content";
import "./globals.css";

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const familjen = Familjen_Grotesk({
  variable: "--font-familjen",
  subsets: ["latin"],
});

const martian = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin"],
  weight: ["300", "500"],
});

export const metadata: Metadata = {
  title: `${meta.name} — ${meta.role}`,
  description: meta.summary,
  openGraph: {
    title: `${meta.name} — ${meta.role}`,
    description: meta.summary,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${instrument.variable} ${familjen.variable} ${martian.variable}`}
    >
      <body>
        <SmoothScroll>
          <CanvasRoot />
          <PageLine />
          {children}
        </SmoothScroll>
        <div className="atmosphere" aria-hidden />
      </body>
    </html>
  );
}
