import * as React from 'react';
import { buildMetadata, softwareAppJsonLd } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { getTool } from '@/lib/tools';

const t = getTool('json-formatter')!;
export const metadata = buildMetadata({ title: t.titleFr + ' — MultiServices', description: t.descFr, path: '/tools/json-formatter', keywords: t.keywords });
export default function Layout({ children }: { children: React.ReactNode }) {
  return (<><JsonLd data={softwareAppJsonLd({ name: t.titleFr, description: t.descFr, path: '/tools/json-formatter' })} />{children}</>);
}