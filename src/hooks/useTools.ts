'use client';

import { useEffect, useState } from 'react';
import type { LocalizedText } from '@/models/Plan';

export interface PublicTool {
  key: string;
  name: LocalizedText;
  description: LocalizedText;
  category: string;
  href: string;
  icon: string;
  planKeys: string[];
  isPremium: boolean;
}

/** Fetch the public, active tool catalogue once. */
export function useTools() {
  const [tools, setTools] = useState<PublicTool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch('/api/tools')
      .then((r) => r.json())
      .then((d) => { if (active && Array.isArray(d.tools)) setTools(d.tools); })
      .catch(() => {})
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return { tools, loading };
}
