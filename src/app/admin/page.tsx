'use client';

import React, { useState } from 'react';
import { useLocale } from '@/context/LocaleContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Shield, Users, CreditCard, Activity, Settings,
  ToggleLeft, ToggleRight, Plus,
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
}

export default function AdminPage() {
  const { t } = useLocale();
  const { user, isAdmin } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: '1', name: 'USDT (TRC20)', enabled: true },
    { id: '2', name: 'Binance Pay', enabled: true },
    { id: '3', name: 'Mobile Money', enabled: false },
    { id: '4', name: 'PayPal', enabled: false },
    { id: '5', name: 'Stripe', enabled: false },
  ]);
  const [newMethod, setNewMethod] = useState('');

  if (!user || !isAdmin()) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md text-center p-8">
          <Shield className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <CardTitle className="mb-2">Access Denied</CardTitle>
          <p className="text-muted-foreground">Admin access required.</p>
        </Card>
      </div>
    );
  }

  const togglePayment = (id: string) => {
    setPaymentMethods(prev =>
      prev.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m)
    );
  };

  const addPaymentMethod = () => {
    if (!newMethod.trim()) return;
    setPaymentMethods(prev => [
      ...prev,
      { id: Date.now().toString(), name: newMethod.trim(), enabled: false },
    ]);
    setNewMethod('');
  };

  const stats = [
    { label: 'Total Users', value: '1,247', icon: <Users className="h-5 w-5" />, color: 'text-blue-600 bg-blue-100' },
    { label: 'Premium Users', value: '342', icon: <CreditCard className="h-5 w-5" />, color: 'text-green-600 bg-green-100' },
    { label: 'Active Today', value: '89', icon: <Activity className="h-5 w-5" />, color: 'text-orange-600 bg-orange-100' },
    { label: 'Revenue (USD)', value: '$3,416', icon: <CreditCard className="h-5 w-5" />, color: 'text-purple-600 bg-purple-100' },
  ];

  return (
    <div className="py-8">
      <div className="container">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">{t('common.admin') as string}</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Methods Management */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <CardTitle>Payment Methods</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-6">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{method.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={method.enabled ? 'default' : 'secondary'}>
                      {method.enabled ? 'Active' : 'Disabled'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePayment(method.id)}
                    >
                      {method.enabled ? (
                        <ToggleRight className="h-5 w-5 text-primary" />
                      ) : (
                        <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="New payment method name..."
                value={newMethod}
                onChange={(e) => setNewMethod(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addPaymentMethod()}
              />
              <Button onClick={addPaymentMethod}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Management Placeholder */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle>Users Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <div className="grid grid-cols-5 gap-4 p-3 bg-muted/50 font-medium text-sm">
                <span>Name</span>
                <span>Email</span>
                <span>Plan</span>
                <span>Role</span>
                <span>Actions</span>
              </div>
              {[
                { name: 'John Doe', email: 'john@example.com', plan: 'premium', role: 'user' },
                { name: 'Jane Smith', email: 'jane@example.com', plan: 'free', role: 'user' },
                { name: 'Admin User', email: 'admin@multiservices.com', plan: 'premium', role: 'admin' },
              ].map((u, i) => (
                <div key={i} className="grid grid-cols-5 gap-4 p-3 border-t text-sm items-center">
                  <span className="font-medium">{u.name}</span>
                  <span className="text-muted-foreground truncate">{u.email}</span>
                  <Badge variant={u.plan === 'premium' ? 'default' : 'secondary'} className="w-fit">
                    {u.plan}
                  </Badge>
                  <Badge variant={u.role === 'admin' ? 'destructive' : 'outline'} className="w-fit">
                    {u.role}
                  </Badge>
                  <Button variant="ghost" size="sm">{t('common.edit') as string}</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
