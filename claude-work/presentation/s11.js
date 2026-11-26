/* 43. BEHIND THE CLOCK. Seven clock weights = seven models; a weight's height = NDCG@10. The big hand = EASE's lead over Popularity. */
(() => {
  const CXc = 446, CYc = 138, CR = 124, NM = ["POP", "BPR", "KNN", "SVD", "ALSW", "ALS", "EASE"], RND = [.1124, .1425, .1385, .1569, .1866, .1928, .2133], REC = [.2643, .2405, .2823, .2762, .3139, .2905, .3289];
  const WX = i => 38 + i * 37, WY = v => Math.round(250 - (v - .08) * 760), aOf = p => -Math.PI / 2 + p * 2 * Math.PI;
  function paint() { const B = new Buf(W, SH); B.rect(0, 0, W, SH, K);
    /* the face, lit from outside: rings of colour, no gradient */
    [[CR, M1], [CR - 10, M2], [CR - 26, M3], [CR - 46, C1], [CR - 68, C2], [CR - 92, Y2]].forEach(([r, col]) => B.disc(CXc, CYc, r, col));
    B.disc(CXc, CYc, CR + 8, K, 0, CR); B.disc(CXc, CYc, CR + 8, Y1, 0, CR + 7); B.disc(CXc, CYc, CR - 9, 0, (j, d) => { d[j] = H(K) }, CR - 11);
    for (let h = 0; h < 12; h++) { const a = aOf(h / 12), x0 = CXc + Math.cos(a) * (CR - 12), y0 = CYc + Math.sin(a) * (CR - 12), x1 = CXc + Math.cos(a) * (CR - (h % 3 ? 26 : 38)), y1 = CYc + Math.sin(a) * (CR - (h % 3 ? 26 : 38)); B.line(x0 - 1, y0 - 1, x1 - 1, y1 - 1, K, h % 3 ? 3 : 5) }
    for (let m = 0; m < 60; m++) if (m % 5) { const a = aOf(m / 60); B.rect(CXc + Math.cos(a) * (CR - 14), CYc + Math.sin(a) * (CR - 14), 2, 2, K) }
    for (let q = 0; q < 4; q++) { const a = q * Math.PI / 2 + .785; B.line(CXc + Math.cos(a) * 20, CYc + Math.sin(a) * 20, CXc + Math.cos(a) * (CR + 4), CYc + Math.sin(a) * (CR + 4), K, 2) }
    /* the weight frame on the left, the floor */
    B.rect(18, 20, 272, 5, K); B.rect(18, 20, 272, 1, Y1); B.rect(18, 25, 272, 1, DM); B.rect(20, 25, 3, 236, N2); B.rect(285, 25, 3, 236, N2);
    [[.10, "0.10"], [.20, "0.20"], [.30, "0.30"]].forEach(([v, s]) => { B.rect(24, WY(v), 260, 1, INK); B.text(s, 290, WY(v) - 3, GR, { f: "T" }) });
    B.rect(0, 262, W, 34, K); B.rect(0, 262, W, 1, DM); [[C1, 0], [O2, 8], [R3, 18]].forEach(([col, o]) => B.poly([[CXc - 90 - o * 2, 264 + o], [CXc + 90 + o * 2, 264 + o], [CXc + 110 + o * 2.4, SH], [CXc - 110 - o * 2.4, SH]], col)); for (let i = 0; i < 80; i++) B.rect(CXc - 150 + rnd() * 300, 266 + rnd() * 28, 4 + rnd() * 16, 1, K);
    NM.forEach((n, i) => B.text(n, WX(i) + 8, 252, i === 6 ? Y1 : GL, { al: "c" }));
    return B }
  const gear = (x, y, r, n, a, col) => { circ(x, y, r, col); for (let q = 0; q < n; q++) { const an = a + q * 2 * Math.PI / n; R(x + Math.cos(an) * (r + 3) - 3, y + Math.sin(an) * (r + 3) - 3, 6, 6, col) } circ(x, y, r - 8, K, r - 11); circ(x, y, 4, K) };
  function live(st) { const T = st.T, mv = st.A(2, 2, .3), lead = st.b < 3 ? null : lerp(.90, .24, ez(st.A(3, 2.2, .4)));
    /* hands: the real time until the lead is shown */
    const sec = Math.floor(T) % 60, ha = lead === null ? aOf(((T / 60) % 12) / 12 + .29) : aOf(.02), ma = lead === null ? aOf(sec / 60) : aOf(lead);
    seg(CXc, CYc, CXc + Math.cos(ha) * 58, CYc + Math.sin(ha) * 58, K, 5); seg(CXc - Math.cos(ma) * 16, CYc - Math.sin(ma) * 16, CXc + Math.cos(ma) * 100, CYc + Math.sin(ma) * 100, lead === null ? K : R1, 3); circ(CXc, CYc, 8, K); circ(CXc, CYc, 3, Y1);
    gear(338, 232, 34, 12, T * .5, K); gear(388, 262, 20, 9, -T * .85 + .3, K); gear(556, 246, 26, 10, T * .6, K);
    if (lead !== null) { plate(["RANDOM HOLDOUT", "+90%"], CXc - 96, 22, Y2, { al: "c", bd: GR, cols: [GL, Y2] }); if (st.A(3, 2.2, .4) >= 1) plate(["RECENT HOLDOUT", "+24%"], CXc + 104, 150, Y2, { al: "c", bd: R1, cols: [GL, Y1] });
      plate(["EASE'S LEAD OVER POPULARITY", "+" + Math.round(lead * 100) + "%"], CXc, 190, Y1, { al: "c", cols: [GL, Y1] }) }
    /* the weights */
    for (let i = 0; i < 7; i++) { const x = WX(i), y0 = WY(RND[i]), y = Math.round(lerp(y0, WY(REC[i]), st.b < 2 ? 0 : ez(cl(mv * 1.3 - i * .04, 0, 1)))), hot = st.b === 4 && (i === 4 || i === 5), col = i === 6 ? Y1 : hot ? (i === 4 ? G2 : GL) : (i === 0 ? M3 : O1);
      for (let yy = 26; yy < y; yy += 4) R(x + 7, yy, 2, 2, yy % 8 ? DM : GR);
      if (st.b >= 2) { R(x, y0, 16, 1, GR); R(x, y0 + 13, 16, 1, GR); R(x, y0, 1, 14, GR); R(x + 15, y0, 1, 14, GR) }
      R(x, y, 16, 14, col); R(x, y, 16, 2, Y2); R(x + 2, y + 11, 12, 2, K); R(x + 6, y - 3, 4, 3, col);
      const v = st.b < 2 ? RND[i] : lerp(RND[i], REC[i], ez(cl(mv * 1.3 - i * .04, 0, 1))); tx(v.toFixed(3).slice(1), x + 8, y - 13, i === 6 ? Y1 : hot ? Y2 : GL, { al: "c", ol: true }) }
    plate(st.b < 2 ? "HIDDEN GAME: RANDOM" : "HIDDEN GAME: RECENT", 208, 2, st.b < 2 ? GL : Y1, { al: "c" });
    if (st.b === 1) plate(["playtime_2weeks > 0", "12,424 PLAYERS HAVE ONE (59%)"], 154, 190, Y2, { al: "c", cols: [G2, Y2] });
    if (st.b === 2 && mv >= 1) plate(["POPULARITY  .112 > .264", "EASE        .213 > .329"], 154, 190, Y2, { al: "c", cols: [M3, Y1] });
    if (st.b === 4) plate(["ALS-W .314 PASSES ALS .291", "HOURS KNOW WHAT IS CURRENT"], 154, 190, Y2, { al: "c", bd: G2, cols: [G2, GL] });
  }
  SCENES.push({ floor: "43", name: "CLOCK ROOM", sec: "EVALUATION", w: W, paint, live, start: { x: -20, y: 293, s: .7, pose: "s" }, rim: C2, clue: 10, clueText: "A RANDOM HOLDOUT FLATTERS PERSONALIZATION", clueY: "b",
    exit: { x: 670 }, exitWipe: "iris", enterWipe: "iris",
    beats: [
      { foc: [154, 150, 152, 126], x: 300, say: ["FLOOR 43. BEHIND THE CLOCK. LOCK 3 DESERVES A ROOM OF ITS OWN.", "SO FAR THE HIDDEN GAME WAS RANDOM. SEVEN WEIGHTS: NDCG@10 FOR EACH MODEL."] },
      { foc: [154, 150, 152, 126], say: ["THE FILE HAS NO DATES. BUT IT HAS MINUTES PLAYED IN THE LAST TWO WEEKS.", "SO HIDE A GAME THE PLAYER TOUCHED RECENTLY. 12,424 PLAYERS HAVE ONE.", "THAT IS CLOSER TO THE REAL QUESTION: WHAT WILL THEY PLAY NEXT?"] },
      { foc: [154, 150, 152, 126], say: ["SAME PLAYERS, NEW HIDDEN GAME. EVERY WEIGHT RISES.", "RECENT GAMES ARE POPULAR GAMES, SO THEY ARE EASIER TO GUESS.", "POPULARITY JUMPS FROM 0.112 TO 0.264. EASE FROM 0.213 TO 0.329."] },
      { foc: [446, 138, 142, 138], say: ["WATCH THE BIG HAND. EASE'S LEAD OVER POPULARITY: +90% WITH A RANDOM HOLDOUT.", "+24% WITH A RECENT ONE. EASE STILL WINS. BY MUCH LESS.", "A RANDOM HOLDOUT FLATTERS PERSONALIZATION."] },
      { foc: [200, 132, 112, 104], clue: true, clueDelay: 1, say: ["ONE MORE REVERSAL. PLAYTIME-WEIGHTED ALS (0.314) PASSES BINARY ALS (0.291).", "HOURS PLAYED CARRY SIGNAL ABOUT WHAT IS CURRENT.", "WHICH MODEL IS SECOND DEPENDS ON THE QUESTION YOU ASK."] }] });
})();
