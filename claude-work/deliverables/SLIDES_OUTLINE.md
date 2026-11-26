# Slide outline · CSE 258 Assignment 2

18 slides for a 20-minute video. Every number below comes from `steam_game_recommender_v3.ipynb` / `workbook.html`. Slide numbers here supersede the cue numbers in the script; cues are matched in the last section.

**Rules for the whole deck**
- Put the rubric section in every title ("Section 4 · Results"). The handout wants the organization "very obvious".
- One idea per slide. Lead with the number, then the method.
- Code slides show real notebook cells (screenshot or paste), 10–15 lines, with two or three lines highlighted. Do not retype code: graders check that slides and notebook match.
- Where a slide says "switch to notebook", scroll to that cell in the live notebook instead of, or after, the slide.
- Say it in your own words. The rubric gives a 1 to a section that seems automatically generated.

---

## Section 1 · Predictive task (0:00–3:30)

### Slide 1 · Title
- **Title:** Recommending Steam Games
- **Subtitle:** Popularity vs. collaborative filtering vs. a linear autoencoder
- **Also on slide:** team names, "CSE 258 · Assignment 2"
- **Say:** the one-line result. EASE wins, tuned ALS is 10% behind, and we checked the comparison three ways.

### Slide 2 · Section 1 · The task: recover a hidden played game
- **Three boxes:** Input (the games a user played) → Output (a ranking of every unplayed game) → Judged on (where one hidden played game lands).
- **Callout:** the hidden game is random, not the latest. No timestamps. This is not next-game prediction.
- **Why ranking:** Steam has no star ratings, only ownership and minutes played.
- **Notebook:** Section 1.

### Slide 3 · Section 1 · Evaluation, baselines, validity
- **Protocol:** per user, 1 test game, 1 validation game, rest train. Tune on validation, refit on train + validation, score once on test.
- **Full-catalog ranking.** No sampled negatives.
- **Metrics:** HR@10, NDCG@10, MRR, AUC, each with a 95% bootstrap interval. Recall@10 = HR@10 here, so precision and recall are left out.
- **Baselines:** Random (sanity check) and Popularity (the bar to clear).
- **Validity:** Random HR@10 = 0.0027 vs. 0.0028 expected; metric code passes known-answer tests; result must survive a second implementation, re-drawn splits, and a different hidden game.

## Section 2 · Data (3:30–6:30)

### Slide 4 · Section 2 · The dataset
- **Source:** UCSD McAuley Lab, Steam Video Game and Bundle Data, Australian users file. Crawl from O'Neill et al., IMC 2016.
- **Four big numbers:** 88,310 profile lines · 684 repeated users (merged) · 35% random sample · 20,940 users × 3,570 games after filtering.
- **Say:** why repeats matter. Unmerged, one copy's hidden game sits in the other copy's training row.
- **Notebook:** Section 2.1, loader output.

### Slide 5 · Section 2 · Owned is not played
- **Table (from notebook 2.2):**

| Title | Owners | Ever played |
|---|---|---|
| Dota 2 Test | 17,249 | 7% |
| Counter-Strike: Global Offensive | 15,170 | 99% |
| Garry's Mod | 15,015 | 97% |
| Left 4 Dead 2 Beta | 12,833 | 4% |
| Left 4 Dead 2 | 12,833 | 94% |

- **Big number:** 36.8% of owned games have zero playtime.
- **Takeaway:** a positive is playtime > 0. With ownership, Popularity would recommend an auto-granted test client to everyone.
- **This is one of the three "surprise" slides. Give it time.**

### Slide 6 · Section 2 · Exploration
- **Figure:** the EDA figure from notebook 2.3.
- **Three takeaways:** mid-sized libraries are the most played (about 70%; smallest decile 55%, largest 59%) · popularity is heavily skewed (long tail) · owner count says almost nothing about hours played (rank correlation about 0.01).
- **Why it matters:** Popularity will be strong on head games, so results are later split by head, torso, tail.

### Slide 7 · Section 2 · Preprocessing (code)
- **Code:** `kcore()` and the per-user split lines from notebook 2.4.
- **Highlight:** the `while True` loop (filter until nothing changes) and the `rk == 1` / `rk == 2` lines (test and validation).
- **Numbers:** ≥ 5 played games per user, ≥ 20 players per game → 20,940 users, 3,570 games, 1,063,175 training interactions.
- **Mention:** two matrices, binary and log(1 + hours).

## Section 3 · Modeling (6:30–11:00)

### Slide 8 · Section 3 · Seven models, one interface
- **Formulation line:** input = user × game matrix; output = a score for every game; top 10 unplayed are recommended.
- **Table:**

| Model | What it optimizes | Where it comes from |
|---|---|---|
| Popularity | Nothing: number of players | Course baseline |
| Item-kNN | Cosine similarity of game audiences | Course method · item similarity |
| PureSVD | Reconstruction of the zero-filled matrix | Course concept · truncated SVD |
| Implicit ALS | Confidence-weighted squared error, all cells | Course method · confidence-weighted ALS |
| BPR-MF | Played game outranks a sampled unplayed one | Course method · pairwise ranking |
| EASE | Linear item-to-item autoencoder, closed form | Outside method · related to SLIM |

- **Footnote:** Random as a sanity check. EASE's nearest course relative is SLIM; it is not AutoRec.

### Slide 9 · Section 3 · EASE in four lines (code)
- **Code:** `EASE.fit` from the model cell.
- **Highlight:** add λ to the diagonal · invert · `B = -P / diag(P)` · zero the diagonal.
- **Say:** same idea as SLIM, but only an L2 penalty, so one matrix inverse and no gradient descent.
- **Trade-off:** game × game matrix, so memory grows with catalog size squared.

### Slide 10 · Section 3 · ALS and BPR (code)
- **Code, left:** `ImplicitALS._solve`. Highlight the per-user linear system and where the confidence weight enters.
- **Code, right:** the BPR batch loop. Highlight negative sampling, the re-sample of false negatives, and the sigmoid gradient.
- **Trade-offs:** ALS is cubic in factors; BPR is cheap per epoch but needs a learning rate and many epochs.

### Slide 11 · Section 3 · Tuning decides the comparison
- **Big number:** ALS validation NDCG@10 at 64 factors, α = 3: **0.154 → 0.180 → 0.128** for reg = 20, 80, 300.
- **Figure or table:** the interior-or-edge table and tuning bars from notebook 4.2.
- **Points:** EASE (λ = 100) and PureSVD (12 factors) are interior optima · ALS and BPR still rising at 128 factors, bounded later by the reference library.
- **Say:** a model tuned on a grid edge has not been tuned.

## Section 4 · Evaluation (11:00–17:30)

### Slide 12 · Section 4 · The evaluation code (code)
- **Code:** `rank_of_targets` from notebook 4.1.
- **Highlight:** masking seen games to −inf · the pessimistic tie rule (`(sc > t) + (sc == t)`).
- **Then:** the known-answer test cell. Four hand-built cases: masked game, tie, best rank, worst rank; plus train/test disjointness.
- **Say:** all four metrics come from this one rank, so if this is right, they are consistent.

### Slide 13 · Section 4 · Results
- **Table:**

| Model | HR@10 | NDCG@10 | AUC |
|---|---|---|---|
| **EASE** | 0.3483 | **0.2251** | 0.9094 |
| ALS (binary) | 0.3249 | 0.2042 | 0.9468 |
| ALS (playtime-weighted) | 0.3096 | 0.1951 | 0.9429 |
| PureSVD | 0.2661 | 0.1642 | 0.9168 |
| Item-kNN | 0.2432 | 0.1511 | 0.9275 |
| BPR-MF | 0.2464 | 0.1498 | 0.9484 |
| Popularity | 0.1890 | 0.1165 | 0.9076 |

- **Callouts:** EASE vs. ALS +0.0210, 95% interval [+0.0185, +0.0234] · EASE vs. Popularity +93%.
- **Figure option:** the bar chart with intervals from notebook 4.3.

### Slide 14 · Section 4 · The metrics disagree
- **Two columns:** by NDCG@10: EASE, ALS, …, BPR sixth. By AUC: BPR first (0.9484), ALS second (0.9468), EASE near last (0.9094), level with Popularity (0.9076).
- **Explanation:** AUC averages over all 3,570 positions; NDCG@10 looks at the ten a user sees.
- **Takeaway:** for top-N, NDCG@10 and HR@10 are the right targets. AUC alone would crown a different winner.
- **Surprise slide.**

### Slide 15 · Section 4 · Why BPR is weak: three tests
- **Figure:** the three-panel BPR diagnosis from notebook 4.2.
- **Three boxes:** Under-trained? Unlikely: pair accuracy gains under two points over the last ten epochs · Objective vs. metric? 96.3% of sampled pairs already ordered, validation NDCG@10 only 0.142 · Harder negatives? Worse: 0.142 → 0.078.
- **Footnote:** `implicit` library BPR scores 0.1387 vs. our 0.1498.

### Slide 16 · Section 4 · Is the result right? Three outside checks
- **Three boxes:**
  1. Second implementation: library ALS 0.2034 vs. ours 0.2042. At 256 factors, 0.2092, still below EASE.
  2. Re-drawn splits: EASE wins 4 of 4 by at least 0.0210; no model moves more than 0.0030.
  3. Different hidden game: hide a recently played game (12,424 users). EASE still first.
- **Figure:** the two-panel checks figure from notebook 4.4.
- **What changes under check 3:** Popularity 0.112 → 0.264 · EASE's margin over Popularity +90% → +24% · weighted ALS (0.3139) now beats binary ALS (0.2905).
- **Surprise slide.** Could be split in two if time allows.

### Slide 17 · Section 4 · Where personalization helps
- **Figure:** heat maps from notebook 4.5 (by library size, by popularity of the hidden game).
- **Points:** tail games: Popularity 0.000, EASE 0.021 · coverage of top-10 lists: Popularity 1.9%, ALS 17.5%, EASE 31.0%, BPR 36.1%.
- **Takeaway:** accuracy and discovery are separate goals.

## Section 5 · Related work (17:30–20:00)

### Slide 18 · Section 5 · Related work
- **This dataset:** Kang & McAuley (ICDM 2018, sequential), Wan & McAuley (RecSys 2018, behavior chains), Pathak et al. (SIGIR 2017, bundles). They use timestamps or reviews; our levels are not comparable.
- **Matches:** EASE ahead of matrix factorization (Steck, WWW 2019) · tuned ALS closes the gap (Rendle et al., RecSys 2022) · BPR strong on AUC, weak on top-N (Rendle et al., UAI 2009; Rendle & Freudenthaler, WSDM 2014).
- **Method choices:** full ranking (Krichene & Rendle, KDD 2020) · tuned baselines (Ferrari Dacrema et al., RecSys 2019).

### Slide 19 · Section 5 · Defend and distrust (optional: merge into 18 to stay at 18 slides)
- **Defend:** EASE > ALS > the rest on top-10 metrics, under a second implementation, four splits, and a different hidden game. Most of an untuned EASE–ALS gap is a tuning artifact.
- **Distrust:** the absolute level of any number; any claim about the next game a user plays.
- **Limits:** offline proxy · random split · tuned on one split · search stopped at 128 factors · 35% sample.
- **Next:** a time-aware split, content features for cold-start games.

---

## Script cue mapping

The script was written against an earlier 16-slide plan. Map its cues like this:

| Script cue | This outline |
|---|---|
| Slides 1–6 | Slides 1–6 |
| "Notebook Section 2.4: preprocessing cell" | Slide 7 |
| Slide 7 (models) and the model code cue | Slides 8–10 |
| Slide 8 (tuning) | Slide 11 |
| "Notebook Section 4.1" cue | Slide 12 |
| Slide 9 (results) | Slide 13 |
| Slide 10 (metrics) | Slide 14 |
| Slide 11 (BPR) | Slide 15 |
| Slides 12–13 (checks, recent holdout) | Slide 16 |
| Slide 14 (error analysis) | Slide 17 |
| Slides 15–16 | Slides 18–19 |
