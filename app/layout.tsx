import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header/Header";
import Info from "./components/Info/Info";
import Modal from "./components/Modal/Modal";
import ProviderWrapper from "./providers/ProviderWrapper";
import Loading from "./components/Loading/Loading";
// import Alpha from "./components/Alpha/Alpha";

export const metadata: Metadata = {
  authors: {
    name: "K-Henry",
  },

  title: "Options Project",
  description: "An easy-to-use options analytical tool.",
  keywords: "options trading, stock options, analysis, options tool, financial analysis, options strategy",
  openGraph: {
    title: "Options Project",
    description: "An easy-to-use options analytical tool.",
    url: "https://www.optionsproject.io",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Options Project",
    description: "An easy-to-use options analytical tool.",
  },


  icons: {
    apple: "/apple-touch-icon.png",
  },

  robots: "index, follow",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ProviderWrapper>
          <Header />
          {children}
          <Info />
          <Modal />
          <Loading />
          {/* <Alpha /> */}
        </ProviderWrapper>
      </body>
    </html>
  );
}