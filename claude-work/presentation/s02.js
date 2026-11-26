/* 1. THE LOBBY. One-point perspective. Twelve plinths = one player's games; one is taken (test), one is covered (validation). */
(() => {
  const VX = 320, VY = 118, Pk = (u, v, k) => [VX + u * 144 * k, VY + v * 70 * k], CV = -.857;
  const PX = [44, 90, 136, 182, 228, 274, 366, 412, 458, 504, 550, 596], PYB = 265, TEST = 8, VAL = 2;
  const CART = [M2, B1, G2, O1, Y1, V3, R1, B2, C1, M1, G1, Y2];
  function paint() { const B = new Buf(W, SH); B.rect(0, 0, W, SH, K);
    const quad = (a, b, cc, d, col, fn) => B.poly([a, b, cc, d], col, fn);
    /* ceiling: coffers running to the vanishing point */
    quad(Pk(-1, CV, 1), Pk(1, CV, 1), Pk(1, CV, 2.7), Pk(-1, CV, 2.7), N1);
    const KS = [1, 1.14, 1.32, 1.56, 1.88, 2.3, 2.8];
    for (let r = 0; r < KS.length - 1; r++) for (let q = 0; q < 8; q++) { const u0 = -1 + q * .25, u1 = u0 + .25; if ((r + q) % 2) quad(Pk(u0 + .03, CV, KS[r] + .02), Pk(u1 - .03, CV, KS[r] + .02), Pk(u1 - .03, CV, KS[r + 1] - .02), Pk(u0 + .03, CV, KS[r + 1] - .02), K) }
    for (let q = 0; q <= 8; q++) { const u = -1 + q * .25, a = Pk(u, CV, 1), b = Pk(u, CV, 2.7); B.line(a[0], a[1], b[0], b[1], V1) }
    for (const k of KS) { const a = Pk(-1, CV, k), b = Pk(1, CV, k); B.rect(a[0], a[1], b[0] - a[0], 1, V1) }
    /* back wall: a sunburst mural, two niches, the lift */
    B.rect(176, 58, 288, 130, IN);
    for (let i = -9; i < 9; i++) { const a0 = i * .175, a1 = a0 + .175; if (i & 1) B.poly([[320, 190], [320 + Math.sin(a0) * 420, 190 - Math.cos(a0) * 420], [320 + Math.sin(a1) * 420, 190 - Math.cos(a1) * 420]], 0, (j, d) => { if (d[j] === H(IN)) d[j] = H(N2) }) }
    for (const r of [64, 96, 128]) B.disc(320, 190, r, 0, (j, d) => { if (d[j] === H(IN) || d[j] === H(N2)) d[j] = H(V1) }, r - 1);
    B.rect(176, 58, 288, 2, Y1); B.rect(176, 60, 288, 1, O2); B.rect(176, 174, 288, 1, DM); B.rect(176, 180, 288, 8, K); B.rect(176, 180, 288, 1, DM);
    for (const nx of [200, 400]) { B.rect(nx, 96, 40, 84, K); B.rect(nx + 4, 90, 32, 6, K); B.rect(nx + 10, 85, 20, 5, K); B.rect(nx + 3, 99, 34, 81, V1); B.rect(nx + 3, 128, 34, 52, V2); B.rect(nx + 3, 152, 34, 28, nx < 320 ? M1 : B1); B.rect(nx + 3, 168, 34, 12, nx < 320 ? M2 : B2);
      B.rect(nx + 12, 160, 16, 20, K); B.rect(nx + 15, 138, 10, 22, K); B.rect(nx + 17, 128, 6, 10, K); B.disc(nx + 20, 122, 6, K); B.rect(nx + 8, 144, 24, 3, K); B.rect(nx, 96, 40, 1, DM); B.rect(nx, 96, 1, 84, DM); B.rect(nx + 39, 96, 1, 84, DM) }
    B.rect(286, 112, 68, 76, K); B.rect(292, 104, 56, 8, K); B.rect(300, 98, 40, 6, K); B.rect(286, 112, 68, 1, Y1); B.rect(292, 104, 56, 1, Y1); B.rect(300, 98, 40, 1, Y1); B.rect(286, 112, 1, 76, O2); B.rect(353, 112, 1, 76, O2);
    B.rect(294, 126, 52, 62, DM); B.rect(296, 128, 23, 60, O2); B.rect(321, 128, 23, 60, O2); B.rect(319, 128, 2, 60, Y2);
    for (let j = 0; j < 6; j++) { B.line(296, 138 + j * 9, 318, 130 + j * 9, DM); B.line(321, 130 + j * 9, 343, 138 + j * 9, DM) } B.rect(296, 128, 48, 1, Y1);
    B.disc(320, 124, 10, Y2); B.rect(308, 124, 24, 3, K); B.disc(320, 124, 10, O1, 0, 9); B.rect(308, 124, 24, 3, K);
    /* side walls: black, with pilasters that catch one colour each */
    const wall = (sg, rim) => { quad(Pk(sg, CV, 1), Pk(sg, CV, 2.9), Pk(sg, 1, 2.9), Pk(sg, 1, 1), K);
      [[1, 1.07], [1.3, 1.4], [1.72, 1.86], [2.3, 2.52]].forEach(([k0, k1], n) => { quad(Pk(sg, CV, k0), Pk(sg, CV, k1), Pk(sg, 1, k1), Pk(sg, 1, k0), N2); const a = Pk(sg, CV, k0), b = Pk(sg, 1, k0); B.line(a[0], a[1], b[0], b[1], rim); if (n) { const e = Pk(sg, CV, k0 - .01), f = Pk(sg, 1, k0 - .01); B.line(e[0], e[1], f[0], f[1], rim) } });
      [[1.1, 1.27], [1.44, 1.68], [1.92, 2.26]].forEach(([k0, k1]) => { quad(Pk(sg, -.6, k0), Pk(sg, -.6, k1), Pk(sg, .7, k1), Pk(sg, .7, k0), N1); const km = (k0 + k1) / 2, p = Pk(sg, -.05, km), w = Math.round(3 * km);
        B.poly([[p[0], p[1]], [p[0] - w * 2.4, p[1] - 30 * km], [p[0] + w * 2.4, p[1] - 30 * km]], 0, (j, d) => { if (d[j] === H(N1)) d[j] = H(V1); else if (d[j] === H(K)) d[j] = H(N2) });
        B.rect(p[0] - w, p[1] - 2, w * 2, 3, Y2); B.rect(p[0] - w + 1, p[1] + 1, w * 2 - 2, 2, O1); B.rect(p[0] - 1, p[1] + 3, 2, 3, O2) }) };
    wall(-1, M1); wall(1, B1);
    /* floor: marble checks, a red runner to the lift */
    quad(Pk(-1, 1, 1), Pk(1, 1, 1), Pk(1, 1, 2.9), Pk(-1, 1, 2.9), N1);
    const FK = [1, 1.1, 1.22, 1.37, 1.55, 1.77, 2.04, 2.36, 2.75];
    for (let r = 0; r < FK.length - 1; r++) for (let q = 0; q < 10; q++) { const u0 = -1 + q * .2, u1 = u0 + .2; quad(Pk(u0, 1, FK[r]), Pk(u1, 1, FK[r]), Pk(u1, 1, FK[r + 1]), Pk(u0, 1, FK[r + 1]), (r + q) % 2 ? K : N2) }
    quad(Pk(-.17, 1, 1), Pk(.17, 1, 1), Pk(.17, 1, 2.9), Pk(-.17, 1, 2.9), R2); quad(Pk(-.1, 1, 1), Pk(.1, 1, 1), Pk(.1, 1, 2.9), Pk(-.1, 1, 2.9), WINE);
    for (const u of [-.17, .17, -.1, .1]) { const a = Pk(u, 1, 1), b = Pk(u, 1, 2.9); B.line(a[0], a[1], b[0], b[1], Math.abs(u) > .12 ? Y1 : R3) }
    for (let y = 190; y < 214; y += 2) B.rect(300 + hs(y, 1) * 6, y, 28 - (y - 190) * .5, 1, y < 198 ? O1 : O2);
    /* two chandeliers */
    for (const x of [228, 412]) { B.rect(x, 60, 1, 10, DM); [[6, Y2], [14, Y1], [22, O1], [14, O2], [6, R3]].forEach(([w, col], i) => { B.rect(x - w / 2, 70 + i * 4, w, 3, col); B.rect(x - w / 2, 73 + i * 4, w, 1, K) }); B.rect(x - 1, 90, 2, 4, Y2) }
    /* plinths */
    for (const x of PX) { B.rect(x - 14, PYB - 4, 28, 4, K); B.rect(x - 14, PYB - 4, 28, 1, DM); B.rect(x - 8, PYB - 26, 16, 22, N2); B.rect(x - 8, PYB - 26, 2, 22, V2); B.rect(x + 6, PYB - 26, 2, 22, K); B.rect(x - 11, PYB - 30, 22, 4, K); B.rect(x - 11, PYB - 30, 22, 1, Y1);
      B.rect(x - 9, PYB - 50, 1, 20, V3); B.rect(x + 8, PYB - 50, 1, 20, V2); B.rect(x - 8, PYB - 51, 16, 1, V3); B.rect(x - 7, PYB - 48, 1, 7, B2); B.rect(x - 10, PYB, 20, 1, V1) }
    return B }
  const sign = (x, y, w, head, lines, col) => { R(x + 14, 0, 1, y, DM); R(x + w - 15, 0, 1, y, DM); box(x, y, w, 38, K, Y1); R(x + 2, y + 2, w - 4, 1, DM); R(x + 2, y + 35, w - 4, 1, DM); R(x + 1, y + 1, w - 2, 11, WINE); tx(head, x + w / 2, y + 3, col, { al: "c" }); lines.forEach((l, i) => tx(l, x + w / 2, y + 15 + i * 10, Y2, { al: "c", f: "P" })) };
  function live(st) { const T = st.T;
    R(319, 128, 2, 60, (T * 1.5 | 0) % 2 ? Y2 : Y1); seg(320, 124, 320 + Math.round(Math.cos(T * .6) * 8), 124 - Math.round(Math.abs(Math.sin(T * .6)) * 8), K);
    for (const x of [228, 412]) if ((T * 3 + x | 0) % 5 === 0) R(x - 1, 90, 2, 4, O1);
    /* the twelve games */
    for (let i = 0; i < 12; i++) { const x = PX[i], a = st.A(0, .3, .25 + i * .09); if (a <= 0) continue; const col = CART[i];
      const gone = i === TEST && st.b >= 1, g = i === TEST ? st.A(1, 1.1, .2) : 0, val = i === VAL ? st.A(2, .5, .2) : 0;
      if (!(gone && g >= 1)) { const lift = i === TEST ? Math.round(g * 34) : 0, cy = PYB - 44 - lift; if (!(g > .55 && (T * 20 | 0) % 2)) { R(x - 5, cy, 10, 13, val >= 1 ? DM : col); R(x - 5, cy, 10, 2, val >= 1 ? O2 : Y2); R(x - 3, cy + 4, 6, 4, val >= 1 ? K : K); R(x - 2, cy + 5, 4, 2, val >= 1 ? O2 : col); R(x - 4, cy + 11, 8, 2, K) }
        if (g > 0 && g < 1) for (let s = 0; s < 6; s++) R(x + Math.cos(s * 1.05 + T * 5) * (6 + g * 14), cy + 6 + Math.sin(s * 1.05 + T * 5) * (6 + g * 14), 2, 2, s % 2 ? Y2 : R1) }
      const glow = gone && g >= 1 ? R1 : val >= 1 ? O1 : Y2; R(x - 11, PYB - 30, 22, 1, glow); for (let y = 0; y < 5; y++) R(x - 7 + y, PYB + 2 + y * 3, 14 - y * 2, 1, gone && g >= 1 ? R3 : val >= 1 ? DM : (y < 2 ? V3 : V1));
      if (gone && g >= 1) { tx("?", x - 3, PYB - 45, (T * 3 | 0) % 2 ? R1 : M3); R(x - 9, PYB - 50, 1, 20, R3); R(x + 8, PYB - 50, 1, 20, R3); R(x - 8, PYB - 51, 16, 1, R1) }
      if (val >= 1) { R(x - 9, PYB - 50, 1, 20, O2); R(x + 8, PYB - 50, 1, 20, O2); R(x - 8, PYB - 51, 16, 1, O1) } }
    /* labels and brackets over the row */
    const brk = (x0, x1, y, col) => { R(x0, y, x1 - x0, 1, col); R(x0, y, 1, 5, col); R(x1 - 1, y, 1, 5, col) };
    if (st.b === 0 && st.A(0, .3, 1.5) >= 1) { brk(30, 610, 204, Y1); plate("ONE PLAYER: 12 GAMES PLAYED", 320, 190, Y2, { al: "c" }) }
    if (st.A(1, .3, 1.4) >= 1) { R(PX[TEST], 202, 1, 10, R1); plate(st.b >= 2 ? "TEST: 1" : "TEST: 1 GAME HIDDEN", PX[TEST], 188, Y2, { al: "c", bd: R1 }) }
    if (st.A(2, .3, .8) >= 1) { R(PX[VAL], 202, 1, 10, O1); plate("VALIDATION: 1", PX[VAL] + 6, 188, Y2, { al: "c", bd: O1 }); const yb = 276; brk(30, 610, yb + 6, G2); plate("TRAIN: THE OTHER 10", 150, yb, Y2, { al: "c", bd: G2 }) }
    /* the directory: three hanging signs */
    const d3 = st.A(3, .5) * (1 - st.A(5, .3)); if (d3 > 0) { const y = Math.round(-44 + 60 * ez(d3)); sign(12, y, 196, "INPUT", ["GAMES A PLAYER", "HAS PLAYED"], O1); sign(222, y, 196, "OUTPUT", ["ALL 3,570 GAMES,", "RANKED FOR THEM"], O1); sign(432, y, 196, "JUDGED ON", ["WHERE THE HIDDEN", "GAME LANDS"], O1);
      if (d3 >= 1 && st.b < 5) { tx(">", 210, y + 16, Y1); tx(">", 420, y + 16, Y1) } }
    const d4 = st.A(4, .3, .2); if (d4 >= 1) { plate(["HIDDEN = A RANDOM GAME", "NOT THE NEXT GAME"], 320, 70, Y2, { al: "c", bd: R1, cols: [Y2, M3] }) }
    if (st.A(5, .3, .2) >= 1) plate("x 20,940 PLAYERS", 320, 112, Y1, { al: "c", s: 2 });
  }
  SCENES.push({ floor: "1", name: "LOBBY", sec: "TASK", w: W, paint, live, start: { x: 320, y: 340, s: .8, pose: "b" }, speed: 60, rim: O1, clue: 1, clueText: "ONE GAME HIDDEN PER PLAYER",
    exit: { y: 214, s: .3 }, exitWipe: "doors", enterWipe: "iris",
    beats: [
      { foc: [320, 236, 330, 72], y: 296, s: .66, say: ["THE LOBBY. ONE PLAYER, TWELVE GAMES THEY ACTUALLY PLAYED.", "STEAM HAS NO STAR RATINGS. ONLY WHAT YOU OWN AND HOW LONG YOU PLAYED."] },
      { foc: [458, 222, 74, 64], say: ["WE TAKE ONE AT RANDOM AND HIDE IT. THAT IS THE TEST GAME.", "THE MODEL NEVER SEES IT. ITS JOB IS TO GUESS IT BACK."] },
      { foc: [320, 236, 330, 76], say: ["A SECOND ONE IS HELD OUT FOR TUNING: VALIDATION. THE OTHER TEN TRAIN.", "TUNE ON VALIDATION. REFIT ON TRAIN + VALIDATION. SCORE ONCE ON TEST."] },
      { foc: [320, 36, 330, 38], say: ["THE TASK: GIVEN THE GAMES A PLAYER PLAYED, RANK ALL 3,570 GAMES.", "A GOOD MODEL PUTS THE HIDDEN GAME NEAR THE TOP. RANKING, NOT RATING."] },
      { foc: [320, 86, 150, 40], say: ["THE HIDDEN GAME IS RANDOM, NOT THE LATEST. THE FILE HAS NO TIMESTAMPS.", "SO THIS IS NOT NEXT-GAME PREDICTION. WE COME BACK TO THAT ON FLOOR 43."] },
      { foc: [320, 122, 190, 34], clue: true, clueDelay: .6, say: ["SAME TRICK ON EVERY ONE OF 20,940 PLAYERS.", "NEXT QUESTION: HOW DO YOU SCORE A GUESS?"] }] });
})();
