# Assignment 2 · Project and submission

[Written handout](https://docs.google.com/document/d/1w_g-yEtn9lvmXIXQWjQoS51FugM_Mx-ACh0-EZcHWR8/edit) · [Project lecture](../slides/assignment2-fa26.md)

A group of one to four chooses a dataset and predictive task. Include a model taught in this course as a baseline or comparator when exploring an outside method. The five sections are worth five points each. Peer grading adds four.

| Section | Evidence for the grader |
|---|---|
| Task | Define the target, prediction time, comparison methods, and how performance will be checked. |
| Data and exploration | Identify provenance, observations, filtering, and transformations. Use plots or tables to explain why preprocessing matters. |
| Models | Explain inputs, outputs, objective, implementation, computational cost, and tradeoffs. |
| Evaluation | Justify the metric and split. Compare baselines under the same protocol. Present results and discuss failed or surprising cases. |
| Related work | Identify comparable datasets or prediction tasks and explain differences in methods or results. |

Submit an executed notebook exported as `workbook.html` and a one-line `video_url.txt` for an approximately 20-minute presentation. A shared Drive MP4 must be downloadable and over 1 MB. The handout also accepts a YouTube link. Peer graders should be able to follow the notebook without running it. Submit `responses.txt` for the later peer-review stage. Gradescope lists the exact deadlines.

## Steam project lookup

- Cells 1–10 of the project notebook define the top-N task, distinguish played from owned games, filter the interaction matrix, and split by user.
- Cells 11–16 implement baselines and recommendation models, ranking evaluation, and validation selection.
- Cells 17–26 refit models, evaluate held-out items, and analyze exposure, subgroups, and neighbors.
- Cells 27–29 discuss related work, uncertainty, and interpretation.

For an in-course comparison, consult the [recommendation deck](../slides/recommendation.md) on cosine neighborhoods, implicit-feedback weighting, BPR, and ranking metrics. EASE and the deck’s AutoRec are distinct models. The random per-user holdout evaluates recovery of a hidden played game. A chronological next-game claim would require a temporal test.
