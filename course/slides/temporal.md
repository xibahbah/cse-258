# Temporal

[Main slides · 123 PDF pages](https://drive.google.com/file/d/1YQdxP_boLqM24MEiXy65ii3Utiqp55R3/view)

Alternate edition: [slides without annotations](https://drive.google.com/file/d/1PU9IlJV8r-_2lscJ0p3ui16L4oM-pu1F/view). Page numbers below refer to the main edition.

## pp. 1–16 · Forecasting

Predict a future value using a sliding mean, decaying weights, or a regression on lagged observations. Build every feature from times earlier than the target.

## pp. 17–45 · Time-dependent factor models

Separate user drift and item trends. Bins, deviations from a user’s mean activity time, and drifting factors let the same user–item pair receive different scores over time.

## pp. 46–62 · Markov transitions and FPMC

Factorizing personalized Markov chains combines long-run user preference with a transition from the most recent item. Compare candidates given the same observed prefix.

## pp. 63–92 · Sequential case studies

Next-basket, location, and playlist prediction use different notions of context. Metric embeddings can express transitions via distances between source and destination representations.

## pp. 93–104 · User experience stages

A user’s taste can depend on experience as well as calendar date. Compare trajectories across users or communities before interpreting a time effect.

## pp. 105–123 · Translations and recurrent models

A translation model moves from a previous item embedding using a user-specific vector. A recurrent network instead maintains a hidden state over the interaction history.
