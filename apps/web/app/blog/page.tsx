import type { Metadata } from "next";
import BlogIndexClient from "./blog-index-client";
import { INDEXABLE_BLOG_POSTS } from "@/lib/data/blog-posts";

const PAGE_URL = "https://cruisekit.app/blog";

export const metadata: Metadata = {
  title: "CruiseKit Blog: Cruise Tips, Costs, Port Days & Planning",
  description:
    "CruiseKit blog articles for realistic cruise costs, first-time cruise planning, port days, ship time, onboard spending, and cruise line add-ons.",
  keywords: [
    "cruise blog",
    "cruise tips",
    "cruise cost guide",
    "first time cruise tips",
    "cruise port day planning",
    "ship time cruise",
    "cruise budgeting",
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "CruiseKit Blog",
    description:
      "Practical cruise planning articles for costs, ship time, port days, onboard add-ons, and first-time cruise decisions.",
    url: "/blog",
    images: [
      {
        url: "/assets/app-screenshots/myday-itinerary.png",
        width: 1290,
        height: 2796,
        alt: "CruiseKit MyDay itinerary screen for cruise planning articles",
      },
    ],
  },
};

function BlogIndexJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${PAGE_URL}#blog`,
    name: "CruiseKit Blog",
    description:
      "Cruise planning articles for true cruise costs, port days, ship time, and onboard add-ons.",
    url: PAGE_URL,
    publisher: {
      "@type": "Organization",
      name: "CruiseKit",
      url: "https://cruisekit.app",
      logo: {
        "@type": "ImageObject",
        url: "https://cruisekit.app/cruisekit_square.png",
      },
    },
    blogPost: INDEXABLE_BLOG_POSTS.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `${PAGE_URL}/${post.slug}`,
      datePublished: post.publishedDate,
      dateModified: post.publishedDate,
      author: {
        "@type": "Organization",
        name: post.author,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export default function BlogPage() {
  return (
    <>
      <BlogIndexJsonLd />
      <BlogIndexClient />
    </>
  );
}
