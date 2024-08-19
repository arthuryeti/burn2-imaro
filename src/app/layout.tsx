import type { Metadata } from "next";
import { Box } from "@chakra-ui/react";
import "@solana/wallet-adapter-react-ui/styles.css";

import "./globals.css";
import { Providers } from "@/providers";

export const metadata: Metadata = {
  title: "BURN $IMARO",
  description: "Made by the community for the community",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="icon" href="/favicon.png" sizes="any" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="roboto-regular">
        <Providers>
          <Box bg="gray.900" w="100vw" h="100vh" overflow="hidden">
            {children}
          </Box>
        </Providers>
      </body>
    </html>
  );
}
