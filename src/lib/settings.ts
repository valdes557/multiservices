import Settings, { type ISettings } from '@/models/Settings';

/** Fetch the global settings doc, creating it with defaults on first access. */
export async function getSettings(): Promise<ISettings> {
  let s = await Settings.findOne({ key: 'global' });
  if (!s) s = await Settings.create({ key: 'global' });
  return s;
}

/** Non-sensitive flags safe to expose to any client. */
export function publicSettings(s: ISettings) {
  return {
    adsenseApproved: s.adsenseApproved,
    adsenseClientId: s.adsenseClientId,
    adsenseSlotTrial: s.adsenseSlotTrial,
    payment: {
      mode: s.sebpay.mode,
      country: s.sebpay.country,
      operators: s.sebpay.operators,
      // True when the keys for the active mode are present (so the UI can offer payment).
      configured:
        s.sebpay.mode === 'live'
          ? !!(s.sebpay.publicKeyLive && s.sebpay.secretKeyLive)
          : !!(s.sebpay.publicKeyTest && s.sebpay.secretKeyTest),
    },
  };
}

/** Admin view — secrets are masked (never returned in clear). */
export function adminSettings(s: ISettings) {
  const mask = (v: string) => (v ? `••••${v.slice(-4)}` : '');
  return {
    adsenseApproved: s.adsenseApproved,
    adsenseClientId: s.adsenseClientId,
    adsenseSlotTrial: s.adsenseSlotTrial,
    sebpay: {
      mode: s.sebpay.mode,
      baseUrl: s.sebpay.baseUrl,
      country: s.sebpay.country,
      operators: s.sebpay.operators,
      publicKeyTest: s.sebpay.publicKeyTest,
      publicKeyLive: s.sebpay.publicKeyLive,
      // Secrets masked + a boolean telling whether they are set.
      secretKeyTest: mask(s.sebpay.secretKeyTest),
      secretKeyLive: mask(s.sebpay.secretKeyLive),
      hasSecretTest: !!s.sebpay.secretKeyTest,
      hasSecretLive: !!s.sebpay.secretKeyLive,
    },
  };
}

/** Resolve the active SebPay credentials based on the configured mode. */
export function activeSebPayKeys(s: ISettings): { publicKey: string; secretKey: string; baseUrl: string } {
  const live = s.sebpay.mode === 'live';
  return {
    publicKey: live ? s.sebpay.publicKeyLive : s.sebpay.publicKeyTest,
    secretKey: live ? s.sebpay.secretKeyLive : s.sebpay.secretKeyTest,
    baseUrl: s.sebpay.baseUrl || 'https://newapi.sebpay.bj/api/v1',
  };
}
