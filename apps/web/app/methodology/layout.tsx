import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/methodology/" },
};

export default function MethodologyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
