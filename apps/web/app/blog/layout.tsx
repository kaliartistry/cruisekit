import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cruise Planning Blog',
  description:
    'Cruise sailings, tips, comparisons, and news to help you plan your next cruise vacation.',
  alternates: { canonical: '/blog/' },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
