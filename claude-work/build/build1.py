import json, copy, re
nb = json.load(open('../../steam_game_recommender_v2.ipynb')); C = nb['cells']
def src(i): return ''.join(C[i]['source'])
def md(t): return {"cell_type":"markdown","metadata":{},"source":t.strip('\n')}
def code(t): return {"cell_type":"code","metadata":{},"execution_count":None,"outputs":[],"source":t.strip('\n')}
def rep(s, a, b, n=1):
    assert s.count(a) >= 1, f'missing: {a[:60]!r}'
    return s.replace(a, b) if n == 0 else s.replace(a, b, n)
out = []

# ---------------- 0 title
out.append(md(r'''
# Recommending Steam Games: Popularity vs. Collaborative Filtering vs. a Linear Autoencoder

**Task.** Given the games a Steam user has *played*, rank the rest of the catalog so that a **held-out game the user really played** appears near the top.

**What this notebook contributes**
1. A leakage-free **train / validation / test** protocol with **full-catalog ranking** (no sampled negatives) and bootstrap confidence intervals.
2. Seven recommenders under one interface. Four are **course models** (Popularity, cosine Item-kNN, implicit-feedback ALS, BPR), PureSVD is the course's "SVD on a filled matrix" contrast, Random is a sanity check, and **EASE is the one method from outside the course**.
3. Evidence that the comparison itself is right, not only the numbers: an audit of the raw file, known-answer tests of the metric code, a search that stops only when the best setting is not on a grid edge, a cross-check against the `implicit` reference library, and repeated splits.
4. Error analysis beyond one number: by user activity, by held-out-game popularity, catalog coverage and exposure, and a qualitative case study.

**Notebook map (matches the five graded presentation sections)**

| Section | Content |
|---|---|
| 1 | Predictive task, evaluation, baselines, validity |
| 2 | Data, raw-file audit, exploratory analysis, pre-processing |
| 3 | Modeling |
| 4 | Evaluation: metric tests, tuning, results, outside checks, error analysis |
| 5 | Related work, conclusions, limitations |
'''))

# ---------------- 1 task
s = src(1)
s = rep(s, "One played game per user is hidden; the model is judged on where that game lands in the ranking.",
        "One played game per user is hidden; the model is judged on where that game lands in the ranking.\n\n**What the model knows at prediction time.** The user's other played games, and nothing else: no timestamps, no game metadata, no playtime of the hidden game. The hidden game is a *random* one of the user's played games, not the most recent, so this is a **recover-a-hidden-game** task. We do not claim to predict the *next* game a user will play.")
s = rep(s, "- *Item-kNN* and *PureSVD*: the neighborhood and latent-factor methods covered in class.",
        "- *Item-kNN (cosine)*, *implicit ALS*, and *BPR*: the neighborhood, confidence-weighted latent-factor, and pairwise-ranking models covered in class. *PureSVD* is the truncated SVD the course contrasts with the latent-factor model.\n- *EASE* is the method from outside the course; the class models are its comparison points.")
s = rep(s, "4. We report coverage and exposure concentration to show accuracy is not bought by recommending only blockbusters.",
        "4. We report coverage and exposure concentration to show accuracy is not bought by recommending only blockbusters.\n5. The evaluation code must pass known-answer tests (Section 4.1), the hand-written ALS and BPR must agree with a reference library, and the model ordering must survive re-drawing the split (Section 4.4).")
s = rep(s, "so the split is random rather than temporal.", "so the split is random rather than temporal. Section 4.4 stress-tests that choice with the file's `playtime_2weeks` field.")
out.append(md(s))

# ---------------- 2 data context
s = src(2)
s = rep(s, " The original notebook took the *first N lines*, which is a non-random slice if the file is ordered.", " The sample is drawn line by line with a seeded generator, not by taking the first N lines, because the file may be ordered.")
s = rep(s, "with the list of games owned and `playtime_forever` (minutes) for each.", "with the list of games owned, `playtime_forever` (minutes), and `playtime_2weeks` (minutes in the two weeks before the crawl) for each.")
out.append(md(s))

# ---------------- 3 setup
s = src(3)
s = rep(s, 'print(f"{DATA_PATH.resolve()}  ({DATA_PATH.stat().st_size / 2**20:.1f} MB)")', 'print(f"{DATA_PATH}  ({DATA_PATH.stat().st_size / 2**20:.1f} MB)")')
s = rep(s, 'FAST_MODE      = False  # True = tiny grids / fewer iterations (for a quick smoke test)',
        'N_RESPLITS     = 3      # extra random re-splits used to check that the model ordering is stable\nFAST_MODE      = False  # True = tiny grids / fewer iterations (for a quick smoke test)')
s = rep(s, 'from IPython.display import display, Markdown', 'from IPython.display import display, Markdown\nimport re')
out.append(code(s))

# ---------------- 4 load
s = src(4)
s = rep(s, "records, names = [], {}\nn_profiles = n_private = 0", "records, names = [], {}\nn_profiles = n_private = 0\nUID = re.compile(r\"'user_id': u?'([^']*)'\"); seen_uid, n_dup_lines = set(), 0   # cheap whole-file duplicate count (no parsing)")
s = rep(s, "        n_profiles += 1\n", "        n_profiles += 1\n        mu = UID.search(line[:200])\n        if mu:\n            n_dup_lines += mu.group(1) in seen_uid; seen_uid.add(mu.group(1))\n")
s = rep(s, 'records.append((uid, iid, float(e.get("playtime_forever") or 0)))', 'records.append((uid, iid, float(e.get("playtime_forever") or 0), float(e.get("playtime_2weeks") or 0)))')
s = rep(s, 'columns=["user_id", "item_id", "playtime"])', 'columns=["user_id", "item_id", "playtime", "playtime_2w"])')
s = rep(s, 'raw["played"] = raw.playtime > MIN_PLAYTIME', 'raw["played"] = raw.playtime > MIN_PLAYTIME\nraw["recent"] = raw.playtime_2w > 0')
s = rep(s, 'print(f"Loaded interactions:', 'print(f"Whole file: {len(seen_uid):,} distinct user ids in {n_profiles:,} lines ({n_dup_lines:,} repeated lines; merged by drop_duplicates above)")\nprint(f"Loaded interactions:')
out.append(code(s))

# ---------------- 4b raw audit (new)
out.append(md(r'''
## 2.2 Raw-file audit: what the cleaned table would hide
Before any modeling we check the raw records for three things that could quietly bias a recommender.
- **Repeated profiles.** If the same user appeared twice as two "users", one copy's held-out game would sit in the other copy's training row, which leaks the answer to item-based models. The loader merges repeats by `user_id`, and the count is printed above.
- **Titles that are owned but not chosen.** Steam grants some titles automatically (test clients, betas). They are "owned" by a huge number of profiles and played by almost none.
- **An unused field.** `playtime_2weeks` is the only time-related signal in the file. We do not train on it, but Section 4.4 uses it to stress-test the random split.
'''))
out.append(code(r'''
g = raw.groupby("item_id").agg(owners=("user_id", "size"), players=("played", "sum"), recent_players=("recent", "sum"))
g["played share"] = g.players / g.owners
g.insert(0, "game", [names.get(i) for i in g.index])
top_owned = g.sort_values("owners", ascending=False).head(12).reset_index(drop=True)
display(top_owned.style.format({"played share": "{:.0%}"}).background_gradient(subset=["played share"], cmap="RdYlGn", vmin=0, vmax=1)
        .set_caption("Most-owned titles in the sample: ownership is not the same as play"))

ghost = g[(g.owners >= 500) & (g["played share"] < 0.25)].sort_values("owners", ascending=False)
u_recent = raw.groupby("user_id").recent.any()
print(f"Titles with >= 500 owners that under 25% of owners ever launched: {len(ghost)}"
      f"  (e.g. {', '.join(str(x) for x in ghost.game.head(4))})")
print(f"Owned pairs with zero playtime: {(~raw.played).mean():.1%}")
print(f"Pairs played in the last two weeks: {raw.recent.mean():.1%} | profiles with at least one such game: {u_recent.mean():.1%}")
'''))

# ---------------- 5,6 EDA (renumber heading 2.2 -> 2.3)
out.append(md(rep(src(5), "## 2.2 Exploratory analysis", "## 2.3 Exploratory analysis")))
out.append(code(src(6)))
s = src(7)
s += "\n- The audit table in 2.2 makes the same point from the raw records: the most-owned title in the sample is an automatically granted test client that almost none of its owners launched. Had we treated ownership as the positive signal, Popularity would have recommended it to everyone and item-based models would have learned co-ownership of free grants instead of taste."
out.append(md(s))

# ---------------- 8,9 preprocess
s = src(8)
s = rep(s, "## 2.3 Pre-processing", "## 2.4 Pre-processing")
s = rep(s, " (The original draft ran a fixed 3 passes, which does not guarantee a stable core.)", " A fixed number of passes does not guarantee a stable core, so the loop runs until nothing is removed.")
out.append(md(s))
s = src(9)
s = rep(s, 'pos = kcore(raw[raw.played][["user_id", "item_id", "hours"]], MIN_USER_ITEMS, MIN_ITEM_USERS).copy()', 'pos = kcore(raw[raw.played][["user_id", "item_id", "hours", "recent"]], MIN_USER_ITEMS, MIN_ITEM_USERS).copy()')
out.append(code(s))
json.dump(out, open('part1.json','w'))
print(len(out), 'cells in part 1')
