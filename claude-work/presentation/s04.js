/* 12. THE ARCHIVE. A long room; the camera follows. Cabinet height = owners, lit drawers = share who ever played. */
(() => {
  const SW = 1240, FY = 236, CAB = [["DOTA 2 TEST", 17249, 7, 25, 2], ["CS:GO", 15170, 99, 22, 22], ["GARRY'S MOD", 15015, 97, 22, 21], ["L4D2 BETA", 12833, 4, 19, 1], ["L4D2", 12833, 94, 19, 18]], CX0 = 694, CP = 100, CW = 76, DH = 7;
  const WIN = [60, 296, 532, 768, 1004];
  function paint() { const S = new Buf(880, SH), B = new Buf(SW, SH);
    [[0, N1], [40, N2], [78, V1], [110, V2], [136, V3], [156, M1], [170, M2]].forEach((q, i, A) => S.rect(0, q[0], 880, (A[i + 1] ? A[i + 1][0] : 190) - q[0], q[1])); S.rect(0, 190, 880, 106, K);
    for (let i = 0; i < 80; i++) S.rect(rnd() * 880, rnd() * 100, 1, 1, rnd() < .3 ? Y2 : V3); S.disc(250, 70, 26, Y2); S.disc(250, 70, 38, 0, (j, d) => { if (d[j] === H(V1)) d[j] = H(V2); else if (d[j] === H(N2)) d[j] = H(V1) }, 34);
    for (let x = 0; x < 880;) { const w = 10 + rnd() * 18 | 0, h = 30 + rnd() * 90 | 0; S.rect(x, 190 - h, w, h, rnd() < .5 ? FB : K); for (let y = 190 - h + 4; y < 186; y += 5) for (let q = x + 2; q < x + w - 2; q += 3) if (hs(q / 7 | 0, y / 12 | 0) > .62 && rnd() < .5) S.rect(q, y, 1, 2, Y1); x += w + (rnd() * 3 | 0) }
    B.rect(0, 0, SW, FY, K); B.rect(0, 0, SW, 9, N2); B.rect(0, 9, SW, 1, Y1); B.rect(0, 11, SW, 1, DM);
    for (let x = 14; x < SW; x += 118) { B.rect(x, 12, 12, FY - 12, IN); B.rect(x, 12, 1, FY - 12, V1); B.rect(x + 11, 12, 1, FY - 12, N1) }
    /* tall windows: holes in the wall, with mullions and a stepped head */
    for (const x of WIN) { for (let y = 28; y < 180; y++) for (let i = x; i < x + 84; i++) B.d[y * SW + i] = 0; for (let y = 16; y < 28; y++) for (let i = x + 14; i < x + 70; i++) B.d[y * SW + i] = 0;
      B.rect(x + 27, 16, 2, 164, K); B.rect(x + 55, 16, 2, 164, K); B.rect(x, 74, 84, 2, K); B.rect(x, 124, 84, 2, K); B.rect(x - 2, 180, 88, 3, N2); B.rect(x - 2, 180, 88, 1, V3);
      for (let q = 0; q < 5; q++) B.line(x + 42, 28, x + 6 + q * 18, 16, K);
      B.poly([[x + 6, FY], [x + 90, FY], [x + 170, SH], [x + 74, SH]], 0, (j, d) => { }) }
    /* floor */
    B.rect(0, FY, SW, SH - FY, N1); B.rect(0, FY, SW, 1, Y1); B.rect(0, FY + 2, SW, 1, DM); for (let x = 0; x < SW; x += 46) B.line(x, FY + 3, x - 30, SH, K); for (let i = 0; i < 160; i++) B.rect(rnd() * SW, FY + 5 + rnd() * 52, 4 + rnd() * 18, 1, K);
    for (const x of WIN) B.poly([[x + 6, FY + 3], [x + 90, FY + 3], [x + 170, SH], [x + 74, SH]], 0, (j, d) => { d[j] = d[j] === H(N1) ? H(V1) : d[j] === H(K) ? H(N2) : d[j] });
    /* green-shade lamps */
    for (let x = 200; x < SW; x += 236) { B.rect(x, 12, 1, 40, DM); B.poly([[x - 24, 68], [x + 25, 68], [x + 10, 52], [x - 9, 52]], G1); B.rect(x - 24, 67, 49, 2, G2); B.rect(x - 9, 52, 19, 1, G2); B.rect(x - 4, 69, 9, 3, Y2);
      B.poly([[x - 22, 72], [x + 22, 72], [x + 74, FY], [x - 74, FY]], 0, (j, d) => { if (d[j] === H(K)) d[j] = H(N1); else if (d[j] === H(IN)) d[j] = H(N2) }) }
    /* A: shipping crates */
    const crate = (x, y, w, h) => { B.rect(x, y, w, h, DM); for (let q = x; q < x + w; q += 14) B.rect(q, y, 1, h, K); B.rect(x, y, w, 2, O2); B.rect(x, y + h - 3, w, 3, K); B.rect(x, y, 3, h, O2); B.rect(x + w - 3, y, 3, h, K); B.rect(x + 3, y + 8, w - 6, 2, K); B.rect(x + 3, y + h - 12, w - 6, 2, K) };
    crate(70, 158, 150, 78); crate(84, 92, 122, 66); crate(234, 172, 112, 64);
    B.rect(80, 176, 130, 36, K); B.text("UCSD", 145, 180, Y2, { al: "c", s: 2 }); B.text("McAULEY LAB", 145, 200, Y1, { al: "c" });
    B.rect(92, 108, 106, 34, K); B.text("STEAM DATA", 145, 113, Y2, { al: "c" }); B.text("VIDEO GAMES", 145, 124, Y1, { al: "c", f: "T" }); B.text("AND BUNDLES", 145, 132, Y1, { al: "c", f: "T" });
    B.rect(242, 186, 96, 30, K); B.text("AUSTRALIAN", 290, 190, Y2, { al: "c" }); B.text("USERS", 290, 202, Y2, { al: "c" });
    /* B: a desk under the lamp, pigeonholes on the wall */
    B.rect(416, 58, 104, 86, K); B.rect(416, 58, 104, 1, Y1); for (let r = 0; r < 4; r++) for (let q = 0; q < 5; q++) { B.rect(420 + q * 20, 62 + r * 20, 16, 16, IN); if (hs(q, r) > .35) B.rect(421 + q * 20, 66 + r * 20 + (hs(r, q) * 4 | 0), 14, 2, C2); if (hs(q + 3, r) > .6) B.rect(421 + q * 20, 72 + r * 20, 14, 2, DM) }
    B.rect(396, 198, 190, 6, K); B.rect(396, 198, 190, 1, Y1); B.rect(402, 204, 178, 32, K); B.rect(402, 204, 178, 1, DM); B.rect(410, 210, 60, 20, IN); B.rect(512, 210, 60, 20, IN); B.rect(434, 218, 12, 2, Y1); B.rect(536, 218, 12, 2, Y1);
    /* C: five cabinets */
    CAB.forEach((cb, i) => { const x = CX0 + i * CP, h = cb[3] * DH + 8, y = FY - h; B.rect(x - 2, y - 3, CW + 4, 3, K); B.rect(x - 2, y - 3, CW + 4, 1, Y1); B.rect(x, y, CW, h, K); B.rect(x, y, 2, h, V2); B.rect(x + CW - 1, y, 1, h, N2);
      for (let dI = 0; dI < cb[3]; dI++) { const yy = FY - 4 - (dI + 1) * DH; B.rect(x + 5, yy, CW - 10, DH - 1, N2); B.rect(x + 5, yy, CW - 10, 1, V1); B.rect(x + CW / 2 - 5, yy + 3, 10, 1, GR) } });
    /* a rolling ladder against the second cabinet */
    B.line(CX0 + CP + 84, FY, CX0 + CP + 64, 40, DM, 2); B.line(CX0 + CP + 96, FY, CX0 + CP + 76, 40, DM, 2); for (let y = 60; y < FY; y += 14) B.rect(CX0 + CP + 66 + (y - 40) * .1, y, 12, 1, O2);
    /* the way up */
    B.rect(1196, 96, 44, 140, K); B.rect(1196, 96, 44, 1, Y1); B.rect(1196, 96, 1, 140, O2); for (let q = 0; q < 8; q++) B.rect(1200 + q * 5, 226 - q * 16, 40, 2, Y1); B.text("UP", 1218, 82, O1, { al: "c" });
    return [{ b: S, p: .4 }, { b: B }] }
  const motes = [...Array(40)].map((_, i) => ({ x: WIN[i % 5] + 20 + (i * 37) % 120, y: 190 + (i * 53) % 100, p: i * 1.7 }));
  function live(st) { const T = st.T;
    for (const m of motes) { const y = FY + 4 + ((m.y + T * 3) % 56), x = m.x + Math.sin(T * .5 + m.p) * 6 + (y - FY) * .9; if (Math.sin(T * 1.4 + m.p) > .2) R(x, y - 60 + (m.p % 3) * 20, 1, 1, V3) }
    for (let x = 200; x < SW; x += 236) if ((T * 3 + x | 0) % 9 === 0) R(x - 4, 69, 9, 3, G2);
    /* A: where the data came from */
    if (st.b === 0) { const k = st.A(0, 1.4, .3); plate([fmt(88310 * ez(k)) + " PROFILE LINES", "ONE LINE = ONE PLAYER'S LIBRARY"], 370, 40, Y2, { cols: [Y1, GL] });
      if (k >= 1) plate(["EACH GAME ON A LINE:", "playtime_forever", "playtime_2weeks"], 370, 76, GL, { cols: [GL, G2, G2] }) }
    /* B: two files for the same player */
    if (st.b >= 1) { const k = st.A(1, 1, .7), gap = Math.round(26 * (1 - ez(k))); const fold = (x, col) => { R(x, 160, 34, 38, col); R(x, 156, 14, 5, col); R(x + 1, 161, 32, 1, Y2); R(x + 5, 170, 24, 2, DM); R(x + 5, 176, 18, 2, DM); R(x + 5, 182, 22, 2, DM) };
      if (k < 1) { fold(474 - gap, C2); fold(474 + gap, C1) } else { fold(474, C2); box(468, 172, 46, 12, K, G2); tx("MERGED", 471, 174, G2, { f: "T" }) }
      if (st.b === 1) plate(k < 1 ? ["684 PLAYERS", "FILED TWICE"] : ["684 MERGED", "87,626 PLAYERS LEFT"], 530, 100, Y2, { bd: k < 1 ? R1 : G2, cols: [Y1, Y2] }) }
    /* C: owned is not played */
    CAB.forEach((cb, i) => { const x = CX0 + i * CP, k = st.A(2, 1.2, .3 + i * .25), top = FY - cb[3] * DH - 8; if (k <= 0) return; const lit = Math.round(cb[4] * k);
      for (let dI = 0; dI < lit; dI++) { const yy = FY - 4 - (dI + 1) * DH; R(x + 5, yy, CW - 10, DH - 1, Y1); R(x + 5, yy, CW - 10, 1, Y2); R(x + 5, yy + DH - 2, CW - 10, 1, O1); R(x + CW / 2 - 5, yy + 3, 10, 1, K) }
      if (k >= 1) { const low = cb[2] < 50; plate([cb[0], fmt(cb[1]) + " OWN", cb[2] + "% PLAYED"], x + CW / 2, top - 40, Y2, { al: "c", bd: low ? R1 : DM, cols: [Y2, GL, low ? M3 : G2], f: "P" }) } });
    if (st.b === 2 && st.A(2, .3, 2) >= 1) plate(["HEIGHT = OWNERS", "LIT = PLAYED"], 566, 196, GL, { cols: [GL, Y1] });
    if (st.b >= 3) { const k = st.A(3, .9, .2); tx((36.8 * ez(k)).toFixed(1) + "%", 566, 62, R1, { s: 3, ol: K }); if (k >= 1) { plate(["OF OWNED GAMES", "NEVER PLAYED"], 566, 92, Y2); plate(["A POSITIVE =", "PLAYTIME > 0"], 566, 128, Y1, { bd: G2 }) } }
    if (st.b >= 4) { plate(["MID-SIZE LIBRARIES:", "MOST PLAYED (70%)"], 566, 168, GL); plate(["OWNERS vs HOURS:", "RANK CORR 0.01"], 566, 200, GL) }
  }
  SCENES.push({ floor: "12", name: "ARCHIVE", sec: "DATA", w: SW, paint, live, start: { x: -20, y: 291, s: .8, pose: "s" }, rim: B2, clue: 3, clueText: "OWNED IS NOT PLAYED", clueY: "b",
    exit: { x: 1228, y: 250, s: .5 }, exitWipe: "iris", enterWipe: "doors",
    beats: [
      { foc: [300, 110, 285, 105], x: 280, say: ["FLOOR 12. THE ARCHIVE. PUBLIC FILES FROM THE UCSD McAULEY LAB:", "STEAM VIDEO GAME AND BUNDLE DATA, AUSTRALIAN USERS. 88,310 PROFILE LINES.", "SOURCE CRAWL: PATHAK ET AL., SIGIR 2017. PER GAME: MINUTES PLAYED."] },
      { foc: [500, 148, 112, 82], x: 596, say: ["FIRST SURPRISE: 684 PLAYERS ARE FILED TWICE.", "LEFT IN, ONE COPY'S HIDDEN GAME SITS IN THE OTHER COPY'S TRAINING ROW.", "THAT IS A LEAK. WE MERGE THEM: 87,626 PLAYERS."] },
      { foc: [932, 124, 290, 134], x: 640, cam: 560, say: ["FIVE MOST-OWNED GAMES. CABINET HEIGHT = OWNERS. LIT DRAWERS = EVER PLAYED.", "DOTA 2 TEST: 17,249 OWNERS, 7% PLAYED. LEFT 4 DEAD 2 BETA: 4%.", "STEAM DROPS TEST CLIENTS INTO LIBRARIES. NOBODY OPENS THEM."] },
      { foc: [626, 106, 92, 64], x: 640, cam: 560, say: ["ACROSS THE WHOLE FILE, 36.8% OF OWNED GAMES HAVE ZERO MINUTES.", "SO A POSITIVE IS PLAYTIME > 0, NOT OWNERSHIP.", "OTHERWISE POPULARITY RECOMMENDS A TEST CLIENT TO EVERYONE."] },
      { foc: [640, 200, 104, 46], x: 640, cam: 560, clue: true, clueDelay: .5, say: ["TWO MORE NOTES. MID-SIZED LIBRARIES ARE THE MOST PLAYED.", "OWNER COUNT SAYS ALMOST NOTHING ABOUT HOURS PLAYED: RANK CORRELATION 0.01.", "ONE MORE THING ABOUT POPULARITY. IT IS UPSTAIRS, AND IT IS LOUD."] }] });
})();
