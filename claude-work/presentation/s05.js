/* 13. THE ORGAN LOFT. 3,570 games sorted by players; one pipe = 51 games; pipe height = average players. The long tail. */
(() => {
  const V = [5320, 2519, 1810, 1384, 1045, 864, 756, 673, 585, 513, 463, 412, 359, 327, 299, 277, 255, 235, 215, 197, 184, 172, 158, 146, 135, 126, 119, 113, 108, 102, 96, 91, 86, 82, 78, 74, 70, 66, 63, 60, 58, 55, 53, 50, 48, 46, 44, 43, 41, 39, 38, 36, 35, 33, 32, 31, 30, 29, 28, 28, 27, 26, 25, 24, 23, 22, 22, 21, 20, 20];
  const PXo = i => 60 + i * 8, BY = 230, ph = v => 6 + Math.round(190 * v / 5320);
  function paint() { const B = new Buf(W, SH); B.rect(0, 0, W, SH, K);
    for (let i = -10; i < 10; i += 2) { const a0 = i * .16, a1 = a0 + .16; B.poly([[320, 262], [320 + Math.sin(a0) * 560, 262 - Math.cos(a0) * 560], [320 + Math.sin(a1) * 560, 262 - Math.cos(a1) * 560]], N1) }
    for (const r of [110, 170, 230, 290]) B.disc(320, 262, r, 0, (j, d) => { d[j] = d[j] === H(N1) ? H(N2) : d[j] === H(K) ? H(N1) : d[j] }, r - 1);
    B.rect(0, 0, W, 12, N2); B.rect(0, 12, W, 1, Y1); B.rect(0, 14, W, 1, DM);
    for (let s = 0; s < 3; s++) { const w = 30 - s * 8; B.rect(0, 15 + s * 9, w, 9, N2); B.rect(0, 23 + s * 9, w, 1, Y1); B.rect(W - w, 15 + s * 9, w, 9, N2); B.rect(W - w, 23 + s * 9, w, 1, Y1) }
    B.rect(0, 15, 12, SH, N2); B.rect(11, 15, 1, SH, M1); B.rect(W - 12, 15, 12, SH, N2); B.rect(W - 12, 15, 1, SH, B1);
    /* the wind chest the pipes stand on, and the console */
    B.rect(50, BY, 576, 8, K); B.rect(50, BY, 576, 1, Y1); B.rect(50, BY + 7, 576, 1, DM); for (let x = 56; x < 622; x += 8) B.rect(x, BY + 3, 4, 2, DM);
    B.rect(262, BY + 8, 116, 50, K); B.rect(262, BY + 8, 116, 1, O2); B.rect(262, BY + 8, 1, 50, O2); B.rect(377, BY + 8, 1, 50, O2);
    for (let m = 0; m < 3; m++) { const y = BY + 14 + m * 10; B.rect(280, y, 80, 6, Y2); for (let x = 283; x < 360; x += 4) B.rect(x, y, 1, 6, K); for (let x = 282; x < 358; x += 4) if ((x >> 2) % 7 !== 2 && (x >> 2) % 7 !== 6) B.rect(x, y, 3, 3, K) }
    for (let r = 0; r < 4; r++) for (const x of [267, 272, 366, 371]) B.rect(x, BY + 14 + r * 8, 3, 3, r % 2 ? Y1 : O1);
    B.rect(0, SH - 6, W, 6, N2); B.rect(0, SH - 6, W, 1, DM);
    /* the scale on the left */
    [[5000, "5K"], [2500, "2.5K"], [0, "0"]].forEach(([v, s]) => { const y = BY - 6 - Math.round(190 * v / 5320); B.rect(48, y, 6, 1, GR); B.text(s, 46, y - 3, GR, { al: "r" }) });
    return B }
  const bar = (y, n, max, s, col) => { const w = Math.max(3, Math.round(300 * n / max)); tx(s, 304, y, col || Y2); R(304, y + 11, w, 7, Y1); R(304, y + 17, w, 1, O1) };
  function live(st) { const T = st.T, g = st.A(0, 1.8, .3), hot = Math.floor(Math.pow(hs(Math.floor(T * 5), 3), 2.2) * 70);
    for (let i = 0; i < 70; i++) { const gi = cl(g * 1.7 - i / 70 * .7, 0, 1), h = Math.round(ph(V[i]) * ez(gi)); if (h <= 0) continue; const x = PXo(i), y = BY - h; let body = Y1, hi = Y2, sh = O2;
      if (st.b === 1) { if (i === 0) { body = M3; sh = R1 } else if (i < 7) { body = Y1 } else if (i >= 35) { body = DM; hi = O2; sh = K } else { body = O1; hi = Y1 } }
      if (i === hot && gi >= 1 && st.b !== 1) body = Y2;
      R(x, y, 6, h, body); R(x, y, 1, h, hi); R(x + 5, y, 1, h, sh); R(x, y, 6, 1, hi); if (h > 12) R(x + 1, BY - 9, 4, 2, K) }
    if (g >= 1) { const a = (T * 5) % 1; R(PXo(hot) + 2, BY - ph(V[hot]) - 5 - a * 16, 2, 2, a < .5 ? Y2 : O1); R(PXo(hot) + 4, BY - ph(V[hot]) - 9 - a * 16, 1, 3, O1) }
    if (st.b === 0 && g >= 1) { plate(["TALLEST PIPE: THE 51 BIGGEST GAMES", "5,320 PLAYERS EACH, ON AVERAGE"], 76, 24, Y2, { cols: [Y2, Y1] }); R(68, 34, 8, 1, Y1);
      plate(["3,570 GAMES, MOST PLAYED ON THE LEFT", "1 PIPE = 51 GAMES"], 300, 96, GL, { cols: [Y2, GL] }); plate(["SHORTEST PIPE: 20 PLAYERS", "(THE CUT-OFF)"], 400, 180, GL); R(617, 208, 1, 14, GL) }
    if (st.b === 1) { const k = st.A(1, .9, .2); plate(["1 PIPE = 1.4% OF THE GAMES", (24.6 * ez(k)).toFixed(0) + "% OF ALL PLAY"], 76, 24, Y2, { bd: R1, cols: [Y2, M3] }); R(68, 34, 8, 1, R1);
      if (k >= 1) { const brk = (x0, x1, col) => { R(x0, BY + 10, x1 - x0, 1, col); R(x0, BY + 8, 1, 3, col); R(x1 - 1, BY + 8, 1, 3, col) };
        brk(60, 116, Y1); plate("7 PIPES (10%): 63% OF PLAY", 40, BY + 16, Y1); brk(340, 620, GR); plate("35 PIPES (50%): 6% OF PLAY", 392, BY + 16, GL);
        plate(["57% OF GAMES HAVE", "FEWER THAN 100 PLAYERS"], 330, 70, Y2); plate(["SO: POPULARITY WINS ON THE HITS", "AND IS BLIND TO EVERYTHING ELSE"], 330, 110, GL, { cols: [Y1, GL] }) } }
    if (st.b === 2 || st.b === 5) { const k = st.b === 5 ? 1 : st.A(2, 2, .2); tx("THE CUT", 304, 30, O1);
      if (k > 0) bar(44, 88310, 88310, "88,310 PROFILE LINES"); if (k > .25) bar(70, 87626, 88310, "87,626 PLAYERS (684 MERGED)"); if (k > .5) bar(96, 24793, 88310, "24,793 IN A 35% RANDOM SAMPLE"); if (k > .75) bar(122, 20940, 88310, "20,940 WITH 5+ PLAYED GAMES");
      if (k >= 1) plate(st.b === 5 ? ["20,940 PLAYERS x 3,570 GAMES", "MATRIX 1: PLAYED (0 / 1)", "MATRIX 2: LOG(1 + HOURS)"] : ["20,940 PLAYERS x 3,570 GAMES", "1,063,175 TRAINING PAIRS", "1.4% OF THE MATRIX IS FILLED"], 304, 152, Y2, { bd: G2, cols: [Y1, st.b === 5 ? G2 : Y2, st.b === 5 ? G2 : GL] }) }
  }
  const kcore = { title: "kcore() and the split", ref: "NOTEBOOK 2.4", lines: [
    "def kcore(df, min_u, min_i):",
    "    while True:",
    "        n0 = len(df)",
    "        df = df[df.groupby(\"user_id\").item_id.transform(\"size\") >= min_u]",
    "        df = df[df.groupby(\"item_id\").user_id.transform(\"size\") >= min_i]",
    "        if len(df) == n0:",
    "            return df",
    "",
    "# per-user random order -> rank 1 = test, 2 = validation, >=3 = train",
    "pos[\"rnd\"] = rng.random(len(pos))",
    "pos[\"rk\"]  = pos.groupby(\"u\").rnd.rank(method=\"first\")",
    "train, val, test = pos[pos.rk > 2], pos[pos.rk == 2], pos[pos.rk == 1]",
    "",
    "def build(df, weighted=False):",
    "    v = np.log1p(df.hours.values) if weighted else np.ones(len(df))"] };
  SCENES.push({ floor: "13", name: "ORGAN LOFT", sec: "DATA", w: W, paint, live, start: { x: 320, y: 340, s: .8, pose: "b" }, speed: 60, clue: 4, clueText: "A FEW GAMES HAVE THE PLAYERS", cards: { kcore },
    exit: {}, exitWipe: "iris", enterWipe: "iris",
    beats: [
      { foc: [150, 122, 150, 122], y: 297, s: .62, say: ["FLOOR 13. THE ORGAN LOFT. EVERY GAME IN THE FILE, SORTED BY PLAYERS.", "ONE PIPE = 51 GAMES. PIPE HEIGHT = HOW MANY PEOPLE PLAYED THEM."] },
      { foc: [160, 122, 165, 125], say: ["ONE PIPE DOES A QUARTER OF THE PLAYING. SEVEN PIPES DO 63% OF IT.", "HALF THE CATALOG SHARES THE LAST 6%. THAT IS A LONG TAIL.", "SO LATER WE SPLIT EVERY RESULT BY HEAD, TORSO AND TAIL."] },
      { foc: [454, 112, 172, 96], say: ["THE CUT. MERGE DUPLICATES. TAKE A 35% RANDOM SAMPLE OF PLAYERS.", "KEEP PLAYERS WITH 5+ PLAYED GAMES AND GAMES WITH 20+ PLAYERS.", "LEFT: 20,940 PLAYERS x 3,570 GAMES. 1,063,175 TRAINING PAIRS."] },
      { card: "kcore", hl: [1, 2, 3, 4, 5, 6], say: ["EVIDENCE: THE FILTER. DROPPING A GAME CAN PUSH A PLAYER BELOW 5 GAMES,", "SO IT LOOPS UNTIL A PASS REMOVES NOTHING."] },
      { card: "kcore", hl: [9, 10, 11], say: ["THEN THE SPLIT. ONE RANDOM NUMBER PER ROW, RANKED INSIDE EACH PLAYER.", "RANK 1 IS THE TEST GAME. RANK 2 IS VALIDATION. EVERYTHING ELSE TRAINS."] },
      { foc: [454, 170, 172, 42], clue: true, clueDelay: .5, say: ["TWO MATRICES COME OUT OF THIS FLOOR: PLAYED OR NOT, AND LOG(1 + HOURS).", "THE SECOND ONE FEEDS THE PLAYTIME-WEIGHTED MODEL. NOW THE MACHINES."] }] });
})();
