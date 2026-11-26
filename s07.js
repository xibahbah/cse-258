/* 28. THE CONTROL ROOM. One big terminal. The code on it is the notebook's own, statement for statement. */
(() => {
  const SX = 20, SY = 18, SWd = 600, SHt = 214, PH = "#0a2a26", PD = "#52c49a";
  const PROG = {
    ease: { name: "EASE", ref: "NOTEBOOK 3  class EASE", lines: [
      "class EASE:",
      "    # Steck (2019): B = argmin ||X - XB||^2 + lam||B||^2  s.t. diag(B)=0",
      "    #   ->  B_ij = -P_ij / P_jj, P = (X^T X + lam I)^-1",
      "    def __init__(self, lam=500.0): self.lam = lam",
      "    def fit(self, X, W=None):",
      "        G = gram(X).astype(np.float64)@@co-play counts, 3,570 x 3,570",
      "        G[np.diag_indices_from(G)] += self.lam@@the only knob",
      "        P = np.linalg.inv(G)@@one inverse",
      "        B = -P / np.diag(P)[None, :]",
      "        np.fill_diagonal(B, 0.0)@@no self-recommendation",
      "        self.B = B.astype(np.float32); self.X = X; return self",
      "    def score(self, u): return np.asarray(self.X[u] @ self.B)"] },
    als: { name: "IMPLICIT ALS", ref: "NOTEBOOK 3  ImplicitALS._solve", lines: [
      "# Hu-Koren-Volinsky: minimise sum_{u,i} c_ui (p_ui - x_u.y_i)^2",
      "#   + reg(|x|^2+|y|^2), c_ui = 1 + alpha*r_ui, p_ui = 1[observed]",
      "def _solve(self, R, Y):",
      "    YtY = (Y.T @ Y).astype(np.float64) + self.reg * np.eye(self.f)",
      "    out = np.zeros((R.shape[0], self.f), np.float32)",
      "    ind, ptr, dat = R.indices, R.indptr, R.data",
      "    for u in range(R.shape[0]):@@one player at a time",
      "        s, e = ptr[u], ptr[u + 1]",
      "        if s == e: continue",
      "        Yi = Y[ind[s:e]].astype(np.float64)@@their games",
      "        r = dat[s:e].astype(np.float64)",
      "        A = YtY + (Yi.T * (self.alpha * r)) @ Yi@@confidence",
      "        out[u] = np.linalg.solve(A, (1 + self.alpha * r) @ Yi)",
      "    return out",
      "for _ in range(self.iters):",
      "    self.U = self._solve(R, self.Y); self.Y = self._solve(Rt, self.U)"] },
    bpr: { name: "BPR-MF", ref: "NOTEBOOK 3  BPRMF.fit, batch loop", lines: [
      "sel = perm[s:s + self.batch]; u, i = us[sel], its[sel]@@played pairs",
      "j = draw(len(sel))@@a random game",
      "bad = np.asarray(Xc[u, j]).ravel() > 0@@oops, they played it",
      "if bad.any(): j[bad] = draw(int(bad.sum()))@@draw again",
      "pu, qi, qj = self.P[u], self.Q[i], self.Q[j]",
      "x = (pu * (qi - qj)).sum(1) + self.b[i] - self.b[j]",
      "g = (1 / (1 + np.exp(np.clip(x, -30, 30)))).astype(np.float32)[:, None]",
      "scatter_mean_update(self.P, u, g * (qi - qj) - self.reg * pu, self.lr)",
      "scatter_mean_update(self.Q, i, g * pu - self.reg * qi, self.lr)",
      "scatter_mean_update(self.Q, j, -g * pu - self.reg * qj, self.lr)"] } };
  const TABLE = ["MODEL  HOW IT IS FIT               KNOBS  WHAT IT COSTS", "", "EASE   ONE MATRIX INVERSE          1      MEMORY: GAMES SQUARED", "ALS    ALTERNATING LINEAR SOLVES   3      TIME: FACTORS CUBED PER ROW", "BPR    SGD ON SAMPLED PAIRS        3      MANY EPOCHS, A LEARNING RATE"];
  function paint() { const B = new Buf(W, SH); B.rect(0, 0, W, SH, K);
    for (let x = 0; x < W; x += 40) B.rect(x, 0, 1, 248, INK);
    B.rect(SX - 12, SY - 12, SWd + 24, SHt + 24, N2); B.rect(SX - 12, SY - 12, SWd + 24, 1, Y1); B.rect(SX - 12, SY + SHt + 11, SWd + 24, 1, DM); B.rect(SX - 12, SY - 12, 1, SHt + 24, O2); B.rect(SX + SWd + 11, SY - 12, 1, SHt + 24, O2);
    B.rect(SX - 6, SY - 6, SWd + 12, SHt + 12, K); B.rect(SX - 2, SY - 2, SWd + 4, SHt + 4, G0); B.rect(SX, SY, SWd, SHt, PH);
    for (const [x, y] of [[SX, SY], [SX + SWd - 3, SY], [SX, SY + SHt - 3], [SX + SWd - 3, SY + SHt - 3]]) B.rect(x, y, 3, 3, K);
    for (const [x, y] of [[SX - 9, SY - 9], [SX + SWd + 6, SY - 9], [SX - 9, SY + SHt + 6], [SX + SWd + 6, SY + SHt + 6]]) B.rect(x, y, 3, 3, Y1);
    /* the desk: keys, a tape reel, a lamp */
    B.rect(0, 250, W, 46, K); B.rect(0, 250, W, 1, Y1); B.rect(0, 252, W, 1, DM);
    for (let r = 0; r < 4; r++) for (let q = 0; q < 30; q++) { const x = 112 + q * 14 + r * 3, y = 258 + r * 9; B.rect(x, y, 11, 6, r === 3 && q > 8 && q < 20 ? N2 : IN); B.rect(x, y, 11, 1, V1) }
    for (const x of [50, 590]) { B.disc(x, 272, 22, N2); B.disc(x, 272, 22, DM, 0, 21); B.disc(x, 272, 6, K) }
    return B }
  function live(st) { const T = st.T, b = st.b, key = b < 3 ? "ease" : b === 3 ? "als" : b === 4 ? "bpr" : null, HL = [[], [5, 6, 7], [8, 9], [6, 9, 11, 12], [1, 2, 3, 5, 6]][b] || [];
    for (const x of [50, 590]) { const a = T * (x < 300 ? 1.4 : -1.4); for (let q = 0; q < 3; q++) seg(x, 272, x + Math.cos(a + q * 2.094) * 18, 272 + Math.sin(a + q * 2.094) * 18, O2, 2); circ(x, 272, 5, Y1) }
    R(SX, SY, SWd, 13, G0); tx(key ? PROG[key].name : "TRADE-OFFS", SX + 8, SY + 3, G2); tx(key ? PROG[key].ref : "NOTEBOOK 3", SX + SWd - 8, SY + 3, PD, { al: "r" });
    const fresh = b === 0 || b === 3 || b === 4 || b === 5, shown = fresh ? Math.floor(st.tb * 34) : 99;
    if (key) { const L = PROG[key].lines; L.forEach((l, i) => { if (i > shown) return; const y = SY + 22 + i * 11, on = HL.includes(i), ni = l.indexOf("@@"), note = ni >= 0 ? l.slice(ni + 2) : ""; if (ni >= 0) l = l.slice(0, ni);
        if (on) { R(SX + 2, y - 2, SWd - 4, 11, "#145046"); R(SX + 2, y - 2, 3, 11, Y1) } const cm = l.trimStart().startsWith("#");
        tx(l, SX + 10, y, cm ? G1 : on ? Y2 : (HL.length ? PD : G2)); if (note && on) { tx(note, SX + SWd - 10, y, Y1, { al: "r" }); tx("<", SX + SWd - 22 - tw(note), y, O1) } });
      if ((T * 2 | 0) % 2 && L.length < 14) R(SX + 10, SY + 22 + Math.min(shown + 1, L.length) * 11, 7, 8, G2);
      const foot = { 2: ["COST: A GAME x GAME WEIGHT MATRIX. MEMORY GROWS WITH THE CATALOG SQUARED.", "SAME IDEA AS SLIM, BUT ONLY AN L2 PENALTY: SO IT HAS A CLOSED FORM."], 3: ["COST: ONE f x f SOLVE PER PLAYER AND PER GAME, EVERY SWEEP. CUBIC IN f."], 4: ["COST: CHEAP PER STEP, BUT IT NEEDS A LEARNING RATE AND MANY EPOCHS."] }[b];
      if (foot && st.A(b, .2, b === 2 ? .2 : 1) >= 1) foot.forEach((f, i) => tx(f, SX + 10, SY + SHt - 12 * (foot.length - i) - 2, i ? PD : Y1)) }
    else { TABLE.forEach((l, i) => { if (i > shown) return; tx(l, SX + 10, SY + 34 + i * 16, i === 0 ? Y1 : i === 2 ? Y2 : G2) }); R(SX + 10, SY + 46, 560, 1, PD);
      if (st.A(5, .2, .6) >= 1) { tx("EASE HAS THE FEWEST MOVING PARTS. IT STILL HAS TO WIN ON THE DATA.", SX + 10, SY + 140, PD); if ((T * 2 | 0) % 2) R(SX + 10, SY + 158, 7, 8, G2) } }
  }
  SCENES.push({ floor: "28", name: "CONTROL ROOM", sec: "MODELING", w: W, paint, live, start: { x: 320, y: 400, s: 1.3, pose: "b" }, speed: 60, rim: G2, clue: 6, clueText: "EASE IS ONE MATRIX INVERSE", clueY: "b",
    exit: {}, exitWipe: "fade", enterWipe: "iris",
    beats: [
      { y: 358, say: ["FLOOR 28. THE CONTROL ROOM. THE WINNING MODEL FITS ON ONE SCREEN.", "EASE PREDICTS EACH GAME FROM A WEIGHTED SUM OF THE PLAYER'S OTHER GAMES."] },
      { say: ["COUNT HOW OFTEN EACH PAIR OF GAMES IS PLAYED BY THE SAME PERSON.", "ADD LAMBDA TO THE DIAGONAL. INVERT THE MATRIX. ONCE."] },
      { say: ["DIVIDE EACH COLUMN BY ITS DIAGONAL ENTRY. ZERO THE DIAGONAL,", "SO A GAME CANNOT RECOMMEND ITSELF. NO GRADIENT DESCENT. ONE KNOB."] },
      { say: ["ALS. FOR EACH PLAYER, ONE SMALL LINEAR SYSTEM OVER THE GAMES THEY PLAYED.", "THE CONFIDENCE WEIGHT ENTERS IN A: PLAYED CELLS COUNT 1 + ALPHA x R.", "THEN THE SAME FOR EACH GAME. TEN SWEEPS."] },
      { say: ["BPR. TAKE A PLAYED GAME i. DRAW A RANDOM GAME j. RE-DRAW IF j WAS PLAYED.", "x IS SCORE(i) - SCORE(j). THE STEP SIZE IS SIGMOID(-x):", "PAIRS ALREADY IN ORDER BARELY MOVE ANYTHING. KEEP THAT IN MIND FOR FLOOR 41."] },
      { clue: true, clueDelay: 1, say: ["SIDE BY SIDE. EASE: ONE INVERSE, ONE KNOB, BUT A GAME x GAME MATRIX.", "ALS AND BPR SCALE TO BIGGER CATALOGS, AND COST MORE TUNING.", "ENOUGH THEORY. UPSTAIRS: WHO ACTUALLY FOUND THE GAME."] }] });
})();
