# CSE 258 Assignment 2 · Steam game recommender

[Compact course guide](llms.txt) · [Course materials](course/README.md) · [Public source inventory](course/inventory.md)

Top-N game recommendation on the UCSD Steam data: Popularity, cosine Item-kNN, PureSVD, implicit ALS, BPR, and EASE, compared under full-catalog ranking.

**Status (Nov 25):** notebook v3 is executed and exported. The script is drafted. Slides and the recording are still to do. See [Remaining work](#8-remaining-work).

**Headline:** EASE is the best model (NDCG@10 0.2251). Tuned implicit ALS, the best course model, is second (0.2042), about 10% behind. That ordering held under a second implementation, four splits, and a different choice of hidden game.

---

## 1. What we submit

| File | What it is | Where it goes |
|---|---|---|
| `workbook.html` | The executed notebook, exported as HTML | Gradescope |
| `video_url.txt` | One line: a Google Drive or YouTube link to the ~20-minute mp4 | Gradescope |
| `responses.txt` | Peer grading, done individually | Gradescope, about a week later |

- **Deadline:** Tuesday of week 10. That should be Dec 1; **confirm on Gradescope**. No late submissions.
- **Grading:** five sections at 5 marks each (task, data, modeling, evaluation, related work), plus 4 marks for peer grading. The video and notebook are graded together.
- **Length:** about 20 minutes, no more than about 22.

## 2. Repository contents

This is the layout once the v3 files are added to the repo.

| Path | Contents |
|---|---|
| `steam_game_recommender_v3.ipynb` | Current notebook, executed, with outputs |
| `workbook.html` | HTML export of the above. This is the submission file |
| `claude-work/` | Working files behind v3: slides draft, figures, experiment scripts and logs, build scripts, the v2 re-run. Not submitted |
| `SLIDES_OUTLINE.md` | Slide-by-slide outline with numbers, figures, and which code cells to show |
| `CSE 258 Assignment 2 Script v2.docx` | Presentation script matched to v3 numbers (draft; reword before recording) |
| `steam_game_recommender_v2.ipynb` | Previous notebook, kept for reference |
| `CSE 258 Assingment 2 Script.docx` | Previous script (v2 numbers; do not record from this) |
| `158 _ 258 2026 Assignment 2.pdf` | The instructor's handout |
| `course/`, `llms.txt` | Course notes and indexes |
| `data/` | Not in the repo. The notebook downloads the data here on first run |

## 3. Results at a glance

Test set: 20,940 users, 3,570 games, one hidden played game per user, every model ranks the full catalog.

| Model | From the course? | HR@10 | NDCG@10 | AUC | NDCG@10 in v2 | Selected settings |
|---|---|---|---|---|---|---|
| **EASE** | No (outside method) | 0.3483 | **0.2251** | 0.9094 | 0.2251 | λ = 100 |
| ALS (binary) | Yes | 0.3249 | 0.2042 | 0.9468 | 0.1696 | 128 factors, α = 3, reg = 80 |
| ALS (playtime-weighted) | Yes | 0.3096 | 0.1951 | 0.9429 | 0.1586 | 128 factors, α = 1, reg = 80 |
| PureSVD | As a contrast | 0.2661 | 0.1642 | 0.9168 | 0.1679 | 12 factors |
| Item-kNN (cosine) | Yes | 0.2432 | 0.1511 | 0.9275 | 0.1484 | no truncation, α = 0.5 |
| BPR-MF | Yes | 0.2464 | 0.1498 | 0.9484 | 0.1441 | 128 factors, lr = 0.05 |
| Popularity | Yes (baseline) | 0.1890 | 0.1165 | 0.9076 | 0.1165 | none |
| Random | Sanity check | 0.0027 | 0.0012 | 0.4983 | 0.0012 | none |

- EASE vs. ALS (binary): +0.0210 NDCG@10, 95% paired-bootstrap interval [+0.0185, +0.0234].
- EASE vs. Popularity: +0.1087, a 93% relative gain.
- Random's HR@10 is 0.0027 against a theoretical 0.0028.

## 4. How to run

**Requirements:** Python 3.10 or later, with `numpy`, `scipy`, `pandas`, `scikit-learn`, `matplotlib`, `jupyter`, and `implicit`.

```bash
pip install numpy scipy pandas scikit-learn matplotlib jupyter implicit
```

**Data.** The first cell downloads `australian_users_items.json.gz` (about 75 MB) from the McAuley Lab server into `data/`. If you already have the uncompressed `australian_users_items.json`, compress it and move it into place instead:

```bash
mkdir -p data
gzip -k australian_users_items.json
mv australian_users_items.json.gz data/
```

**Run and export.**

```bash
# execute top to bottom and save the executed notebook
jupyter nbconvert --to notebook --execute --ExecutePreprocessor.timeout=7200 \
  --output steam_game_recommender_v3.ipynb steam_game_recommender_v3.ipynb

# export the submission file
jupyter nbconvert --to html --output workbook.html steam_game_recommender_v3.ipynb
```

- **Runtime:** about 37 minutes on a 2-core machine. Most of it is the NumPy ALS and BPR being fitted many times (tuning, three re-splits, the recent-game check).
- **Smoke test:** set `FAST_MODE = True` in the setup cell. The whole notebook then runs in about 4 minutes with tiny grids. Its numbers are meaningless; use it only to check that nothing crashes.
- **Determinism:** everything is seeded (`SEED = 42`). Re-running v2 unchanged from the raw file reproduced its published table exactly, and EASE and Popularity are identical in v2 and v3.
- **Do not hand-edit outputs.** If you change code, re-run the whole notebook, then re-export.

**Settings in the setup cell**

| Name | Value | Meaning |
|---|---|---|
| `SAMPLE_FRAC` | 0.35 | Share of profiles sampled, line by line, with a fixed seed |
| `MIN_PLAYTIME` | 0 | A game counts as played if playtime exceeds this many minutes |
| `MIN_USER_ITEMS` / `MIN_ITEM_USERS` | 5 / 20 | Iterative k-core thresholds |
| `TUNE_USERS` | 5000 | Validation users used for the hyper-parameter search |
| `N_RESPLITS` | 3 | Extra random re-splits for the robustness check |
| `FAST_MODE` | False | Smoke-test switch |

## 5. What the notebook contains

| Notebook section | Rubric section | Content |
|---|---|---|
| 1 | Task | Task definition, what the model knows at prediction time, protocol, metrics, baselines, validity checks |
| 2.1–2.2 | Data | Source, and a raw-file audit: repeated profiles, auto-granted titles, the unused `playtime_2weeks` field |
| 2.3–2.4 | Data | Exploratory plots, k-core filter, per-user split |
| 3 | Modeling | Formulation, the seven models, where each sits relative to the course, cost, code |
| 4.1 | Evaluation | Ranking and metric code, with known-answer tests |
| 4.2 | Evaluation | Tuning log, an interior-or-edge table for every setting, and the BPR diagnosis |
| 4.3 | Evaluation | Final test table, bootstrap intervals, paired differences |
| 4.4 | Evaluation | Three outside checks: reference library, re-drawn splits, recent-game holdout |
| 4.5–4.7 | Evaluation | Results by user activity and game popularity, coverage and exposure, nearest neighbors, a case study |
| 5 | Related work | Prior Steam work, the methods' papers, how our results match or differ, conclusions, limitations |

## 6. What changed from v2 to v3, and why

No models or sections were added. The work went into checking that the comparison is right.

1. **The task wording was corrected.** v2 said we predict the game a user plays "next". The split is random and the file has no timestamps, so v3 says "a held-out played game" and states plainly that this is not next-game prediction.
2. **ALS was under-tuned in v2, which inflated EASE's lead.** v2 fixed ALS regularization at 10. Regularization turns out to be the setting that matters most: at 64 factors and α = 3, validation NDCG@10 is 0.154, 0.180, and 0.128 for reg = 20, 80, and 300. With a proper search ALS rose from 0.1696 to 0.2042 on test, and EASE's lead fell from 33% to 10%. EASE itself was already at its optimum (λ = 100) and did not change.
3. **Every search now reports its edges.** A table in 4.2 shows, for each setting, whether the selected value is interior or on the edge of the grid. ALS and BPR are still rising slowly at 128 factors; the notebook says so and bounds the effect for ALS with the reference library.
4. **BPR's weak result is now explained with evidence.** It is not under-trained (its curves flatten early). By the last epoch it orders 96.3% of sampled pairs correctly and has the best AUC of any model (0.9484), yet its NDCG@10 is 0.1498. It optimizes AUC, not the top of the list. Sampling popular negatives made it worse (validation NDCG@10 0.142 to 0.078).
5. **The metrics disagree, and the notebook now says why.** By AUC the order is BPR, ALS, then EASE near the bottom. By NDCG@10 it is EASE, ALS, then BPR near the bottom. AUC averages over the whole catalog; NDCG@10 looks at the ten results a user would see.
6. **The raw file was audited.** 684 of 88,310 lines repeat a user already in the file (the loader merges them, so there is no leakage). The most-owned title in the sample, "Dota 2 Test", was launched by 7% of its owners; 36.8% of owned games have zero playtime. This is the evidence for using playtime, not ownership, as the positive signal.
7. **Leftover notes were removed** (two editing notes and a local file path), and the citations were checked and extended.

## 7. How we know the results are right

| Check | Result |
|---|---|
| Random baseline at chance | HR@10 0.0027 vs. 0.0028 expected |
| Known-answer tests of the metric code | Masking, ties, best and worst rank, metric formulas, and train/test disjointness all pass |
| Reproducibility | v2 re-run from the raw file on a different machine matched its saved table exactly |
| Second implementation (ALS) | `implicit` library 0.2034 vs. ours 0.2042 at identical settings |
| Headroom in the ALS search | Library at 256 factors: 0.2092, still below EASE at 0.2251 |
| Second implementation (BPR) | Library 0.1386 vs. ours 0.1498 |
| Re-drawn splits | EASE wins 4 of 4, by at least 0.0210; no model moves more than 0.0030 |
| Different hidden game | EASE still first when a recently played game is hidden instead of a random one |

**What the recent-game check changes.** For the 12,424 users with a game played in the two weeks before the crawl, hiding that game instead of a random one:
- lifts Popularity from 0.112 to 0.264, because recently played games are mostly hits;
- cuts EASE's margin over Popularity from 90% to 24%;
- reverses the playtime result: weighted ALS (0.3139) beats binary ALS (0.2905), the opposite of the main table.

The winner is stable. The size of the win, and whether playtime weighting helps, depend on which game is hidden. This is a stress test, not a temporal split.

## 8. Remaining work

| # | Task | Owner | Due |
|---|---|---|---|
| 1 | Read the v3 notebook end to end. Each speaker should be able to explain their section's code without the script | Everyone | Fri Nov 27 |
| 2 | Reword the script in your own voice, section by section | Each speaker | Sat Nov 28 |
| 3 | Build the slides (about 16, one per script cue, section number in every title) | TBD | Sat Nov 28 |
| 4 | Timed run-through, 22 minutes at most | Everyone | Sun Nov 29 |
| 5 | Record, merge to one mp4, upload to Drive with "anyone with the link" | Everyone | Mon Nov 30 |
| 6 | Run the handout's verification script on `workbook.html` and the video link, then submit | One person | Tue Dec 1 |
| 7 | Peer grading (`responses.txt`) | Each person | Week 11 |

**Suggested speaking split (four people)**

| Speaker | Sections | Approx. time |
|---|---|---|
| 1 | Opening, 1. Task and evaluation | 0:00–3:30 |
| 2 | 2. Data, audit, exploration, preprocessing | 3:30–6:30 |
| 3 | 3. Modeling and tuning, 4. results and metric choice | 6:30–13:00 |
| 4 | 4. BPR diagnosis, outside checks, error analysis, 5. Related work and conclusions | 13:00–20:00 |

## 9. Submission checklist

- [ ] `workbook.html` opens in a browser and starts with `<!DOCTYPE html>` (export from Jupyter; do not rename an `.ipynb`).
- [ ] The video is an mp4, larger than 1 MB, and plays on ordinary hardware.
- [ ] The Drive link is set to "anyone with the link" and downloads without signing in.
- [ ] `video_url.txt` holds exactly one line: the link.
- [ ] The video is between 20 and 22 minutes.
- [ ] Every number spoken or shown on a slide matches the notebook.
- [ ] The five sections are announced in order, on screen and out loud.
- [ ] The presentation is in our own words. The rubric gives a 1 to any section that "seems to be automatically generated".
- [ ] The course's policy on AI assistance has been checked, and anything it requires us to disclose is disclosed.

## 10. Known limits

- **Offline proxy.** A hidden played game is not proof the user would prefer it over other recommendations.
- **Random split, no timestamps.** Nothing here supports a claim about the next game a user will play.
- **Levels depend on the holdout.** See the recent-game check in section 7.
- **Tuned on one split.** The re-splits reuse the settings selected on the main split.
- **Search stopped at 128 factors** for the NumPy ALS and BPR. The library check bounds ALS; BPR beyond 128 is untested.
- **35% sample, k-core filtered.** Cold-start users and games are out of scope.
- **Memory.** EASE and Item-kNN build a game-by-game matrix and would not scale to millions of items.

## 11. References

- McAuley, Kang & Pasricha. *Steam Video Game and Bundle Data* (dataset).
- O'Neill, Vaziripour, Wu & Zappala. *Condensing Steam: Distilling the Diversity of Gamer Behavior.* IMC 2016.
- Kang & McAuley. *Self-Attentive Sequential Recommendation.* ICDM 2018.
- Wan & McAuley. *Item Recommendation on Monotonic Behavior Chains.* RecSys 2018.
- Pathak, Gupta & McAuley. *Generating and Personalizing Bundle Recommendations on Steam.* SIGIR 2017.
- Hu, Koren & Volinsky. *Collaborative Filtering for Implicit Feedback Datasets.* ICDM 2008.
- Rendle, Freudenthaler, Gantner & Schmidt-Thieme. *BPR: Bayesian Personalized Ranking from Implicit Feedback.* UAI 2009.
- Cremonesi, Koren & Turrin. *Performance of Recommender Algorithms on Top-N Recommendation Tasks.* RecSys 2010.
- Ning & Karypis. *SLIM: Sparse Linear Methods for Top-N Recommender Systems.* ICDM 2011.
- Rendle & Freudenthaler. *Improving Pairwise Learning for Item Recommendation from Implicit Feedback.* WSDM 2014.
- Steck. *Embarrassingly Shallow Autoencoders for Sparse Data.* WWW 2019.
- Ferrari Dacrema, Cremonesi & Jannach. *Are We Really Making Much Progress? A Worrying Analysis of Recent Neural Recommendation Approaches.* RecSys 2019.
- Krichene & Rendle. *On Sampled Metrics for Item Recommendation.* KDD 2020.
- Rendle, Krichene, Zhang & Koren. *Revisiting the Performance of iALS on Item Recommendation Benchmarks.* RecSys 2022.
