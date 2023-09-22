import "../globals.css";
import type { Metadata } from "next";
import { dark } from "@clerk/themes";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import LeftSideBar from "@/components/shared/LeftSideBar";
import Bottombar from "@/components/shared/Bottombar";
import { ThemeProvider } from "@/components/theme-provider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Threads",
  description: "A Next.js 13 Meta Threads App.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <NextTopLoader showSpinner={false} />
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <main className="mx-auto sm:max-w-4xl flex flex-row ">
              <LeftSideBar />

              <section className="w-full">
                <div className="">{children}</div>
              </section>
              <Bottombar />
            </main>
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
