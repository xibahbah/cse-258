/* 41. INTERROGATION. One lamp, one suspect (BPR), a corkboard with three exhibits and red string. */
(() => {
  const PAPER = "#f3e3b0", INKC = "#1a1030", CORK = "#3b2310", CK2 = "#2a180a";
  const CARD = [[70, 22], [240, 22], [410, 22]], CWd = 160, CHt = 132;
  function paint() { const A = new Buf(W, SH), B = new Buf(W, SH); A.rect(0, 0, W, SH, K);
    for (let x = 0; x < W; x += 32) A.rect(x, 0, 1, 236, INK); A.rect(0, 236, W, 60, K); A.rect(0, 236, W, 1, R2);
    /* the corkboard */
    A.rect(52, 8, 536, 160, K); A.rect(52, 8, 536, 1, Y1); A.rect(52, 167, 536, 1, DM); A.rect(52, 8, 1, 160, O2); A.rect(587, 8, 1, 160, O2); A.rect(58, 14, 524, 148, CORK); for (let i = 0; i < 500; i++) A.rect(58 + rnd() * 522, 14 + rnd() * 146, 2, 1, CK2);
    /* table, chair: their own layer, so the lamp's cone falls behind them */
    B.rect(214, 214, 212, 6, K); B.rect(214, 214, 212, 1, Y2); B.rect(214, 215, 212, 1, O1); B.rect(226, 220, 6, 50, K); B.rect(408, 220, 6, 50, K); B.rect(226, 220, 1, 50, R3); B.rect(408, 220, 1, 50, R3);
    B.rect(452, 196, 4, 74, K); B.rect(452, 196, 30, 4, K); B.rect(478, 150, 4, 50, K); B.rect(452, 226, 30, 3, K); B.rect(478, 150, 1, 50, O2);
    return [{ b: A }, { b: B }] }
  const sway = T => Math.round(Math.sin(T * .9) * 10);
  function back(st) { const bx = 320 + sway(st.T); lpoly([[bx - 14, 196], [bx + 14, 196], [bx + 170, SH], [bx - 170, SH]], N1); lpoly([[bx - 8, 196], [bx + 8, 196], [bx + 96, SH], [bx - 96, SH]], IN) }
  const card = (i, k, head, body) => { const [x, y0] = CARD[i], y = y0 + Math.round((1 - ez(k)) * -14); if (k <= 0) return null; R(x + 3, y + 3, CWd, CHt, CK2); R(x, y, CWd, CHt, PAPER); R(x, y, CWd, 13, INKC); tx(head, x + 5, y + 3, PAPER); circ(x + CWd / 2, y - 1, 3, R1); R(x + CWd / 2 - 1, y - 2, 1, 1, Y2); if (k >= 1) body(x, y); return [x, y] };
  const stamp = (x, y, s, col) => { const w = tw(s) + 10; R(x, y, w, 14, PAPER); R(x, y, w, 1, col); R(x, y + 13, w, 1, col); R(x, y, 1, 14, col); R(x + w - 1, y, 1, 14, col); R(x + 2, y + 2, w - 4, 1, col); R(x + 2, y + 11, w - 4, 1, col); tx(s, x + 5, y + 4, col) };
  function live(st) { const T = st.T, bx = 320 + sway(T);
    /* red string from the suspect's photo to each exhibit */
    const px = 320, py = 180; for (let i = 0; i < 3; i++) if (st.A(i + 1, .4) >= 1) seg(CARD[i][0] + CWd / 2, CARD[i][1] + CHt - 4, px, py - 6, R1);
    card(0, st.A(1, .4), "1 UNDER-TRAINED?", (x, y) => { R(x + 14, y + 24, 1, 56, INKC); R(x + 14, y + 80, 130, 1, INKC); let py2 = 0; for (let q = 0; q < 124; q++) { const v = Math.exp(-q / 16) * .82 + .1, yy = y + 80 - Math.round(v * 52); R(x + 16 + q, yy, 2, 2, R1) }
      tx("epoch", x + 100, y + 84, INKC, { f: "T" }); tx("learning signal", x + 20, y + 22, INKC, { f: "T" }); tx("FLAT AFTER A FEW", x + 8, y + 96, INKC); tx("EPOCHS", x + 8, y + 107, INKC); stamp(x + 98, y + 112, "NO", R1) });
    card(1, st.A(2, .4), "2 WRONG TARGET?", (x, y) => { const n = Math.round(963 * st.A(2, 1.2, .5) / 10); for (let q = 0; q < 100; q++) { const cx = x + 10 + (q % 20) * 7, cy = y + 20 + (q / 20 | 0) * 7; if (q < n) R(cx, cy, 5, 5, INKC); else { R(cx, cy, 5, 5, R1); R(cx + 1, cy + 1, 3, 3, PAPER) } }
      tx("96.3% OF PAIRS", x + 8, y + 60, INKC); tx("ALREADY IN ORDER", x + 8, y + 71, INKC); tx("AUC      0.949", x + 8, y + 86, INKC); tx("NDCG@10  0.142", x + 8, y + 97, R1); stamp(x + 90, y + 112, "YES", "#0e6a4a") });
    card(2, st.A(3, .4), "3 HARD NEGATIVES?", (x, y) => { const k = st.A(3, .9, .5), h0 = Math.round(142 * .34), h1 = Math.round(lerp(142, 78, ez(k)) * .34), hp = Math.round(112 * .34); R(x + 12, y + 80, 136, 1, INKC);
      R(x + 12, y + 80 - h0, 46, h0, INKC); R(x + 88, y + 80 - h1, 46, h1, R1); for (let q = x + 12; q < x + 148; q += 6) R(q, y + 80 - hp, 3, 1, INKC); tx("popularity 0.112", x + 62, y + 80 - hp - 8, INKC, { f: "T" });
      tx("0.142", x + 15, y + 80 - h0 + 4, PAPER); tx((lerp(142, 78, ez(k)) / 1000).toFixed(3), x + 91, y + 80 - h1 + 4, PAPER); tx("UNIFORM", x + 12, y + 84, INKC); tx("POP^.75", x + 84, y + 84, R1); tx("VALIDATION NDCG@10", x + 8, y + 98, INKC); stamp(x + 82, y + 112, "WORSE", R1) });
    /* the lamp */
    R(bx, 168, 1, 14, DM); lpoly([[bx - 16, 196], [bx + 17, 196], [bx + 7, 182], [bx - 6, 182]], G1); R(bx - 16, 195, 33, 1, G2); R(bx - 6, 182, 13, 1, G2); R(bx - 4, 196, 9, 3, Y2);
    /* the suspect on the table: a small BPR balance, tilting nervously */
    const a = Math.sin(T * 5) * .08 + Math.sin(T * 1.1) * .16, dx = Math.cos(a) * 30, dy = Math.sin(a) * 30; R(318, 184, 4, 30, K); R(308, 210, 24, 4, K); R(318, 184, 1, 30, O1); seg(320 - dx, 186 + dy, 320 + dx, 186 - dy, Y1, 2);
    for (const sg of [-1, 1]) { const qx = 320 + sg * dx, qy = 186 - sg * dy; seg(qx, qy, qx - 7, qy + 16, DM); seg(qx, qy, qx + 7, qy + 16, DM); R(qx - 9, qy + 16, 19, 2, O2); R(qx - 4, qy + 9, 8, 7, sg > 0 ? Y1 : GR) } circ(320, 184, 3, Y2);
    plate("BPR-MF", 320, 222, Y2, { al: "c", bd: R1 }); if ((T * 1.3 | 0) % 3 === 0) { R(300, 190 + (T * 20 % 14), 1, 3, B2) }
    if (st.b === 0) plate(["AUC: 1ST OF 7", "NDCG@10: 6TH OF 7"], 480, 196, Y2, { cols: [G2, M3] });
    if (st.b === 4 && st.A(4, .3, .3) >= 1) { plate(["LIBRARY BPR (implicit)  0.1386", "OUR BPR                 0.1498", "NOT A BUG. IT IS THE METHOD."], 36, 184, Y2, { bd: G2, cols: [GL, Y1, G2] }) }
  }
  SCENES.push({ floor: "41", name: "INTERROGATION", sec: "EVALUATION", w: W, paint, back, live, start: { x: -20, y: 291, s: .8, pose: "s" }, rim: Y2, clue: 8, clueText: "BPR OPTIMIZES PAIRS, NOT THE TOP TEN", clueY: "b",
    exit: { x: 670 }, exitWipe: "iris", enterWipe: "iris",
    beats: [
      { foc: [320, 200, 132, 52], x: 150, say: ["FLOOR 41. INTERROGATION. THE SUSPECT: BPR-MF.", "BEST AUC IN THE BUILDING. SIXTH OF SEVEN WHERE IT COUNTS. THREE QUESTIONS."] },
      { foc: [150, 88, 94, 80], say: ["QUESTION 1: DID WE STOP TRAINING TOO EARLY?", "NO. THE LEARNING SIGNAL SHRINKS AND GOES FLAT WITHIN A FEW EPOCHS.", "MORE EPOCHS BUY NOTHING."] },
      { foc: [320, 88, 94, 80], say: ["QUESTION 2: IS IT OPTIMIZING THE WRONG THING?", "YES. BY THE END, 96.3% OF SAMPLED PAIRS ARE ALREADY IN THE RIGHT ORDER.", "THAT IS WHAT AUC 0.949 MEANS. THE TOP TEN IS DECIDED BY THE REST."] },
      { foc: [490, 88, 94, 80], say: ["QUESTION 3: WOULD HARDER NEGATIVES HELP? SAMPLE POPULAR GAMES MORE OFTEN.", "WORSE. VALIDATION NDCG@10 FALLS FROM 0.142 TO 0.078, BELOW POPULARITY."] },
      { foc: [240, 204, 225, 42], clue: true, clueDelay: 1, say: ["LAST QUESTION: IS IT OUR CODE? THE implicit LIBRARY'S BPR SCORES 0.1386.", "OURS SCORES 0.1498. SO NO.", "VERDICT: BPR DOES ITS JOB. ITS JOB IS PAIRS, NOT THE TOP TEN."] }] });
})();
