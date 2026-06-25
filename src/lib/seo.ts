import type { Metadata } from 'next';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://multiservices.app';
export const SITE_NAME = 'MultiServices';

export function buildMetadata(opts: {
  title: string; description: string; path?: string; keywords?: string[]; image?: string;
}): Metadata {
  const url = SITE_URL + (opts.path || '');
  const image = opts.image || SITE_URL + '/og-default.png';
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: opts.title, description: opts.description, url, siteName: SITE_NAME,
      type: 'website', images: [{ url: image, width: 1200, height: 630, alt: opts.title }],
    },
    twitter: {
      card: 'summary_large_image', title: opts.title, description: opts.description, images: [image],
    },
  };
}

export function softwareAppJsonLd(opts: { name: string; description: string; path: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: opts.name,
    description: opts.description,
    url: SITE_URL + opts.path,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  };
}
