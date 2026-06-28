import type { MetadataRoute } from "next";
import { listProducts } from "@/lib/queries";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://remoda.is";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/konur", "/karlar", "/leit", "/selja"].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "daily" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await listProducts({ limit: 1000 });
    productRoutes = products.map((p) => ({
      url: `${siteUrl}/vara/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    // If the DB is unreachable at build, ship the static routes only.
  }

  return [...staticRoutes, ...productRoutes];
}
