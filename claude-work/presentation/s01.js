/* G. THE STREET. Title screen.
   The city is real geometry: boxes in metres, seen by a camera lying on the street and tilted 25 degrees up, 113-degree lens.
   So verticals meet at the zenith, floors get shorter with height, and side walls recede. Fog sits between the depth layers. */
(() => {
  const GY = 246, CX = 330, TH = .44, ct = Math.cos(TH), sn = Math.sin(TH), FL = 210, CYc = 148, CH = .35;
  const PR = (X, Y, Z) => { const y = Y - CH, zz = Z * ct + y * sn, yy = -Z * sn + y * ct; return [CX + FL * X / zz, CYc - FL * yy / zz, zz] };
  const SKY = [[0, N1], [34, N2], [66, V1], [96, V2], [124, V3], [150, M1], [174, M2], [196, M3], [216, C1], [232, C2]];
  const flick = [], cells = [], bulbs = [], ubulbs = [], rain = [...Array(120)].map(() => ({ x: Math.random() * 700, y: Math.random() * SH, v: 4 + Math.random() * 3 }));
  const ZEP = []; for (let y = -5; y <= 5; y++) for (let x = -19; x <= 19; x++) if ((x / 19) ** 2 + (y / 5) ** 2 <= 1) ZEP.push([x, y, y < -2 && x > -12 && x < 12 ? V2 : K]);
  for (let y = -7; y <= 7; y++) for (let x = -24; x <= -17; x++) if (Math.abs(y) <= (x + 25)) ZEP.push([x, y, K]); for (let x = -5; x <= 5; x++) { ZEP.push([x, 6, K]); ZEP.push([x, 7, K]) }
  function paint() {
    const S = new Buf(W, SH), F = new Buf(W, SH);
    SKY.forEach((b, i) => S.rect(0, b[0], W, (SKY[i + 1] ? SKY[i + 1][0] : GY) - b[0], b[1])); S.rect(0, GY, W, SH - GY, N1);
    const LIGHT = new Map(SKY.map((b, i) => [H(b[1]), H((SKY[i + 1] || b)[1])])), lighten = (i, d) => { const v = LIGHT.get(d[i]); if (v) d[i] = v };
    for (let i = 0; i < 70; i++) S.rect(rnd() * 640, rnd() * 110, 1, 1, rnd() < .3 ? Y2 : V3);
    S.disc(424, 50, 50, 0, lighten, 46); S.disc(424, 50, 38, 0, lighten, 34); S.disc(424, 50, 26, Y2);
    const rect = (...a) => F.rect(...a), poly = (...a) => F.poly(...a), disc = (...a) => F.disc(...a), line = (...a) => F.line(...a), buf = F.d;
    /* ---- boxes ---- */
    const q3 = (pts, col) => { const q = pts.map(p => PR(p[0], p[1], p[2])); if (q.some(p => p[2] < 2)) return; F.poly(q, col) };
    const lit = (a, b, sd2, dens) => hs((a / 3 | 0) + sd2, (b / 4 | 0) * 1.7 + sd2) > (1 - dens) * .7 && hs(a * 7 + sd2, b * 13 + sd2) > 1 - dens;
    function bx(x0, x1, z0, z1, h0, h1, o) { const xs = x1 < 0 ? x1 : x0 > 0 ? x0 : null, bay = o.bay || 4, fl = o.fl || 3.5, sd2 = o.seed || 1, wc = o.win;
      if (xs !== null && o.side) { q3([[xs, h0, z0], [xs, h0, z1], [xs, h1, z1], [xs, h1, z0]], o.side);
        if (o.wside) { let iz = 0; for (let z = z0 + bay * .3; z < z1 - bay * .6; z += bay, iz++) { let iy = 0; for (let y = h0 + fl * .45; y < h1 - fl * .55; y += fl, iy++) { if (!lit(iz, iy, sd2 + 50, o.dens)) continue; const col = wc[(hs(iz, iy + sd2) * wc.length) | 0];
              const a = PR(xs, y, z), b = PR(xs, y + fl * .52, z + bay * .52); if (a[2] < 2) continue; if (Math.abs(b[0] - a[0]) < 2.5) rect(Math.min(a[0], b[0]), b[1], Math.max(1, Math.abs(b[0] - a[0])), Math.max(1, a[1] - b[1]), col); else q3([[xs, y, z], [xs, y, z + bay * .52], [xs, y + fl * .52, z + bay * .52], [xs, y + fl * .52, z]], col) } } }
        if (o.rim) { const a = PR(xs, h0, z1), b = PR(xs, h1, z1), e = PR(xs, h1, z0); if (a[2] > 2 && b[2] > 2) line(a[0], a[1], b[0], b[1], o.rim); if (e[2] > 2 && b[2] > 2 && o.cornice) line(e[0], e[1], b[0], b[1], o.cornice) } }
      q3([[x0, h0, z0], [x1, h0, z0], [x1, h1, z0], [x0, h1, z0]], o.front);
      if (wc && o.front) { let ix = 0; for (let x = x0 + bay * .25; x < x1 - bay * .5; x += bay, ix++) { let iy = 0; for (let y = h0 + fl * .45; y < h1 - fl * .55; y += fl, iy++) { if (!lit(ix, iy, sd2, o.dens)) continue; const a = PR(x, y, z0), b = PR(x + bay * .55, y + fl * .52, z0); if (a[2] < 2) continue;
            const rx = Math.round(Math.min(a[0], b[0])), ry = Math.round(b[1]), rw = Math.max(1, Math.round(Math.abs(b[0] - a[0]))), rh = Math.max(1, Math.round(a[1] - b[1])), col = wc[(hs(ix + 3, iy + sd2) * wc.length) | 0]; rect(rx, ry, rw, rh, col); if (o.flick && hs(ix * 3 + sd2, iy * 5) > .955) flick.push([rx, ry, rw, rh, o.front, hs(ix, iy) * 9]) } } } }
    const tower = (X, Z, w, d, h, o) => { bx(X, X + w, Z, Z + d, 0, h, o); const t = hs(X, Z); if (t > .35) bx(X + w * .2, X + w * .8, Z + d * .2, Z + d * .8, h, h + 12 + t * 26, o); if (t > .6) { const a = PR(X + w / 2, h + 12 + t * 26, Z + d * .3), b = PR(X + w / 2, h + 40 + t * 40, Z + d * .3); line(a[0], a[1], b[0], b[1], o.front) } };
    const ring = (n, xr, z0, z1, wr, hr, o) => [...Array(n)].map(() => ({ X: -xr + rnd() * 2 * xr, Z: z0 + rnd() * (z1 - z0), w: wr[0] + rnd() * (wr[1] - wr[0]), h: hr[0] + rnd() * (hr[1] - hr[0]) })).sort((a, b) => b.Z - a.Z).forEach((t, i) => tower(t.X, t.Z, t.w, o.d, t.h, Object.assign({ seed: i * 3 + n }, o)));
    /* ---- the concrete jungle, far to near, with fog between the layers ---- */
    ring(90, 1500, 600, 1000, [40, 100], [110, 330], { d: 60, front: FA });
    fogBand(F, 176, GY + 2, M1, 3);
    ring(64, 640, 270, 520, [30, 62], [120, 300], { d: 44, front: FB, side: V1, win: [O2, DM, O2], dens: .42, bay: 6, fl: 7 });
    fogBand(F, 188, GY + 2, V3, 8);
    ring(30, 420, 200, 300, [28, 54], [110, 240], { d: 38, front: N2, side: IN, rim: V2, win: [Y1, O1, Y1, Y2], wside: 1, dens: .5, bay: 5, fl: 5 });
    fogBand(F, 202, GY + 2, V2, 14);
    /* ---- the tower: six setbacks, a window in almost every bay ---- */
    const TIER = [[46, 62, 0, 42], [38, 66, 42, 70], [30, 70, 70, 92], [22, 74, 92, 110], [14, 78, 110, 122], [7, 82, 122, 132]];
    { const a = PR(0, 132, 82), b = PR(0, 160, 82); line(a[0], a[1], b[0], b[1], Y1) }
    for (let i = 5; i >= 0; i--) { const [hw, z, h0, h1] = TIER[i]; bx(-hw, hw, z, z + 60, h0, h1, { front: K, win: [Y1, Y1, O1, Y2, Y1], dens: .84, bay: 4, fl: 3.5, seed: i * 11 + 2, flick: 1 });
      for (let x = -hw; x <= hw + .1; x += 8) { const a = PR(x, h0, z), b = PR(x, h1, z); line(a[0], a[1], b[0], b[1], Math.abs(x) > hw - 1 ? (x < 0 ? M1 : B1) : (x / 8 & 1 ? DM : O2)) }
      const l = PR(-hw - 1.6, h1, z), r = PR(hw + 1.6, h1, z); rect(l[0], l[1] - 1, r[0] - l[0], 2, Y1); rect(l[0], l[1] + 1, r[0] - l[0], 1, O2) }
    { const tp = PR(0, 132, 82); for (let k = -4; k <= 4; k++) { const a = k * .34; poly([[CX, tp[1]], [CX + Math.sin(a - .11) * 13, tp[1] - Math.cos(a - .11) * 13], [CX + Math.sin(a + .11) * 13, tp[1] - Math.cos(a + .11) * 13]], k % 2 ? O1 : Y1) } disc(CX, tp[1], 3, Y2) }
    /* ---- the flanks: named towers at four depths, each showing the face that looks into the street ---- */
    const NEAR = [[-214, 46, 176, 44, 232, N2, M1], [196, 48, 178, 44, 246, N2, B1], [-98, 28, 164, 34, 196, N2, M1], [74, 26, 172, 34, 214, N2, B1],
      [-112, 32, 120, 34, 132, IN, M1], [80, 30, 126, 34, 146, IN, B1], [-160, 40, 96, 42, 174, K, M1], [112, 42, 92, 42, 190, K, B1]];
    NEAR.sort((p, q) => q[2] - p[2]).forEach(([X, w, Z, d, h, col, rim], i) => { const o = { front: col, side: col, rim, cornice: rim, win: col === K ? [Y1, Y1, Y2, O1] : [O1, Y1, O1, O2], wside: 1, dens: col === K ? .66 : .52, bay: 4, fl: 3.6, seed: 61 + i * 7, flick: col === K };
      bx(X, X + w, Z, Z + d, 0, h, o); bx(X + w * .18, X + w * .82, Z + d * .18, Z + d * .82, h, h + 16, o); bx(X + w * .34, X + w * .66, Z + d * .34, Z + d * .66, h + 16, h + 28, o);
      const a = PR(X + w / 2, h + 28, Z + d / 2), b2 = PR(X + w / 2, h + 52, Z + d / 2); line(a[0], a[1], b2[0], b2[1], rim); if (i === 3) fogBand(F, 216, GY + 2, V2, 31) });
    fogBand(F, 238, GY + 2, V1, 21, 0, 200); fogBand(F, 238, GY + 2, V1, 25, 462, W);
    /* marquee: a sign on the facade and a canopy over the doors, both projected like everything else */
    const ZS = 59.5, sq = (x0, x1, y0, y1, col, z) => q3([[x0, y0, z || ZS], [x1, y0, z || ZS], [x1, y1, z || ZS], [x0, y1, z || ZS]], col), pl = (x0, y0, x1, y1, col, z) => { const p = PR(x0, y0, z || ZS), q = PR(x1, y1, z || ZS); line(p[0], p[1], q[0], q[1], col) };
    sq(-36, 36, 57, 61.5, K); sq(-22, 22, 61.5, 65, K); pl(-36, 61.5, 36, 61.5, Y1); pl(-22, 65, 22, 65, Y1);
    { const c0 = PR(0, 65, ZS); for (let k = -3; k <= 3; k++) { const an = k * .36; poly([[c0[0], c0[1]], [c0[0] + Math.sin(an - .12) * 14, c0[1] - Math.cos(an - .12) * 14], [c0[0] + Math.sin(an + .12) * 14, c0[1] - Math.cos(an + .12) * 14]], k % 2 ? R1 : O1) } }
    sq(-56, 56, 20.5, 57.5, K); sq(-54, 54, 22, 56, DM); sq(-53, 53, 22.8, 55.2, K); sq(-52, 52, 23.6, 54.4, R2); sq(-50, 50, 24.6, 53.4, WINE);
    const glyphs = (str, ytop, col, dx, dy) => { const f = FONT.P, px = .98, py = 1.62; let x = -str.length * 8 * px / 2 + .5; for (let n = 0; n < str.length; n++) { const g = f.g[str.charCodeAt(n)]; for (let r = 0; r < 8; r++) for (let q = 0; q < 8; q++) if (g[1][r] >> q & 1) { const X = x + q * px + dx, Y = ytop - (r + 1) * py + dy; q3([[X, Y, ZS], [X + px, Y, ZS], [X + px, Y + py, ZS], [X, Y + py, ZS]], col) }
        if (!dx) cells.push([[x - .4, ytop - 8 * py - .3], [x + 8 * px - .5, ytop - 8 * py - .3], [x + 8 * px - .5, ytop + .3], [x - .4, ytop + .3]].map(p => PR(p[0], p[1], ZS))); x += 8 * px } };
    cells.length = 0; glyphs("RECOMMENDING", 52.6, K, .55, -.6); glyphs("RECOMMENDING", 52.6, Y2, 0, 0); glyphs("STEAM GAMES", 38.6, K, .55, -.6); glyphs("STEAM GAMES", 38.6, Y1, 0, 0);
    bulbs.length = 0; for (let x = -52.5; x <= 52.6; x += 3.5) { bulbs.push(PR(x, 55.3, ZS)); bulbs.push(PR(x, 22.7, ZS)) } for (let y = 26; y < 54; y += 3.5) { bulbs.push(PR(-52.5, y, ZS)); bulbs.push(PR(52.5, y, ZS)) }
    rect(246, 193, 168, 53, K); rect(250, 193, 2, 53, O1); rect(408, 193, 2, 53, O1);
    for (let d = 0; d < 3; d++) { const x = 262 + d * 46; rect(x, 197, 40, 5, Y2); rect(x, 202, 40, 16, Y1); rect(x, 218, 40, 28, O1); rect(x + 19, 197, 2, 49, K); rect(x, 210, 40, 2, K); rect(x, 230, 40, 2, K);
      for (let k = 0; k < 4; k++) { line(x + 19, 197, x + 2 + k * 5, 209, K); line(x + 20, 197, x + 37 - k * 5, 209, K) } rect(x + 15, 224, 2, 4, K); rect(x + 23, 224, 2, 4, K) }
    for (const x of [230, 424]) { rect(x, 206, 6, 3, Y2); rect(x + 1, 209, 4, 8, O1); rect(x + 2, 217, 2, 5, O2); rect(x - 2, 203, 10, 2, K); rect(x - 3, 200, 1, 6, O2); rect(x + 8, 200, 1, 6, O2) }
    q3([[-42, 13, 45], [42, 13, 45], [42, 13, 60], [-42, 13, 60]], WINE); q3([[-42, 13, 45], [42, 13, 45], [42, 17, 45], [-42, 17, 45]], K); pl(-42, 17, 42, 17, Y1, 45); pl(-42, 13, 42, 13, O1, 45); pl(-42, 13, -42, 13.01, O1, 45);
    { const p = PR(-42, 13, 45), q = PR(-42, 13, 60), p2 = PR(42, 13, 45), q2 = PR(42, 13, 60); line(p[0], p[1], q[0], q[1], O2); line(p2[0], p2[1], q2[0], q2[1], O2) }
    ubulbs.length = 0; for (const z of [47.5, 51, 54.5, 58]) for (let x = -39; x <= 39.1; x += 3.9) ubulbs.push(PR(x, 13, z));
    /* wet street */
    rect(0, GY, W, SH - GY, N1); rect(0, GY, W, 2, V1);
    for (let k = -6; k <= 6; k++) if (k) line(CX + k * 24, GY + 2, CX + k * 130, SH, "#1b0e52");
    for (let i = 0; i < 150; i++) { const y = GY + 4 + rnd() * 46 | 0, x = rnd() * 640 | 0, w = 3 + rnd() * 16 | 0; rect(x, y, w, 1, x < 210 ? (rnd() < .4 ? M1 : V1) : x > 450 ? (rnd() < .4 ? B1 : V1) : V1) }
    [[GY, GY + 5, Y1], [GY + 5, GY + 13, O1], [GY + 13, GY + 27, O2], [GY + 27, SH, R3]].forEach(([a, b, col]) => poly([[CX - 68 - (a - GY) * 1.5, a], [CX + 68 + (a - GY) * 1.5, a], [CX + 68 + (b - GY) * 1.5, b], [CX - 68 - (b - GY) * 1.5, b]], col));
    for (let y = GY + 3; y < SH; y += 2) for (let k = 0; k < 7; k++) { const hw = 68 + (y - GY) * 1.5, x = CX - hw + rnd() * 2 * hw, w = 4 + rnd() * 22; if (rnd() < .55) rect(x, y, w, 1, N1) }
    for (let i = 0; i < 46; i++) { const x = 194 + i * 6; if (i % 2 === 0) rect(x, GY + 3 + (i % 3), 1, 3 + (i * 7) % 9, (x < CX - 70 || x > CX + 70) ? Y1 : Y2) }
    rect(226, 281, 22, 3, K); rect(228, 280, 18, 1, V1);
    /* foreground: lamp, car */
    disc(84, 134, 20, 0, i => { if (buf[i] === H(K)) buf[i] = H(R2) }, 18); disc(84, 134, 14, 0, i => { if (buf[i] === H(K) || buf[i] === H(R2)) buf[i] = H(O2) }, 12);
    rect(82, 146, 5, 150, K); rect(87, 146, 1, 150, O2); rect(78, 272, 13, 24, K); rect(91, 272, 1, 24, O2); rect(80, 262, 9, 10, K); rect(79, 143, 11, 3, K); rect(77, 141, 15, 2, O2); disc(84, 134, 7, Y2); disc(84, 134, 7, O1, 0, 6); rect(81, 125, 7, 2, K); rect(83, 122, 3, 3, K);
    poly([[462, SH], [466, 283], [480, 273], [518, 267], [566, 255], [640, 248], [640, SH]], K);
    line(480, 273, 518, 267, B2); line(518, 267, 566, 255, B2); line(566, 255, 640, 248, B2); line(466, 283, 480, 273, B1);
    poly([[574, 257], [640, 250], [640, 261], [584, 265]], V1); poly([[590, 258], [640, 253], [640, 255], [596, 260]], M2);
    rect(465, 278, 10, 8, R3); rect(468, 280, 6, 4, R1); poly([[486, 274], [520, 268], [560, 258], [560, 261], [522, 271], [488, 277]], M1); rect(467, 279, 8, 1, O1); rect(467, 284, 8, 1, R3); line(464, 290, 530, 287, B2);
    disc(512, SH + 2, 15, K); disc(512, SH + 2, 11, Y2, 0, 8);
    return [{ b: S }, { b: F }];
  }
  function back(st) { const T = st.T;
    /* searchlights: each beam lifts the sky one band, its core two */
    [[150, .23, 0, 70, 110], [236, .17, 2, 50, -60], [420, .2, 4, 60, 70], [520, .15, 1, 80, -150], [300, .12, 3, 90, 0]].forEach(([gx, sp, ph, amp, lean]) => { const tx0 = gx + lean + Math.sin(T * sp + ph) * amp;
      for (const [hw, up] of [[30, 1], [11, 2]]) { const pts = [[gx - 2, GY], [gx + 2, GY], [tx0 + hw, 0], [tx0 - hw, 0]]; for (let i = 0; i < SKY.length - up; i++) lpoly(pts, SKY[Math.min(SKY.length - 1, i + up)][1], SKY[i][0], SKY[i + 1][0] - 1) } });
    circ(424, 50, 26, Y2);
    const zx = ((T * 7) % 760) - 60, zy = 30 + Math.sin(T * .4) * 3 | 0; for (const p of ZEP) R(zx + p[0] | 0, zy + p[1], 1, 1, p[2]); if ((T * 1.5 | 0) % 2) R(zx + 19, zy, 1, 1, R1) }
  function live(st) { const T = st.T, on = st.b === 0 ? st.tb : 99;
    for (const f of flick) if (Math.sin(T * 1.3 + f[5] * 4) > .72) R(f[0], f[1], f[2], f[3], f[4]);
    if ((T * 1.2 | 0) % 2) R(CX, 0, 1, 2, R1);
    /* fog rolling along the street */
    for (let i = 0; i < 9; i++) { const side = i % 2, x = side ? 470 + ((T * (4 + i) + i * 61) % 230) : 190 - ((T * (4 + i) + i * 53) % 250), y = 206 + (i * 9) % 38, w = 26 + (i * 17) % 40, col = y < 222 ? V3 : y < 234 ? V2 : V1; R(x, y, w, 2, col); R(x + 6, y - 2, w * .5, 1, col) }
    const ph = T * 9 | 0; bulbs.forEach((p, i) => R(p[0] - 1, p[1] - 1, 2, 2, ((i >> 1) + ph) % 3 === 0 ? Y2 : DM)); ubulbs.forEach((p, i) => R(p[0] - 1, p[1] - 1, 2, 2, (i + ph) % 4 === 0 ? Y2 : (i + ph) % 4 === 1 ? O1 : O2));
    cells.forEach((q, i) => { const a = on - (i < 12 ? .3 : 1.3) - (i < 12 ? i : i - 12) * .07; if (a < 0 || (a < .35 && (a * 30 | 0) % 3 === 0)) lpoly(q, WINE) });
    for (let i = 0; i < 14; i++) { const a = (T * 9 + i * 5) % 34; R(236 + Math.sin(T * .9 + i) * 4 + a * .15, 279 - a, 2, 2, a < 12 ? V3 : a < 24 ? V2 : V1) }
    for (let i = 0; i < 9; i++) { const y = GY + 6 + ((i * 7 + (T * 4 | 0) * 3) % 44), hw = 68 + (y - GY) * 1.5; R(CX - hw + ((i * 53 + (T * 4 | 0) * 17) % (2 * hw | 0)), y, 6 + i % 9, 1, N1) } }
  function fore(st) { for (const p of rain) { p.y += p.v; p.x -= 1.2; if (p.y > SH) { p.y = -4; p.x = Math.random() * 720 } R(p.x, p.y, 1, 3, p.y > GY ? "#5a3fb0" : "#c9b8ff") } }
  SCENES.push({ floor: "G", name: "STREET", sec: "CASE 258", w: W, paint, back, live, fore, start: { x: 330, y: 290, s: 1, pose: "b" }, speed: 44, rim: O1,
    exit: { y: 252, s: .56 }, exitWipe: "iris", enterWipe: "fade",
    panel(b, tb, T) { if (b === 0 && tb > 2.2 && (T * 2 | 0) % 2) tx("> PRESS START", W - 14, SH + 30, Y1, { al: "r" }) },
    beats: [{ say: [] }, { say: [] }, { say: [] }] });
})();
