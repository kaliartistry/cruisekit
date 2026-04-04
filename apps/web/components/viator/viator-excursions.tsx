"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, Clock, ExternalLink, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { ViatorProduct, ViatorSearchResponse } from "@/lib/types/viator";

interface ViatorExcursionsProps {
  portSlug: string;
  portName: string;
}

export default function ViatorExcursions({
  portSlug,
  portName,
}: ViatorExcursionsProps) {
  const [products, setProducts] = useState<ViatorProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        const res = await fetch(
          `/data/viator/${encodeURIComponent(portSlug)}.json`
        );
        if (!res.ok) throw new Error("fetch failed");
        const data: ViatorSearchResponse = await res.json();
        if (!cancelled) {
          setProducts(data.products);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, [portSlug]);

  // Private islands / no products
  if (!loading && !error && products.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-navy">
          Book Tours & Activities
        </h2>
        {!loading && products.length > 0 && (
          <span className="text-xs text-gray-400">
            Powered by Viator
          </span>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-12 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading tours for {portName}…</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />
          <p className="text-sm text-amber-800">
            Tours are temporarily unavailable. Check back soon!
          </p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ViatorProductCard key={product.productCode} product={product} />
          ))}
        </div>
      )}

      {/* Viator attribution (required by partner agreement) */}
      {!loading && products.length > 0 && (
        <p className="mt-4 text-center text-[11px] text-gray-400">
          Tour content and prices provided by Viator. CruiseKit may earn a
          commission on bookings.
        </p>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Product Card                                                       */
/* ------------------------------------------------------------------ */

function ViatorProductCard({ product }: { product: ViatorProduct }) {
  return (
    <a
      href={product.productUrl}
      target="_blank"
      rel="noopener noreferrer noindex nofollow"
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white",
        "transition-all hover:shadow-lg hover:border-teal/30"
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {product.thumbnailUrl ? (
          <Image
            src={product.thumbnailUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100 text-gray-300">
            <Star className="h-8 w-8" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-navy group-hover:text-teal">
          {product.title}
        </h3>

        {/* Rating */}
        {product.reviewCount > 0 && (
          <div className="mt-2 flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < Math.round(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-200"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({product.reviewCount.toLocaleString()})
            </span>
          </div>
        )}

        {/* Duration */}
        {product.duration && (
          <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            {product.duration}
          </div>
        )}

        {/* Price + CTA */}
        <div className="mt-auto flex items-end justify-between pt-3">
          {product.pricingFrom != null ? (
            <div>
              <span className="text-[11px] text-gray-400">From</span>
              <p className="text-lg font-bold text-navy">
                ${product.pricingFrom.toFixed(0)}
              </p>
            </div>
          ) : (
            <div />
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal transition-colors group-hover:bg-teal group-hover:text-white">
            Book <ExternalLink className="h-3 w-3" />
          </span>
        </div>
      </div>
    </a>
  );
}
