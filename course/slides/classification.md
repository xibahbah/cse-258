# Classification

[Main slides · 118 PDF pages](https://drive.google.com/file/d/1fUrZCpQ6Sx92blcn6NshOPEWxb27Jp6k/view)

Alternate edition: [slides without annotations](https://drive.google.com/file/d/1osU1qwLApN39oKNLeIQdpVBD4tADJekS/view). Page numbers below refer to the main edition.

## pp. 1–19 · From scores to labels

Choose labels and decide whether probability, ranking, or a threshold decision is the output.

## pp. 20–39 · Naive Bayes

Score each class by the prior times its class-conditional feature likelihoods. Conditional independence makes estimation cheap but correlated features can double-count evidence.

## pp. 40–54 · Logistic regression

For a binary label, predict sigmoid(w·x+b). Fit by log likelihood. A threshold converts the continuous score into a decision.

## pp. 55–82 · Maximum margin

A linear SVM fits a separating score with a margin penalty. Hinge loss and logistic loss can give the same decision boundary but respond differently to borderline examples.

## pp. 83–99 · Class imbalance and costs

Compute TP, TN, FP, FN at a specified threshold. BER = (FNR + FPR)/2. Accuracy can be high when every prediction is the majority class.

## pp. 100–118 · Ranking and evaluation

Sort continuous scores to measure precision at a cutoff. Compare classifiers at a threshold appropriate to the cost of errors.
