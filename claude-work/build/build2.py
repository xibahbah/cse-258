import json
from build1 import src, md, code, rep, C
out = []
# ---------------- 10 modeling md
s = src(10)
s = rep(s, "## 3.2 Models and trade-offs\n\n| Model | Idea | Pros | Cons |\n|---|---|---|---|", "## 3.2 Models and trade-offs\n\n| Model | Idea | Pros | Cons |\n|---|---|---|---|")
s = rep(s, "All models implement the same interface",
"**Where each model sits relative to the course.** Popularity, cosine Item-kNN, implicit ALS (confidence-weighted squared error over all cells), and BPR (pairwise loss over sampled unobserved items) are the course's recommendation models. PureSVD is the truncated SVD of the zero-filled matrix, which the course contrasts with the latent-factor model because it optimizes a different objective. EASE is not a course model. Its closest relative in the course is SLIM: both learn an item-to-item weight matrix with a zero diagonal, but SLIM uses an L1 + L2 penalty with non-negativity and is fit column by column, while EASE keeps only the L2 penalty and so has a closed form. It is not AutoRec, which has a hidden layer and a non-linear encoder.\n\n**Cost.** Item-kNN and EASE both build the $I \\times I$ Gram matrix ($O(\\text{nnz}\\cdot\\bar n)$ time, $O(I^2)$ memory); EASE adds one $O(I^3)$ inverse. ALS costs $O(\\text{nnz}\\,f^2 + (U+I) f^3)$ per sweep. BPR costs $O(\\text{nnz}\\,f)$ per epoch but needs many epochs and a learning rate.\n\nAll models implement the same interface")
out.append(md(s))

# ---------------- 11 models code: BPR gains a negative-sampler exponent and a training history
s = src(11)
old_init = "def __init__(self, f=64, lr=0.1, reg=0.01, epochs=20, batch=2048): self.f, self.lr, self.reg, self.epochs, self.batch = f, lr, reg, epochs, batch"
new_init = ("# neg_pow = 0 samples negatives uniformly (standard BPR); neg_pow > 0 samples them in proportion to popularity**neg_pow (used only in the 4.2 diagnosis).\n"
            "    # history records, per epoch, the mean gradient weight sigma(-x) and the share of sampled pairs already ordered correctly.\n"
            "    def __init__(self, f=64, lr=0.1, reg=0.01, epochs=20, batch=2048, neg_pow=0.0): self.f, self.lr, self.reg, self.epochs, self.batch, self.neg_pow = f, lr, reg, epochs, batch, neg_pow")
s = rep(s, old_init, new_init)
s = rep(s, "        us, its = coo.row.astype(np.int64), coo.col.astype(np.int64)\n",
           "        us, its = coo.row.astype(np.int64), coo.col.astype(np.int64)\n"
           "        cdf = np.cumsum(np.asarray(X.sum(0)).ravel() ** self.neg_pow); cdf = cdf / cdf[-1]\n"
           "        draw = (lambda n: r.integers(0, n_i, n)) if self.neg_pow == 0 else (lambda n: np.minimum(np.searchsorted(cdf, r.random(n)), n_i - 1))\n"
           "        self.history = []\n")
s = rep(s, "        for _ in range(self.epochs):\n            perm = r.permutation(len(us))\n", "        for ep in range(self.epochs):\n            perm = r.permutation(len(us)); gw, ok = [], []\n")
s = rep(s, "                j = r.integers(0, n_i, len(sel))\n", "                j = draw(len(sel))\n")
s = rep(s, "                if bad.any(): j[bad] = r.integers(0, n_i, bad.sum())\n", "                if bad.any(): j[bad] = draw(int(bad.sum()))\n")
s = rep(s, "                g = (1 / (1 + np.exp(np.clip(x, -30, 30)))).astype(np.float32)[:, None]   # sigma(-x)\n",
           "                g = (1 / (1 + np.exp(np.clip(x, -30, 30)))).astype(np.float32)[:, None]   # sigma(-x)\n"
           "                gw.append(float(g.mean())); ok.append(float((x > 0).mean()))\n")
s = rep(s, "                scatter_mean_update(self.b, j, -g[:, 0] - self.reg * self.b[j], self.lr)\n        return self",
           "                scatter_mean_update(self.b, j, -g[:, 0] - self.reg * self.b[j], self.lr)\n            self.history.append({\"epoch\": ep + 1, \"mean gradient weight\": float(np.mean(gw)), \"pairs already ordered\": float(np.mean(ok))})\n        return self")
out.append(code(s))

# ---------------- 12, 13 eval
out.append(md(src(12)))
out.append(code(src(13)))

# ---------------- 13b known-answer tests
out.append(md(r'''
### Known-answer tests of the evaluation code
Every number in Section 4 passes through `rank_of_targets` and `metrics_from_ranks`, so a bug there would silently corrupt all of them. The cell below feeds them hand-built score tables whose correct ranks we can work out on paper, covering the cases that usually go wrong: masking of games the user already has, ties, a target ranked first and last, and the metric formulas at known ranks. It also checks the split itself: no user's validation or test game may appear in that user's training row.
'''))
out.append(code(r'''
class _Fixed:                                  # a "model" that returns a score table we wrote by hand
    def __init__(self, S): self.S = np.asarray(S, np.float32)
    def score(self, u): return self.S[u]

seen = csr_matrix(np.array([[1, 0, 0, 0, 0],   # user 0 already has game 0 (the top-scored one): it must be masked out
                            [0, 0, 0, 0, 0],   # user 1: three-way tie that includes the target
                            [0, 0, 0, 0, 0],   # user 2: target has the highest score
                            [0, 1, 1, 0, 0]])) # user 3: target has the lowest score among 3 unseen games
S = [[9, 5, 7, 1, 3],      # user 0, target 1: unseen scores 5,7,1,3 -> one game (7) is above -> rank 2
     [4, 4, 4, 1, 0],      # user 1, target 0: ties count against the model -> rank 3
     [1, 2, 9, 0, 3],      # user 2, target 2: rank 1
     [5, 9, 9, 1, 0]]      # user 3, target 4: unseen scores 5,1,0 -> rank 3
tg = np.array([1, 0, 2, 4]); uu = np.arange(4)
rk = rank_of_targets(_Fixed(S), seen, tg, uu)
assert rk.tolist() == [2, 3, 1, 3], rk

m = metrics_from_ranks(np.array([1, 2, 11]), np.array([100, 100, 100]), K=10)
assert np.allclose(m["HR"], [1, 1, 0]) and np.allclose(m["NDCG"], [1, 1 / np.log2(3), 0])
assert np.allclose(m["MRR"], [1, 1 / 2, 1 / 11]) and np.allclose(m["AUC"], [1, 1 - 1 / 99, 1 - 10 / 99])

# an oracle that scores the hidden game highest must be perfect; one that scores it lowest must be at the bottom
class _Oracle:
    def __init__(self, sign): self.sign = sign
    def score(self, u):
        sc = np.zeros((len(u), n_items), np.float32); sc[np.arange(len(u)), test_item[u]] = self.sign; return sc
chk = all_users[:2000]
assert (rank_of_targets(_Oracle(+1), X_trval, test_item, chk) == 1).all()
assert (rank_of_targets(_Oracle(-1), X_trval, test_item, chk) == ncand_test[chk]).all()

# split integrity: held-out games are absent from the rows the models are fitted on
assert X_train[all_users, val_item].sum() == 0 and X_train[all_users, test_item].sum() == 0 and X_trval[all_users, test_item].sum() == 0
assert X_trval[all_users, val_item].sum() == n_users            # validation games do return for the final refit
print("All evaluation and split checks passed: masking, ties, best/worst rank, metric formulas, no train/test overlap.")
'''))

# ---------------- 14, 15 tuning
out.append(md(r'''
## 4.2 Hyper-parameter tuning (validation only)
Each model family is tuned on a random subset of **validation** users, fitted on the training matrix only, selecting by validation **NDCG@10**. The test set is not touched here.

**A comparison is only as fair as its weakest search.** A model whose best setting sits on the edge of its grid has not been tuned: the true optimum may lie outside. So every search below is wide enough that the selected value is either *interior* or on a *flat* part of the curve, and the table after the search states which, axis by axis.
- Item-kNN, PureSVD, and EASE are cheap, so they get full grids.
- ALS is searched in two stages: confidence $\alpha$ and regularization on a 3 x 3 grid at $f=64$, then the number of factors at the best pair. Regularization was fixed in the first draft of this project; it turns out to matter more than any other ALS setting.
- BPR is searched over factors and learning rate.
'''))
out.append(code(r'''
FACTORY = {
    "Random":                  lambda **p: Random(),
    "Popularity":              lambda **p: Popularity(),
    "Item-kNN":                lambda **p: ItemKNN(**p),
    "PureSVD":                 lambda **p: PureSVD(**p),
    "ALS (binary)":            lambda **p: ImplicitALS(weighted=False, iters=3 if FAST_MODE else 10, **p),
    "ALS (playtime-weighted)": lambda **p: ImplicitALS(weighted=True,  iters=3 if FAST_MODE else 10, **p),
    "BPR-MF":                  lambda **p: BPRMF(epochs=3 if FAST_MODE else 20, **p),
    "EASE":                    lambda **p: EASE(**p),
}
MODEL_ORDER = ["Random", "Popularity", "Item-kNN", "PureSVD", "ALS (binary)", "ALS (playtime-weighted)", "BPR-MF", "EASE"]
TUNED = MODEL_ORDER[2:]

tune_users = rng.choice(n_users, min(TUNE_USERS, n_users), replace=False)
tuning_rows, bpr_history = [], {}

def run_config(name, p):
    t0 = time.time(); m = FACTORY[name](**p).fit(X_train, W_train)
    mt = metrics_from_ranks(rank_of_targets(m, X_train, val_item, tune_users), ncand_val[tune_users])
    row = {"model": name, "params": ", ".join(f"{k}={v:g}" for k, v in p.items()), "_p": dict(p),
           "val NDCG@10": mt["NDCG"].mean(), "val HR@10": mt["HR"].mean(), "fit+eval s": time.time() - t0}
    tuning_rows.append(row)
    if name == "BPR-MF": bpr_history[row["params"]] = m.history
    print(f"{name:25s} {row['params']:28s} NDCG@10={row['val NDCG@10']:.4f}  ({row['fit+eval s']:.0f}s)")

def search(name, **axes):
    combos = [dict(zip(axes, v)) for v in itertools.product(*axes.values())]
    for p in (combos[:2] if FAST_MODE else combos): run_config(name, p)

def best_of(name):
    sub = [r for r in tuning_rows if r["model"] == name]
    return max(sub, key=lambda r: r["val NDCG@10"])["_p"]

search("Item-kNN", k=[50, 200, 800, n_items], alpha=[0.3, 0.5, 0.7])          # k = n_items means "no truncation"
search("PureSVD",  f=[4, 8, 12, 16, 24, 32, 64])
search("EASE",     lam=[10.0, 30.0, 100.0, 300.0, 1000.0, 3000.0])
for name, alphas in [("ALS (binary)", [1, 3, 10]), ("ALS (playtime-weighted)", [0.1, 0.3, 1])]:
    search(name, f=[64], alpha=alphas, reg=[20.0, 80.0, 300.0])                 # stage 1: confidence x regularization
    b = best_of(name); search(name, f=[32, 128], alpha=[b["alpha"]], reg=[b["reg"]])   # stage 2: factors
search("BPR-MF", f=[32, 64, 128], lr=[0.02, 0.05, 0.1])

tuning_df = pd.DataFrame(tuning_rows)
best_params = {name: best_of(name) for name in TUNED}
print("\nSelected hyper-parameters:", best_params)
'''))
out.append(code(r'''
# Is each selected value interior to what we tried, or on an edge? (An edge is acceptable only where the curve is flat.)
edge_rows = []
for name in TUNED:
    sub = tuning_df[tuning_df.model == name]; bp = best_params[name]; top = sub["val NDCG@10"].max()
    for ax in bp:
        vals = sorted({r[ax] for r in sub._p})
        if len(vals) < 2: continue
        # best score reached at each value of this axis (other axes free)
        by = {v: max(r2["val NDCG@10"] for r2 in tuning_rows if r2["model"] == name and r2["_p"][ax] == v) for v in vals}
        pos_ = "interior" if vals[0] < bp[ax] < vals[-1] else "edge"
        i = vals.index(bp[ax]); nb_ = [by[vals[j]] for j in (i - 1, i + 1) if 0 <= j < len(vals)]
        edge_rows.append({"model": name, "setting": ax, "tried": ", ".join(f"{v:g}" for v in vals), "selected": f"{bp[ax]:g}", "position": pos_,
                          "gain over best neighbouring value": top - max(nb_)})
edge_df = pd.DataFrame(edge_rows)
display(edge_df.style.format({"gain over best neighbouring value": "{:+.4f}"})
        .map(lambda v: "background-color:#fde0dd" if v == "edge" else "", subset=["position"])
        .set_caption("Where each selected setting sits in its search range (validation NDCG@10)"))

fig, axes = plt.subplots(1, len(TUNED), figsize=(3.3 * len(TUNED), 3.6), sharey=True)
for a, name in zip(axes, TUNED):
    sub = tuning_df[tuning_df.model == name].reset_index(drop=True); bi = sub["val NDCG@10"].idxmax()
    a.bar(range(len(sub)), sub["val NDCG@10"], color=["#E45756" if i == bi else "#4C78A8" for i in range(len(sub))])
    a.set_xticks(range(len(sub))); a.set_xticklabels(sub.params, rotation=80, ha="right", fontsize=6); a.set_title(name, fontsize=9)
axes[0].set_ylabel("validation NDCG@10"); plt.suptitle("Every configuration tried (red = selected)", y=1.02, fontsize=10); plt.tight_layout(); plt.show()
'''))

# ---------------- BPR diagnosis
out.append(md(r'''
### Why is BPR weak here? A diagnosis, not an excuse
BPR is a course model and, on paper, the one that "optimizes ranking directly", so a weak result needs an explanation backed by evidence. Three candidate causes, each tested:
1. **Under-training.** The left panel tracks training over epochs. If the curves are still moving at the last epoch, more epochs would help.
2. **The objective is not the metric.** BPR maximizes the chance that a played game outranks *one uniformly sampled unplayed game*, which is AUC. NDCG@10 only rewards the very top of a 3,500-game list. The middle panel shows the share of sampled training pairs the model already orders correctly: once that is high, most gradient updates are near zero even though the top of the list is not yet right.
3. **Easy negatives.** With a long-tailed catalog a uniformly sampled negative is almost always an obscure game. If that were the whole story, sampling negatives in proportion to popularity (harder negatives) should help. The right panel tests it.
'''))
out.append(code(r'''
bp = best_params["BPR-MF"]; key = ", ".join(f"{k}={v:g}" for k, v in bp.items())
hist = pd.DataFrame(bpr_history[key])

def val_scores(m):
    mt = metrics_from_ranks(rank_of_targets(m, X_train, val_item, tune_users), ncand_val[tune_users])
    return mt["NDCG"].mean(), mt["AUC"].mean()

neg_rows = []
for pw in [0.0, 0.75]:
    m = FACTORY["BPR-MF"](neg_pow=pw, **bp).fit(X_train); nd, au = val_scores(m)
    neg_rows.append({"negatives sampled ∝ popularity^": pw, "val NDCG@10": nd, "val AUC": au, "pairs already ordered (last epoch)": m.history[-1]["pairs already ordered"]})
neg_df = pd.DataFrame(neg_rows)
pop_nd, pop_au = val_scores(Popularity().fit(X_train))

fig, ax = plt.subplots(1, 3, figsize=(16, 4))
ax[0].plot(hist.epoch, hist["mean gradient weight"], marker="o", ms=3); ax[0].set(xlabel="epoch", ylabel="mean σ(−x) over sampled pairs", title="1. Gradient weight shrinks, then flattens")
ax[1].plot(hist.epoch, hist["pairs already ordered"], marker="o", ms=3, color="#54A24B"); ax[1].set(xlabel="epoch", ylabel="share of sampled pairs", ylim=(0.5, 1), title="2. Sampled pairs already ordered correctly")
ax[2].bar([f"pop^{p:g}" for p in neg_df.iloc[:, 0]], neg_df["val NDCG@10"], color=["#4C78A8"] + ["#F58518"] * (len(neg_df) - 1))
ax[2].axhline(pop_nd, ls="--", c="gray"); ax[2].text(len(neg_df) - 0.55, pop_nd, "Popularity", va="bottom", ha="right", fontsize=8, color="gray")
ax[2].set(ylabel="validation NDCG@10", title="3. Harder (popular) negatives do not help")
plt.tight_layout(); plt.show()
display(neg_df.style.format({"val NDCG@10": "{:.4f}", "val AUC": "{:.4f}", "pairs already ordered (last epoch)": "{:.1%}"}))
print(f"For reference, Popularity on the same validation users: NDCG@10 = {pop_nd:.4f}, AUC = {pop_au:.4f}")
'''))
json.dump(out, open('part2.json','w')); print(len(out))
