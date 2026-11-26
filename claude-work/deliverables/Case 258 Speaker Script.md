---
title: "Case 258: Speaker Script"
subtitle: "Diana, Keith, Shirley · CSE 258 Assignment 2"
---

## How to use this script

One block is one step. Say it, then press the Right arrow. The step number in the bottom-right corner of the screen (for example 20/65) matches the number here.

- **Length:** 65 steps, about 2,580 words. At 125 to 140 words a minute that is 18.4 to 20.6 minutes of speech, plus about 40 seconds of floor transitions. The rubric allows about 10% over 20 minutes, so stay under 22.
- **Speakers (change if you like):** Keith does steps 1 to 17. Diana does steps 18 to 40. Shirley does steps 41 to 65.
- **Before recording:** read it out loud once, then say it in your own words. The rubric gives 1 point to a section that sounds automatically generated.

## Opening: the case

**1** · *THE MISSING GAME*

Hi everyone, we're Diana, Keith, and Shirley. Our project is a Steam game recommender. We framed it as a small detective case, because the task really is a search: one game is missing from each player's library, and our models have to find it. We compare a popularity baseline, collaborative filtering from the course, and a linear autoencoder called EASE.

**2** · *ONE GAME IS HIDDEN FROM EVERY PLAYER*

Here's the setup. For every player, we hide one game they played. Seven models then rank the whole catalog, and we check how high each model puts the hidden game.

**3** · *SPOILER: EASE WINS*

Our main result up front: EASE ranks the hidden game highest, and a properly tuned ALS model is about ten percent behind it. We'll spend the rest of the talk on the evidence, and on three checks we ran to make sure the result holds.

## Section 1: Predictive task (Lobby, Lift)

**4** · *ONE PLAYER. TWELVE GAMES PLAYED.*

We start in the lobby with the predictive task. This is one player, and these twelve cases are the twelve games they actually played. Steam has no star ratings, so our signal is implicit: what a player owns, and how many minutes they played.

**5** · *HIDE ONE AT RANDOM: THE TEST GAME*

We pick one played game at random and hold it out. That's the test game. The model never sees it, during training or during tuning.

**6** · *ONE MORE FOR TUNING. TEN TO TRAIN.*

We hold out a second game for validation, which we use for all hyperparameter tuning. The remaining ten are training data. After tuning, we refit on training plus validation and evaluate on the test game exactly once.

**7** · *THE TASK: RANK ALL 3,570 GAMES*

So the task is top-N recommendation from implicit feedback. Given a player's history, rank all 3,570 games. A good model places the hidden game near the top of that ranking.

**8** · *RANDOM GAME, NOT THE NEXT GAME*

One limitation we want to state early. The hidden game is random, not the most recent one, because the data has no timestamps. So this is not next-game prediction. We come back to this later with a recency-based check.

**9** · *REPEAT FOR 20,940 PLAYERS*

We apply this leave-one-out split to all 20,940 players. Next: how we score a single prediction.

**10** · *WHERE DID THE HIDDEN GAME LAND?*

For every player, the question is simple: at what rank did the hidden game land? The dial above the door shows that rank, from 1 on the left to 3,570 on the right, on a log scale.

**11** · *RANK 3: FOUR METERS, ONE NUMBER*

Suppose it lands at rank 3. We report four metrics, and all of them come from that one rank. Hit rate at 10 is 1. NDCG at 10 is 0.5. MRR is one third. AUC is 0.999.

**12** · *RANK 40: OUT OF THE TOP TEN*

Now suppose rank 40. That's outside the top ten, so hit rate and NDCG are both zero: the player would never see it. AUC is still 0.989, because AUC rewards position over the entire list. That difference becomes important later.

**13** · *RULES: FULL CATALOG, NO SAMPLING*

A few evaluation choices. We rank against the full catalog rather than a sample of negatives, which avoids inflated scores. We average over all players and report a 95 percent bootstrap interval for every number. With one hidden game per player, recall at 10 equals hit rate at 10, so we don't report it separately.

**14** · *TWO BASELINES TO BEAT*

We use two baselines. Random ranking gets a hit rate of 0.0027, which matches the theoretical 0.0028, so it doubles as a sanity check on the pipeline. Popularity recommends the same ten best-sellers to everyone and reaches 0.189. That's the real bar every model has to clear.

**15** · *EVIDENCE: ONE FUNCTION, ONE RANK*

This is the evaluation code, from notebook Section 4.1. Two lines matter. The first sets games the player already owns to minus infinity, so they can't be recommended. The second counts ties against the model, so a model can't benefit from giving many games the same score.

**16** · *ALL FOUR METRICS FROM THAT RANK*

This second function turns that one rank into all four metrics. Since everything comes from the same rank, the metrics are consistent with each other by construction.

**17** · *IS THE RULER STRAIGHT? FOUR TESTS*

To validate the evaluation itself, we wrote known-answer tests: four small hand-built cases covering a masked game, a tie, the best rank, and the worst rank. All four pass, and we also assert that train and test share no pairs. With the evaluation verified, Diana will take us through the data.

## Section 2: Data (Archive, Organ Loft)

**18** · *THE SOURCE: 88,310 STEAM PROFILES*

Thanks, Keith. Section two is the data. We use the Steam dataset from Professor McAuley's lab, specifically the Australian users file. Pathak and colleagues collected it for a 2017 paper on bundle recommendation, by crawling public profiles from an Australian Steam community. The raw file has 88,310 profile lines, each listing a player's games and playtime. That's notebook Section 2.1.

**19** · *684 PLAYERS ARE FILED TWICE*

Our raw-file audit found something the cleaned tables hide: 684 players appear twice. If we left them in, a game hidden from one copy would still be visible in the other copy's training data. That's a leak, so we merged them. The audit is in Section 2.2.

**20** · *OWNED IS NOT PLAYED*

The second finding: owning a game is not the same as playing it. These are the five most-owned games. Cabinet height is the number of owners, and the lit drawers are the share who ever played. Dota 2 Test has over seventeen thousand owners, and only seven percent ever opened it. Steam adds test clients to libraries automatically.

**21** · *36.8% OF OWNED GAMES: NEVER PLAYED*

Across the whole file, 36.8 percent of owned games have zero playtime. So we define a positive as a game with playtime above zero. If we used ownership instead, Popularity would recommend a test client to almost everyone.

**22** · *OWNERS SAY NOTHING ABOUT HOURS*

Two more observations from the exploratory analysis. Mid-sized libraries are the most played, at about 70 percent, and the smallest and largest are lower. And the number of owners barely predicts hours played: the rank correlation is 0.01. The plots are in Section 2.3.

**23** · *EVERY GAME, SORTED BY PLAYERS*

Next, popularity. Here every game is sorted by how many people played it. Each pipe groups fifty-one games, and its height is their average player count.

**24** · *ONE PIPE = A QUARTER OF ALL PLAY*

The distribution is extremely skewed. The first pipe alone accounts for a quarter of all play, and seven pipes account for 63 percent. Half of the catalog shares the last six percent. That's why Popularity is a strong baseline on the hits, and why we later look at tail games separately.

**25** · *THE CUT: 20,940 x 3,570*

For preprocessing, we merge duplicates, take a 35 percent random sample of players, and apply a k-core filter: at least five played games per player, and at least twenty players per game. That leaves 20,940 players, 3,570 games, and just over a million training interactions.

**26** · *EVIDENCE: FILTER UNTIL STABLE*

Here's the k-core filter, from Section 2.4. Removing a game can push a player below five games, and the other way around, so the loop repeats until a full pass removes nothing.

**27** · *EVIDENCE: THE SPLIT*

And here's the split from the lobby, in three lines. Each interaction gets a random number, we rank within each player, and rank one becomes test, rank two validation, and the rest training.

**28** · *TWO MATRICES LEAVE THIS FLOOR*

This section produces two matrices: a binary played-or-not matrix, and one weighted by log of one plus hours. The weighted one feeds the playtime-weighted ALS model, and it becomes relevant again near the end.

## Section 3: Modeling (Engine Room, Control Room)

**29** · *SEVEN MACHINES, ONE INTERFACE*

Section three is modeling. All seven models share one interface. The input is the player-by-game matrix, the output is a score for every game, and we recommend the ten highest-scoring games the player hasn't played. What differs is the objective each model optimizes.

**30** · *COUNT, COMPARE, COMPRESS*

The first three. Popularity simply counts players and learns nothing. Item-kNN scores games by the cosine similarity of their player sets. PureSVD takes a low-rank decomposition of the zero-filled matrix, which minimizes reconstruction error.

**31** · *ALS: FACTORIZE EVERY CELL*

These two are implicit ALS, from the course. It minimizes a confidence-weighted squared error over every cell of the matrix, so played cells carry more weight than unplayed ones. We train a binary version and a playtime-weighted version.

**32** · *BPR RANKS PAIRS. EASE IS LINEAR.*

BPR optimizes a pairwise ranking objective: a played game should score higher than a randomly sampled unplayed one. EASE is our method from outside the course. It's a linear item-to-item model that minimizes squared reconstruction error with an L2 penalty, under the constraint that a game can't predict itself. Its closest relative in the course is SLIM.

**33** · *TUNING DECIDES THIS CASE*

Tuning turned out to decide this comparison. Watch the regularization lever on ALS. Validation NDCG is 0.154 at 20, 0.180 at 80, and 0.128 at 300. Our first draft left it at 10, which made ALS look 33 percent behind EASE. Properly tuned, the gap is 10 percent. The grids are in Section 4.2.

**34** · *GREEN = TUNED. AMBER = GRID EDGE.*

So for every hyperparameter we checked where the best value fell. A green lamp means it's inside the search range. Amber means it's on the edge, so a wider search could still help. Eight of twelve are green. ALS and BPR were still improving at 128 factors, and we address that with an outside check later.

**35** · *EASE FITS ON ONE SCREEN*

Now the code walkthrough, starting with EASE in Section 3.2. The entire model fits on one screen.

**36** · *CO-PLAY COUNTS, THEN ONE INVERSE*

It computes the item-item co-occurrence matrix, adds lambda to the diagonal, which is its only hyperparameter, and inverts the result once.

**37** · *NO GRADIENT DESCENT. ONE KNOB.*

Then it divides each column by its diagonal entry and zeroes the diagonal, so a game can't recommend itself. There's no gradient descent and no learning rate. The trade-off is memory: the weight matrix is games by games, so it grows with the square of the catalog.

**38** · *ALS: ONE SMALL SOLVE PER PLAYER*

ALS alternates between two least-squares problems. For each player, it solves a small linear system given the game factors, then does the same for each game. The highlighted lines show where the confidence weight enters. The cost is cubic in the number of factors.

**39** · *BPR: PLAYED i VS. RANDOM j*

BPR samples a played game i and a random game j, and resamples j if the player actually played it. The gradient weight is the sigmoid of minus the score difference, so pairs that are already in the right order contribute almost nothing. Keep this line in mind: it explains a result in the next section.

**40** · *SIMPLE VS. SCALABLE*

To sum up the trade-offs: EASE is simple, with one hyperparameter and a closed-form solution, but its memory scales with the catalog. ALS and BPR scale better to large catalogs but need more careful tuning. Shirley will now show how they actually performed.

## Section 4: Evaluation (Penthouse, Interrogation, Strongroom, Clock Room)

**41** · *LIT FLOORS = NDCG@10. EASE WINS.*

Thanks, Diana. Section four is evaluation, and the protocol is the function Keith showed in the lift. Here, each tower is a model, and the lit floors are test NDCG at 10. EASE leads at 0.225, tuned ALS follows at 0.204, and Popularity sits at 0.117.

**42** · *EASE BEATS ALS BY 0.021. REAL?*

Is the gap between EASE and ALS meaningful? We ran a paired bootstrap over players. The 95 percent interval for the difference is about plus 0.019 to plus 0.023, which excludes zero, so the margin is small but consistent. Against Popularity, EASE is 93 percent higher. The full table is in Section 4.3.

**43** · *RELIT BY AUC: BPR IS FIRST*

Now the same towers, relit by AUC. The ranking changes completely. BPR is first at 0.948, and EASE drops to 0.909, essentially level with Popularity.

**44** · *TWO METRICS, TWO WINNERS*

So two metrics give two different winners. AUC averages over all 3,570 positions, while NDCG at 10 only looks at what the player actually sees. For a recommender, the top of the list is the product, so NDCG and hit rate at 10 are our primary metrics.

**45** · *THE SUSPECT: BPR-MF*

That raises a question: why is BPR best on AUC but sixth of seven on NDCG? We investigated it directly, with three hypotheses. The diagnosis is in Section 4.2.

**46** · *1. STOPPED TOO EARLY? UNLIKELY.*

First, is it undertrained? Unlikely. Over the last ten epochs, the share of correctly ordered pairs rises by less than two points, so more epochs would add little.

**47** · *2. WRONG TARGET? YES.*

Second, is it optimizing the wrong target? Yes. By the end of training, 96.3 percent of sampled pairs are already in the right order. That's exactly what a high AUC means, and those pairs produce almost no gradient. The top ten is decided by the few pairs that remain.

**48** · *3. HARDER NEGATIVES? WORSE.*

Third, would harder negatives help? We sampled negatives in proportion to popularity. Validation NDCG dropped from 0.142 to 0.078, below the Popularity baseline.

**49** · *VERDICT: PAIRS, NOT THE TOP TEN*

And it's not an implementation issue: the implicit library's BPR scores 0.1387, close to our 0.1498. Our conclusion is that BPR works as designed. It optimizes pairwise order, not top-ten accuracy.

**50** · *THREE LOCKS ON THE VERDICT*

Next: how do we know the main result is right? We ran three checks that don't depend on our own code or our own split. They're in Section 4.4.

**51** · *LOCK 1: SOMEONE ELSE'S CODE*

Check one is an independent implementation. The implicit library's ALS scores 0.2034, against our 0.2042. Even with 256 factors it reaches 0.2092, still below EASE at 0.2251. So stopping our search at 128 factors didn't change the conclusion.

**52** · *LOCK 2: FOUR NEW SPLITS*

Check two is four new random splits. EASE wins all four by at least 0.021, and no model's score moves by more than 0.003.

**53** · *LOCK 3: A DIFFERENT HIDDEN GAME*

Check three changes the hidden game. Instead of a random game, we hide one the player played recently. About twelve thousand four hundred players qualify, and EASE is still first. This check has an interesting side effect, which we'll show in a moment.

**54** · *ACCURACY IS NOT DISCOVERY*

Behind the vault door is a different question: coverage. Each box is a group of sixteen games, lit if a model recommends them to anyone. Popularity covers 1.9 percent of the catalog, ALS 17.5, EASE 31, and BPR 36. On tail games, Popularity scores zero and EASE scores 0.021. Accuracy and discovery are separate goals. This is Section 4.6.

**55** · *SO FAR THE HIDDEN GAME WAS RANDOM*

Now the recency check in detail. Each weight is one model, and its height is NDCG at 10. So far, the hidden game has been random.

**56** · *NOW HIDE A RECENT GAME*

The dataset has no dates, but it does record minutes played in the last two weeks. So we hide a game with recent playtime instead. That's a closer proxy for the question people actually care about: what will this player play next?

**57** · *EVERY WEIGHT RISES*

Every model improves, because recently played games tend to be popular ones. Popularity improves the most, from 0.112 to 0.264. EASE goes from 0.213 to 0.329.

**58** · *EASE'S LEAD: +90% BECOMES +24%*

The clock hand shows EASE's lead over Popularity. With a random hidden game, the lead is 90 percent. With a recent one, it's 24 percent. EASE still wins, but a random holdout clearly overstates the benefit of personalization. For us, this was the most important finding of the project.

**59** · *AND SECOND PLACE CHANGES HANDS*

One more change: playtime-weighted ALS, at 0.314, now beats binary ALS at 0.291. Hours played carry information about what's current, and the binary matrix throws that away.

## Section 5: Related work and conclusions (Roof)

**60** · *RELATED WORK: WHO USED THIS DATA?*

Section five is related work. Three papers from the same lab work with Steam data on different tasks: Kang and McAuley on sequential recommendation, Wan and McAuley on behavior chains, and Pathak and colleagues on bundle recommendation. They rely on timestamps or reviews, so our numbers aren't directly comparable. This is Section 5.1.

**61** · *DO PUBLISHED RESULTS AGREE? YES.*

Where results are comparable, ours agree with the literature. Steck found that EASE outperforms matrix factorization. Rendle and colleagues showed that a well-tuned ALS closes most of that gap. And BPR's strength on AUC and weakness on top-N follows from its objective. What we add is the recency check: the lead over Popularity is much smaller than a random split suggests.

**62** · *WHERE OUR METHOD COMES FROM*

Our methodology follows prior work too. Krichene and Rendle argue for ranking against the full catalog instead of sampled negatives. Ferrari Dacrema and colleagues showed that baselines deserve the same tuning effort as new models. We followed both.

**63** · *WHAT WE DEFEND*

To conclude, here's what we're confident in. EASE ranks first and ALS second on top-ten metrics, and that ordering holds under an independent implementation, four new splits, and a different hidden game. Most of the gap in our first draft was a tuning artifact.

**64** · *WHAT WE DISTRUST*

And here's where we'd be careful. This is an offline evaluation on a 35 percent sample, so the absolute numbers will move. We also don't predict the next game a player picks up. With real timestamps, a time-aware split would be our first next step, along with content features for cold-start games.

**65** · *CASE 258 IS CLOSED*

And that closes the case. Thanks for watching, and we hope this helps when you go through our notebook.
