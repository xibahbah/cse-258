/* 44. THE ROOF, AT DAWN. Nine rooftop signs = the related work, in three groups. Then the verdict, the limits, and the sun. */
(() => {
  const SKY = [[0, N2], [26, V1], [52, V2], [80, V3], [108, M1], [134, M2], [158, M3], [180, C1], [200, C2], [218, Y2]], HZ = 236;
  const SIGN = [
    ["1. SAME STEAM DATA", B2, [["KANG & McAULEY 2018", "PREDICT THE NEXT GAME"], ["WAN & McAULEY 2018", "BEHAVIOR CHAINS"], ["PATHAK ET AL. 2017", "RECOMMEND BUNDLES"]]],
    ["2. SAME FINDINGS", Y1, [["STECK 2019 (WWW)", "EASE BEATS MF"], ["RENDLE ET AL. 2022", "TUNED ALS CATCHES UP"], ["RENDLE ET AL. 2009", "BPR: AUC, NOT TOP-N"]]],
    ["3. SAME METHOD", M3, [["KRICHENE & RENDLE 2020", "RANK THE FULL CATALOG"], ["FERRARI DACREMA 2019", "TUNE YOUR BASELINES"], ["PATHAK ET AL. 2017", "THE STEAM CRAWL"]]]];
  const SXs = [14, 222, 430], SYs = [34, 82, 130], SWd = 196, SHh = 38;
  function paint() { const S = new Buf(W, SH), F = new Buf(W, SH);
    SKY.forEach((b, i) => S.rect(0, b[0], W, (SKY[i + 1] ? SKY[i + 1][0] : HZ) - b[0], b[1])); S.rect(0, HZ, W, SH - HZ, K);
    for (let i = 0; i < 26; i++) S.rect(rnd() * W, rnd() * 50, 1, 1, V3);
    /* far city, then the near roofs that carry the signs */
    for (let x = -4; x < W;) { const w = 8 + rnd() * 14 | 0, h = 10 + rnd() * 40 | 0; F.rect(x, HZ - h, w, h, M1); x += w + (rnd() * 3 | 0) } fogBand(F, 212, HZ, M2, 6); for (let x = -6; x < W;) { const w = 12 + rnd() * 18 | 0, h = 6 + rnd() * 26 | 0; F.rect(x, HZ - h, w, h, FB); x += w + (rnd() * 4 | 0) } fogBand(F, 226, HZ, M1, 11);
    SXs.forEach((x, g) => { F.rect(x + 16, 176, SWd - 32, HZ - 176, K); F.rect(x + 36, 168, SWd - 72, 8, K); F.rect(x + 16, 176, SWd - 32, 1, SIGN[g][1]); for (let q = x + 26; q < x + SWd - 30; q += 12) for (let y = 184; y < HZ - 6; y += 9) if (hs(q, y) > .6) F.rect(q, y, 3, 4, hs(y, q) > .5 ? Y1 : DM);
      F.rect(x + 30, 30, 2, 146, K); F.rect(x + SWd - 32, 30, 2, 146, K); for (let y = 40; y < 170; y += 16) { F.line(x + 31, y, x + 44, y + 12, K); F.line(x + SWd - 31, y, x + SWd - 44, y + 12, K) } });
    /* our roof: parapet, tank, the crown we saw from the street */
    F.rect(0, HZ, W, SH - HZ, K); F.rect(0, HZ, W, 2, Y1); F.rect(0, HZ + 2, W, 1, O2); for (let x = 6; x < W; x += 20) { F.rect(x, HZ + 6, 12, 8, IN); F.rect(x, HZ + 6, 12, 1, V1) } F.rect(0, HZ + 18, W, 1, DM);
    F.rect(594, 196, 34, 40, K); F.poly([[590, 196], [632, 196], [611, 182]], K); F.rect(598, 236, 3, 10, K); F.rect(621, 236, 3, 10, K); F.rect(594, 196, 1, 40, C1);
    return [{ b: S }, { b: F }] }
  const birds = [...Array(5)].map((_, i) => ({ p: i * 1.3, y: 40 + i * 13 }));
  function back(st) { const T = st.T, up = st.b < 3 ? .12 + st.b * .1 : st.b === 3 ? .45 : st.b === 4 ? .6 : lerp(.6, 1, ez(st.A(5, 3))), sy = Math.round(HZ + 6 - up * 60);
    if (st.b >= 5) for (let q = -4; q <= 4; q++) { const a = q * .3 + Math.sin(T * .2) * .05, pts = [[320, sy], [320 + Math.sin(a - .06) * 520, sy - Math.cos(a - .06) * 520], [320 + Math.sin(a + .06) * 520, sy - Math.cos(a + .06) * 520]]; for (let i = 0; i < SKY.length - 1; i++) lpoly(pts, SKY[i + 1][1], SKY[i][0], SKY[i + 1][0] - 1) }
    circ(320, sy, 30, Y2); circ(320, sy, 38, C2, 36);
    for (const b of birds) { const x = ((T * 14 + b.p * 130) % 720) - 40, y = b.y + Math.sin(T + b.p) * 4, f = (T * 5 + b.p | 0) % 2; R(x, y, 3, 1, K); R(x - 3, y - (f ? 2 : -1), 3, 1, K); R(x + 3, y - (f ? 2 : -1), 3, 1, K) } }
  function live(st) { const T = st.T;
    SIGN.forEach(([head, col, items], g) => { const k = st.A(g, .9, .2); if (k <= 0 && st.b <= g) return; const x = SXs[g], dim = st.b >= 3;
      if (dim) return;
      tx(head, x + SWd / 2, 21, col, { al: "c", ol: true });
      items.forEach((it, r) => { const kk = st.b > g ? 1 : cl(k * 3 - r, 0, 1); if (kk <= 0) return; const y = SYs[r], fl = kk < 1 && (T * 16 | 0) % 2; box(x, y, SWd, SHh, K, fl ? DM : (dim ? GR : col)); R(x + 2, y + 2, SWd - 4, 1, DM); R(x + 2, y + SHh - 3, SWd - 4, 1, DM); if (fl) return;
        tx(it[0], x + SWd / 2, y + 8, dim ? GL : Y2, { al: "c" }); tx(it[1], x + SWd / 2, y + 21, dim ? GR : col, { al: "c" });
        if (!dim) for (let q = 0; q < 12; q++) R(x + 6 + q * 16 + ((T * 6 | 0) % 2) * 8, y - 1, 2, 1, Y2) }) });
    if (st.b === 0 && st.A(0, .3, 1.4) >= 1) plate(["OTHER TASKS, WITH", "TIMESTAMPS OR REVIEWS.", "NOT COMPARABLE TO US."], 22, 178, Y2, { cols: [GL, GL, Y1] });
    if (st.b === 3) { const k = st.A(3, .4, .2); if (k >= 1) plate(["WE DEFEND", "EASE > ALS > THE REST ON TOP-10 METRICS.", "IT HOLDS UNDER A SECOND IMPLEMENTATION, FOUR SPLITS,", "AND A DIFFERENT HIDDEN GAME.", "MOST OF AN UNTUNED EASE-ALS GAP IS A TUNING ARTIFACT."], 320, 60, Y2, { al: "c", bd: G2, cols: [G2, Y1, Y2, Y2, GL] }) }
    if (st.b === 4) { const k = st.A(4, .4, .2); if (k >= 1) plate(["WE DISTRUST", "THE ABSOLUTE LEVEL OF ANY NUMBER HERE.", "ANY CLAIM ABOUT THE NEXT GAME A PLAYER BUYS.", "LIMITS: OFFLINE PROXY. TUNED ON ONE SPLIT.", "SEARCH STOPPED AT 128 FACTORS. A 35% SAMPLE.", "NEXT: A TIME-AWARE SPLIT. CONTENT FOR COLD-START GAMES."], 320, 52, Y2, { al: "c", bd: R1, cols: [M3, Y2, Y2, GL, GL, G2] }) }
    if (st.b === 5) { const k = st.A(5, .25, .5); if (k > 0) { const s = k < 1 ? 3 : 3, w = tw("CASE CLOSED", "P", s) + 28, x = (W - w) >> 1, y = 58 + Math.round((1 - k) * -10); box(x, y, w, 44, K, R1); R(x + 3, y + 3, w - 6, 1, R1); R(x + 3, y + 40, w - 6, 1, R1); R(x + 3, y + 3, 1, 38, R1); R(x + w - 4, y + 3, 1, 38, R1); tx("CASE CLOSED", x + 14, y + 11, R1, { s: 3 }) }
      if (st.A(5, .3, 1.4) >= 1) { plate(["THE MISSING GAME WAS FOUND BY A MATRIX INVERSE.", "CHECKED THREE WAYS."], 320, 112, Y2, { al: "c", cols: [Y2, GL] }); tx(TEAM, 320, 146, Y2, { al: "c", ol: true }); tx("CSE 258", 320, 159, Y2, { al: "c", ol: true }) } }
  }
  SCENES.push({ floor: "44", name: "ROOF", sec: "RELATED WORK", w: W, paint, back, live, start: { x: -20, y: 293, s: .7, pose: "s" }, rim: C2,
    exit: {}, exitWipe: "fade", enterWipe: "iris",
    beats: [
      { foc: [112, 118, 122, 114], x: 110, say: ["THE ROOF. OTHERS WORKED THIS CITY. SAME STEAM DATA, DIFFERENT QUESTIONS:", "WHAT COMES NEXT IN A SEQUENCE, CHAINS OF BEHAVIOR, WHICH BUNDLE TO BUY.", "THEY HAD TIMESTAMPS OR REVIEWS. WE CANNOT COMPARE NUMBERS WITH THEM."] },
      { foc: [320, 100, 112, 92], x: 300, say: ["WHERE WE CAN COMPARE, WE AGREE WITH THE LITERATURE.", "EASE AHEAD OF MATRIX FACTORIZATION: STECK 2019. TUNED ALS CATCHES UP:", "RENDLE ET AL. 2022. BPR STRONG ON AUC, WEAK ON TOP-N: RENDLE ET AL. 2009."] },
      { foc: [528, 100, 112, 92], x: 500, say: ["OUR METHOD CAME FROM THERE TOO. RANK THE FULL CATALOG, NO SAMPLED NEGATIVES:", "KRICHENE & RENDLE 2020. TUNE THE BASELINES AS HARD AS YOUR OWN MODEL:", "FERRARI DACREMA ET AL. 2019. THE CRAWL ITSELF: PATHAK ET AL. 2017."] },
      { sec: "VERDICT", x: 320, pose: "b", say: ["WHAT WE WOULD DEFEND IN COURT: EASE, THEN ALS, THEN EVERYONE ELSE.", "UNDER A SECOND IMPLEMENTATION, FOUR SPLITS AND A DIFFERENT HIDDEN GAME.", "AND THAT MOST OF AN UNTUNED GAP BETWEEN THEM IS A TUNING ARTIFACT."] },
      { sec: "VERDICT", x: 320, pose: "b", say: ["WHAT WE WOULD NOT SWEAR TO: THE ABSOLUTE LEVEL OF ANY NUMBER,", "OR ANY CLAIM ABOUT THE NEXT GAME A PLAYER WILL ACTUALLY PICK UP.", "NEXT TIME: A TIME-AWARE SPLIT, AND CONTENT FEATURES FOR COLD-START GAMES."] },
      { sec: "VERDICT", x: 320, pose: "b", say: ["CASE 258 IS CLOSED.", "THANK YOU."] }] });
})();
