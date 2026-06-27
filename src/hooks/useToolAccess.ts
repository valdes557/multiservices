'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { canAccessTool, type SubscriptionView, type ToolView } from '@/lib/entitlements';

interface PublicTool extends ToolView {
  name: { fr: string; en: string };
  category: string;
  href: string;
}

// Module-level cache so multiple tool pages share one fetch.
let cache: PublicTool[] | null = null;
let inflight: Promise<PublicTool[]> | null = null;

async function loadTools(): Promise<PublicTool[]> {
  if (cache) return cache;
  if (!inflight) {
    inflight = fetch('/api/tools')
      .then((r) => (r.ok ? r.json() : { tools: [] }))
      .then((d) => { cache = d.tools as PublicTool[]; return cache; })
      .catch(() => { cache = []; return cache; });
  }
  return inflight;
}

export interface ToolAccess {
  loading: boolean;
  /** The tool exists in the catalog. */
  found: boolean;
  /** The current user may run this tool right now. */
  allowed: boolean;
  /** Plans that grant this tool (for the upgrade prompt). */
  planKeys: string[];
  isPremium: boolean;
}

/** Resolve whether the current user can use a given tool (by key). */
export function useToolAccess(toolKey: string): ToolAccess {
  const { user } = useAuth();
  const [tools, setTools] = useState<PublicTool[] | null>(cache);

  useEffect(() => {
    let cancelled = false;
    loadTools().then((t) => { if (!cancelled) setTools(t); });
    return () => { cancelled = true; };
  }, []);

  if (!tools) {
    return { loading: true, found: false, allowed: false, planKeys: [], isPremium: true };
  }

  const tool = tools.find((t) => t.key === toolKey);
  if (!tool) {
    return { loading: false, found: false, allowed: false, planKeys: [], isPremium: true };
  }

  const sub = (user?.subscription as unknown as SubscriptionView) ?? null;
  return {
    loading: false,
    found: true,
    allowed: canAccessTool(sub, tool),
    planKeys: tool.planKeys,
    isPremium: tool.isPremium,
  };
}
