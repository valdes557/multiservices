import crypto from 'crypto';
import type { ISettings } from '@/models/Settings';
import { activeSebPayKeys } from '@/lib/settings';

/**
 * Thin server-side client for the SebPay Collections API (Mobile Money).
 * Docs: https://new.sebpay.bj/fr/docs — base https://newapi.sebpay.bj/api/v1
 */

export interface CollectionInput {
  amount: number;
  currency: string;
  phone: string;
  operator: string;
  country: string;
  external_reference: string;
  callback_url?: string;
  otp_code?: string;
}

export interface CollectionResult {
  ok: boolean;
  status: string;
  transactionId?: string;
  providerLink?: string;
  message?: string;
  raw?: unknown;
}

/** Map any SebPay status string to our internal payment status. */
export function normalizeStatus(s: string | undefined): 'pending' | 'completed' | 'failed' {
  const v = (s || '').toLowerCase();
  if (v === 'approved' || v === 'success' || v === 'completed') return 'completed';
  if (v === 'rejected' || v === 'failed' || v === 'cancelled' || v === 'expired') return 'failed';
  return 'pending';
}

function headers(publicKey: string, secretKey: string) {
  return {
    'X-Public-Key': publicKey,
    'X-Secret-Key': secretKey,
    'Content-Type': 'application/json',
  };
}

/** Initiate a Mobile Money collection. Throws if keys are missing. */
export async function initiateCollection(settings: ISettings, input: CollectionInput): Promise<CollectionResult> {
  const { publicKey, secretKey, baseUrl } = activeSebPayKeys(settings);
  if (!publicKey || !secretKey) throw new Error('Clés de paiement SebPay non configurées');

  const res = await fetch(`${baseUrl}/collections`, {
    method: 'POST',
    headers: headers(publicKey, secretKey),
    body: JSON.stringify(input),
  });
  const json = await res.json().catch(() => ({}));
  const data = json?.data ?? json;
  if (!res.ok || json?.success === false) {
    return { ok: false, status: 'failed', message: json?.message || `Erreur SebPay (${res.status})`, raw: json };
  }
  return {
    ok: true,
    status: data?.status || 'pending',
    transactionId: data?.transaction_id,
    providerLink: data?.provider_link,
    message: data?.message || json?.message,
    raw: json,
  };
}

/** Check a collection's current status by SebPay id or our external reference. */
export async function getCollectionStatus(settings: ISettings, idOrRef: string): Promise<CollectionResult> {
  const { publicKey, secretKey, baseUrl } = activeSebPayKeys(settings);
  if (!publicKey || !secretKey) throw new Error('Clés de paiement SebPay non configurées');

  const res = await fetch(`${baseUrl}/collections/${encodeURIComponent(idOrRef)}`, {
    headers: headers(publicKey, secretKey),
  });
  const json = await res.json().catch(() => ({}));
  const data = json?.data ?? json;
  if (!res.ok) return { ok: false, status: 'pending', message: json?.message, raw: json };
  return {
    ok: true,
    status: data?.status || 'pending',
    transactionId: data?.transaction_id,
    message: data?.message,
    raw: json,
  };
}

/**
 * Verify the HMAC-SHA256 signature SebPay sends in `X-SebPay-Signature`.
 * Recomputed over the raw request body with the active secret key.
 */
export function verifyWebhookSignature(settings: ISettings, rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const { secretKey } = activeSebPayKeys(settings);
  if (!secretKey) return false;
  const expected = crypto.createHmac('sha256', secretKey).update(rawBody).digest('hex');
  try {
    const a = Buffer.from(expected);
    const b = Buffer.from(signature);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
