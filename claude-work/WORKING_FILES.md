# Working files behind v3

Everything that went into the v3 notebook and the slide plan, kept for reference. **Nothing here is submitted.** The submission files are in `deliverables/`: `workbook.html` (plus the video link, still to make).

| Folder | Contents |
|---|---|
| `slides_draft/` | A 16-slide draft deck (one HTML file per slide, a shared `deck.css`, and `deck.json` with the order). Superseded by `deliverables/SLIDES_OUTLINE.md`; use it only as a content reference |
| `figures/` | The six charts exported from the executed v3 notebook |
| `experiments/` | Exploratory scripts run before v3 was built, and their logs |
| `build/` | Scripts that turned the v2 notebook into v3, plus the script source |
| `reproduction/` | The v2 notebook re-run unchanged from the raw data file |

## slides_draft/

- Images in the slides point to `/_blob/...` addresses that only resolve inside the Claude artifact the draft was made in. Locally, use the PNGs in `figures/`: `IMG_EDA` → `eda.png`, `IMG_CHECKS` → `checks.png`, `IMG_HEAT` → `heat.png`.
- The draft has 16 slides and no code slides. The outline in `deliverables/` has 19, including four code slides.

## figures/

| File | Notebook section | Shows |
|---|---|---|
| `eda.png` | 2.3 | Unplayed share by library size, rank-frequency of games, owners vs. median hours |
| `tune.png` | 4.2 | Validation NDCG@10 for every configuration tried |
| `bpr.png` | 4.2 | BPR diagnosis: gradient weight, pairs already ordered, popularity-weighted negatives |
| `final.png` | 4.3 | Test NDCG@10 and HR@10 with intervals, HR@K curve |
| `checks.png` | 4.4 | Re-drawn splits, and random vs. recently played hidden game |
| `heat.png` | 4.5 | NDCG@10 by user library size and by popularity of the hidden game |

## experiments/

These were run on the exact sample and split the notebook uses, to find out where the real comparison lay before changing the notebook. Their findings are reproduced, with the final settings, inside v3; read the notebook, not these, for the results.

| Script | Question | Finding |
|---|---|---|
| `audit.py` | What is in the raw file? | 684 repeated profile lines; "Dota 2 Test" most owned, 7% played; 36% of owned pairs unplayed; `playtime_2weeks` unused |
| `ex1.py` | Were Item-kNN, PureSVD, EASE tuned? | EASE peaks at λ = 100 (interior); PureSVD peaks at 12–16 factors; kNN flat beyond k = 800 |
| `ex2.py` | Does our ALS match the `implicit` library? Which ALS settings matter? | Matches at equal settings; regularization matters most, and v2 fixed it at 10 |
| `ex3.py` | Finer ALS search with the library | Best region α 2–4, reg 50–80, more factors keep helping |
| `ex4.py`, `ex5.py` | Is BPR under-trained or mis-tuned? | Library BPR is no better than ours; ours plateaus by epoch 10–30 |
| `ex6.py` | Is BPR limited by easy negatives? | Popularity-weighted negatives make it worse |
| `ex7.py` | Our ALS at the library's best settings | 0.188 at 128 factors; confirms the region the notebook then searched |

`common.py` loads a cached copy of the notebook's sample and split (`prep.pkl`), which is not in the repo (it is about 170 MB). To rerun an experiment, regenerate it by running notebook cells 3, 4, and 9 and pickling the variables listed in `common.py`; `ex2w.py` wraps the library models. Logs are in `experiments/logs/`; the output of `ex2.py` and `ex7.py` was printed to the console and not saved.

## build/

| File | Role |
|---|---|
| `build1.py`, `build2.py`, `build3.py` | Rebuild the v3 notebook cell by cell from `../../steam_game_recommender_v2.ipynb` |
| `headline.py` | The computed headline cell in Section 5.2 |
| `md_patch.py` | Inserts the interpretation text cells after a full run, so every quoted number matches the run |
| `show.py`, `figs.py` | Print a notebook's outputs; export its figures |
| `script.txt`, `mk.js` | Source of the presentation script and the generator for the `.docx` |

Run order: `build1.py` (imported by the others) → `build2.py` → `build3.py`, add `headline.py`'s code into the headline cell, execute the notebook, then `md_patch.py executed.ipynb final.ipynb`. The v3 notebook in `deliverables/` is the result; there is no need to rebuild it.

## reproduction/

`v2_rerun_executed.ipynb` is the teammate's v2 notebook, re-executed without changes from the raw data on a different machine. Its headline table is identical to the saved v2 outputs, which is the evidence that the v2 numbers were reproducible before anything was changed.
