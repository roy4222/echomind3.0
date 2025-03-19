import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import ClientLayout from "@/components/layout/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EchoMind",
  description: "Your AI Assistant",
  icons: {
    icon: [
      {
        url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><g fill="none"><path stroke="%23fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M12 8c-3.052 4.517-5.987 5.81-8 5c.543 1.833 4.443 4.375 6.927 5.838c1.07.63 1.383 2.065.638 3.059C10.202 23.717 8.315 26.289 8 27C.954 39.79 16.482 44.648 24 44c22.144-1.908 21.355-19.197 18-26c-8.052 13.994-20.481 5.915-20 3s3.792-2.335 5-7C29.013 4.768 16.374.399 12 8"/><path stroke="%23fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M19 31c2.5 3.5 10 7 16 2"/><circle cx="17" cy="12" r="2" fill="%23fff"/></g></svg>',
        type: 'image/svg+xml',
        sizes: '48x48'
      }
    ],
    shortcut: [
      {
        url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><g fill="none"><path stroke="%23fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M12 8c-3.052 4.517-5.987 5.81-8 5c.543 1.833 4.443 4.375 6.927 5.838c1.07.63 1.383 2.065.638 3.059C10.202 23.717 8.315 26.289 8 27C.954 39.79 16.482 44.648 24 44c22.144-1.908 21.355-19.197 18-26c-8.052 13.994-20.481 5.915-20 3s3.792-2.335 5-7C29.013 4.768 16.374.399 12 8"/><path stroke="%23fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" d="M19 31c2.5 3.5 10 7 16 2"/><circle cx="17" cy="12" r="2" fill="%23fff"/></g></svg>',
        type: 'image/svg+xml',
        sizes: '48x48'
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientLayout>
            {children}
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
