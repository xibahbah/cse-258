import json, re, sys
src_nb, dst_nb = sys.argv[1], sys.argv[2]
nb = json.load(open(src_nb)); C = nb['cells']
S = lambda c: c['source'] if isinstance(c['source'], str) else ''.join(c['source'])
def md(t): return {"cell_type":"markdown","metadata":{},"source":t.strip('\n')}
def find(key, kind=None):
    hits = [i for i, c in enumerate(C) if key in S(c) and (kind is None or c['cell_type'] == kind)]
    assert len(hits) == 1, (key, hits); return hits[0]
NEW = {}   # name -> text, also used for the number check

NEW['tuning_intro'] = r'''
## 4.2 Hyper-parameter tuning (validation only)
Each model family is tuned on a random subset of **validation** users, fitted on the training matrix only, selecting by validation **NDCG@10**. The test set is not touched here.

**A comparison is only as fair as its weakest search.** A model whose best setting sits on the edge of its grid has not been tuned: the true optimum may lie outside. The table after the search therefore reports, setting by setting, whether the selected value is *interior* or on an *edge*, and how much it gained over its best neighbour. Where an edge remains, the text below says what we know about it.
- Item-kNN, PureSVD, and EASE are cheap, so they get full grids.
- ALS is searched in two stages: confidence $\alpha$ and regularization on a 3 x 3 grid at $f=64$, then the number of factors at the best pair.
- BPR is searched over factors and learning rate.
'''
NEW['tuning_read'] = r'''
**Reading the search.**
- **Regularization is the setting that decides ALS.** At $f=64$, $\alpha=3$, validation NDCG@10 is 0.1543 with reg = 20, 0.1795 with reg = 80, and 0.1279 with reg = 300. A study that fixes this value understates ALS by a wide margin and overstates every model compared against it.
- **EASE and PureSVD have clean interior optima** ($\lambda=100$; $f=12$). PureSVD *degrades* quickly with more factors (0.1576 at 12, 0.1056 at 64): beyond the first few singular vectors it fits the zeros.
- **Edges that remain, and why they do not change the conclusions.**
  - *Item-kNN, k:* no truncation is best, but by +0.0005 over k = 800. The curve is flat.
  - *ALS, factors:* still rising at 128 (+0.0088 over 64). Our NumPy solver is cubic in $f$, so Check 1 in Section 4.4 asks the reference library for 256 factors instead and measures the headroom directly.
  - *BPR, factors:* still rising at 128 (+0.0112 over 64). BPR would need several times that gain to reach ALS, and the diagnosis below shows what actually limits it.
'''
NEW['bpr_read'] = r'''
**What the diagnosis shows.**
1. *Not under-trained.* The gradient weight and the share of correctly ordered pairs both flatten well before the last epoch.
2. *The objective is met; the metric is not.* By the last epoch the model orders 96.3% of sampled (played, random unplayed) pairs correctly, and its validation AUC is 0.9485, well above Popularity's 0.9084. Its NDCG@10 is 0.1421 against Popularity's 0.1118. BPR is doing what it optimizes: pushing played games above the *bulk* of the catalog. A top-10 list is decided among the few dozen strongest candidates, and a uniformly sampled negative is almost never one of them.
3. *Harder negatives make it worse.* Sampling negatives in proportion to popularity$^{0.75}$ drops validation NDCG@10 from 0.1421 to 0.0784. Under a random holdout the hidden game is itself usually popular, so a sampler that punishes popular games punishes the answers.

So BPR's place in the results table is a property of the pairwise-uniform objective on a long-tailed catalog, not of our implementation. Section 4.4 confirms that with a reference library.
'''
NEW['final_read'] = r'''
**Reading the table.**
- **EASE is best on every top-of-list metric**, and tuned **binary ALS is second** (NDCG@10 0.2251 vs. 0.2042). The paired bootstrap below puts the difference at +0.0210 with an interval that excludes zero.
- **The metrics disagree, and the disagreement is informative.** On AUC the order nearly reverses: BPR is *first* (0.9484), ALS second (0.9468), and EASE (0.9094) is barely above Popularity (0.9076). AUC averages over all 3,570 positions; NDCG@10 looks only at the top ten. BPR and ALS order the whole catalog well; EASE concentrates its accuracy at the head of the list, where a storefront shows results. For a top-N task NDCG@10 and HR@10 are the right targets, which is why they, not AUC, select our models. A project that reported AUC alone would have crowned a different winner.
- **Playtime weighting does not help ALS under this holdout** (0.1951 weighted vs. 0.2042 binary). Section 4.4 shows that this conclusion depends on which game is hidden.
'''
NEW['ref_read'] = r'''
**Reading Check 1.** At identical settings the library's ALS scores 0.2034 against our 0.2042, a difference of 0.0007, far inside the bootstrap interval: two independent solvers agree, so the ALS number is not an artifact of our code. Doubling the factors to 256 adds 0.0050 (0.2092), which leaves ALS below EASE's 0.2251: the remaining "edge" in the ALS search cannot close the gap. The library's BPR, tuned on validation, reaches 0.1386 against our 0.1498, so our BPR is not the weak link either; BPR itself is.
'''
NEW['robust_read'] = r'''
**Reading Check 2.** Across four independent splits no model's NDCG@10 moves by more than 0.0030 (one standard deviation), and EASE wins every one by at least 0.0210. The only change in ordering is between Item-kNN and BPR, which are tied to begin with. The headline does not depend on the seed.

**Reading Check 3.** Hiding a *recently played* game changes the levels sharply and the conclusions in three specific ways.
- **Everything looks easier, mostly because of popularity.** The hidden game is one of the 100 most-played titles 59% of the time, against 43% under the random holdout, and Popularity alone jumps from 0.1124 to 0.2643 on the same users.
- **Personalization is worth less than the random split suggests.** EASE still wins (0.3289), but its margin over Popularity falls from +90% to +24%. The random holdout overstates how much a deployed system would gain from personalization.
- **Playtime weighting flips from harmful to helpful.** Weighted ALS overtakes binary ALS (0.3139 vs. 0.2905), the reverse of the main table. A random hidden game is often something the user tried for minutes; a currently played game is one they are invested in, and the weighted model has learned which of a user's games those are. BPR, by contrast, falls below Popularity (0.2405 vs. 0.2643).

The winner is stable; the size of the win and the value of the playtime signal are not. Both depend on what "the right answer" is taken to be, which is the strongest argument for collecting timestamps before trusting any of these numbers as a forecast.
'''
NEW['related_results'] = r'''
**How our results match or differ from related work.**
- *EASE first, matrix factorization second* matches Steck (2019), who reports EASE ahead of weighted matrix factorization and, on most of his datasets (MovieLens-20M, Netflix Prize, Million Song Dataset), ahead of deep non-linear models. Steam playtime data adds one more dataset where a closed-form linear item model leads.
- *The size of the gap depends on tuning*, which matches Rendle, Krichene, Zhang & Koren, *Revisiting the Performance of iALS on Item Recommendation Benchmarks* (RecSys 2022). They show that implicit ALS, usually reported as far behind autoencoder-style models, becomes competitive once regularization and embedding size are tuned properly. We see the same mechanism: tuning regularization moved ALS far more than any other change in this notebook, and the remaining gap to EASE is about a tenth.
- *BPR trailing on top-N metrics while leading on AUC* is consistent with BPR's design (Rendle et al., 2009, derive it as an AUC surrogate) and with Rendle & Freudenthaler, *Improving Pairwise Learning for Item Recommendation from Implicit Feedback* (WSDM 2014), who show that uniformly sampled negatives give vanishing gradients on long-tailed catalogs. Their remedy is an *adaptive* sampler that picks negatives the model currently ranks high; our static popularity sampler is a cruder idea and, as Section 4.2 shows, it backfires under a random holdout.
- *A well-tuned neighborhood model within reach of a factor model* echoes Ferrari Dacrema et al. (2019); here Item-kNN matches BPR but not ALS.
- *Where we differ from prior Steam work:* Kang & McAuley (2018) evaluate next-item prediction on time-ordered Steam reviews and report sequence models ahead of non-sequential baselines such as BPR. We cannot test that claim on this file. Check 3 is the closest we can get, and it points the same way: results move a lot once the target is tied to *when* a game is played.
'''
NEW['interpret'] = r'''
**What we conclude.**
1. **A linear item-to-item model is the best recommender here.** EASE leads on HR@10, NDCG@10, and MRR, on every split, with full-catalog ranking.
2. **The best course model is close behind once it is tuned.** Binary implicit ALS is within about a tenth of EASE. Most of the apparent superiority of the outside method in an untuned comparison is a tuning artifact, not a modeling advantage.
3. **BPR's weak top-10 result is explained, not excused:** it has the best AUC of any model and a top-10 score near Item-kNN, because it optimizes the former.
4. **Accuracy and discovery pull apart.** Popularity covers 1.9% of the catalog; EASE covers 31.0%, ALS 17.5%, and BPR 36.1% (at much lower accuracy). The stratified results show personalized models earning their margin on torso and tail games, where Popularity scores nothing.
5. **How the task is posed matters as much as the model.** Under a recently-played holdout the personalization gain shrinks and playtime weighting becomes useful.

**What we would tell a grader to distrust.** The absolute level of every number (it depends on the holdout), and any claim about *next*-game prediction (we have no timestamps). What we would defend: the ordering EASE > ALS > the rest on top-10 metrics, which held under a second implementation, four splits, and a different choice of hidden game.
'''

# --- apply
i = find('a 3,500-game list', 'markdown'); C[i]['source'] = S(C[i]).replace('a 3,500-game list', 'a 3,570-game list')
i = find("a measurement study of ownership and playtime, including the gap between owning and playing that Section 2 reproduces.", 'markdown'); C[i]['source'] = S(C[i]).replace(", including the gap between owning and playing that Section 2 reproduces.", " on Steam.")
i = find('## 4.2 Hyper-parameter tuning (validation only)', 'markdown'); C[i]['source'] = NEW['tuning_intro'].strip('\n')
i = find('edge_rows = []', 'code'); C.insert(i + 1, md(NEW['tuning_read']))
i = find('neg_rows = []', 'code'); C.insert(i + 1, md(NEW['bpr_read']))
i = find('# paired bootstrap: is the best model really better', 'code'); C.insert(i + 1, md(NEW['final_read']))
i = find('ref_rows = []', 'code'); C.insert(i + 1, md(NEW['ref_read']))
i = find('def fit_and_score', 'code'); C.insert(i + 1, md(NEW['robust_read']))
i = find('RELATED_RESULTS_PLACEHOLDER', 'markdown'); C[i]['source'] = S(C[i]).replace('RELATED_RESULTS_PLACEHOLDER', NEW['related_results'].strip('\n'))
i = find('INTERPRET_PLACEHOLDER', 'markdown')
t = S(C[i]).replace('INTERPRET_PLACEHOLDER', NEW['interpret'].strip('\n'))
a = "- **Random, not temporal, split.** No timestamps are available, so models may see \"future\" games of the same user. Absolute scores will be optimistic compared with a deployed next-game system."
b = "- **Random, not temporal, split.** No timestamps are available, so models may see \"future\" games of the same user. Check 3 in Section 4.4 shows how much the picture moves under a different holdout; it is a stress test, not a temporal evaluation."
assert a in t; t = t.replace(a, b)
a = "- **Single split / single seed.** Bootstrap CIs capture *user* sampling noise, not split noise. A repeated-split study would be stronger."
b = "- **Hyper-parameters tuned on one split.** The re-splits in Section 4.4 reuse the settings selected on the main split, and model initialization uses one seed. Split noise is measured; tuning noise is not.\n- **Unequal search effort.** ALS and BPR were searched to 128 factors because the NumPy implementations are slow beyond that. The reference-library check bounds what ALS could gain; BPR at larger sizes is untested."
assert a in t; t = t.replace(a, b)
C[i]['source'] = t
for c in C:
    assert 'PLACEHOLDER' not in S(c)
json.dump(nb, open(dst_nb, 'w'), indent=1)
json.dump(NEW, open('new_md.json', 'w'))
print('patched', len(C), 'cells')
