/* 42. THE STRONGROOM. A round door with three locks = three outside checks. Behind it, one deposit box per 16 games: lit = recommended to somebody. */
(() => {
  const DX = 410, DY = 148, DR = 112, GN = 15, GS = 10, G0x = DX - 75, G0y = DY - 75;
  const COV = [["POPULARITY", 1.9, R1], ["ALS", 17.5, O1], ["EASE", 31.0, Y1], ["BPR", 36.1, B2]];
  function paint() { const A = new Buf(W, SH), B = new Buf(W, SH);
    A.rect(0, 0, W, SH, INK); for (let r = 0; r < GN; r++) for (let q = 0; q < GN; q++) { const x = G0x + q * GS, y = G0y + r * GS; A.rect(x, y, GS - 1, GS - 1, N2); A.rect(x, y, GS - 1, 1, V1); A.rect(x + 3, y + 4, 3, 1, GR) }
    B.rect(0, 0, W, SH, K); for (let x = 0; x < W; x += 28) B.rect(x, 0, 1, 262, INK); B.rect(0, 262, W, 34, K); B.rect(0, 262, W, 1, Y1); B.rect(0, 264, W, 1, DM); for (let x = -20; x < W; x += 40) B.line(x, 266, x - 24, SH, IN);
    /* the opening: a ringed hole in the wall */
    B.disc(DX, DY, DR + 12, N2); B.disc(DX, DY, DR + 12, Y1, 0, DR + 11); B.disc(DX, DY, DR + 6, 0, (j, d) => { d[j] = H(DM) }, DR + 5); B.disc(DX, DY, DR - 2, 0, (j, d) => { d[j] = 0 });
    for (let a = 0; a < 16; a++) { const an = a * Math.PI / 8 + .2; B.disc(Math.round(DX + Math.cos(an) * (DR + 6)), Math.round(DY + Math.sin(an) * (DR + 6)), 3, Y1); B.disc(Math.round(DX + Math.cos(an) * (DR + 6)), Math.round(DY + Math.sin(an) * (DR + 6)), 1, K) }
    /* three lock panels */
    for (let i = 0; i < 3; i++) { const y = 16 + i * 82; B.rect(12, y, 262, 74, K); B.rect(12, y, 262, 1, Y1); B.rect(12, y + 73, 262, 1, DM); B.rect(12, y, 1, 74, O2); B.rect(273, y, 1, 74, O2); B.rect(15, y + 3, 256, 1, DM); B.disc(30, y + 20, 9, N2); B.disc(30, y + 20, 9, DM, 0, 8); B.rect(274, y + 36, 16, 3, DM) }
    B.rect(560, 60, 80, 6, K); B.rect(560, 60, 80, 1, DM); B.rect(560, 230, 80, 6, K); B.rect(560, 230, 80, 1, DM);
    return [{ b: A }, { b: B }] }
  const LOCK = [
    ["1 SOMEONE ELSE'S CODE", ["OUR ALS       0.2042", "LIBRARY ALS   0.2034", "256 FACTORS   0.2092 < EASE"]],
    ["2 FOUR NEW RANDOM SPLITS", ["EASE WINS       4 OF 4", "SMALLEST MARGIN 0.0210", "BIGGEST SWING   0.0030"]],
    ["3 A DIFFERENT HIDDEN GAME", ["RECENT, NOT RANDOM", "12,424 PLAYERS QUALIFY", "EASE STILL FIRST"]]];
  function back(st) { const T = st.T, k = st.A(4, 2.4, 1.3); if (st.b < 4) return; let acc = 0, n = 0; const tot = GN * GN;
    COV.forEach(([nm, pc, col], ci) => { const upto = Math.round(tot * pc / 100), kk = cl(k * 4 - ci, 0, 1); for (; n < Math.round(lerp(acc, upto, kk)); n++) { const q = n % GN, r = n / GN | 0, x = G0x + q * GS, y = G0y + r * GS; R(x, y, GS - 1, GS - 1, col); R(x, y, GS - 1, 1, Y2); R(x + 3, y + 4, 3, 1, K) } acc = upto }) }
  function live(st) { const T = st.T, open = st.A(4, 1.2, .1), dx = DX + Math.round(ez(open) * 262), turn = (st.A(1, .8, .2) + st.A(2, .8, .2) + st.A(3, .8, .2)) * 2.094 + ez(open) * 4;
    /* the door */
    circ(dx, DY, DR - 3, K); circ(dx, DY, DR - 8, DM, DR - 9); circ(dx, DY, DR - 24, N2, DR - 27); circ(dx, DY, 62, Y1, 61); circ(dx, DY, 60, INK); circ(dx, DY, 44, DM, 43);
    for (let a = 0; a < 12; a++) { const an = a * Math.PI / 6; circ(Math.round(dx + Math.cos(an) * (DR - 16)), Math.round(DY + Math.sin(an) * (DR - 16)), 3, O2) }
    for (let q = 0; q < 6; q++) { const an = turn + q * 1.047; seg(dx, DY, dx + Math.cos(an) * 54, DY + Math.sin(an) * 54, Y1, 3); circ(Math.round(dx + Math.cos(an) * 56), Math.round(DY + Math.sin(an) * 56), 5, O1) } circ(dx, DY, 12, Y2); circ(dx, DY, 6, K);
    for (let i = 0; i < 3; i++) { const an = -2.2 + i * .65, lx = Math.round(dx + Math.cos(an) * 84), ly = Math.round(DY + Math.sin(an) * 84), ok = st.A(i + 1, .2, .9) >= 1; circ(lx, ly, 8, K); circ(lx, ly, 6, ok ? G2 : R1); circ(lx, ly, 2, ok ? Y2 : R2); tx(String(i + 1), lx - 3, ly + 11, ok ? G2 : M3) }
    /* the lock panels */
    for (let i = 0; i < 3; i++) { const y = 16 + i * 82, on = st.b >= i + 1, ok = st.A(i + 1, .2, .9) >= 1; circ(30, y + 20, 6, ok ? G2 : on ? O1 : R2); if (ok) circ(30, y + 20, 2, Y2); R(274, y + 36, 16, 3, ok ? G2 : DM);
      tx(LOCK[i][0], 46, y + 10, on ? Y2 : GR); if (on) { const k = st.A(i + 1, .7, .1); LOCK[i][1].forEach((l, q) => { if (k >= (q + 1) / 3 || st.b > i + 1) tx(l, 46, y + 26 + q * 13, q === 2 ? (i === 0 ? GL : G2) : GL) }); if (ok) tx("OPEN", 266, y + 60, G2, { al: "r" }) } else tx("LOCKED", 46, y + 26, R3) }
    if (st.b >= 4 && open >= 1) { box(12, 16, 262, 238, K, Y1); tx("INSIDE THE VAULT", 22, 24, O1); tx("1 BOX = 16 GAMES", 22, 40, Y2); tx("LIT = IN SOMEBODY'S TOP 10", 22, 53, GL); R(22, 68, 242, 1, DM);
      COV.forEach(([nm, pc, col], i) => { const y = 78 + i * 26, kk = cl(st.A(4, 2.4, 1.3) * 4 - i, 0, 1); R(22, y, 12, 12, col); R(22, y, 12, 1, Y2); tx(nm, 42, y + 2, Y2); tx((pc * kk).toFixed(1) + "%", 262, y + 2, col, { al: "r" }); R(42, y + 14, Math.round(220 * pc / 100 * kk), 3, col) });
      R(22, 186, 242, 1, DM); tx("NDCG@10 ON TAIL GAMES", 22, 196, GL); tx("POPULARITY", 22, 211, Y2); tx("0.000", 262, 211, M3, { al: "r" }); tx("EASE", 22, 224, Y2); tx("0.021", 262, 224, Y1, { al: "r" }); tx("ACCURACY IS NOT DISCOVERY", 22, 240, G2) }
  }
  SCENES.push({ floor: "42", name: "STRONGROOM", sec: "EVALUATION", w: W, paint, back, live, start: { x: -20, y: 293, s: .7, pose: "s" }, rim: Y1, clue: 9, clueText: "THE VERDICT SURVIVES THREE CHECKS", clueY: "b",
    exit: { x: 670 }, exitWipe: "iris", enterWipe: "iris",
    beats: [
      { foc: [410, 148, 132, 132], x: 300, say: ["FLOOR 42. THE STRONGROOM. THE VERDICT IS LOCKED IN HERE.", "THREE LOCKS. EACH ONE IS A CHECK THAT DOES NOT TRUST OUR CODE OR OUR SPLIT."] },
      { foc: [143, 53, 142, 46], say: ["LOCK 1: SOMEONE ELSE'S CODE. LIBRARY ALS (implicit): 0.2034. OURS: 0.2042.", "GIVE IT 256 FACTORS AND IT REACHES 0.2092. STILL UNDER EASE AT 0.2251.", "SO STOPPING OUR SEARCH AT 128 FACTORS DID NOT DECIDE THE CASE."] },
      { foc: [143, 135, 142, 46], say: ["LOCK 2: REDRAW THE RANDOM SPLIT FOUR TIMES. EASE WINS ALL FOUR,", "NEVER BY LESS THAN 0.0210. NO MODEL'S SCORE MOVES MORE THAN 0.0030.", "THE RANKING IS NOT A LUCKY DRAW."] },
      { foc: [143, 217, 142, 46], say: ["LOCK 3: CHANGE WHAT IS HIDDEN. A RECENTLY PLAYED GAME, NOT A RANDOM ONE.", "12,424 PLAYERS QUALIFY. EASE IS STILL FIRST.", "THE FULL STORY OF THAT ONE IS UPSTAIRS, BEHIND THE CLOCK."] },
      { clue: true, clueDelay: 4, say: ["THE DOOR OPENS. ONE BOX PER 16 GAMES. LIT = SOMEBODY GETS IT RECOMMENDED.", "POPULARITY USES 1.9% OF THE CATALOG. ALS 17.5%. EASE 31.0%. BPR 36.1%.", "TAIL GAMES: POPULARITY 0.000, EASE 0.021. ACCURACY IS NOT DISCOVERY."] }] });
})();
