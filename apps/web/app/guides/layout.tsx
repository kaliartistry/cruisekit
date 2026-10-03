import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cruise Planning Guides',
  description:
    'Expert cruise planning guides for first-timers and seasoned cruisers. Packing lists, budget tips, onboard advice, and port day strategies.',
};

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
