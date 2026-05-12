import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/firebase/auth";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE_TITLE = "CruiseKit — Everything You Need for Your Cruise";
const SITE_DESCRIPTION =
  "The all-in-one cruise planning toolkit. Calculate true costs, plan port days, coordinate your group, manage your cruise day, and optimize your loyalty rewards.";
const OG_IMAGE = {
  url: "/cruisekit_square.png",
  width: 512,
  height: 512,
  alt: "CruiseKit — cruise planning toolkit",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://cruisekit.app"),
  title: {
    default: SITE_TITLE,
    template: "%s | CruiseKit",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "cruise cost calculator",
    "cruise planning",
    "port day planner",
    "cruise group planning",
    "cruise loyalty tracker",
    "hidden cruise costs",
    "cruise day planner",
    "cruisekit",
  ],
  openGraph: {
    siteName: "CruiseKit",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "en_US",
    url: "/",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AuthProvider>{children}</AuthProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: "CruiseKit",
                  url: "https://cruisekit.app",
                  description:
                    "The all-in-one cruise planning toolkit. Calculate true costs, plan port days, coordinate your group, and optimize your loyalty rewards.",
                },
                {
                  "@type": "WebSite",
                  name: "CruiseKit",
                  url: "https://cruisekit.app",
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
