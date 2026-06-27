'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Shield, Users, Layers, Wrench, RefreshCw, Plus, Trash2, Save,
} from 'lucide-react';
import {
  adminFetch, type AdminPlan, type AdminTool, type AdminUser,
} from '@/lib/adminApi';

type Tab = 'plans' | 'tools' | 'users';

const STATUS_COLORS: Record<string, string> = {
  trial: 'bg-amber-100 text-amber-700',
  active: 'bg-green-100 text-green-700',
  expired: 'bg-gray-100 text-gray-600',
  disabled: 'bg-red-100 text-red-700',
  none: 'bg-slate-100 text-slate-500',
};

export default function AdminPage() {
  const { user, token, isAdmin } = useAuth();
  const [tab, setTab] = useState<Tab>('plans');
  const [plans, setPlans] = useState<AdminPlan[]>([]);
  const [tools, setTools] = useState<AdminTool[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!token) return;
    setError(null);
    try {
      const [p, t, u] = await Promise.all([
        adminFetch('/api/admin/plans', token),
        adminFetch('/api/admin/tools', token),
        adminFetch('/api/admin/users', token),
      ]);
      setPlans(p.plans);
      setTools(t.tools);
      setUsers(u.users);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try { await fn(); } catch (e) { setError((e as Error).message); } finally { setBusy(false); }
  };

  const seed = () => run(async () => {
    await adminFetch('/api/admin/seed', token, { method: 'POST' });
    await load();
  });

  if (!user || !isAdmin()) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md text-center p-8">
          <Shield className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <CardTitle className="mb-2">Accès refusé</CardTitle>
          <p className="text-muted-foreground">Accès administrateur requis.</p>
        </Card>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'plans', label: 'Plans', icon: <Layers className="h-4 w-4" /> },
    { id: 'tools', label: 'Outils', icon: <Wrench className="h-4 w-4" /> },
    { id: 'users', label: 'Utilisateurs', icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <div className="py-8">
      <div className="container">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Administration</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => run(load)} disabled={busy}>
              <RefreshCw className="h-4 w-4 mr-1" /> Rafraîchir
            </Button>
            <Button size="sm" onClick={seed} disabled={busy}>
              <Plus className="h-4 w-4 mr-1" /> Initialiser plans & outils
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b mb-6">
          {tabs.map((tb) => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === tb.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tb.icon}{tb.label}
            </button>
          ))}
        </div>

        {tab === 'plans' && <PlansPanel plans={plans} token={token} reload={load} setError={setError} />}
        {tab === 'tools' && <ToolsPanel tools={tools} plans={plans} token={token} reload={load} setError={setError} />}
        {tab === 'users' && <UsersPanel users={users} plans={plans} token={token} reload={load} setError={setError} />}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Plans */

function PlansPanel({ plans, token, reload, setError }: {
  plans: AdminPlan[]; token: string | null; reload: () => Promise<void>; setError: (s: string | null) => void;
}) {
  const [newKey, setNewKey] = useState('');
  const [newNameFr, setNewNameFr] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newTrial, setNewTrial] = useState('3');

  const create = async () => {
    setError(null);
    try {
      await adminFetch('/api/admin/plans', token, {
        method: 'POST',
        body: JSON.stringify({
          key: newKey,
          name: { fr: newNameFr || newKey, en: newNameFr || newKey },
          price: Number(newPrice) || 0,
          trialDays: Number(newTrial) || 0,
        }),
      });
      setNewKey(''); setNewNameFr(''); setNewPrice(''); setNewTrial('3');
      await reload();
    } catch (e) { setError((e as Error).message); }
  };

  return (
    <div className="space-y-4">
      {plans.map((p) => <PlanEditor key={p._id} plan={p} token={token} reload={reload} setError={setError} />)}

      <Card>
        <CardHeader><CardTitle className="text-base flex items-center gap-2"><Plus className="h-4 w-4" /> Nouveau plan</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <Input placeholder="clé (ex: premium-pro)" value={newKey} onChange={(e) => setNewKey(e.target.value)} />
            <Input placeholder="Nom (FR)" value={newNameFr} onChange={(e) => setNewNameFr(e.target.value)} />
            <Input placeholder="Prix (XOF)" type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
            <Input placeholder="Jours d'essai" type="number" value={newTrial} onChange={(e) => setNewTrial(e.target.value)} />
          </div>
          <Button className="mt-3" onClick={create} disabled={!newKey.trim()}>
            <Plus className="h-4 w-4 mr-1" /> Créer le plan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function PlanEditor({ plan, token, reload, setError }: {
  plan: AdminPlan; token: string | null; reload: () => Promise<void>; setError: (s: string | null) => void;
}) {
  const [nameFr, setNameFr] = useState(plan.name.fr);
  const [nameEn, setNameEn] = useState(plan.name.en);
  const [price, setPrice] = useState(String(plan.price));
  const [trialDays, setTrialDays] = useState(String(plan.trialDays));
  const [adsDuringTrial, setAdsDuringTrial] = useState(plan.adsDuringTrial);
  const [forumEnabled, setForumEnabled] = useState(plan.forumEnabled);
  const [active, setActive] = useState(plan.active);
  const [features, setFeatures] = useState(plan.features.map((f) => f.fr).join('\n'));

  const save = async () => {
    setError(null);
    try {
      await adminFetch(`/api/admin/plans/${plan._id}`, token, {
        method: 'PUT',
        body: JSON.stringify({
          name: { fr: nameFr, en: nameEn || nameFr },
          price: Number(price) || 0,
          trialDays: Number(trialDays) || 0,
          adsDuringTrial, forumEnabled, active,
          features: features.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => ({ fr: l, en: l })),
        }),
      });
      await reload();
    } catch (e) { setError((e as Error).message); }
  };

  const remove = async () => {
    if (!confirm(`Supprimer le plan "${plan.key}" ?`)) return;
    setError(null);
    try {
      await adminFetch(`/api/admin/plans/${plan._id}`, token, { method: 'DELETE' });
      await reload();
    } catch (e) { setError((e as Error).message); }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Badge variant="outline">{plan.key}</Badge>
            {plan.isSystem && <Badge variant="secondary">système</Badge>}
            {!active && <Badge className="bg-gray-200 text-gray-600">désactivé</Badge>}
          </CardTitle>
          <span className="text-sm text-muted-foreground">{plan.price} {plan.currency}/mois</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-xs text-muted-foreground">Nom (FR)<Input value={nameFr} onChange={(e) => setNameFr(e.target.value)} /></label>
          <label className="text-xs text-muted-foreground">Nom (EN)<Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} /></label>
          <label className="text-xs text-muted-foreground">Prix (XOF)<Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} /></label>
          <label className="text-xs text-muted-foreground">Jours d&apos;essai gratuit<Input type="number" value={trialDays} onChange={(e) => setTrialDays(e.target.value)} /></label>
        </div>
        <label className="text-xs text-muted-foreground block">
          Fonctionnalités (une par ligne)
          <textarea
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
          />
        </label>
        <div className="flex flex-wrap gap-4 text-sm">
          <Toggle label="Pubs pendant l'essai" checked={adsDuringTrial} onChange={setAdsDuringTrial} />
          <Toggle label="Forum activé" checked={forumEnabled} onChange={setForumEnabled} />
          <Toggle label="Actif" checked={active} onChange={setActive} />
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={save}><Save className="h-4 w-4 mr-1" /> Enregistrer</Button>
          {!plan.isSystem && (
            <Button size="sm" variant="outline" onClick={remove} className="text-red-600">
              <Trash2 className="h-4 w-4 mr-1" /> Supprimer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------------------------------------------------------------- Tools */

function ToolsPanel({ tools, plans, token, reload, setError }: {
  tools: AdminTool[]; plans: AdminPlan[]; token: string | null; reload: () => Promise<void>; setError: (s: string | null) => void;
}) {
  const planKeys = plans.map((p) => p.key);

  const togglePlan = async (tool: AdminTool, key: string) => {
    const next = tool.planKeys.includes(key)
      ? tool.planKeys.filter((k) => k !== key)
      : [...tool.planKeys, key];
    setError(null);
    try {
      await adminFetch(`/api/admin/tools/${tool._id}`, token, { method: 'PUT', body: JSON.stringify({ planKeys: next }) });
      await reload();
    } catch (e) { setError((e as Error).message); }
  };

  const patch = async (tool: AdminTool, body: object) => {
    setError(null);
    try {
      await adminFetch(`/api/admin/tools/${tool._id}`, token, { method: 'PUT', body: JSON.stringify(body) });
      await reload();
    } catch (e) { setError((e as Error).message); }
  };

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Attribution des outils aux plans</CardTitle></CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-muted-foreground border-b">
              <th className="py-2 pr-4">Outil</th>
              <th className="py-2 pr-4">Catégorie</th>
              {planKeys.map((k) => <th key={k} className="py-2 px-2 text-center">{k}</th>)}
              <th className="py-2 px-2 text-center">Premium</th>
              <th className="py-2 px-2 text-center">Actif</th>
            </tr>
          </thead>
          <tbody>
            {tools.map((tool) => (
              <tr key={tool._id} className="border-b last:border-0">
                <td className="py-2 pr-4 font-medium">{tool.name.fr || tool.key}</td>
                <td className="py-2 pr-4 text-muted-foreground">{tool.category}</td>
                {planKeys.map((k) => (
                  <td key={k} className="py-2 px-2 text-center">
                    <input type="checkbox" checked={tool.planKeys.includes(k)} onChange={() => togglePlan(tool, k)} />
                  </td>
                ))}
                <td className="py-2 px-2 text-center">
                  <input type="checkbox" checked={tool.isPremium} onChange={() => patch(tool, { isPremium: !tool.isPremium })} />
                </td>
                <td className="py-2 px-2 text-center">
                  <input type="checkbox" checked={tool.active} onChange={() => patch(tool, { active: !tool.active })} />
                </td>
              </tr>
            ))}
            {tools.length === 0 && (
              <tr><td colSpan={planKeys.length + 4} className="py-6 text-center text-muted-foreground">
                Aucun outil. Cliquez sur « Initialiser plans & outils ».
              </td></tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

/* ---------------------------------------------------------------- Users */

function UsersPanel({ users, plans, token, reload, setError }: {
  users: AdminUser[]; plans: AdminPlan[]; token: string | null; reload: () => Promise<void>; setError: (s: string | null) => void;
}) {
  const act = async (u: AdminUser, body: object) => {
    setError(null);
    try {
      await adminFetch(`/api/admin/users/${u.id}`, token, { method: 'PATCH', body: JSON.stringify(body) });
      await reload();
    } catch (e) { setError((e as Error).message); }
  };

  return (
    <div className="space-y-3">
      {users.map((u) => (
        <Card key={u.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <div className="font-medium">{u.name} {u.role === 'admin' && <Badge variant="destructive" className="ml-1">admin</Badge>}</div>
                <div className="text-sm text-muted-foreground">{u.email}</div>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <Badge className={STATUS_COLORS[u.effectiveStatus] || ''}>{u.effectiveStatus}</Badge>
                  <span className="text-muted-foreground">plan: {u.subscription.planKey || '—'}</span>
                  {u.subscription.adsEnabled && <Badge variant="outline">pubs ON</Badge>}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <select
                  className="rounded-md border border-input bg-background px-2 py-1 text-sm"
                  value={u.subscription.planKey || ''}
                  onChange={(e) => e.target.value && act(u, { action: 'assignPlan', planKey: e.target.value })}
                >
                  <option value="">— Assigner un plan —</option>
                  {plans.map((p) => <option key={p.key} value={p.key}>{p.name.fr}</option>)}
                </select>
                <Button size="sm" onClick={() => act(u, { action: 'activateMonthly', months: 1 })}>
                  Activer mensuel (bloque pubs)
                </Button>
                {u.subscription.disabledByAdmin ? (
                  <Button size="sm" variant="outline" onClick={() => act(u, { action: 'enablePlan' })}>Réactiver</Button>
                ) : (
                  <Button size="sm" variant="outline" className="text-red-600" onClick={() => act(u, { action: 'disablePlan' })}>Désactiver</Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => act(u, { action: 'setAds', adsEnabled: !u.subscription.adsEnabled })}>
                  {u.subscription.adsEnabled ? 'Couper pubs' : 'Activer pubs'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      {users.length === 0 && <p className="text-muted-foreground text-sm">Aucun utilisateur.</p>}
    </div>
  );
}

/* ---------------------------------------------------------------- shared */

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}
