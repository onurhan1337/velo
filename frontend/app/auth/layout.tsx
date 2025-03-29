import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication pages for your account.",
};

export const dynamic = "force-dynamic";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="flex justify-center mb-6 text-2xl font-bold text-primary hover:underline"
        >
          Velo
        </Link>
        <Card className="w-full">{children}</Card>
      </div>
    </div>
  );
}
