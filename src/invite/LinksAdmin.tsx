// Private helper page (open the site with ?links) to create a personal link for every guest.
import { useMemo, useState } from 'react';
import { COUPLE } from './config';
import { guestLink } from './guest';

const KEY = 'skw-guest-names';

export function LinksAdmin() {
  const [text, setText] = useState(() => {
    try {
      return localStorage.getItem(KEY) ?? '';
    } catch {
      return '';
    }
  });
  const [copied, setCopied] = useState<string | null>(null);
  const base = `${location.origin}/`;

  const names = useMemo(
    () =>
      [...new Set(text.split('\n').map((n) => n.replace(/\s+/g, ' ').trim()).filter(Boolean))].slice(0, 500),
    [text],
  );

  const save = (v: string) => {
    setText(v);
    try {
      localStorage.setItem(KEY, v);
    } catch {
      /* fine without saving */
    }
  };

  const message = (name: string) =>
    `Dear ${name},\n\nWith joy in our hearts, we invite you to celebrate the wedding of ${COUPLE.bride} & ${COUPLE.groom} 💌\n\nTap to open your invitation:\n${guestLink(base, name)}`;

  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      window.prompt('Copy this:', value);
    }
  };

  return (
    <main className="paper min-h-[100svh] px-5 py-10">
      <div className="mx-auto max-w-2xl">
        <p className="caps-label text-[#8c6a3a]">Private · only for you</p>
        <h1 className="mt-1 font-script text-5xl text-[#9c1f45]">Guest invitation links</h1>
        <p className="mt-3 font-serif text-[0.95rem] leading-relaxed text-[#5a4044]">
          Type one name per line, the way it should appear on the invitation (for example <i>Sharma Family</i> or <i>Riya &amp; Aman</i>). Each guest gets their own link: the invitation
          opens with “For {'{'}their name{'}'}” on the doors and “Dear {'{'}their name{'}'},” inside.
        </p>

        <textarea
          value={text}
          onChange={(e) => save(e.target.value)}
          rows={8}
          placeholder={'Sharma Family\nPatel Family\nRiya & Aman'}
          className="mt-5 w-full rounded-2xl border border-[#d8c3a2] bg-white/80 p-4 font-serif text-base text-[#3d2430] shadow-inner outline-none focus:border-[#b8893a]"
        />

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="font-sans text-sm text-[#7a6266]">{names.length} links</p>
          {names.length > 0 && (
            <button
              onClick={() => copy('all', names.map((n) => `${n}\t${guestLink(base, n)}`).join('\n'))}
              className="rounded-full bg-[#4a2230] px-4 py-2 font-sans text-xs font-medium text-white"
            >
              {copied === 'all' ? 'Copied ✓' : 'Copy all (for Excel / Sheets)'}
            </button>
          )}
        </div>

        <ul className="mt-5 space-y-3">
          {names.map((n) => {
            const link = guestLink(base, n);
            return (
              <li key={n} className="rounded-2xl border border-[#e6d3b4] bg-white/80 p-4 shadow-[0_10px_24px_-20px_rgba(90,50,30,0.6)]">
                <p className="font-script text-2xl text-[#9c1f45]">{n}</p>
                <p className="mt-1 font-sans text-xs break-all text-[#7a6266]">{link}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => copy(n, link)} className="rounded-full border border-[#b8893a] px-4 py-1.5 font-sans text-xs text-[#4a2230]">
                    {copied === n ? 'Copied ✓' : 'Copy link'}
                  </button>
                  <button onClick={() => copy(`${n}-msg`, message(n))} className="rounded-full border border-[#b8893a] px-4 py-1.5 font-sans text-xs text-[#4a2230]">
                    {copied === `${n}-msg` ? 'Copied ✓' : 'Copy message'}
                  </button>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(message(n))}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-[#25d366] px-4 py-1.5 font-sans text-xs font-medium text-white"
                  >
                    Send on WhatsApp
                  </a>
                  <a href={link} target="_blank" rel="noreferrer" className="rounded-full px-3 py-1.5 font-sans text-xs text-[#9c1f45] underline">
                    Preview
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
