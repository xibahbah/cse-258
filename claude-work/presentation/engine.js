"use strict";
/* CASE 258: THE MISSING GAME. Engine.
   Every scene is painted pixel by pixel into a buffer (flat colour, hard edges, no dithering, no anti-aliasing),
   then a live layer animates on top. Text is a baked bitmap font, so it is the same on every machine. */
const TEAM = "DIANA, KEITH, SHIRLEY";                       // <- put the team's names here
const W = 640, VH = 360, SH = 296;
const cv = document.getElementById("cv"), c = cv.getContext("2d"); c.imageSmoothingEnabled = false;
function fit() { const s = Math.min(innerWidth / W, innerHeight / VH); cv.style.width = W * s + "px"; cv.style.height = VH * s + "px" } addEventListener("resize", fit); fit();

/* ---------- palette: dark deco ---------- */
const K = "#000000", N1 = "#0b0626", N2 = "#170b4a", V1 = "#2a1478", V2 = "#4a1fa8", V3 = "#7a2fc4", M1 = "#a8309e", M2 = "#d43c8a", M3 = "#f25c7e", C1 = "#ff8a6a", C2 = "#ffb86a",
  Y1 = "#ffd23e", Y2 = "#fff0b8", O1 = "#ff8a1f", O2 = "#c2451c", R1 = "#e02a2a", R2 = "#4a0c1c", R3 = "#7a1f24", B1 = "#3d5cff", B2 = "#9fdcff", FA = "#8a3a9c", FB = "#3c1a72", IN = "#120a38", DM = "#6b3a10",
  G1 = "#1f8a6a", G2 = "#5fe0a0", G0 = "#0c3a34", T1 = "#1b6f8a", GR = "#6b5a8c", GL = "#b9a8dc", INK = "#07031a", WINE = "#2e0712";
const HC = new Map(), H = h => { let v = HC.get(h); if (v === undefined) { const n = parseInt(h.slice(1), 16); v = (0xff000000 | ((n & 255) << 16) | (n & 0xff00) | (n >>> 16)) >>> 0; HC.set(h, v) } return v };
let sd = 7; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647, seed = s => { sd = s };
const hs = (a, b) => { const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return n - Math.floor(n) };
const cl = (v, a, b) => v < a ? a : v > b ? b : v, lerp = (a, b, t) => a + (b - a) * t, ez = t => t * t * (3 - 2 * t);
const fmt = n => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

/* ---------- pixel buffer ---------- */
class Buf {
  constructor(w, h) { this.w = w; this.h = h; this.d = new Uint32Array(w * h) }
  rect(x, y, w, h, col) { const cc = H(col), d = this.d, Wd = this.w; x = Math.round(x); y = Math.round(y); w = Math.round(w); h = Math.round(h);
    const x1 = Math.min(Wd, x + w), y1 = Math.min(this.h, y + h); for (let j = Math.max(0, y); j < y1; j++) for (let i = Math.max(0, x); i < x1; i++) d[j * Wd + i] = cc; return this }
  poly(pts, col, fn) { const cc = col ? H(col) : 0, d = this.d, Wd = this.w; let y0 = 1e9, y1 = -1e9; for (const p of pts) { y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]) }
    y0 = Math.max(0, Math.ceil(y0 - .5)); y1 = Math.min(this.h - 1, Math.floor(y1 - .5));
    for (let y = y0; y <= y1; y++) { const sy = y + .5, xs = []; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; if ((a[1] <= sy && b[1] > sy) || (b[1] <= sy && a[1] > sy)) xs.push(a[0] + (sy - a[1]) / (b[1] - a[1]) * (b[0] - a[0])) }
      xs.sort((p, q) => p - q); for (let k = 0; k + 1 < xs.length; k += 2) { const xa = Math.max(0, Math.ceil(xs[k] - .5)), xb = Math.min(Wd - 1, Math.floor(xs[k + 1] - .5)); for (let x = xa; x <= xb; x++) { const i = y * Wd + x; fn ? fn(i, d) : d[i] = cc } } } return this }
  disc(cx, cy, r, col, fn, r0) { const cc = col ? H(col) : 0, d = this.d, Wd = this.w; for (let y = Math.max(0, cy - r | 0); y <= Math.min(this.h - 1, cy + r); y++) for (let x = Math.max(0, cx - r | 0); x <= Math.min(Wd - 1, cx + r); x++) { const q = (x - cx) ** 2 + (y - cy) ** 2; if (q <= r * r && (!r0 || q >= r0 * r0)) { const i = y * Wd + x; fn ? fn(i, d) : d[i] = cc } } return this }
  line(x0, y0, x1, y1, col, th) { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) | 0; th = th || 1; for (let i = 0; i <= n; i++) { const t = n ? i / n : 0; this.rect(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, th, th, col) } return this }
  text(s, x, y, col, o) { o = o || {}; s = String(s); const f = FONT[o.f || "P"], sc = o.s || 1; const wd = tw(s, o.f, sc); if (o.al === "c") x -= wd >> 1; else if (o.al === "r") x -= wd; x = Math.round(x); y = Math.round(y);
    for (let n = 0; n < s.length; n++) { const g = f.g[s.charCodeAt(n)] || f.g[63]; for (let r = 0; r < f.h; r++) { const bits = g[1][r]; if (!bits) continue; for (let q = 0; q < f.w; q++) if (bits >> q & 1) this.rect(x + q * sc, y + r * sc, sc, sc, col) } x += g[0] * sc } return this }
  swap(x, y, w, h, m) { const d = this.d; for (let j = Math.max(0, y); j < Math.min(this.h, y + h); j++) for (let i = Math.max(0, x); i < Math.min(this.w, x + w); i++) { const v = m.get(d[j * this.w + i]); if (v !== undefined) d[j * this.w + i] = v } return this }
  canvas() { const cn = document.createElement("canvas"); cn.width = this.w; cn.height = this.h; cn.getContext("2d").putImageData(new ImageData(new Uint8ClampedArray(this.d.buffer), this.w, this.h), 0, 0); return cn }
}
const cmap = pairs => new Map(pairs.map(p => [H(p[0]), H(p[1])]));

/* ---------- live drawing ---------- */
const R = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)) };
const ATL = new Map();
function atlas(fk, col) { const key = fk + col; let a = ATL.get(key); if (a) return a; const f = FONT[fk]; a = document.createElement("canvas"); a.width = 95 * f.w; a.height = f.h; const x = a.getContext("2d"); x.fillStyle = col;
  for (let ch = 32; ch < 127; ch++) { const g = f.g[ch]; for (let r = 0; r < f.h; r++) for (let q = 0; q < f.w; q++) if (g[1][r] >> q & 1) x.fillRect((ch - 32) * f.w + q, r, 1, 1) } ATL.set(key, a); return a }
function tw(s, fk, sc) { const f = FONT[fk || "P"]; let n = 0; s = String(s); for (let i = 0; i < s.length; i++) n += (f.g[s.charCodeAt(i)] || f.g[63])[0]; return n * (sc || 1) }
function run(a, f, s, x, y, sc) { for (let i = 0; i < s.length; i++) { let ch = s.charCodeAt(i); if (!f.g[ch]) ch = 63; c.drawImage(a, (ch - 32) * f.w, 0, f.w, f.h, x, y, f.w * sc, f.h * sc); x += f.g[ch][0] * sc } }
function tx(s, x, y, col, o) { o = o || {}; s = String(s); const fk = o.f || "P", f = FONT[fk], sc = o.s || 1; if (o.al === "c") x -= tw(s, fk, sc) / 2; else if (o.al === "r") x -= tw(s, fk, sc); x = Math.round(x); y = Math.round(y);
  if (o.ol) { const a = atlas(fk, o.ol === true ? K : o.ol); for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) run(a, f, s, x + dx * sc, y + dy * sc, sc) }
  if (o.sh) run(atlas(fk, o.sh === true ? K : o.sh), f, s, x + sc, y + sc, sc);
  run(atlas(fk, col), f, s, x, y, sc) }
/* a small placard: black box, thin border, one or more lines */
function plate(lines, x, y, col, o) { o = o || {}; if (!Array.isArray(lines)) lines = [lines]; const fk = o.f || "P", f = FONT[fk], sc = o.s || 1, lh = (f.h + 3) * sc; let wd = 0; for (const l of lines) wd = Math.max(wd, tw(l, fk, sc));
  const bw = wd + 9, bh = lines.length * lh + 5; if (o.al === "c") x -= bw >> 1; else if (o.al === "r") x -= bw; x = Math.round(x); y = Math.round(y); const bd = o.bd || col;
  R(x, y, bw, bh, o.bg || K); R(x, y, bw, 1, bd); R(x, y + bh - 1, bw, 1, bd); R(x, y, 1, bh, bd); R(x + bw - 1, y, 1, bh, bd);
  lines.forEach((l, i) => tx(l, x + 5, y + 4 + i * lh, (o.cols && o.cols[i]) || col, { f: fk, s: sc })); return [bw, bh] }
function box(x, y, w, h, bg, bd) { R(x, y, w, h, bg); R(x, y, w, 1, bd); R(x, y + h - 1, w, 1, bd); R(x, y, 1, h, bd); R(x + w - 1, y, 1, h, bd) }
/* hard-edged circle / ring on the live layer */
function circ(cx, cy, r, col, r0) { c.fillStyle = col; for (let y = -r; y <= r; y++) { const dx = Math.sqrt(r * r - y * y) | 0; if (r0 && Math.abs(y) < r0) { const d0 = Math.sqrt(r0 * r0 - y * y) | 0; c.fillRect(cx - dx, cy + y, dx - d0, 1); c.fillRect(cx + d0 + 1, cy + y, dx - d0, 1) } else c.fillRect(cx - dx, cy + y, 2 * dx + 1, 1) } }
function seg(x0, y0, x1, y1, col, th) { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) | 0; th = th || 1; c.fillStyle = col; for (let i = 0; i <= n; i++) { const t = n ? i / n : 0; c.fillRect(Math.round(x0 + (x1 - x0) * t), Math.round(y0 + (y1 - y0) * t), th, th) } }
/* scanline polygon on the live layer (no anti-aliasing) */
function lpoly(pts, col, y0c, y1c) { let y0 = 1e9, y1 = -1e9; for (const p of pts) { y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]) } y0 = Math.max(y0c === undefined ? -999 : y0c, Math.ceil(y0 - .5)); y1 = Math.min(y1c === undefined ? 999 : y1c, Math.floor(y1 - .5)); c.fillStyle = col;
  for (let y = y0; y <= y1; y++) { const sy = y + .5, xs = []; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; if ((a[1] <= sy && b[1] > sy) || (b[1] <= sy && a[1] > sy)) xs.push(a[0] + (sy - a[1]) / (b[1] - a[1]) * (b[0] - a[0])) }
    xs.sort((p, q) => p - q); for (let k = 0; k + 1 < xs.length; k += 2) { const xa = Math.ceil(xs[k] - .5), xb = Math.floor(xs[k + 1] - .5); if (xb >= xa) c.fillRect(xa, y, xb - xa + 1, 1) } } }

/* ---------- the detective: a rim-lit silhouette, seen from behind or from the side ---------- */
const FIGB = [[-10, -3, 9, 3], [1, -3, 9, 3], [-8, -23, 6, 21], [2, -23, 6, 21], [-18, -56, 5, 26], [13, -56, 5, 26], [-8, -62, 16, 5], [-5, -70, 10, 9], [-11, -71, 22, 2], [-7, -77, 14, 6]];
for (let y = -58; y < -20; y += 2) { const hw = 14 + (y + 58) / 38 * 3.5 | 0; FIGB.push([-hw, y, hw * 2, 2]) }
const FIGS = [[-7, -3, 9, 3], [1, -3, 10, 3], [-6, -23, 6, 21], [1, -23, 6, 21], [-6, -63, 13, 6], [5, -65, 3, 5], [-4, -71, 10, 9], [6, -67, 2, 2], [-9, -72, 24, 2], [-6, -78, 13, 6]];
for (let y = -58; y < -20; y += 2) { const t = (y + 58) / 38; FIGS.push([-9 - (t * 3 | 0), y, 18 + (t * 4.5 | 0), 2]) }
function figure(x, y, o) { o = o || {}; const s = o.s || .62, side = o.pose === "s", dir = o.dir || 1, ph = o.ph || 0, L = side ? FIGS : FIGB, rim = o.rim || O1, T = o.T || 0;
  const bob = ph ? (ph % 2 ? 0 : -1) : (Math.sin(T * 1.7) > .86 ? -1 : 0);
  for (const pass of [1, 0]) L.forEach((r, i) => { let dx = 0, dy = i > 3 ? bob : 0;
    if (side) { if (ph) { const st = [5, 0, -5, 0][ph - 1]; if (i === 0 || i === 2) dx = -st; if (i === 1 || i === 3) dx = st; if ((i === 0 || i === 2) && ph === 2) dy = -2; if ((i === 1 || i === 3) && ph === 4) dy = -2 }
      if (i >= L.length - 3) dx += ph ? -1 : (Math.sin(T * 2.3 + i) > .5 ? -1 : 0) }
    else if (ph) { if ((ph % 2 === 1) && (i === 0 || i === 2)) dy = -2; if ((ph % 2 === 0) && (i === 1 || i === 3)) dy = -2 }
    const xa = Math.round((r[0] + dx) * s), xb = Math.round((r[0] + dx + r[2]) * s), ya = Math.round((r[1] + dy) * s), yb = Math.round((r[1] + dy + r[3]) * s);
    const px = dir > 0 ? x + xa : x - xb; c.fillStyle = pass ? rim : (o.body || K); c.fillRect(px - pass, y + ya - pass, Math.max(1, xb - xa) + 2 * pass, Math.max(1, yb - ya) + 2 * pass) }) }

/* ---------- scenes ---------- */
const SCENES = [];
function ensure(sc) { if (!sc._l) { seed(sc.seed || 7); const L = sc.paint(); sc._l = (Array.isArray(L) ? L : [{ b: L }]).map(l => ({ cv: l.b.canvas(), p: l.p === undefined ? 1 : l.p, f: !!l.f })) } }
const posOf = (sc, b) => { let x = sc.start.x, y = sc.start.y, s = sc.start.s || .62, pose = sc.start.pose || "s", cam; for (let i = 0; i <= b; i++) { const bt = sc.beats[i]; if (!bt) break; if (bt.x !== undefined) x = bt.x; if (bt.y !== undefined) y = bt.y; if (bt.s !== undefined) s = bt.s; if (bt.pose) pose = bt.pose; cam = bt.cam } return { x, y, s, pose, cam } };
const camOf = (sc, p) => cl(Math.round(p.cam !== undefined ? p.cam : p.x - 320), 0, sc.w - W);
function drawScene(si, b, tb, T, ex) { const sc = SCENES[si]; ensure(sc); const nb = sc.beats.length; b = cl(b, 0, nb - 1);
  let p0 = b > 0 ? posOf(sc, b - 1) : Object.assign({}, sc.start, { s: sc.start.s || .62, pose: sc.start.pose || "s" }), p1 = posOf(sc, b), tt = tb;
  if (ex) { p0 = p1; p1 = Object.assign({}, p1, sc.exit || {}); tt = ex.t }
  const dist = Math.hypot(p1.x - p0.x, (p1.y - p0.y) * 2), wt = dist / (sc.speed || 110), k = wt > 0 ? cl(tt / wt, 0, 1) : 1, walking = k < 1 && dist > 1;
  const fx = lerp(p0.x, p1.x, k), fy = lerp(p0.y, p1.y, k), fs = lerp(p0.s, p1.s, k), arr = Math.max(0, tt - wt);
  const c0 = camOf(sc, p0), c1 = camOf(sc, p1); let cam = (p1.cam !== undefined || p0.cam !== undefined) ? Math.round(lerp(c0, c1, ez(cl(tt / .9, 0, 1)))) : cl(Math.round(fx - 320), 0, sc.w - W);
  const st = { b, tb, T, cam, fx, fy, walking, arr: ex ? 99 : arr, ex: !!ex, A: (kk, dur, del) => b < kk ? 0 : b > kk || ex ? 1 : cl((arr - (del || 0)) / (dur || .6), 0, 1), at: kk => b >= kk, on: kk => b === kk && !ex };
  c.save(); c.beginPath(); c.rect(0, 0, W, SH); c.clip();
  sc._l.forEach((l, i) => { if (l.f) return; c.drawImage(l.cv, -Math.round(cam * l.p), 0); if (i === 0 && sc.back) { c.save(); c.translate(-Math.round(cam * l.p), 0); sc.back(st); c.restore() } });
  c.save(); c.translate(-cam, 0); if (sc.live) sc.live(st);
  const bt = sc.beats[b]; if (sc.fig !== false && !(bt.hide && !walking && !ex)) { const dir = walking ? (p1.x >= p0.x ? 1 : -1) : (bt.dir || p1.dir || 1), pose = walking ? (Math.abs(p1.x - p0.x) < 6 ? "b" : "s") : p1.pose;
    figure(Math.round(fx), Math.round(fy), { s: fs, pose, dir, ph: walking ? 1 + ((tt * 7 | 0) % 4) : 0, rim: sc.rim, T }) }
  if (sc.fore) sc.fore(st); c.restore(); sc._l.forEach(l => { if (l.f) c.drawImage(l.cv, -Math.round(cam * l.p), 0) });
  if (!ex) { const f1 = bt.foc, f0 = b > 0 ? sc.beats[b - 1].foc : null, k = ez(cl((tb - (f0 ? 0 : Math.min(wt, 1.2))) / .5, 0, 1)); if (f1 || f0) { const f = f1 && f0 ? f1.map((v, i) => lerp(f0[i], v, k)) : (f1 || f0); spot([Math.round(f[0] - cam), Math.round(f[1]), f[2], f[3]], f1 && f0 ? 1 : f1 ? k : 1 - k) } }
  if (si > 0) tx((/^\d+$/.test(sc.floor) ? sc.floor + " " : "") + sc.name, 6, 2, GL, { ol: true });
  if (sc.over) sc.over(st);
  if (bt.card && !ex) { const prev = b > 0 && sc.beats[b - 1].card === bt.card; drawCard(sc.cards[bt.card], bt.hl, prev ? 1 : cl(tb / .25, 0, 1), bt.note) }
  if (bt.clue && !ex) clueBanner(sc, cl((arr - (bt.clueDelay || 0)) / .35, 0, 1));
  c.restore(); return st }

/* ---------- spotlight: everything outside the beat's subject drops back, in two flat steps ---------- */
function spot(f, a) { if (a <= 0) return; const [cx, cy, rx, ry] = f, RX = rx * 1.16, RY = ry * 1.16; c.fillStyle = K;
  c.globalAlpha = .62 * a; for (let y = 0; y < SH; y++) { const t = (y + .5 - cy) / RY; if (Math.abs(t) >= 1) c.fillRect(0, y, W, 1); else { const dx = Math.round(RX * Math.sqrt(1 - t * t)); c.fillRect(0, y, Math.max(0, cx - dx), 1); c.fillRect(cx + dx, y, W, 1) } }
  c.globalAlpha = .3 * a; for (let y = 0; y < SH; y++) { const t = (y + .5 - cy) / RY; if (Math.abs(t) >= 1) continue; const dx = Math.round(RX * Math.sqrt(1 - t * t)), u = (y + .5 - cy) / ry, d2 = Math.abs(u) < 1 ? Math.round(rx * Math.sqrt(1 - u * u)) : 0;
    if (!d2) c.fillRect(cx - dx, y, 2 * dx, 1); else { c.fillRect(cx - dx, y, dx - d2, 1); c.fillRect(cx + d2, y, dx - d2, 1) } } c.globalAlpha = 1 }
/* ---------- evidence card: real notebook code ---------- */
function drawCard(cd, hl, k, note) { const n = cd.lines.length, lh = 11, ch = n * lh + 36 + (note ? 16 : 0), cw = 620, x = 10, y = Math.max(4, (SH - ch) / 2 | 0) + Math.round((1 - k) * 14);
  c.globalAlpha = .8 * k; R(0, 0, W, SH, K); c.globalAlpha = 1; if (k < .5) return;
  box(x, y, cw, ch, INK, Y1); R(x + 2, y + 2, cw - 4, 1, DM); R(x + 2, y + ch - 3, cw - 4, 1, DM); R(x + 1, y + 1, cw - 2, 15, WINE); R(x + 1, y + 16, cw - 2, 1, Y1);
  tx("EVIDENCE", x + 8, y + 5, O1); tx(cd.title, x + 82, y + 5, Y2); tx(cd.ref, x + cw - 8, y + 5, O1, { al: "r" });
  cd.lines.forEach((l, i) => { const yy = y + 24 + i * lh, on = hl && hl.includes(i); if (on) { R(x + 3, yy - 2, cw - 6, lh, "#3a1030"); R(x + 3, yy - 2, 3, lh, Y1) }
    const ni = l.indexOf("@@"), nt = ni >= 0 ? l.slice(ni + 2) : ""; if (ni >= 0) l = l.slice(0, ni);
    const ci = l.indexOf("#"), code = ci >= 0 ? l.slice(0, ci) : l, col = on ? Y2 : (hl && hl.length ? "#9b8cc4" : GL); tx(code, x + 12, yy, col); if (ci >= 0) tx(l.slice(ci), x + 12 + ci * 8, yy, on ? C2 : V3);
    if (nt && (!hl || on)) { tx(nt, x + cw - 10, yy, O1, { al: "r" }); tx("<", x + cw - 22 - tw(nt), yy, O2) } });
  if (note) tx(note, x + 12, y + ch - 16, G2) }
function clueBanner(sc, k) { if (k <= 0) return; const s = "CLUE " + String(sc.clue).padStart(2, "0") + ": " + sc.clueText, bw = tw(s) + 34, x = (W - bw) >> 1, y = sc.clueY === "b" ? Math.round(SH + 2 - 26 * ez(k)) : Math.round(-22 + 28 * ez(k));
  box(x, y, bw, 19, K, Y1); R(x + 2, y + 2, bw - 4, 1, DM); R(x + 2, y + 16, bw - 4, 1, DM); R(x + 7, y + 6, 7, 7, Y1); R(x + 9, y + 8, 3, 3, K); tx(s, x + 22, y + 6, Y2) }

/* ---------- the panel under the picture ---------- */
const NCL = 10;
function hud(si, b, tb, T, quiet) { const sc = SCENES[si], bt = sc.beats[cl(b, 0, sc.beats.length - 1)]; R(0, SH, W, 64, K); R(0, SH, W, 1, Y1); R(0, SH + 3, W, 1, DM);
  const sec = (!quiet && bt.sec) || sc.sec; if (sec) { const w = tw(sec, "P", 2) + 10; R(10, SH + 7, w, 18, Y1); tx(sec, 16, SH + 8, K, { s: 2 }) }
  let have = 0; for (let i = 0; i < SCENES.length; i++) { const s = SCENES[i]; if (!s.clue) continue; const cb = s.beats.findIndex(q => q.clue); if (i < si || (i === si && b >= cb && cb >= 0)) have = Math.max(have, s.clue) }
  for (let i = 0; i < NCL; i++) { const x = W - 10 - (NCL - i) * 12; R(x, SH + 11, 10, 10, i < have ? Y1 : DM); R(x + 1, SH + 12, 8, 8, i < have ? O1 : K); if (i < have) R(x + 3, SH + 14, 4, 4, Y2) }
  tx("CLUES", W - 10 - NCL * 12 - 6, SH + 12, GR, { al: "r" });
  if (quiet) return; const say = bt.say || []; let left = Math.floor(tb * 46);
  say.forEach((l, i) => { const n = Math.min(l.length, Math.max(0, left)); left -= l.length; if (n > 0) { if (i === 0) tx(l.slice(0, n), 12, SH + 29, Y2, { s: 2 }); else tx(l.slice(0, n), 12, SH + 49, Y2) } });
  { let n = b + 1, tot = 0; SCENES.forEach((s, i) => { if (i < si) n += s.beats.length; tot += s.beats.length }); const sx = sec ? 10 + tw(sec, "P", 2) + 10 + 10 : 12; tx(n + "/" + tot, sx, SH + 12, O1) }
  if (sc.panel) sc.panel(b, tb, T); else if (left >= 0 && (T * 2 | 0) % 2) tx(">", W - 18, SH + 34, O1) }

/* ---------- wipes ---------- */
function iris(cx, cy, k) { const r = (1 - k) * 440; c.fillStyle = K; for (let y = 0; y < SH; y++) { const dy = y - cy, dx = Math.abs(dy) < r ? Math.sqrt(r * r - dy * dy) : 0; if (dx <= 0) c.fillRect(0, y, W, 1); else { c.fillRect(0, y, Math.max(0, cx - dx), 1); c.fillRect(cx + dx, y, W, 1) } } }
let DOOR = null;
function doors(k) { if (!DOOR) { const B = new Buf(320, SH); B.rect(0, 0, 320, SH, K); B.rect(316, 0, 4, SH, DM); B.rect(319, 0, 1, SH, Y1); for (let i = 0; i < 9; i++) { B.rect(300 - i * 34, 0, 1, SH, i % 2 ? DM : R3) }
    for (let j = 0; j < 7; j++) { const y = 148 + (j - 3) * 4, wv = 300 - Math.abs(j - 3) * 46; B.rect(320 - wv, y, wv, 2, j === 3 ? Y1 : O2) } for (let r = 20; r <= 68; r += 12) B.disc(320, 148, r, 0, (i, d) => { d[i] = H(r % 24 ? O1 : Y1) }, r - 2); B.disc(320, 148, 10, Y1);
    B.rect(0, 0, 320, 6, DM); B.rect(0, SH - 6, 320, 6, DM); const a = B.canvas(), m = document.createElement("canvas"); m.width = 320; m.height = SH; const x = m.getContext("2d"); x.translate(320, 0); x.scale(-1, 1); x.drawImage(a, 0, 0); DOOR = [a, m] }
  const off = Math.round((1 - ez(k)) * 322); c.drawImage(DOOR[0], -off, 0); c.drawImage(DOOR[1], 320 + off, 0) }
function wipe(type, k, cx, cy) { if (k <= 0) return; if (type === "doors") doors(k); else if (type === "fade") { c.globalAlpha = k; R(0, 0, W, SH, K); c.globalAlpha = 1 } else if (type === "rise") { R(0, 0, W, Math.round(SH * ez(k)), K) } else iris(cx, cy, ez(k)) }

/* a bank of fog: one flat colour, a ragged top, a few loose strands above it */
function fogBand(B, yTop, yBot, col, sd2, x0, x1) { x0 = x0 || 0; x1 = x1 || B.w; for (let x = x0; x < x1; x += 2) { const h = Math.round(5 * Math.sin(x * .021 + sd2) + 3 * Math.sin(x * .067 + sd2 * 2.3) + (hs(x >> 3, sd2) > .7 ? 2 : 0)); B.rect(x, yTop + h, 2, yBot - yTop - h, col) }
  for (let i = 0; i < (x1 - x0) / 70; i++) { const x = x0 + hs(i, sd2) * (x1 - x0), y = yTop - 3 - hs(i, sd2 + 5) * 12, w = 18 + hs(i, sd2 + 9) * 60; B.rect(x, y, w, 2, col); B.rect(x + 6, y - 2, w * .5, 1, col) } }
/* ---------- the tower map between floors: our tower in a concrete jungle ---------- */
let MAPBG = null;
const mapY = i => 262 - i * 20;
function drawMap(a, b, k, T) { if (!MAPBG) { const B = new Buf(W, SH); [[0, N1], [60, N2], [110, V1], [154, V2], [190, V3], [220, M1], [244, M2], [264, M3]].forEach((q, i, A) => B.rect(0, q[0], W, (A[i + 1] ? A[i + 1][0] : SH) - q[0], q[1])); seed(31);
    for (let i = 0; i < 80; i++) B.rect(rnd() * W, rnd() * 140, 1, 1, rnd() < .3 ? Y2 : V3); B.disc(560, 54, 22, Y2); B.disc(560, 54, 34, 0, (j, d) => { d[j] = d[j] === H(N2) ? H(V1) : d[j] === H(N1) ? H(N2) : d[j] }, 31);
    const row = (col, hmin, hmax, wmin, wmax, win, crown) => { for (let x = -8; x < W;) { const w = wmin + rnd() * (wmax - wmin) | 0, h = hmin + rnd() * (hmax - hmin) | 0, y = SH - h; B.rect(x, y, w, h, col);
        if (crown) { const t = rnd(); if (t < .3) { B.rect(x + 3, y - 6, w - 6, 6, col); B.rect(x + 7, y - 11, w - 14, 5, col); B.rect(x + (w >> 1), y - 24, 1, 13, col) } else if (t < .5) B.poly([[x + 2, y], [x + w - 2, y], [x + w / 2, y - 16]], col); else if (t < .7) { B.rect(x + (w >> 1) - 1, y - 18, 2, 18, col); B.rect(x + 4, y - 4, w - 8, 4, col) } }
        if (win) for (let yy = y + 5; yy < SH - 4; yy += 6) for (let q = x + 3; q < x + w - 3; q += 4) if (hs(q / 8 | 0, yy / 18 | 0) > .45 && rnd() < .55) B.rect(q, yy, 2, 3, win); x += w + (rnd() * 4 | 0) } };
    row(FA, 70, 210, 10, 26, 0, 1); fogBand(B, 208, SH, V3, 2); row(FB, 50, 180, 14, 30, "#8a5a2a", 1); fogBand(B, 232, SH, V2, 5); row(N2, 30, 140, 18, 38, Y1, 1); fogBand(B, 256, SH, V1, 9); row(K, 16, 70, 22, 46, O1, 0);
    for (let i = 0; i < SCENES.length; i++) { const hw = 92 - i * 5.4 | 0, y = mapY(i); B.rect(150 - hw, y, hw * 2, 20, K); B.rect(150 - hw - 3, y + 19, hw * 2 + 6, 1, DM); B.rect(150 - hw, y, 1, 20, M1); B.rect(150 + hw - 1, y, 1, 20, B1) }
    const ty = mapY(SCENES.length - 1); for (let q = -3; q <= 3; q++) { const an = q * .36; B.poly([[150, ty], [150 + Math.sin(an - .12) * 22, ty - Math.cos(an - .12) * 22], [150 + Math.sin(an + .12) * 22, ty - Math.cos(an + .12) * 22]], q % 2 ? O1 : Y1) } B.rect(150, ty - 44, 1, 24, Y1); B.rect(0, SH - 10, W, 10, K); fogBand(B, SH - 16, SH - 8, V1, 13, 0, 56); fogBand(B, SH - 16, SH - 8, V1, 17, 246, W);
    B.rect(286, 88, 344, 90, K); B.rect(286, 88, 344, 1, Y1); B.rect(286, 177, 344, 1, Y1); B.rect(286, 88, 1, 90, O2); B.rect(629, 88, 1, 90, O2); B.rect(289, 91, 338, 1, DM); B.rect(289, 174, 338, 1, DM); MAPBG = B.canvas() }
  c.drawImage(MAPBG, 0, 0); const car = lerp(mapY(a), mapY(b), ez(cl(k * 1.5, 0, 1)));
  for (let i = 0; i < SCENES.length; i++) { const hw = 92 - i * 5.4 | 0, y = mapY(i), seen = i <= Math.min(a, b) || (i === b && k > .66), here = i === b;
    for (let x = 150 - hw + 6; x < 150 + hw - 8; x += 7) { if (Math.abs(x - 147) < 7) continue; const lit = seen ? (hs(x, i) > .25) : false; R(x, y + 6, 4, 8, lit ? (here && (T * 4 | 0) % 2 ? Y2 : Y1) : IN) }
    tx(SCENES[i].floor, 150 + hw + 8, y + 6, here ? Y1 : seen ? O2 : FB, { f: "T" }) }
  R(146, mapY(SCENES.length - 1), 9, SCENES.length * 20, INK); R(147, Math.round(car) + 3, 7, 14, Y2); R(148, Math.round(car) + 5, 5, 10, O1); R(150, mapY(SCENES.length - 1), 1, Math.round(car) + 3 - mapY(SCENES.length - 1), DM);
  for (let i = 0; i < 5; i++) { const x = ((T * (5 + i * 2) + i * 170) % 900) - 130, y = 196 + i * 13; R(x, y, 70 + i * 12, 2, i % 2 ? V3 : V2); R(x + 14, y - 2, 30, 1, i % 2 ? V3 : V2) }
  const sb = SCENES[b]; if (k > .25) { tx(sb.sec, 304, 106, Y2, { s: 3 }); tx(sb.name, 304, 144, Y2, { s: 2 }) } }

/* ---------- running the show ---------- */
let cur = { s: 0, b: 0, t0: 0 }, tr = null, NOW = 0;
const exitDur = sc => { const p = posOf(sc, sc.beats.length - 1), e = Object.assign({}, p, sc.exit || {}); return Math.hypot(e.x - p.x, (e.y - p.y) * 2) / (sc.speed || 110) };
function frame(now) { const T = now / 1000; NOW = T; c.fillStyle = K; c.fillRect(0, 0, W, VH);
  if (tr) { const t = T - tr.t0, A = SCENES[tr.a], Bs = SCENES[tr.b], d0 = tr.d0, wT = .7, mT = 1.9, eT = .7;
    if (t < d0 + wT) { const st = drawScene(tr.a, A.beats.length - 1, 99, T, { t }); wipe(A.exitWipe || "iris", cl((t - d0) / wT, 0, 1), st.fx - st.cam, st.fy - 24); hud(tr.a, A.beats.length - 1, 99, T, true) }
    else if (t < d0 + wT + mT) { drawMap(tr.a, tr.b, (t - d0 - wT) / mT, T); hud(tr.b, 0, 0, T, true); ensure(Bs) }
    else if (t < d0 + wT + mT + eT) { const t2 = t - d0 - wT - mT, st = drawScene(tr.b, 0, t2, T); wipe(Bs.enterWipe || "iris", 1 - t2 / eT, st.fx - st.cam, st.fy - 24); hud(tr.b, 0, t2, T) }
    else { cur = { s: tr.b, b: 0, t0: tr.t0 + d0 + wT + mT }; tr = null } }
  if (!tr) { drawScene(cur.s, cur.b, T - cur.t0, T); hud(cur.s, cur.b, T - cur.t0, T) }
  requestAnimationFrame(frame) }
function go(d) { const sc = SCENES[cur.s];
  if (tr) { const t = NOW - tr.t0, e = [tr.d0 + .7, tr.d0 + 2.6, tr.d0 + 3.3]; if (d > 0) { const nx = e.find(v => v > t + .05); if (nx === e[2] || nx === undefined) { cur = { s: tr.b, b: 0, t0: NOW - .7 }; tr = null } else tr.t0 = NOW - nx } else { cur = { s: tr.a, b: SCENES[tr.a].beats.length - 1, t0: NOW - 99 }; tr = null } return }
  if (d > 0) { if (cur.b < sc.beats.length - 1) cur = { s: cur.s, b: cur.b + 1, t0: NOW }; else if (cur.s < SCENES.length - 1) tr = { a: cur.s, b: cur.s + 1, t0: NOW, d0: exitDur(sc) } }
  else { if (cur.b > 0) cur = { s: cur.s, b: cur.b - 1, t0: NOW - 99 }; else if (cur.s > 0) cur = { s: cur.s - 1, b: SCENES[cur.s - 1].beats.length - 1, t0: NOW - 99 } } }
function jump(s, b, done) { tr = null; s = cl(s, 0, SCENES.length - 1); cur = { s, b: cl(b || 0, 0, SCENES[s].beats.length - 1), t0: NOW - (done ? 99 : 0) } }
addEventListener("keydown", e => { if (["ArrowRight", "ArrowDown", " ", "Enter", "PageDown"].includes(e.key)) { e.preventDefault(); go(1) } else if (["ArrowLeft", "ArrowUp", "PageUp", "Backspace"].includes(e.key)) { e.preventDefault(); go(-1) }
  else if (e.key === "f" || e.key === "F") { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen().catch(() => { }) }
  else if (e.key === "]") jump(cur.s + 1, 0) ; else if (e.key === "[") jump(cur.s - 1, 0); else if (e.key === "Home") jump(0, 0) });
addEventListener("click", e => go(e.clientX < innerWidth * .2 ? -1 : 1));
function check() { SCENES.forEach(s => { s.beats.forEach((b, i) => (b.say || []).forEach((l, q) => { if (l.length > (q ? 76 : 38)) console.error("LONG SAY", s.name, i, l.length, l) })); for (const k in (s.cards || {})) s.cards[k].lines.forEach(l => { const a = l.split("@@"); if (a[0].length + (a[1] ? a[1].length + 3 : 0) > 74) console.error("LONG CODE", s.name, k, l) }) }) }
function boot() { check(); NOW = performance.now() / 1000; const m = /s=(\d+)(?:&b=(\d+))?(&done)?/.exec(location.hash); if (m) jump(+m[1], +(m[2] || 0), !!m[3]); else cur.t0 = NOW; if (/map=(\d+)/.test(location.hash)) { const a = +/map=(\d+)/.exec(location.hash)[1]; tr = { a, b: a + 1, t0: NOW - exitDur(SCENES[a]) - .7 - 1.2, d0: exitDur(SCENES[a]) } } requestAnimationFrame(frame) }
