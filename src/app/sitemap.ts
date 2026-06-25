import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ['', '/tools', '/pricing', '/services', '/auth/login', '/auth/signup'].map((p) => ({
    url: SITE_URL + p, lastModified: now, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.8,
  }));
  const toolRoutes = tools.map((t) => ({
    url: `${SITE_URL}/tools/${t.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9,
  }));
  return [...staticRoutes, ...toolRoutes];
}
