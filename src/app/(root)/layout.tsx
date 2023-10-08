import "../globals.css";
import type { Metadata } from "next";
import { dark } from "@clerk/themes";
import { Inter } from "next/font/google";
import { ClerkProvider, currentUser } from "@clerk/nextjs";
import LeftSideBar from "@/components/shared/LeftSideBar";
import Bottombar from "@/components/shared/Bottombar";
import { ThemeProvider } from "@/components/theme-provider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/toaster";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { getUnreadNotificationCount } from "@/lib/actions/notification.actions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Threads",
  description: "A Next.js 13 Meta Threads App.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) {
    redirect("/onboarding");
  }

  const notification = await getUnreadNotificationCount({
    userId: userInfo._id,
  });

  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NextTopLoader showSpinner={false} />
            <main className="mx-auto sm:max-w-4xl flex flex-row ">
              <LeftSideBar notification={notification.length} />

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
