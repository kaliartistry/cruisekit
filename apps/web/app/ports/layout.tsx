import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cruise Port Guides',
  description:
    'Browse 60+ cruise port guides with safety ratings, excursions, free activities, restaurants, and transport tips for every major cruise destination.',
};

export default function PortsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
