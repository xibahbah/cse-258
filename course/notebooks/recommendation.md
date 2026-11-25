# Lecture notebook · recommendation

[Original HTML · 42 cells](https://drive.google.com/file/d/1Hfy0Da3qJwCTDbLtyQgtOIHSKXERQ4xb/view)

Cells 1–15 build user and product lookup tables and set similarities. Cells 16–24 retrieve similar items, then narrow the candidate set through shared users. Cells 25–42 use a user’s history for rating prediction and calculate errors.

## Code lookup

Cell numbers include Markdown cells. Only operations and function names are indexed.

- cell 14 · `Jaccard`
- cell 15 · `mostSimilar`
- cell 23 · `mostSimilarFast`
- cell 31 · `predictRating`
- cell 36 · `MSE`
