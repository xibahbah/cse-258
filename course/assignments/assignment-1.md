# Assignment 1 · Book prediction

[Handout](https://docs.google.com/document/d/1tKW17iW84QsZ3f0O59pL9EDuG9oo6_1s6bC-pfRFIBY/edit) · [Official data and baselines](https://drive.google.com/file/d/1Gu0TAAFSPrS6ZwT1K0D7ADf1lhtlcqJg/view)

Complete at least three of six tasks. The same interactions support different prediction problems.

| Task | Prediction target | Information |
|---|---|---|
| 1 | Numeric rating | User and item |
| 2 | Which of two items is the observed interaction | User and candidate pair |
| 3 | Numeric rating | User, item, timestamp |
| 4 | Which candidate is the observed interaction | User, pair, timestamp |
| 5 | Which item comes next | Sequential history and candidate pair |
| 6 | Time until the next interaction | Timed interaction history |

Provided comparisons include a latent-factor rating model, BPR for preference ordering, and a median time-gap prediction. Include the code, a short write-up, and the prediction CSVs for the selected tasks. Use the handout and supplied baseline to match its file names, column order, and units.

## Data archive

Headers from the distributed files.

- `task_1_test.csv` · user, item, rating
- `task_2_test.csv` · user, item1, item2, which
- `task_3_test.csv` · user, item, timestamp, rating
- `task_4_test.csv` · user, timestamp, item1, item2, which
- `task_5_test.csv` · user, item1, item2, which
- `task_5_train.csv` · user, item, timestamp, rating
- `task_6_test.csv` · user, item, delta
- `task_6_train.csv` · user, item, timestamp, rating
- `tasks_1_2_train.csv` · user, item, timestamp, rating
- `tasks_3_4_train.csv` · user, item, timestamp, rating

The archive includes a 25-cell baseline notebook.
