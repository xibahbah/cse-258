# Text Mining

[Main slides · 111 PDF pages](https://drive.google.com/file/d/1t9ePbS8Sq7wlZM9kIArWwWej6oX0ODgf/view)

Alternate edition: [slides without annotations](https://drive.google.com/file/d/1ytOekXudv3iDdte53oORmixHA1gjnJTz/view). Page numbers below refer to the main edition.

## pp. 1–36 · Bag of words and n-grams

Choose tokenization and case handling, count tokens on training text, cap the vocabulary, and map each example into the same feature space. Bigrams preserve some local order.

## pp. 37–57 · TF–IDF and cosine

Term frequency measures use inside one document. Inverse document frequency discounts terms present across many documents. Normalize vectors before using their dot product as cosine similarity.

## pp. 58–80 · LSA, Word2Vec, Item2Vec

Truncated SVD compresses the term–document matrix. Skip-gram learns embeddings by predicting nearby tokens. For Item2Vec, substitute item IDs for tokens and user histories for sentences.

## pp. 81–103 · Suggestions and conversation

Response suggestion ranks plausible replies. Conversational recommendation introduces turn history and user feedback into item selection.

## pp. 104–111 · Personalized generation and project examples

User or item signals can condition a language model. The ending also gives examples of time-aware prediction tasks.

## Alternate edition · 123 pages

Independent keyword locators for the alternate edition.

- pp. 1–8: prediction task, prediction, sentiment
- pp. 9–16: feature vector, bag of words, prediction task, prediction
- pp. 17–24: feature vector, stemming, retrieval
- pp. 25–32: stopword, feature vector, n-gram, sentiment
- pp. 33–40: stemming, unigram, bigram, n-gram
- pp. 41–48: cosine, document frequency, term frequency
- pp. 49–56: document frequency, term frequency, tf-idf
- pp. 57–64: recall, retrieval, latent factor, bag of words
- pp. 65–72: gradient descent, latent semantic, cosine, word2vec
- pp. 73–80: word2vec, item2vec, skip-gram, dataset
- pp. 81–88: sequential, word2vec, recommendation, item2vec
- pp. 89–96: response suggestion, smart reply, embedding
- pp. 97–104: response suggestion, smart reply, classification
- pp. 105–112: recommendation, conversational, response suggestion, smart reply
- pp. 113–120: generative, conversational, rating, language model
