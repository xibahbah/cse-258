# Homeworks 1–4

[Official handout](https://docs.google.com/document/d/1zongdaJNV49MRl81TH5iL4fezrAZ2GsuaftdLkFrRsk/edit)

| Homework | PDF pages | Work and evaluation |
|---|---|---|
| 1 | 1–2 | Regress book ratings on length and date features. Compare ordinal and one-hot time features before and after a shuffled 50/50 split. For beer reviews, classify ratings ≥4 and evaluate balanced error and precision@K. |
| 2 | 3–4 | Predict a high-ABV label from beer features. Tune regularization using 50/25/25 train/validation/test splits, then ablate feature groups. On instrument reviews, retrieve similar products and predict ratings with training-only means and fallbacks. |
| 3 | 5 | Use the Assignment 1 data, six tasks, and provided baseline thresholds. Each task earns one point for a 2% improvement. |
| 4 | 6–7 | Compare three 1,000-feature text representations with Ridge and report held-out MSE. Use train-only unigram TF–IDF for review similarity. Train skip-gram Item2Vec on ordered user histories and evaluate its cosine-based rating estimator and an improved estimator. |

## Starter and runner lookup

Cell numbers count all notebook cells. HW3 uses Assignment 1.

### [hw1_runner.ipynb](https://drive.google.com/file/d/1nbPqnrDKyG9YLzVSKqFlYbpjRqhelk_v/view)

- cell 11 · `testQ1`
- cell 12 · `testQ2`
- cell 13 · `testQ3`
- cell 14 · `testQ4`
- cell 15 · `testQ5`
- cell 16 · `testQ6`
- cell 17 · `testQ7`

### [hw1_stub.ipynb](https://drive.google.com/file/d/1GLCD-trhAqNvYmDn5icinsqen9RBK_RP/view)

- cell 3 · `getMaxLen`
- cell 4 · `featureQ1`
- cell 5 · `Q1`
- cell 7 · `featureQ2`
- cell 8 · `Q2`
- cell 10 · `featureQ3`
- cell 11 · `Q3`
- cell 13 · `Q4`
- cell 15 · `featureQ5`
- cell 16 · `Q5`
- cell 18 · `Q6`
- cell 20 · `featureQ7`

### [hw2_runner.ipynb](https://drive.google.com/file/d/1LZs-XOG016u5-AUN5U_qctXop7GRrhwH/view)

- cell 5 · `parseData`
- cell 15 · `testQ1`
- cell 17 · `testQ2`
- cell 19 · `testQ3`
- cell 21 · `testQ4`
- cell 31 · `testQ5`
- cell 36 · `testQ6`
- cell 38 · `testQ7`

### [hw2_stub.ipynb](https://drive.google.com/file/d/1-dK1cSrZ3rfUqfOvjph1d4VCe9KEOFcy/view)

- cell 3 · `feat`
- cell 4 · `pipeline`
- cell 7 · `Q1`
- cell 10 · `Q2`
- cell 13 · `Q3`
- cell 16 · `Q4`
- cell 19 · `Jaccard`
- cell 20 · `mostSimilar`
- cell 23 · `MSE`
- cell 24 · `getMeanRating`, `getUserAverages`, `getItemAverages`
- cell 26 · `predictRating`
- cell 29 · `predictRatingQ7`

### [hw4_runner.ipynb](https://drive.google.com/file/d/1I7P3jDvc8Le-r358Tvpqz6NrGKk5GH1g/view)

- cell 3 · `MSE`
- cell 4 · `readGz`
- cell 5 · `readCSV`
- cell 7 · `testQ1`
- cell 9 · `testQ2`
- cell 11 · `testQ3`
- cell 13 · `testQ4`

### [hw4_stub.ipynb](https://drive.google.com/file/d/1Aa0Qc-jEoIPZUuCxGbbweePmpJ0vztsz/view)

- cell 2 · `MSE`
- cell 4 · `counts`
- cell 5 · `feature`
- cell 6 · `fitModel`
- cell 7 · `DF`
- cell 8 · `TF`
- cell 9 · `TFIDF`
- cell 10 · `Cosine`
- cell 11 · `similarities`
- cell 12 · `makeUserSentences`
- cell 13 · `makeWVmodel`
- cell 14 · `predictRating`
- cell 15 · `betterPredictRating`
