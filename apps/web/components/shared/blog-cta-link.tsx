"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackBlogCtaClick } from "@/lib/analytics";

type BlogCtaLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  source: string;
};

export default function BlogCtaLink({
  source,
  href,
  onClick,
  ...props
}: BlogCtaLinkProps) {
  return (
    <Link
      href={href}
      onClick={(event) => {
        trackBlogCtaClick(source, href);
        onClick?.(event);
      }}
      {...props}
    />
  );
}
