# Recommendation

[Main slides · 205 PDF pages](https://drive.google.com/file/d/1VAt1C5Za5JCBXUkeRbqkH8jajgTdfmnl/view)

Alternate edition: [slides without annotations](https://drive.google.com/file/d/1FqFjaDuxrHg6vLmP3lQJMR8qFXZniVrL/view). Page numbers below refer to the main edition.

## pp. 1–20 · Personalization

A useful scoring function distinguishes both users and items. A globally popular item gives everyone the same ordering and makes a simple baseline.

## pp. 21–55 · Nearest neighbors and retrieval

For binary item audiences A and B, Jaccard = |A∩B|/|A∪B| and cosine = |A∩B|/sqrt(|A||B|). Use an inverted index to find overlapping audiences before scoring candidates. Pearson centers ratings.

## pp. 56–69 · Neighborhood rating estimates

Weight a user’s past ratings by item similarity. A centered variant averages deviations from neighboring item means and adds the target item mean. Define a fallback for zero overlap.

## pp. 70–105 · Explicit feedback and matrix factorization

Start with a global mean and regularized user/item biases. Add p_u·q_i to capture user-specific taste. Fit only observed ratings. Ordinary truncated SVD on a filled matrix solves a different objective.

## pp. 106–118 · Implicit feedback and confidence

A missing interaction supplies weak evidence. Separate binary preference from confidence. Weighted squared error can be optimized by alternating user-factor and item-factor least-squares updates.

## pp. 119–140 · Bayesian personalized ranking

Sample a user, an observed item i, and an unobserved item j. Minimize −log sigmoid(s_ui−s_uj) plus regularization. Sampling affects which pairwise comparisons the model learns. The deck demonstrates Surprise and implicit.

## pp. 141–159 · Ranking metrics

MRR rewards an early first relevant result. Precision@K measures the relevant fraction returned. AUC estimates how often a positive outranks a negative. Candidate sampling changes the interpretation of these metrics.

## pp. 160–186 · Learning from item histories

SLIM learns sparse item-to-item coefficients for scoring a history. AutoRec reconstructs a rating vector with an encoder and decoder. Evaluate on withheld interactions.

## pp. 187–205 · Extensions

Side information and changing user preferences can extend the factor model. Make explicit what information is available when scoring.

## Alternate edition · 207 pages

Independent keyword locators for the alternate edition.

- pp. 1–8: recommendation
- pp. 9–16: rating, recommendation
- pp. 17–24: rating, social network, temporal, recommendation
- pp. 25–32: euclidean, cosine, jaccard, rating
- pp. 33–40: pearson, cosine, collaborative filtering, rating
- pp. 41–48: jaccard, recommendation
- pp. 49–56: recommendation, jaccard, rating prediction, prediction
- pp. 57–64: rating prediction, prediction, rating, collaborative filtering
- pp. 65–72: prediction, rating prediction, latent factor, cosine
- pp. 73–80: netflix, rating prediction, prediction, rating
- pp. 81–88: singular value, rating prediction, prediction, rating
- pp. 89–96: gradient descent, rating, regularizer
- pp. 97–104: rating, least squares, variance, alternating least squares
- pp. 105–112: logistic regression, regression, prediction, linear function
- pp. 113–120: personalized ranking, ranking, bayesian personalized ranking, logistic regression
- pp. 121–128: personalized ranking, bayesian personalized ranking, ranking, dataset
- pp. 129–136: surprise, bayesian personalized ranking, personalized ranking, ranking
- pp. 137–144: bayesian personalized ranking, personalized ranking, ranking, squared error
- pp. 145–152: recall, precision, reciprocal rank, classifier
- pp. 153–160: auc, implicit feedback, rating, recommendation
- pp. 161–168: sparse linear, slim, latent factor, regression
- pp. 169–176: recommendation, sparse linear, slim, latent factor
- pp. 177–184: feature vector, autorec, autoencoder, collaborative filtering
- pp. 185–192: factorization machine, autorec, matrix factorization, recurrent neural
- pp. 193–200: temporal, netflix, implicit feedback, rating
- pp. 201–207: netflix, temporal, diversity, rating
