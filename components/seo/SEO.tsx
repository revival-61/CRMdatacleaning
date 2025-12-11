"use client";

import { Metadata } from "next";

interface SEOProps {
  metadata?: Metadata;
}

export default function SEO({ metadata }: SEOProps) {
  // In Next.js App Router, metadata is handled via generateMetadata
  // This component is kept for compatibility but metadata should be
  // generated in page.tsx files using generateMetadata function
  return null;
}

