// Placeholder server synth: a plain subtractive voice (oscillator, resonant low-pass, envelope) that returns a WAV.
// It exists to prove the path from the page to a server and back. The real, private DSP belongs in a private repo
// with its own Vercel project; the page then only changes the address it calls (API_BASE in server.html).
const SR = 44100;
const num = (v, lo, hi, d) => { const x = parseFloat(v); return Number.isFinite(x) ? Math.min(hi, Math.max(lo, x)) : d; };

function render(p) {
  const n = Math.round((p.dur + p.release) * SR), out = new Float32Array(n), f0 = 440 * Math.pow(2, (p.note - 69) / 12), dt = f0 / SR;
  const wave = p.wave; let ph = 0, lp = 0, bp = 0;
  const blep = (t, d) => (t < d ? (t /= d, t + t - t * t - 1) : t > 1 - d ? (t = (t - 1) / d, t * t + t + t + 1) : 0);   // removes the sharp edge of a saw or square
  const q = 1 - p.res * .96;
  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let o;
    if (wave === "sine") o = Math.sin(2 * Math.PI * ph);
    else if (wave === "tri") o = 4 * Math.abs(ph - .5) - 1;
    else if (wave === "square") o = (ph < .5 ? 1 : -1) + blep(ph, dt) - blep((ph + .5) % 1, dt);
    else o = 2 * ph - 1 - blep(ph, dt);
    ph += dt; if (ph >= 1) ph -= 1;
    let a;   // amplitude envelope: attack, decay to the sustain level, hold, release
    if (t < p.dur) a = t < p.attack ? t / p.attack : p.sustain + (1 - p.sustain) * Math.exp(-(t - p.attack) / p.decay);
    else { const t0 = p.dur, a0 = t0 < p.attack ? t0 / p.attack : p.sustain + (1 - p.sustain) * Math.exp(-(t0 - p.attack) / p.decay); a = a0 * Math.max(0, 1 - (t - t0) / p.release); }
    const fc = Math.min(SR / 6, p.cutoff * Math.pow(2, p.env * 4 * Math.exp(-t / .25) * (1 - Math.exp(-t / .002)))), f = 2 * Math.sin(Math.PI * fc / SR);
    for (let k = 0; k < 2; k++) { lp += f * bp; const hp = o - lp - q * bp; bp += f * hp; }   // two passes a sample keep the filter stable
    out[i] = Math.tanh(lp * a * .9);
  }
  return out;
}

function wav(f) {
  const n = f.length, b = Buffer.alloc(44 + n * 2);
  b.write("RIFF", 0); b.writeUInt32LE(36 + n * 2, 4); b.write("WAVEfmt ", 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(SR, 24); b.writeUInt32LE(SR * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write("data", 36); b.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, f[i])) * 32767), 44 + i * 2);
  return b;
}

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") { res.statusCode = 204; res.end(); return; }
  const q = Object.fromEntries(new URL(req.url, "http://x").searchParams);
  const p = {   // every value is limited, so one request cannot ask for much work
    note: Math.round(num(q.note, 12, 108, 57)), dur: num(q.dur, .05, 4, 1), wave: ["saw", "square", "tri", "sine"].includes(q.wave) ? q.wave : "saw",
    cutoff: Math.round(num(q.cutoff, 40, 12000, 1200)), res: Math.round(num(q.res, 0, .95, .3) * 20) / 20, env: Math.round(num(q.env, 0, 1, .5) * 10) / 10,
    attack: num(q.attack, .002, 2, .005), decay: num(q.decay, .02, 3, .4), sustain: num(q.sustain, 0, 1, .6), release: num(q.release, .01, 3, .3)
  };
  const body = wav(render(p));
  res.setHeader("Content-Type", "audio/wav"); res.setHeader("Content-Length", body.length);
  res.setHeader("Cache-Control", "public, s-maxage=31536000, max-age=3600, immutable");   // the same settings always give the same sound, so the answer can be kept
  res.statusCode = 200; res.end(body);
};
