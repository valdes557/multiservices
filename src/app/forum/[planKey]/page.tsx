'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Send, Image as ImageIcon, Mic, Square, Smile, Trash2, Lock,
  Lock as LockClosed, Unlock, Eraser, ArrowLeft, Loader2,
} from 'lucide-react';

interface Msg {
  id: string; userId: string; authorName: string;
  type: 'text' | 'image' | 'voice'; content: string; attachmentUrl: string;
  deleted: boolean; createdAt: string;
}

const EMOJIS = ['😀', '😂', '😍', '👍', '🙏', '🔥', '🎉', '❤️', '😎', '😢', '🤔', '👏', '✅', '🚀', '💡', '📌'];

export default function ForumChatPage() {
  const params = useParams();
  const planKey = String(params.planKey);
  const { user, token } = useAuth();
  const { locale } = useLocale();
  const fr = locale !== 'en';

  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState('');
  const [forumOpen, setForumOpen] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [denied, setDenied] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [recording, setRecording] = useState(false);

  const sinceRef = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const auth = useCallback(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const load = useCallback(async () => {
    if (!token) return;
    const url = `/api/forums/${planKey}/messages${sinceRef.current ? `?since=${encodeURIComponent(sinceRef.current)}` : ''}`;
    const res = await fetch(url, { headers: auth() });
    if (res.status === 403) { const d = await res.json(); setDenied(d.reason || 'forbidden'); return; }
    if (!res.ok) return;
    const d = await res.json();
    setDenied(null);
    setForumOpen(d.forumOpen);
    setIsAdmin(d.isAdmin);
    if (d.messages?.length) {
      sinceRef.current = d.messages[d.messages.length - 1].createdAt;
      setMsgs((prev) => {
        const ids = new Set(prev.map((m: Msg) => m.id));
        return [...prev, ...d.messages.filter((m: Msg) => !ids.has(m.id))];
      });
    }
  }, [planKey, token, auth]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const t = setInterval(load, 4000);
    return () => clearInterval(t);
  }, [load]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const send = async (payload: { type: 'text' | 'image' | 'voice'; content?: string; attachmentUrl?: string }) => {
    setSending(true);
    try {
      const res = await fetch(`/api/forums/${planKey}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...auth() },
        body: JSON.stringify(payload),
      });
      const d = await res.json();
      if (res.ok && d.message) {
        sinceRef.current = d.message.createdAt;
        setMsgs((prev) => [...prev, d.message]);
        setText('');
      } else if (!res.ok) {
        alert(d.error || 'Erreur');
      }
    } finally { setSending(false); }
  };

  const sendText = () => { if (text.trim()) send({ type: 'text', content: text.trim() }); };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2_500_000) { alert(fr ? 'Image trop volumineuse (max 2.5 Mo)' : 'Image too large (max 2.5MB)'); return; }
    const reader = new FileReader();
    reader.onload = () => send({ type: 'image', content: '', attachmentUrl: reader.result as string });
    reader.readAsDataURL(f);
    e.target.value = '';
  };

  const toggleRecord = async () => {
    if (recording) { recorderRef.current?.stop(); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (ev) => ev.data.size && chunksRef.current.push(ev.data);
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        if (blob.size > 2_500_000) { alert(fr ? 'Vocal trop long' : 'Voice too long'); return; }
        const reader = new FileReader();
        reader.onload = () => send({ type: 'voice', content: '', attachmentUrl: reader.result as string });
        reader.readAsDataURL(blob);
      };
      rec.start();
      recorderRef.current = rec;
      setRecording(true);
      rec.onstart = () => setRecording(true);
      rec.addEventListener('stop', () => setRecording(false));
    } catch {
      alert(fr ? 'Micro indisponible' : 'Microphone unavailable');
    }
  };

  const del = async (id: string) => {
    const res = await fetch(`/api/forums/${planKey}/messages/${id}`, { method: 'DELETE', headers: auth() });
    if (res.ok) setMsgs((prev) => prev.map((m) => (m.id === id ? { ...m, deleted: true, content: '', attachmentUrl: '' } : m)));
  };

  const adminAction = async (action: 'open' | 'close' | 'clear') => {
    const res = await fetch(`/api/admin/forums/${planKey}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json', ...auth() }, body: JSON.stringify({ action }),
    });
    if (res.ok) {
      if (action === 'open') setForumOpen(true);
      if (action === 'close') setForumOpen(false);
      if (action === 'clear') { setMsgs([]); sinceRef.current = null; }
    }
  };

  if (!user) {
    return <Locked title={fr ? 'Connexion requise' : 'Sign in required'} desc={fr ? 'Connectez-vous pour accéder au forum.' : 'Sign in to access the forum.'} cta={{ href: '/auth/login', label: fr ? 'Se connecter' : 'Sign in' }} />;
  }
  if (denied) {
    return <Locked
      title={fr ? 'Forum réservé aux membres' : 'Members-only forum'}
      desc={fr ? 'Vous devez avoir un abonnement actif (essai ou payé) à ce plan pour accéder au forum.' : 'You need an active (trial or paid) subscription to this plan to access the forum.'}
      cta={{ href: '/subscribe', label: fr ? 'Souscrire' : 'Subscribe' }} />;
  }

  return (
    <div className="py-6">
      <div className="container max-w-3xl">
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Link href="/forum"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button></Link>
            <h1 className="text-xl font-bold">{fr ? 'Forum' : 'Forum'} · {planKey}</h1>
            <Badge variant={forumOpen ? 'secondary' : 'destructive'}>{forumOpen ? (fr ? 'ouvert' : 'open') : (fr ? 'fermé' : 'closed')}</Badge>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              {forumOpen
                ? <Button size="sm" variant="outline" onClick={() => adminAction('close')}><LockClosed className="h-4 w-4 mr-1" /> {fr ? 'Fermer' : 'Close'}</Button>
                : <Button size="sm" variant="outline" onClick={() => adminAction('open')}><Unlock className="h-4 w-4 mr-1" /> {fr ? 'Ouvrir' : 'Open'}</Button>}
              <Button size="sm" variant="outline" className="text-red-600" onClick={() => { if (confirm(fr ? 'Vider le forum ?' : 'Clear forum?')) adminAction('clear'); }}>
                <Eraser className="h-4 w-4 mr-1" /> {fr ? 'Vider' : 'Clear'}
              </Button>
            </div>
          )}
        </div>

        <Card className="h-[60vh] overflow-y-auto p-4 space-y-3">
          {msgs.length === 0 && <p className="text-center text-sm text-muted-foreground py-10">{fr ? 'Aucun message. Lancez la discussion !' : 'No messages yet. Start the conversation!'}</p>}
          {msgs.map((m) => {
            const mine = m.userId === user.id;
            return (
              <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                <div className={`group max-w-[80%] rounded-2xl px-3 py-2 text-sm ${mine ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  {!mine && <div className="text-[11px] font-semibold opacity-70 mb-0.5">{m.authorName}</div>}
                  {m.deleted ? (
                    <em className="opacity-60">{fr ? 'message supprimé' : 'message deleted'}</em>
                  ) : m.type === 'image' ? (
                    <img src={m.attachmentUrl} alt="" className="rounded-lg max-h-60" />
                  ) : m.type === 'voice' ? (
                    <audio controls src={m.attachmentUrl} className="max-w-[220px]" />
                  ) : (
                    <span className="whitespace-pre-wrap break-words">{m.content}</span>
                  )}
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] opacity-60">{new Date(m.createdAt).toLocaleTimeString()}</span>
                    {!m.deleted && (isAdmin || mine) && (
                      <button onClick={() => del(m.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </Card>

        {/* Composer */}
        {forumOpen || isAdmin ? (
          <div className="mt-3">
            {showEmoji && (
              <div className="flex flex-wrap gap-1 p-2 mb-2 rounded-lg border bg-card">
                {EMOJIS.map((e) => (
                  <button key={e} className="text-xl hover:scale-125 transition-transform" onClick={() => setText((t) => t + e)}>{e}</button>
                ))}
              </div>
            )}
            <div className="flex items-end gap-2">
              <Button variant="outline" size="icon" onClick={() => setShowEmoji((s) => !s)}><Smile className="h-4 w-4" /></Button>
              <Button variant="outline" size="icon" onClick={() => fileRef.current?.click()}><ImageIcon className="h-4 w-4" /></Button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
              <Button variant={recording ? 'destructive' : 'outline'} size="icon" onClick={toggleRecord}>
                {recording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText(); } }}
                placeholder={fr ? 'Votre message…' : 'Your message…'}
                rows={1}
                className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[40px] max-h-32"
              />
              <Button size="icon" onClick={sendText} disabled={sending || !text.trim()}>
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            {recording && <p className="text-xs text-red-600 mt-1">● {fr ? 'Enregistrement… (cliquez sur ■ pour envoyer)' : 'Recording… (click ■ to send)'}</p>}
          </div>
        ) : (
          <div className="mt-3 rounded-lg border bg-muted/30 p-3 text-center text-sm text-muted-foreground">
            <Lock className="h-4 w-4 inline mr-1" /> {fr ? 'Le forum est fermé par l’administrateur.' : 'The forum is closed by the administrator.'}
          </div>
        )}
      </div>
    </div>
  );
}

function Locked({ title, desc, cta }: { title: string; desc: string; cta: { href: string; label: string } }) {
  return (
    <div className="py-16">
      <div className="container max-w-md">
        <Card className="text-center p-8">
          <Lock className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h1 className="text-xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground mb-6">{desc}</p>
          <Link href={cta.href}><Button>{cta.label}</Button></Link>
        </Card>
      </div>
    </div>
  );
}
