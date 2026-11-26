/* 27. THE ENGINE ROOM. Seven machines on a catwalk, one per model. Knob lamps: green = best value inside the grid, amber = on its edge. */
(() => {
  const SW = 1180, FY = 240, MX = i => 100 + i * 160;
  const M = [
    { n: "POPULARITY", p: "NO SETTINGS", o: ["COUNT THE PLAYERS.", "NOTHING IS LEARNED"], t: "BASELINE", knobs: [] },
    { n: "ITEM-KNN", p: "k=3570 a=0.5", o: ["COSINE BETWEEN", "GAME AUDIENCES"], t: "COURSE", knobs: [["k", 0], ["a", 1]] },
    { n: "PURESVD", p: "f=12", o: ["RANK-12 REBUILD OF", "THE 0/1 MATRIX"], t: "CONTRAST", knobs: [["f", 1]] },
    { n: "ALS BINARY", p: "f=128 a=3 reg=80", o: ["WEIGHTED SQ. ERROR", "ON EVERY CELL"], t: "COURSE", knobs: [["f", 0], ["a", 1], ["reg", 1]] },
    { n: "ALS PLAYTIME", p: "f=128 a=1 reg=80", o: ["SAME, WEIGHTED BY", "LOG(1 + HOURS)"], t: "COURSE", knobs: [["f", 0], ["a", 1], ["reg", 1]] },
    { n: "BPR-MF", p: "f=128 lr=0.05", o: ["PLAYED GAME BEATS", "A RANDOM UNPLAYED"], t: "COURSE", knobs: [["f", 0], ["lr", 1]] },
    { n: "EASE", p: "lambda=100", o: ["GAME-TO-GAME LINEAR", "MODEL, CLOSED FORM"], t: "OUTSIDE METHOD", knobs: [["lam", 1]] }];
  function paint() { const S = new Buf(910, SH), B = new Buf(SW, SH);
    [[0, K], [44, WINE], [104, R2], [164, R3], [206, O2]].forEach((q, i, A) => S.rect(0, q[0], 910, (A[i + 1] ? A[i + 1][0] : FY) - q[0], q[1])); S.rect(0, FY, 910, SH - FY, K);
    for (const [x, r] of [[150, 78], [470, 96], [790, 70]]) { S.disc(x, 150, r, K); S.disc(x, 150, r - 10, 0, (j, d) => { d[j] = H(d[j] === H(K) ? WINE : K) }, r - 14); for (let a = 0; a < 6; a++) S.line(x, 150, x + Math.cos(a * 1.047) * (r - 12), 150 + Math.sin(a * 1.047) * (r - 12), WINE, 3); S.disc(x, 150, 12, WINE) }
    for (let x = 30; x < 910; x += 150) { S.rect(x, 70, 44, 170, K); S.disc(x + 22, 70, 22, K); S.rect(x + 4, 96, 2, 130, R3); for (let y = 100; y < 230; y += 26) S.rect(x, y, 44, 2, WINE) }
    for (let x = 80; x < 910; x += 210) { S.rect(x, 196, 34, 44, K); S.rect(x + 5, 206, 24, 26, O1); S.rect(x + 8, 210, 18, 18, Y1); S.rect(x + 12, 216, 10, 12, Y2) }
    S.rect(0, 58, 910, 5, K); S.rect(0, 58, 910, 1, R3); S.rect(0, 120, 910, 3, K);
    /* front: overhead pipes, the catwalk, seven machines */
    B.rect(0, 0, SW, 9, K); B.rect(0, 9, SW, 1, O2); B.rect(0, 14, SW, 6, N2); B.rect(0, 14, SW, 1, V2); B.rect(0, 19, SW, 1, K); for (let x = 40; x < SW; x += 160) { B.rect(x, 12, 8, 10, K); B.rect(x + 2, 10, 4, 2, Y1) }
    B.rect(0, FY, SW, SH - FY, K); B.rect(0, FY, SW, 1, Y1); B.rect(0, FY + 2, SW, 1, DM); for (let x = 2; x < SW; x += 6) B.rect(x, FY + 4, 1, 4, DM); B.rect(0, FY + 10, SW, 1, O2);
    for (let x = 0; x < SW; x += 96) { B.rect(x, FY + 11, 4, 45, N2); B.rect(x + 8, FY + 24, 80, 2, R2) }
    M.forEach((m, i) => { const x = MX(i);
      B.rect(x - 58, 222, 116, 18, K); B.rect(x - 58, 222, 116, 1, Y1); B.rect(x - 54, 226, 108, 1, DM);
      B.rect(x - 68, 62, 136, 30, K); B.rect(x - 68, 62, 136, 1, Y1); B.rect(x - 68, 91, 136, 1, Y1); B.rect(x - 68, 62, 1, 30, O2); B.rect(x + 67, 62, 1, 30, O2); B.text(m.n, x, 67, Y2, { al: "c" }); B.text(m.p, x, 79, GL, { al: "c" });
      B.rect(x - 1, 92, 2, 10, DM);
      if (i === 0) { B.poly([[x - 44, 104], [x + 44, 104], [x + 16, 150], [x - 16, 150]], K); B.rect(x - 44, 102, 88, 3, O2); B.rect(x - 24, 150, 48, 72, K); B.rect(x - 24, 150, 2, 72, R3); B.rect(x - 18, 164, 36, 16, INK); B.rect(x - 18, 164, 36, 1, DM) }
      else if (i === 1) { B.rect(x - 46, 104, 92, 118, K); B.rect(x - 46, 104, 92, 1, O2); B.rect(x - 46, 104, 2, 118, R3); for (let r = 0; r < 6; r++) for (let q = 0; q < 6; q++) { B.rect(x - 38 + q * 14, 114 + r * 14, 4, 4, DM); B.rect(x - 37 + q * 14, 115 + r * 14, 2, 2, K) } }
      else if (i === 2) { B.rect(x - 46, 104, 8, 118, K); B.rect(x + 38, 104, 8, 118, K); B.rect(x - 46, 104, 2, 118, R3); B.rect(x - 50, 104, 100, 8, K); B.rect(x - 50, 104, 100, 1, O2); B.rect(x - 40, 208, 80, 14, K); B.rect(x - 40, 208, 80, 1, DM) }
      else if (i === 3 || i === 4) { for (const dx of [-28, 12]) { B.rect(x + dx, 120, 20, 102, K); B.rect(x + dx, 120, 2, 102, R3); B.rect(x + dx - 2, 120, 24, 3, O2); B.rect(x + dx + 5, 132, 10, 60, INK) } B.rect(x - 40, 198, 84, 24, K); B.rect(x - 40, 198, 84, 1, DM);
        if (i === 4) { B.disc(x + 48, 126, 12, K); B.disc(x + 48, 126, 10, Y2); B.disc(x + 48, 126, 10, O1, 0, 9) } else { B.rect(x + 44, 130, 14, 92, K); B.rect(x + 44, 130, 14, 1, O2); B.rect(x + 49, 136, 4, 60, INK) } }
      else if (i === 5) { B.rect(x - 3, 116, 6, 106, K); B.rect(x - 3, 116, 1, 106, R3); B.poly([[x - 26, 222], [x + 26, 222], [x + 10, 200], [x - 10, 200]], K); B.disc(x, 114, 6, Y1) }
      else { B.rect(x - 46, 104, 92, 118, K); B.rect(x - 46, 104, 92, 2, Y1); B.rect(x - 46, 104, 2, 118, M1); B.rect(x + 44, 104, 2, 118, B1); B.rect(x - 40, 110, 80, 1, DM); B.disc(x, 160, 34, INK); B.disc(x, 160, 34, Y1, 0, 33) }
      m.knobs.forEach((kb, q) => { const kx = x - (m.knobs.length - 1) * 13 + q * 26; B.disc(kx, 232, 4, DM); B.rect(kx, 229, 1, 3, Y2) }) });
    B.rect(1150, 150, 30, 90, K); B.rect(1150, 150, 30, 1, Y1); B.rect(1150, 150, 1, 90, O2); B.text("28", 1166, 136, O1, { al: "c" });
    return [{ b: S, p: .5 }, { b: B }] }
  function back(st) { const T = st.T; for (let x = 80; x < 910; x += 210) { const f = (T * 8 + x | 0) % 3; R(x + 8 + f, 210 + f, 18 - f * 2, 18 - f, f ? Y1 : Y2); R(x + 12, 216 - f * 2, 10, 12, f === 1 ? Y2 : O1) }
    for (const [x, r] of [[150, 78], [470, 96], [790, 70]]) { const a = T * .5 * (x % 3 ? 1 : -1); for (let q = 0; q < 3; q++) seg(x, 150, x + Math.cos(a + q * 2.094) * (r - 20), 150 + Math.sin(a + q * 2.094) * (r - 20), R3, 2) } }
  const REG = [[20, .154], [80, .180], [300, .128]];
  function live(st) { const T = st.T;
    M.forEach((m, i) => { const x = MX(i);
      if (i === 0) { const n = String(1000 + (T * 37 | 0) % 9000); tx(n, x - 16, 168, Y1); for (let q = 0; q < 5; q++) { const yy = 106 + ((T * 30 + q * 11) % 42); R(x - 20 + q * 9 + (yy - 106) * (q - 2) * -.18, yy, 3, 3, [M2, B2, Y1, G2, C1][q]) } }
      if (i === 1) for (let q = 0; q < 5; q++) { const s = Math.floor(T * .8 + q * .37), a = hs(s, q) * 36 | 0, b = hs(s, q + 9) * 36 | 0, ax = x - 36 + (a % 6) * 14, ay = 116 + (a / 6 | 0) * 14, bx = x - 36 + (b % 6) * 14, by = 116 + (b / 6 | 0) * 14; seg(ax, ay, bx, by, [B2, M2, Y1, G2, C1][q]); R(ax - 1, ay - 1, 3, 3, Y2); R(bx - 1, by - 1, 3, 3, Y2) }
      if (i === 2) { const d = Math.round((Math.sin(T * 1.6) * .5 + .5) * 46); R(x - 2, 112, 4, 30 + d, DM); R(x - 36, 142 + d, 72, 6, K); R(x - 36, 142 + d, 72, 1, O2); const n = 12, h = 208 - (148 + d); for (let q = 0; q < n; q++) R(x - 30, 148 + d + Math.round(q * h / n), 60, Math.max(1, Math.round(h / n) - 1), q % 2 ? V3 : M2) }
      if (i === 3 || i === 4) { [-28, 12].forEach((dx, q) => { const d = Math.round((Math.sin(T * 3 + q * Math.PI) * .5 + .5) * 40); R(x + dx + 5, 134 + d, 10, 14, i === 3 ? Y1 : C2); R(x + dx + 5, 134 + d, 10, 2, Y2); R(x + dx + 9, 148 + d, 2, 44 - d, DM) }); if (i === 4) { seg(x + 48, 126, x + 48 + Math.cos(T * 2) * 7, 126 + Math.sin(T * 2) * 7, K); seg(x + 48, 126, x + 48 + Math.cos(T * .3) * 5, 126 + Math.sin(T * .3) * 5, R1) } }
      if (i === 5) { const a = Math.sin(T * 1.3) * .22 + .12, dx = Math.cos(a) * 42, dy = Math.sin(a) * 42; seg(x - dx, 114 + dy, x + dx, 114 - dy, Y1, 2); for (const sg of [-1, 1]) { const px = x + sg * dx, py = 114 - sg * dy; seg(px, py, px - 10, py + 30, DM); seg(px, py, px + 10, py + 30, DM); R(px - 12, py + 30, 25, 3, O2); R(px - 5, py + 20, 10, 10, sg > 0 ? Y1 : GR); R(px - 5, py + 20, 10, 2, sg > 0 ? Y2 : GL) } }
      if (i === 6) { const a = T * .9; for (let q = 0; q < 8; q++) { const aa = a + q * .785; seg(x, 160, x + Math.cos(aa) * 30, 160 + Math.sin(aa) * 30, q % 2 ? O1 : Y1, 2); R(x + Math.cos(aa) * 36 - 2, 160 + Math.sin(aa) * 36 - 2, 5, 5, Y1) } circ(x, 160, 9, Y2); circ(x, 160, 4, K); tx("X^-1", x, 204, Y1, { al: "c" }) }
      /* what each one optimizes: a plate lowered on its beat */
      const beatOf = i < 3 ? 1 : i < 5 ? 2 : 3, k = st.A(beatOf, .35, (i - (i < 3 ? 0 : i < 5 ? 3 : 5)) * .5 + .2); if (k > 0 && st.b < 4) { const y = Math.round(-30 + 54 * ez(k)); R(x - 1, 0, 2, y, DM); plate(m.o, x, y, Y2, { al: "c", bd: i === 6 ? M3 : O1 }); if (k >= 1) { const tw2 = tw(m.t) + 8; box(x - tw2 / 2, y + 28, tw2, 11, i === 6 ? WINE : INK, i === 6 ? M3 : i === 2 ? GR : G1); tx(m.t, x, y + 30, i === 6 ? M3 : i === 2 ? GL : G2, { al: "c" }) } }
      /* knob lamps */
      m.knobs.forEach((kb, q) => { const kx = x - (m.knobs.length - 1) * 13 + q * 26, on = st.b >= 5 && st.A(5, .2, .2 + i * .15) >= 1; R(kx - 2, 222, 5, 4, on ? (kb[1] ? G2 : O1) : DM); if (on) R(kx - 1, 223, 3, 2, Y2); tx(kb[0], kx, 213, on ? (kb[1] ? G2 : O1) : GR, { al: "c", f: "T" }) }) });
    /* the reg lever on ALS */
    if (st.b === 4) { const t = st.arr, ph = t < 1.2 ? 0 : t < 2.4 ? 1 : t < 3.8 ? 2 : 1, done = t >= 3.8, x = MX(3), ang = [-.7, 0, .7][ph];
      seg(x + 51, 222, x + 51 + Math.sin(ang) * 36, 222 - Math.cos(ang) * 36, Y1, 3); circ(x + 51 + Math.round(Math.sin(ang) * 36), 222 - Math.round(Math.cos(ang) * 36), 5, R1);
      const bx = x + 96; box(bx, 34, 228, 184, K, Y1); tx("ALS  f=64  alpha=3", bx + 8, 40, O1); tx("VALIDATION NDCG@10", bx + 8, 52, GL); R(bx + 8, 64, 212, 1, DM);
      REG.forEach(([r, v], q) => { const show = done || q <= (t < 1.2 ? 0 : t < 2.4 ? 1 : 2), cx = bx + 44 + q * 70, h = Math.round((v - .1) / .1 * 56); box(cx - 9, 140, 18, 60, INK, DM); if (show) { R(cx - 7, 198 - h, 14, h, q === 1 ? Y1 : O2); R(cx - 7, 198 - h, 14, 1, Y2); tx(v.toFixed(3), cx, 128, q === 1 ? Y1 : M3, { al: "c" }) } tx("reg " + r, cx, 205, q === ph ? Y2 : GR, { al: "c" }) });
      if (done) { tx("FIRST DRAFT LEFT reg AT 10:", bx + 8, 72, GL); tx("ALS LOOKED 33% BEHIND EASE.", bx + 8, 84, M3); tx("TUNED: 10% BEHIND.", bx + 8, 96, G2) } }
    if (st.b === 5 && st.A(5, .2, 1.4) >= 1) { plate(["GREEN: BEST VALUE INSIDE THE GRID   8 OF 12", "AMBER: BEST VALUE ON THE EDGE       4 OF 12", "EDGES: k (KNN), f (ALS, ALS, BPR)"], st.cam + 320, 104, Y2, { al: "c", cols: [G2, O1, GL] }) }
    for (let i = 0; i < 7; i++) { const a = (T * .7 + i * .37) % 1; R(40 + i * 160 + 3 + Math.sin(T + i) * 3, 22 + a * 26, 2, 2, a < .4 ? GL : GR) }
  }
  SCENES.push({ floor: "27", name: "ENGINE ROOM", sec: "MODELING", w: SW, paint, back, live, start: { x: -20, y: 291, s: .8, pose: "s" }, rim: O1, clue: 5, clueText: "TUNING DECIDES THE COMPARISON", clueY: "b",
    exit: { x: 1166, y: 250, s: .5 }, exitWipe: "iris", enterWipe: "iris",
    beats: [
      { x: 180, cam: 0, say: ["FLOOR 27. THE ENGINE ROOM. SEVEN MACHINES, ONE INTERFACE:", "PLAYER x GAME MATRIX GOES IN. A SCORE FOR EVERY GAME COMES OUT.", "THE TEN BEST UNPLAYED GAMES ARE THE RECOMMENDATION."] },
      { foc: [260, 122, 252, 124], x: 500, cam: 0, say: ["POPULARITY COUNTS PLAYERS. NOTHING IS LEARNED. IT IS THE BAR TO CLEAR.", "ITEM-KNN: TWO GAMES ARE CLOSE IF THE SAME PEOPLE PLAY BOTH.", "PURESVD: A LOW-RANK REBUILD THAT TREATS UNPLAYED AS ZERO. A CONTRAST."] },
      { foc: [660, 122, 172, 124], x: 500, cam: 340, say: ["ALS: MATRIX FACTORIZATION OVER EVERY CELL. PLAYED CELLS GET MORE CONFIDENCE.", "TWO BUILDS: PLAYED OR NOT, AND WEIGHTED BY LOG HOURS.", "SOLVED BY ALTERNATING: FIX GAMES, SOLVE PLAYERS. FIX PLAYERS, SOLVE GAMES."] },
      { foc: [980, 122, 172, 124], x: 720, cam: 540, say: ["BPR-MF: A PLAYED GAME SHOULD OUTRANK A RANDOM UNPLAYED ONE. TRAINED BY SGD.", "EASE: EACH GAME PREDICTED FROM A WEIGHTED SUM OF THE PLAYER'S OTHER GAMES.", "EASE IS OUR OUTSIDE METHOD. NEAREST COURSE RELATIVE: SLIM. NOT AUTOREC."] },
      { foc: [790, 126, 136, 104], x: 480, cam: 272, say: ["TUNING DECIDES THIS CASE. PULL THE REG LEVER ON ALS:", "20 GIVES 0.154.  80 GIVES 0.180.  300 GIVES 0.128.", "OUR FIRST DRAFT LEFT IT AT 10. THAT MADE EASE LOOK 33% BETTER. IT IS 10%."] },
      { foc: [860, 166, 330, 84], x: 700, cam: 540, clue: true, clueDelay: 2.2, say: ["EVERY KNOB GOT A GRID. GREEN LAMP: THE BEST VALUE SITS INSIDE THE GRID.", "AMBER: ON THE EDGE. ALS AND BPR WERE STILL IMPROVING AT 128 FACTORS.", "A MODEL TUNED ON A GRID EDGE IS NOT TUNED. WE BOUND THAT ON FLOOR 42."] }] });
})();
