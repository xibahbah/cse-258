/* 40. THE PENTHOUSE. Eight towers outside the window, one per model. Lit floors = the score. Then the same towers relit by AUC. */
(() => {
  const NM = ["RANDOM", "POPULAR", "BPR", "KNN", "SVD", "ALS-W", "ALS", "EASE"], ND = [.0012, .1165, .1498, .1511, .1642, .1951, .2042, .2251], HR = [.0027, .1890, .2464, .2432, .2661, .3096, .3249, .3483], AU = [.4983, .9076, .9484, .9275, .9168, .9429, .9468, .9094];
  const TX = i => 44 + i * 72, TW = 46, BY = 250, nf = i => Math.round(ND[i] / .005), af = i => Math.max(0, Math.round((AU[i] - .9) / .001));
  const BL0 = "#0e1244", BL1 = "#1c1f7a", BL2 = "#2c36b0", BL3 = "#6a7cff", WD = "#12164a";
  function paint() { const B = new Buf(W, SH);
    [[0, N1], [34, BL0], [74, BL1], [114, BL2], [150, B1], [184, BL3], [212, B2], [236, Y2]].forEach((q, i, A) => B.rect(0, q[0], W, (A[i + 1] ? A[i + 1][0] : BY) - q[0], q[1]));
    for (let i = 0; i < 70; i++) B.rect(rnd() * W, rnd() * 110, 1, 1, rnd() < .3 ? Y2 : BL3); B.disc(620, 84, 11, Y2); B.disc(625, 80, 10, BL1);
    for (let x = -4; x < W;) { const w = 8 + rnd() * 14 | 0, h = 16 + rnd() * 54 | 0; B.rect(x, BY - h, w, h, BL2); x += w + (rnd() * 3 | 0) } fogBand(B, 214, BY, BL3, 4); for (let x = -6; x < W;) { const w = 12 + rnd() * 18 | 0, h = 10 + rnd() * 36 | 0; B.rect(x, BY - h, w, h, BL1); x += w + (rnd() * 4 | 0) } fogBand(B, 232, BY, B1, 9);
    for (let i = 0; i < 8; i++) { const x = TX(i); B.rect(x, 50, TW, 200, K); B.rect(x, 50, 1, 200, i === 7 ? Y1 : BL3); B.rect(x + TW - 1, 50, 1, 200, BL0);
      if (i % 4 === 0) { B.rect(x + 6, 44, TW - 12, 6, K); B.rect(x + 22, 34, 2, 10, K) } else if (i % 4 === 1) { B.rect(x + 4, 45, TW - 8, 5, K); B.rect(x + 12, 40, TW - 24, 5, K) } else if (i % 4 === 2) { B.poly([[x + 8, 50], [x + TW - 8, 50], [x + 23, 38]], K) } else { B.rect(x + 3, 46, TW - 6, 4, K); B.rect(x + 9, 42, TW - 18, 4, K); B.rect(x + 16, 38, TW - 32, 4, K) }
      if (i === 7) for (let k = -2; k <= 2; k++) { const a = k * .5; B.poly([[x + 23, 40], [x + 23 + Math.sin(a - .16) * 12, 40 - Math.cos(a - .16) * 12], [x + 23 + Math.sin(a + .16) * 12, 40 - Math.cos(a + .16) * 12]], k % 2 ? O1 : Y1) }
      for (let f = 0; f < 50; f++) for (let q = 0; q < 6; q++) B.rect(x + 6 + q * 6, BY - 3 - f * 4, 4, 2, WD); for (let f = 10; f < 50; f += 10) B.rect(x + 2, BY - f * 4, 3, 1, GR) }
    /* the room: sill, balustrade, floor with pools of window light */
    B.rect(0, BY, W, 8, K); B.rect(0, BY, W, 1, Y1); for (let x = 4; x < W; x += 10) B.rect(x, BY + 2, 5, 5, IN); B.rect(0, BY + 8, W, 38, K); B.rect(0, BY + 8, W, 1, DM);
    for (const x0 of [10, 186, 474]) B.poly([[x0 + 16, BY + 10], [x0 + 148, BY + 10], [x0 + 190, SH], [x0 - 10, SH]], BL0);
    B.poly([[202, BY + 10], [452, BY + 10], [520, SH], [150, SH]], BL0);
    NM.forEach((n, i) => B.text(n, TX(i) + 23, 264, i === 7 ? Y1 : GL, { al: "c" }));
    return B }
  function live(st) { const T = st.T, auc = st.b >= 2, k = auc ? st.A(2, 1.6, .2) : st.A(0, 2.4, .3);
    for (let i = 0; i < 8; i++) { const x = TX(i), n = auc ? Math.round(lerp(nf(i), af(i), ez(k))) : Math.round(nf(i) * ez(cl(k * 1.5 - i * .06, 0, 1)));
      for (let f = 0; f < n; f++) for (let q = 0; q < 6; q++) R(x + 6 + q * 6, BY - 3 - f * 4, 4, 2, hs(i * 7 + q, f) > .86 ? Y2 : (auc ? C2 : Y1));
      if (n > 0) R(x + 2, BY - n * 4 - 1, TW - 4, 1, auc ? B2 : O1);
      if (i === 0 && (T * 3 | 0) % 4 !== 0) R(x + 18, BY - 3 - 16, 4, 2, Y1);
      const done = auc ? k >= 1 : cl(k * 1.5 - i * .06, 0, 1) >= 1; if (done || auc) { const v = auc ? (k >= 1 ? AU[i] : lerp(ND[i], AU[i], k)) : ND[i]; const top1 = !auc && i === 7; tx(v.toFixed(3), x + 23, top1 ? 18 : 26, top1 ? Y1 : Y2, { al: "c", ol: true, s: top1 && (auc ? k >= 1 : true) ? 2 : 1 }); if (!auc) tx("HIT " + HR[i].toFixed(3).slice(1), x + 23, 276, i === 7 ? O1 : GR, { al: "c" }) } }
    for (const x of [0, 175, 463, 636]) { R(x, 0, 4, BY, K); R(x, 0, 1, BY, BL0) } R(0, 0, W, 5, K); R(0, 5, W, 1, DM);
    plate(auc ? "LIT FLOORS = AUC ABOVE 0.90   (1 FLOOR = 0.001)" : "LIT FLOORS = NDCG@10 ON TEST   (1 FLOOR = 0.005)", 126, 8, auc ? B2 : Y1);
    if (st.b === 1) { const a = st.A(1, .4, .2); if (a >= 1) { const y1 = BY - nf(7) * 4, y0 = BY - nf(6) * 4; R(524, y1, 22, 1, Y1); R(524, y0, 22, 1, Y1); R(534, y1, 1, y0 - y1, Y1);
        plate(["EASE - ALS = +0.0210", "95% CI: +0.0185 TO +0.0234", "PAIRED BOOTSTRAP. EXCLUDES ZERO."], 300, 96, Y2, { bd: Y1, cols: [Y1, Y2, GL] }); seg(518, 104, 534, y1 + 8, Y1);
        plate(["EASE vs POPULARITY", "+93%"], 130, 96, Y2, { bd: O1, cols: [GL, Y1] }) } }
    if (st.b >= 2 && k >= 1) { plate(["BPR FIRST", "0.948"], TX(2) + 23, 70, Y1, { al: "c", bd: B2 }); if (st.b >= 3) plate(["EASE = POPULARITY", "0.909 vs 0.908"], TX(7) - 20, 150, Y2, { al: "c", bd: M3, cols: [M3, Y2] }) }
    if (st.b === 3 && st.A(3, .3, .3) >= 1) plate(["AUC GRADES ALL 3,570 POSITIONS", "NDCG@10 GRADES THE TEN A PLAYER SEES", "A STORE SHOWS TEN. WE JUDGE BY THE TEN."], 150, 100, Y2, { cols: [B2, Y1, Y2] });
  }
  SCENES.push({ floor: "40", name: "PENTHOUSE", sec: "EVALUATION", w: W, paint, live, start: { x: 320, y: 340, s: .8, pose: "b" }, speed: 60, rim: B2, clue: 7, clueText: "THE METRICS DISAGREE", clueY: "b",
    exit: {}, exitWipe: "iris", enterWipe: "iris",
    beats: [
      { y: 297, s: .62, say: ["FLOOR 40. THE PENTHOUSE. EIGHT TOWERS, ONE PER MODEL, WORST TO BEST.", "LIT FLOORS = NDCG@10 ON THE TEST GAMES. EASE 0.225. TUNED ALS 0.204.", "POPULARITY 0.117. RANDOM: ONE WINDOW."] },
      { foc: [505, 126, 150, 128], say: ["EASE BEATS ALS BY 0.0210, ABOUT 10%. IS THAT REAL OR LUCK?", "PAIRED BOOTSTRAP OVER PLAYERS: 95% INTERVAL +0.0185 TO +0.0234.", "IT EXCLUDES ZERO. SMALL LEAD, REAL LEAD. OVER POPULARITY: +93%."] },
      { foc: [211, 140, 64, 128], say: ["NOW RELIGHT THE SAME TOWERS BY AUC. THE SKYLINE CHANGES.", "BPR IS FIRST AT 0.948. ALS SECOND. EASE FALLS TO 0.909,", "LEVEL WITH POPULARITY AT 0.908."] },
      { foc: [320, 120, 215, 40], clue: true, clueDelay: 1.2, say: ["SAME MODELS, SAME PLAYERS, TWO DIFFERENT WINNERS.", "AUC AVERAGES ALL 3,570 POSITIONS. NDCG@10 LOOKS AT THE TEN A PLAYER SEES.", "FOR A RECOMMENDER, THE TOP TEN IS THE PRODUCT. BUT WHY IS BPR SO SPLIT?"] }] });
})();
