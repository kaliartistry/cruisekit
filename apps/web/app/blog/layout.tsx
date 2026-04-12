import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cruise Planning Blog',
  description:
    'The latest cruise deals, tips, comparisons, and news to help you plan your next cruise vacation.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
