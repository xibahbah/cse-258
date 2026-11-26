/* THE LIFT. The floor dial is the ranking: rank 1 on the left, rank 3,570 on the right, the top ten in gold. */
(() => {
  const DX = 320, DY = 98, DR = 80, LN = Math.log(3570), ang = r => Math.PI * (1 - Math.log(r) / LN), X0 = 214, X1 = 426, Y0 = 108, Y1b = 272;
  function paint() { const S = new Buf(W, SH), B = new Buf(W, SH); S.rect(0, 0, W, SH, K);
    B.rect(0, 0, W, SH, K); B.rect(0, 0, W, 10, N2); B.rect(0, 10, W, 1, Y1); B.rect(0, 12, W, 1, DM);
    for (let x = 4; x < W; x += 18) { B.rect(x, 14, 1, 258, x % 36 < 18 ? IN : N1) }
    /* floor with a fan inlay */
    B.rect(0, Y1b, W, SH - Y1b, N2); B.rect(0, Y1b, W, 1, Y1); for (let k = -9; k <= 9; k++) B.line(320, SH + 30, 320 + k * 60, Y1b + 1, k % 2 ? V1 : DM);
    for (const r of [44, 70]) B.disc(320, SH + 30, r, 0, (j, d) => { if (d[j] === H(N2)) d[j] = H(V1) }, r - 1);
    /* side boards */
    for (const x of [10, 440]) { B.rect(x, 22, 190, 242, K); B.rect(x, 22, 190, 1, Y1); B.rect(x, 263, 190, 1, Y1); B.rect(x, 22, 1, 242, O2); B.rect(x + 189, 22, 1, 242, O2); B.rect(x + 3, 25, 184, 1, DM); B.rect(x + 3, 260, 184, 1, DM); B.rect(x + 3, 25, 1, 236, DM); B.rect(x + 186, 25, 1, 236, DM);
      for (const [cx, cy] of [[x + 7, 29], [x + 182, 29], [x + 7, 256], [x + 182, 256]]) B.rect(cx - 1, cy - 1, 3, 3, Y1) }
    /* door frame and the opening onto the shaft */
    B.rect(X0 - 10, Y0 - 8, X1 - X0 + 20, Y1b - Y0 + 8, K); B.rect(X0 - 10, Y0 - 8, X1 - X0 + 20, 1, Y1); B.rect(X0 - 10, Y0 - 8, 1, Y1b - Y0 + 8, Y1); B.rect(X1 + 9, Y0 - 8, 1, Y1b - Y0 + 8, Y1); B.rect(X0 - 5, Y0 - 3, X1 - X0 + 10, 1, DM); B.rect(X0 - 5, Y0 - 3, 1, Y1b - Y0 + 3, DM); B.rect(X1 + 4, Y0 - 3, 1, Y1b - Y0 + 3, DM);
    for (let y = Y0; y < Y1b; y++) for (let x = X0; x < X1; x++) B.d[y * W + x] = 0;
    /* scissor gate */
    const gp = (x, y, col) => { if (x >= X0 && x < X1 && y >= Y0 && y < Y1b) B.rect(x, y, 1, 1, col) };
    for (let o = -400; o < 400; o += 24) for (let y = Y0; y < Y1b; y++) { const a = X0 + o + (y - Y0) * .62, b = X1 - o - (y - Y0) * .62; gp(Math.round(a), y, DM); gp(Math.round(a) + 1, y, O2); gp(Math.round(b), y, DM); gp(Math.round(b) - 1, y, O2) }
    for (let x = X0 + 2; x < X1; x += 35) for (let y = Y0; y < Y1b; y++) gp(x, y, K);
    B.rect(X0, Y0, X1 - X0, 2, O2); B.rect(X0, Y1b - 3, X1 - X0, 3, DM); B.rect(319, Y0, 2, Y1b - Y0, Y1); B.rect(312, 188, 16, 5, Y1); B.rect(312, 193, 16, 1, O2);
    /* the dial housing */
    B.rect(226, 12, 188, 90, K); B.rect(238, 6, 164, 8, K); B.rect(226, 12, 188, 1, Y1); B.rect(238, 6, 164, 1, Y1); B.rect(226, 12, 1, 90, O2); B.rect(413, 12, 1, 90, O2);
    B.disc(DX, DY, DR, Y1); B.disc(DX, DY, DR - 2, INK); B.disc(DX, DY, DR - 5, 0, (j, d) => { d[j] = H(DM) }, DR - 6);
    for (let r = 1; r <= 10; r += .02) { const a = ang(r); for (let q = 60; q <= 73; q++) B.rect(DX + Math.cos(a) * q, DY - Math.sin(a) * q, 2, 2, Y1) }
    for (const r of [1, 2, 3, 5, 10, 20, 30, 50, 100, 200, 300, 500, 1000, 2000, 3570]) { const a = ang(r), big = [1, 10, 100, 1000, 3570].includes(r); for (let q = big ? 58 : 66; q <= 73; q++) B.rect(DX + Math.cos(a) * q, DY - Math.sin(a) * q, 1, 1, r <= 10 ? K : (big ? Y2 : GR)) }
    B.rect(DX - DR - 4, DY, 2 * DR + 8, 14, K); B.rect(DX - DR - 4, DY, 2 * DR + 8, 1, Y1); B.disc(DX, DY, 7, Y1); B.rect(DX - 8, DY + 1, 17, 8, K);
    [[1, "1", 268, 86], [10, "10", 286, 58], [100, "100", 330, 46], [1000, "1000", 362, 66]].forEach(([r, s, x, y]) => B.text(s, x, y, r <= 10 ? Y1 : GL, { al: "c" })); B.text("3570", 366, 84, GL);
    B.text("RANK (LOG SCALE)", DX, DY + 4, O1, { al: "c" });
    for (const x of [100, 540]) { B.disc(x, 12, 7, Y2); B.disc(x, 12, 7, O1, 0, 6); B.rect(x - 8, 3, 17, 9, N2); B.rect(x - 9, 11, 19, 1, Y1) }
    return [{ b: S }, { b: B }] }
  function back(st) { const T = st.T, sp = st.ex ? 0 : 70;
    for (let i = 0; i < 4; i++) { const y = ((T * sp + i * 96) % 384) - 60 + Y0; R(X0, y, X1 - X0, 5, V1); R(X0, y + 5, X1 - X0, 14, IN); R(X0, y - 1, X1 - X0, 1, V3);
      const dx = X0 + 24 + ((i * 67) % 120); R(dx, y - 46, 30, 45, N2); R(dx + 3, y - 43, 24, 42, i % 2 ? O2 : V2); R(dx + 14, y - 43, 2, 42, N2); R(dx + 40, y - 30, 8, 8, Y1); tx(String(2 + ((T * sp / 96 | 0) + (4 - i)) % 40), dx + 60, y - 30, FB) } }
  const rankAt = st => { if (st.b === 0) return Math.max(3, Math.round(Math.exp(lerp(LN, Math.log(3), ez(st.A(0, 2.2, .5)))))); if (st.b === 1) return 3; if (st.b === 2) return Math.round(Math.exp(lerp(Math.log(3), Math.log(40), ez(st.A(2, .9, .2))))); if (st.b === 3) return 40; if (st.b === 4) return 1 + Math.floor(hs(Math.floor(st.T * 2.2), 7) * 3569); return 3 };
  function live(st) { const T = st.T, rk = rankAt(st), a = ang(rk) + (st.b === 4 ? Math.sin(T * 30) * .01 : 0), hit = rk <= 10;
    seg(DX, DY - 1, DX + Math.cos(a) * 60, DY - 1 - Math.sin(a) * 60, R1, 2); R(DX - 2, DY - 3, 5, 3, R1);
    plate("RANK " + fmt(rk), DX, 112, hit ? Y1 : M3, { al: "c", bd: hit ? Y1 : R3 });
    for (const x of [100, 540]) if ((T * 2 + x | 0) % 7 === 0) R(x - 3, 13, 7, 3, O1);
    /* left board: four meters, all read off the one rank */
    const lx = 20; tx("FOUR METERS, ONE RANK", lx + 4, 32, st.b >= 1 ? O1 : DM);
    if (st.b >= 1) { const ndcg = hit ? 1 / Math.log2(rk + 1) : 0, mrr = 1 / rk, auc = 1 - (rk - 1) / 3557, k = st.A(1, .4);
      [["HIT@10", hit ? 1 : 0, hit ? "1" : "0", "RANK <= 10 ?"], ["NDCG@10", ndcg, ndcg.toFixed(2), "1/LOG2(RANK+1)"], ["MRR", mrr, mrr.toFixed(3), "1/RANK"], ["AUC", auc, auc.toFixed(3), "SHARE RANKED BELOW"]].forEach(([nm, v, s, f], i) => { if (k < (i + 1) / 4) return; const y = 48 + i * 53;
        tx(nm, lx + 4, y, Y2); tx(s, lx + 166, y, v > 0.0005 ? Y1 : M3, { al: "r" }); box(lx + 4, y + 12, 164, 9, INK, DM); R(lx + 6, y + 14, Math.round(160 * v), 5, i === 3 ? B2 : Y1); if (i === 0) R(lx + 6, y + 14, 160, 5, hit ? Y1 : R2);
        tx(f, lx + 4, y + 25, GL); if (i < 2) tx("TOP 10 ONLY", lx + 4, y + 36, O1); if (i === 3) tx("THE WHOLE LIST", lx + 4, y + 36, B2) }) }
    /* right board: the rules, then the two baselines */
    const rx = 450; tx(st.b >= 4 ? "TWO BASELINES" : "THE RULES", rx + 4, 32, st.b >= 3 ? O1 : DM);
    if (st.b === 3 || st.b > 4) { const k = st.b > 4 ? 1 : st.A(3, .8); ["RANK ALL 3,570 GAMES", "NO SAMPLED NEGATIVES", "", "MEAN OVER 20,940", "PLAYERS", "", "95% BOOTSTRAP", "INTERVAL ON EACH", "", "RECALL@10 = HIT@10", "(ONE HIDDEN GAME)"].forEach((l, i) => { if (k >= i / 11) tx(l, rx + 4, 52 + i * 11, [0, 3, 6, 9].includes(i) ? Y2 : GL) }) }
    if (st.b === 4) { const k = st.A(4, .6); tx("RANDOM", rx + 4, 52, Y2); tx("HIT@10", rx + 4, 66, GL); tx("0.0027", rx + 166, 66, M3, { al: "r" }); tx("EXPECTED", rx + 4, 78, GL); tx("0.0028", rx + 166, 78, GL, { al: "r" }); tx("NEEDLE LANDS ANYWHERE", rx + 4, 92, GR);
      if (k >= 1) { R(rx + 4, 106, 166, 1, DM); tx("POPULARITY", rx + 4, 116, Y2); tx("HIT@10", rx + 4, 130, GL); tx("0.1890", rx + 166, 130, Y1, { al: "r" }); tx("NDCG@10", rx + 4, 142, GL); tx("0.1165", rx + 166, 142, Y1, { al: "r" }); tx("SAME 10 FOR EVERYONE", rx + 4, 156, GR);
        box(rx + 4, 172, 166, 30, WINE, R1); tx("THE BAR", rx + 87, 177, Y2, { al: "c" }); tx("TO CLEAR", rx + 87, 189, Y2, { al: "c" }) } }
  }
  const rank = { title: "rank_of_targets()", ref: "NOTEBOOK 4.1", lines: [
    "def rank_of_targets(model, X_seen, targets, users, batch=2000):",
    "    ranks = np.empty(len(users), np.int64)",
    "    for s in range(0, len(users), batch):",
    "        ub = users[s:s + batch]",
    "        sc = np.array(model.score(ub), dtype=np.float32)",
    "        r, c = X_seen[ub].nonzero(); sc[r, c] = -np.inf",
    "        t = sc[np.arange(len(ub)), targets[ub]][:, None]",
    "        ranks[s:s + len(ub)] = (sc > t).sum(1) + (sc == t).sum(1)",
    "    return ranks",
    "",
    "def metrics_from_ranks(ranks, n_cand, K=TOP_K):",
    "    hit = ranks <= K",
    "    return {\"HR\": hit.astype(float),",
    "            \"NDCG\": np.where(hit, 1 / np.log2(ranks + 1.0), 0.0),",
    "            \"MRR\": 1.0 / ranks, \"AUC\": 1 - (ranks - 1) / (n_cand - 1)}"] };
  const tests = { title: "known-answer tests", ref: "NOTEBOOK 4.1", lines: [
    "S = [[9, 5, 7, 1, 3],@@top game already owned: masked. rank 2",
    "     [4, 4, 4, 1, 0],@@three-way tie counts against. rank 3",
    "     [1, 2, 9, 0, 3],@@target scored highest. rank 1",
    "     [5, 9, 9, 1, 0]]@@target scored lowest. rank 3",
    "tg = np.array([1, 0, 2, 4]); uu = np.arange(4)",
    "rk = rank_of_targets(_Fixed(S), seen, tg, uu)",
    "assert rk.tolist() == [2, 3, 1, 3], rk"] };
  SCENES.push({ floor: "UP", name: "LIFT", sec: "TASK", w: W, paint, back, live, start: { x: 320, y: 340, s: .8, pose: "b" }, speed: 60, clue: 2, clueText: "ONE RANK, FOUR METERS", cards: { rank, tests },
    exit: {}, exitWipe: "doors", enterWipe: "doors",
    beats: [
      { foc: [320, 70, 112, 72], y: 296, s: .66, say: ["GOING UP. THE MODEL RANKS EVERY GAME THE PLAYER HAS NOT PLAYED YET.", "ONE QUESTION: WHERE DID THE HIDDEN GAME LAND? RANK 1 IS A PERFECT GUESS."] },
      { foc: [105, 143, 112, 134], say: ["SAY IT LANDED AT RANK 3. FOUR METERS READ THAT ONE NUMBER:", "HIT@10 = 1.  NDCG@10 = 1/LOG2(4) = 0.50.  MRR = 1/3.  AUC = 0.999."] },
      { foc: [105, 143, 112, 134], say: ["NOW RANK 40: OUTSIDE THE TOP TEN. HIT 0, NDCG 0. THE PLAYER NEVER SEES IT.", "AUC STILL SAYS 0.989. IT GRADES THE WHOLE LIST. REMEMBER THAT."] },
      { foc: [535, 143, 112, 134], say: ["HOUSE RULES: RANK THE FULL CATALOG, NO SAMPLED NEGATIVES.", "AVERAGE OVER ALL PLAYERS. PUT A 95% BOOTSTRAP INTERVAL ON EVERY SCORE."] },
      { foc: [535, 143, 112, 134], say: ["TWO BASELINES. RANDOM: HIT@10 0.0027, AND THEORY SAYS 0.0028. SANITY CHECK.", "POPULARITY: THE SAME TEN BEST-SELLERS FOR EVERYONE. HIT@10 0.189. BEAT THAT."] },
      { card: "rank", hl: [5, 7], say: ["EVIDENCE: THE WHOLE EVALUATION IS THIS ONE FUNCTION.", "OWNED GAMES ARE MASKED TO -INF. TIES COUNT AGAINST THE MODEL."] },
      { card: "rank", hl: [11, 12, 13, 14], say: ["ALL FOUR METRICS ARE COMPUTED FROM THAT ONE RANK.", "SO IF THE RANK IS RIGHT, THE METRICS CANNOT DISAGREE BY ACCIDENT."] },
      { card: "tests", hl: [0, 1, 2, 3, 6], note: "> All evaluation and split checks passed", clue: true, clueDelay: 1.6, say: ["IS THE RULER STRAIGHT? FOUR HAND-BUILT CASES WITH KNOWN ANSWERS.", "MASKED GAME, TIE, BEST RANK, WORST RANK. PLUS: NO TRAIN/TEST OVERLAP."] }] });
})();
