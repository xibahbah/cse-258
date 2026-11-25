import json
from build1 import src, md, code, rep, C
out = []
out.append(md(src(16)))
out.append(code(src(17)))
out.append(code(src(18)))

# ---------------- 4.4 outside checks
out.append(md(r'''
## 4.4 Is the result right? Three checks that do not depend on our own code or our one split
A results table can be wrong in ways its own confidence intervals cannot see: a bug in a hand-written model, a lucky split, or an evaluation design that flatters one family. Each check below attacks one of those.

### Check 1: the hand-written ALS and BPR against a reference library
The course demonstrates the `implicit` library for these two models. We fit its ALS at the *same* factors, confidence, and regularization as ours (its confidence parameterization is $c = 1+\alpha r$ once the matrix is rescaled, so the settings map exactly). Its BPR uses per-sample SGD where ours uses mini-batches, so learning rates do not transfer; we give it its own small validation search instead. If our implementations were broken, the library would beat them clearly. We also ask the library for an ALS with twice as many factors as our search reached, to measure how much headroom is left.
'''))
out.append(code(r'''
from implicit.als import AlternatingLeastSquares
from implicit.bpr import BayesianPersonalizedRanking

class Reference:                                   # adapts an `implicit` model to our fit/score interface
    def __init__(self, make): self.make = make
    def fit(self, X, W=None):
        self.m = self.make(); self.m.fit(X.astype(np.float32).tocsr(), show_progress=False)
        self.U, self.Y = np.asarray(self.m.user_factors), np.asarray(self.m.item_factors); return self
    def score(self, u): return self.U[u] @ self.Y.T

def conf(X, alpha):                                # c_ui = 1 + alpha * r_ui on observed cells
    Cm = X.astype(np.float32).copy(); Cm.data = 1 + alpha * Cm.data; return Cm

def test_scores(m, fitted_on=None):
    mt = metrics_from_ranks(rank_of_targets(m, X_trval, test_item, all_users), ncand_test)
    return mt["NDCG"].mean(), mt["HR"].mean()

ref_rows = []
pa = best_params["ALS (binary)"]
mk_als = lambda f: Reference(lambda: AlternatingLeastSquares(factors=f, alpha=1.0, regularization=pa["reg"], iterations=15, random_state=SEED))
for label, f in [("ALS (binary), same settings", pa["f"]), (f"ALS (binary), factors doubled to {2 * pa['f']}", 2 * pa["f"])]:
    nd, hr = test_scores(mk_als(f).fit(conf(X_trval, pa["alpha"])))
    ref_rows.append({"model": label, "hand-written NDCG@10": per_user["ALS (binary)"]["NDCG"].mean(), "implicit library NDCG@10": nd,
                     "hand-written HR@10": per_user["ALS (binary)"]["HR"].mean(), "implicit library HR@10": hr})

pb = best_params["BPR-MF"]; cand = []
for reg, it in itertools.product([0.02, 0.05, 0.1], [30] if FAST_MODE else [30, 60]):
    mk = lambda reg=reg, it=it: Reference(lambda: BayesianPersonalizedRanking(factors=pb["f"], learning_rate=0.01, regularization=reg, iterations=it, random_state=SEED))
    mt = metrics_from_ranks(rank_of_targets(mk().fit(X_train), X_train, val_item, tune_users), ncand_val[tune_users])
    cand.append((mt["NDCG"].mean(), reg, it, mk))
vbest, reg_b, it_b, mk_b = max(cand, key=lambda c: c[0])
nd, hr = test_scores(mk_b().fit(X_trval))
ref_rows.append({"model": f"BPR-MF (library tuned on validation: reg={reg_b:g}, {it_b} iterations)", "hand-written NDCG@10": per_user["BPR-MF"]["NDCG"].mean(),
                 "implicit library NDCG@10": nd, "hand-written HR@10": per_user["BPR-MF"]["HR"].mean(), "implicit library HR@10": hr})
ref_df = pd.DataFrame(ref_rows); ref_df["library − ours (NDCG@10)"] = ref_df["implicit library NDCG@10"] - ref_df["hand-written NDCG@10"]
display(ref_df.style.format({c: "{:.4f}" for c in ref_df.columns if "@10" in c and "−" not in c} | {"library − ours (NDCG@10)": "{:+.4f}"})
        .set_caption("Test-set agreement between our implementations and the reference library"))
print(f"EASE on the same test set: NDCG@10 = {per_user['EASE']['NDCG'].mean():.4f}")
'''))

out.append(md(r'''
### Check 2: does the ordering survive a different split?
The bootstrap intervals in 4.3 capture noise from *which users* we evaluate, not from *which game* each user had hidden. Here the per-user split is redrawn with new seeds, every model is refit with the hyper-parameters already selected (they are not re-tuned, so this is a test of the result, not a second chance to fit), and the test metric is recomputed.

### Check 3: is a random hidden game a fair stand-in for a game the user is playing now?
The honest objection to this whole study is that a deployed recommender predicts *forward* in time, and a random holdout does not. The file has no timestamps, but `playtime_2weeks` marks games played in the two weeks before the crawl. For every user with at least one such game we hide **one recently played game** instead of a random one, train on all their other games, and compare the models on exactly those users. This is not a temporal split (a recently played game may be an old favorite, and the training row can contain games bought later), so we read it as a stress test: if the model ordering changed here, conclusions drawn from the random split would be suspect.
'''))
out.append(code(r'''
def fit_and_score(trval_df, test_df, eval_users):
    _gram_cache.update(key=None, G=None)             # new matrices can reuse an old object's id and nnz: never reuse the Gram matrix
    Xb, Wb = build(trval_df), build(trval_df, True)
    tgt = np.zeros(n_users, int); tgt[test_df.u.values] = test_df.i.values
    ncand = n_items - np.diff(Xb.indptr); res = {}
    for name in MODEL_ORDER:
        m = FACTORY[name](**best_params.get(name, {})).fit(Xb, Wb)
        res[name] = metrics_from_ranks(rank_of_targets(m, Xb, tgt, eval_users), ncand[eval_users])["NDCG"]
    return res

# ---- Check 2: re-draw the random split
split_scores = {"main split (seed 42)": {n: per_user[n]["NDCG"].mean() for n in MODEL_ORDER}}
for s in range(1, (1 if FAST_MODE else N_RESPLITS) + 1):
    r = np.random.default_rng(SEED + s); t0 = time.time()
    rk = pos.assign(rnd=r.random(len(pos))).groupby("u").rnd.rank(method="first")
    res = fit_and_score(pos[rk > 1], pos[rk == 1], all_users)
    split_scores[f"re-split {s}"] = {n: v.mean() for n, v in res.items()}
    print(f"re-split {s} done in {time.time() - t0:.0f}s")
split_df = pd.DataFrame(split_scores)
split_df["mean"] = split_df.mean(1); split_df["sd across splits"] = split_df.iloc[:, :-1].std(1)
orders = {c: tuple(split_df[c].sort_values(ascending=False).index) for c in split_scores}
same_order = len(set(orders.values())) == 1
display(split_df.style.format("{:.4f}").background_gradient(subset=["mean"], cmap="Greens").set_caption("Test NDCG@10 under independent re-draws of the per-user split"))
print("Model ordering identical on every split:", same_order)
if not same_order:
    for c, o in orders.items(): print(f"  {c}: {' > '.join(o)}")

# ---- Check 3: hide a recently played game instead of a random one
r = np.random.default_rng(SEED); rec = pos[pos.recent]
pick = rec.assign(rnd=r.random(len(rec))).groupby("u").rnd.rank(method="first") == 1
test_rec = rec[pick]; eval_rec = np.sort(test_rec.u.values)
res_rec = fit_and_score(pos.drop(test_rec.index), test_rec, eval_rec)
_gram_cache.update(key=None, G=None)
recent_df = pd.DataFrame({"random hidden game (same users)": {n: per_user[n]["NDCG"][eval_rec].mean() for n in MODEL_ORDER},
                          "recently played hidden game": {n: res_rec[n].mean() for n in MODEL_ORDER}})
pop_order = np.argsort(-np.asarray(X_trval.sum(0)).ravel(), kind="stable"); head100 = np.zeros(n_items, bool); head100[pop_order[:100]] = True
tgt_rec = np.zeros(n_users, int); tgt_rec[test_rec.u.values] = test_rec.i.values
print(f"Users with a recently played game in the filtered data: {len(eval_rec):,} of {n_users:,} ({len(eval_rec) / n_users:.0%})")
print(f"Hidden game is one of the 100 most-played titles: random holdout {head100[test_item[eval_rec]].mean():.0%} | recent holdout {head100[tgt_rec[eval_rec]].mean():.0%}")
order_rand = tuple(recent_df.iloc[:, 0].sort_values(ascending=False).index); order_rec = tuple(recent_df.iloc[:, 1].sort_values(ascending=False).index)
print("Ordering under random holdout :", " > ".join(order_rand)); print("Ordering under recent holdout :", " > ".join(order_rec))

fig, ax = plt.subplots(1, 2, figsize=(15, 4.4)); x = np.arange(len(MODEL_ORDER)); w = 0.8 / len(split_scores)
for k, c in enumerate(split_scores): ax[0].bar(x + k * w - 0.4 + w / 2, split_df.loc[MODEL_ORDER, c], w, label=c)
ax[0].set_xticks(x); ax[0].set_xticklabels(MODEL_ORDER, rotation=35, ha="right"); ax[0].set(ylabel="test NDCG@10", title="Check 2: same models, re-drawn splits"); ax[0].legend(fontsize=7)
ax[1].bar(x - 0.2, recent_df.loc[MODEL_ORDER].iloc[:, 0], 0.4, label="random hidden game"); ax[1].bar(x + 0.2, recent_df.loc[MODEL_ORDER].iloc[:, 1], 0.4, label="recently played hidden game")
ax[1].set_xticks(x); ax[1].set_xticklabels(MODEL_ORDER, rotation=35, ha="right"); ax[1].set(ylabel="test NDCG@10", title="Check 3: what is hidden changes the level, does it change the order?"); ax[1].legend(fontsize=8)
plt.tight_layout(); plt.show()
display(recent_df.style.format("{:.4f}"))
'''))

# ---------------- error analysis etc (renumber)
out.append(md(rep(src(19), "## 4.4 Error analysis", "## 4.5 Error analysis")))
out.append(code(src(20)))
out.append(md(rep(src(21), "## 4.5 Beyond accuracy", "## 4.6 Beyond accuracy")))
out.append(code(src(22)))
out.append(md(rep(src(23), "## 4.6 Qualitative checks", "## 4.7 Qualitative checks")))
out.append(code(src(24)))
out.append(code(src(25)))

# ---------------- related work
out.append(md(r'''
# 5. Related work, conclusions, and limitations

## 5.1 Related work
**This dataset.** The file is part of the UCSD *Steam Video Game and Bundle Data* collection (McAuley, Kang & Pasricha). The lab's own papers on Steam study different tasks from ours:
- Kang & McAuley, *Self-Attentive Sequential Recommendation* (ICDM 2018): next-item prediction from the *order* of a user's interactions.
- Wan & McAuley, *Item Recommendation on Monotonic Behavior Chains* (RecSys 2018): chains of progressively stronger signals (e.g. purchase, play, review, recommend).
- Pathak, Gupta & McAuley, *Generating and Personalizing Bundle Recommendations on Steam* (SIGIR 2017): recommending bundles rather than single games.
- The underlying profile crawl is from O'Neill, Vaziripour, Wu & Zappala, *Condensing Steam: Distilling the Diversity of Gamer Behavior* (IMC 2016), a measurement study of ownership and playtime, including the gap between owning and playing that Section 2 reproduces.

**Methods we implement.** Hu, Koren & Volinsky, *Collaborative Filtering for Implicit Feedback Datasets* (ICDM 2008) for confidence-weighted ALS; Rendle, Freudenthaler, Gantner & Schmidt-Thieme, *BPR: Bayesian Personalized Ranking from Implicit Feedback* (UAI 2009); Cremonesi, Koren & Turrin, *Performance of Recommender Algorithms on Top-N Recommendation Tasks* (RecSys 2010) for PureSVD; Steck, *Embarrassingly Shallow Autoencoders for Sparse Data* (WWW 2019) for EASE, which names SLIM (Ning & Karypis, ICDM 2011) as its closest relative.

**Evaluation methodology.** Krichene & Rendle, *On Sampled Metrics for Item Recommendation* (KDD 2020) show that metrics computed against sampled negatives can reorder models, which is why we rank against the full catalog. Ferrari Dacrema, Cremonesi & Jannach, *Are We Really Making Much Progress?* (RecSys 2019) show that carefully tuned simple baselines often match or beat newer neural methods, which is why no model here is reported from a setting on the edge of its search.

**How our setting differs from prior Steam work.** Sequential models such as SASRec need timestamps and are usually evaluated leave-last-out on *reviews*. This file has **no timestamps** and records **playtime**, so we use a random per-user holdout and a "played" signal. Absolute numbers are therefore not comparable to published Steam results; only the *relative ordering of methods* can be compared.

RELATED_RESULTS_PLACEHOLDER

## 5.2 Conclusions
'''))
out.append(code("HEADLINE_PLACEHOLDER"))
out.append(md("INTERPRET_PLACEHOLDER\n\n" + src(28).split("## 5.3 Limitations and validity threats")[1].join(["## 5.3 Limitations and validity threats", ""])))
json.dump(out, open('part3.json','w')); print(len(out))

# assemble
import copy
nbo = json.load(open('../../steam_game_recommender_v2.ipynb'))
cells = json.load(open('part1.json')) + json.load(open('part2.json')) + out
nbo['cells'] = cells
nbo['metadata']['kernelspec'] = {"display_name": "Python 3", "language": "python", "name": "python3"}
json.dump(nbo, open('steam_v3_draft.ipynb','w'), indent=1)
print('total cells', len(cells))
