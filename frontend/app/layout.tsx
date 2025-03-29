import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthInitializer } from "@/components/auth/auth-initializer";
import { getAuthToken, getCurrentUser } from "@/lib/auth";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Velo",
  description: "Your application description",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getAuthToken();
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthInitializer user={user} token={token} />
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}
