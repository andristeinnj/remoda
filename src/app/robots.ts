import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://remoda.is";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/seljandi",
        "/kassi",
        "/minar-sidur",
        "/innskraning",
        "/nyskraning",
        "/stilbok",
        "/api/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
