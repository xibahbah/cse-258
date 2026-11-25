# Regression

[Main slides · 107 PDF pages](https://drive.google.com/file/d/19xh-0pTHUjTMNLFCGQVnPPgivAhbnpFX/view)

Alternate edition: [slides without annotations](https://drive.google.com/file/d/1ZtdSeNpOaOrruK6FOzciiPoEPJeXtWac/view). Page numbers below refer to the main edition.

## pp. 1–35 · Least squares

Place one example in each row of X. With an intercept column, prediction is x·θ. Fit θ by minimizing the sum of squared residuals. A coefficient measures change with the other encoded features held fixed.

## pp. 36–59 · Feature engineering

A category ID carries no meaningful numeric distance. Use indicator columns, omit a reference category when using an intercept, and check for linearly dependent columns.

## pp. 60–72 · Time features

Compare a scalar trend with month indicators or piecewise features. Buckets can represent seasonality while a single slope imposes a monotonic effect.

## pp. 73–85 · Diagnostics

MSE averages squared residuals. MAE gives each unit of error the same weight. R² compares squared error to predicting the response mean.

## pp. 86–107 · Regularization and model selection

Ridge minimizes squared error plus λ times the squared coefficient norm. Choose λ on validation data and reserve the test split for the final comparison.
