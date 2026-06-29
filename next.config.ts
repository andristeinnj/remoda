import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  // Wrap <Link> navigations in document.startViewTransition for smooth page
  // transitions and shared-element morphs (driven by CSS view-transition-name).
  experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      // Supabase Storage (product-images bucket)
      { protocol: "https", hostname: "*.supabase.co" },
      // Placeholder imagery used until real photos are uploaded
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
