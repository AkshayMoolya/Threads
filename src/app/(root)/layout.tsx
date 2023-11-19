import "../globals.css";
import { dark } from "@clerk/themes";
import { Inter } from "next/font/google";
import { ClerkProvider, currentUser } from "@clerk/nextjs";
import Bottombar from "@/components/shared/Bottombar";
import { ThemeProvider } from "@/components/theme-provider";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/toaster";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { getUnreadNotificationCount } from "@/lib/actions/notification.actions";
import { metaTagsGenerator } from "@/lib/utils";
import TopBar from "@/components/shared/TopBar";



const inter = Inter({ subsets: ["latin"] });

export const Metadata = metaTagsGenerator({});

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
    userId: userInfo.id,
  });

  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <NextTopLoader showSpinner={false} />
            <main className="mx-auto sm:max-w-7xl flex flex-col ">
              <TopBar
                notification={notification}
                authUserId={user.id}
                userInfo={userInfo}
              />

              <section className="w-full ">
                <div className="mx-auto max-w-xl">{children}</div>
              </section>
              <Bottombar
                notification={notification}
                authUserId={user.id}
                userInfo={userInfo}
              />
            </main>
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
