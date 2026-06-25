const t = getTool('adsense-calculator')!;
export const metadata = buildMetadata({ title: t.titleFr + ' — MultiServices', description: t.descFr, path: '/tools/adsense-calculator', keywords: t.keywords });
export default function Layout({ children }: { children: React.ReactNode }) {
  return (<><JsonLd data={softwareAppJsonLd({ name: t.titleFr, description: t.descFr, path: '/tools/adsense-calculator' })} />{children}</>);
}
