---
title: "Case 258: Speaker Script"
subtitle: "Diana, Keith, Shirley · CSE 258 Assignment 2"
---

## How to use this script

One row is one step. Say the row, then press the Right arrow. The script has 65 steps and about 2,600 words. At 125 to 140 words a minute that is 18.5 to 20.5 minutes of speech, plus about 40 seconds of floor transitions. The rubric allows about 10% over 20 minutes, so stay under 22. If you run long, speak a little faster rather than cut rows. The step number is in the bottom right corner of the screen (for example 20/65) and matches the # column here.

- **Speakers (a proposal, change it):** Keith does steps 1 to 17. Diana does steps 18 to 40. Shirley does steps 41 to 65.
- **Fixed words:** player, game, hidden game, model. The script does not use other words for these four things.
- **Screen column:** the headline in the bottom panel. Use it to find your place.
- **Style:** short, active sentences of 25 words or fewer, with a warmer voice than strict Simplified Technical English. Read it once out loud, then say it in your own words: the rubric gives 1 point to a section that sounds automatically generated.

## Opening: the case

**1** · *THE MISSING GAME*

Hi everyone. We are Diana, Keith, and Shirley. Welcome to Case 258. Today you are the detective, and we are your guides. Our case is about Steam games, and how to recommend the right game to the right player.

**2** · *ONE GAME IS HIDDEN FROM EVERY PLAYER*

Here is the mystery. For each player, we take one game from their library and hide it. Then we ask seven different models to find it. The model that finds it most often wins.

**3** · *SPOILER: EASE WINS*

We will tell you the ending now. A model named EASE wins. A well-tuned ALS model is close behind. But do not trust us yet. Come inside, and we will show you the evidence, floor by floor.

## Section 1: Task (Lobby, Lift)

**4** · *ONE PLAYER. TWELVE GAMES PLAYED.*

Welcome to the lobby. Meet one player. These twelve cases are the twelve games this player played. Steam does not have star ratings. We only know which games a player owns and how long they played each one.

**5** · *HIDE ONE AT RANDOM: THE TEST GAME*

Now watch the red case. We pick one game at random and take it away. This is the test game. The model never sees it. Its only job is to guess it back.

**6** · *ONE MORE FOR TUNING. TEN TO TRAIN.*

We also cover a second game. We use this one to tune our models, so we call it the validation game. The other ten games are for training. We tune on validation, and we touch the test game only one time, at the very end.

**7** · *THE TASK: RANK ALL 3,570 GAMES*

So here is the task in one sentence. The model looks at the games you played, and it ranks every game in the catalog for you. A good model puts your hidden game near the top.

**8** · *RANDOM GAME, NOT THE NEXT GAME*

One honest note. The hidden game is a random one, not the last one you played. The file has no dates. So we do not claim to predict your next game. We come back to this near the top of the tower.

**9** · *REPEAT FOR 20,940 PLAYERS*

And we do this for about twenty-one thousand players. That is our first clue. Now, how do we score a guess? Let us take the lift.

**10** · *WHERE DID THE HIDDEN GAME LAND?*

Look at the dial above the door. The model ranks every game the player did not play. We only ask one question. Where did the hidden game land? Rank one is a perfect guess.

**11** · *RANK 3: FOUR METERS, ONE NUMBER*

Say the hidden game landed at rank three. That is a good guess. All four of our metrics read that one rank, and all four are happy. The numbers are on the left.

**12** · *RANK 40: OUT OF THE TOP TEN*

Now say it landed at rank forty. The player never sees it, so hit rate and NDCG are zero. But look at AUC. It is still almost perfect. AUC is kind, because it grades the whole list. Remember that. It matters later.

**13** · *RULES: FULL CATALOG, NO SAMPLING*

These are our house rules. We rank the full catalog, with no shortcuts. We average over all players. And every score comes with a confidence interval, so you can see how sure we are.

**14** · *TWO BASELINES TO BEAT*

Every case needs a baseline. Random guessing gets almost nothing, exactly as theory says. Popularity is the real opponent. It gives everyone the same ten best-sellers, and the hidden game is in that list for about nineteen percent of players. Every model must do better than that.

**15** · *EVIDENCE: ONE FUNCTION, ONE RANK*

Here is our first piece of evidence, from notebook Section 4.1. This one function is our whole evaluation protocol. Look at the two bright lines. The first one hides the games you already own. The second one counts ties against the model, so we never flatter it.

**16** · *ALL FOUR METRICS FROM THAT RANK*

And these lines compute all four metrics from that same rank. One rank, four metrics. So the metrics cannot disagree by accident.

**17** · *IS THE RULER STRAIGHT? FOUR TESTS*

But is our ruler straight? We tested it. We built four tiny cases by hand, where we already know the answer. The function gets all four right. So now we can trust the ruler. On to the data.

## Section 2: Data (Archive, Organ Loft)

**18** · *THE SOURCE: 88,310 STEAM PROFILES*

Thank you, Keith. Welcome to the archive. Every good case starts with the files. Ours are public Steam data from the McAuley lab here at UCSD. Researchers collected it by crawling public Steam profiles of Australian users, for a 2016 study of how people use Steam. It has about eighty-eight thousand player profiles, each with their games and their playtime. In the notebook, this is Section 2.1.

**19** · *684 PLAYERS ARE FILED TWICE*

Our first surprise came quickly. Some players are in the file two times. That sounds harmless, but it is a leak. The game we hide in one copy is still visible in the other copy. So we merged them. This audit is notebook Section 2.2.

**20** · *OWNED IS NOT PLAYED*

Now look at these five cabinets. They are the five most-owned games. A tall cabinet has many owners. A lit drawer shows people who really played. Look at the first one, Dota 2 Test. It is the tallest cabinet, and it is almost dark. Nearly nobody opened it.

**21** · *36.8% OF OWNED GAMES: NEVER PLAYED*

And this is true across the whole file. More than one third of owned games were never played. That changed our definition. For us, a positive is a game you played, not a game you own.

**22** · *OWNERS SAY NOTHING ABOUT HOURS*

One more note from the files. The number of owners tells you almost nothing about how long people play. Popular does not mean loved. The plots for all of this are in notebook Section 2.3. That is our third clue.

**23** · *EVERY GAME, SORTED BY PLAYERS*

Come upstairs to the organ loft. We sorted every game by how many people played it. Each pipe is a group of fifty-one games. A tall pipe has many players.

**24** · *ONE PIPE = A QUARTER OF ALL PLAY*

Do you see the shape? One pipe is a giant. That first pipe alone has a quarter of all the play. Then the pipes get small very fast. Half of the catalog shares the last six percent. So Popularity is strong on the hits, and blind to everything else.

**25** · *THE CUT: 20,940 x 3,570*

Next we cleaned the data. We took a random sample of players. We kept players with at least five played games, and games with at least twenty players. That leaves about twenty-one thousand players and three and a half thousand games.

**26** · *EVIDENCE: FILTER UNTIL STABLE*

Here is the code for that filter, from notebook Section 2.4. There is one small trick. When you remove a game, some players fall below five games. So the loop runs again and again until nothing changes.

**27** · *EVIDENCE: THE SPLIT*

And here is the split you saw in the lobby. Every row gets a random number. Inside each player, the first row is the test game, the second is validation, and the others are training. Three lines of code.

**28** · *TWO MATRICES LEAVE THIS FLOOR*

We leave this floor with two tables. One only says played or not played. The other also remembers how many hours. Keep the second one in mind. It comes back at the end.

## Section 3: Modeling (Engine Room, Control Room)

**29** · *SEVEN MACHINES, ONE INTERFACE*

Now for the fun floor. This is the engine room, and these machines are our seven models. They all do the same job. A table of players and games goes in. A score for every game comes out. The ten best scores are the recommendation. What changes from machine to machine is what each one optimizes.

**30** · *COUNT, COMPARE, COMPRESS*

Let us meet the first three. Popularity only counts players. It does not learn anything. Item-kNN says two games are close when the same people play both, measured by cosine similarity. And PureSVD compresses the whole table into a few patterns, so that it can rebuild the table with the smallest error.

**31** · *ALS: FACTORIZE EVERY CELL*

These two are ALS, a matrix factorization model from our course. It minimizes the squared error over every cell in the table, played or not, and it gives the played cells a bigger weight. We built two versions. One knows only played or not. The other also knows the hours.

**32** · *BPR RANKS PAIRS. EASE IS LINEAR.*

The last two. BPR learns from pairs. It wants a game you played to rank above a random game you did not play. And EASE is our model from outside the course. It predicts each game from your other games, with one linear model. It minimizes the squared error, with a penalty that keeps the weights small.

**33** · *TUNING DECIDES THIS CASE*

Now, a confession. Tuning decided this case. Watch the lever on ALS. With a little regularization the score is low. In the middle it is at its best. With too much it falls again. In our first draft we never moved this lever, and ALS looked far behind. After tuning, it is only ten percent behind. The tuning grids are in notebook Section 4.2.

**34** · *GREEN = TUNED. AMBER = GRID EDGE.*

So we gave every setting a small lamp. Green means we found the best value inside our search range. Amber means the best value was at the edge, so more search can help. We are honest about the amber lamps, and we test them later.

**35** · *EASE FITS ON ONE SCREEN*

Next door is the control room. And here is the winner. All of EASE fits on one screen. This is the model cell in notebook Section 3.2, and you can follow along there.

**36** · *CO-PLAY COUNTS, THEN ONE INVERSE*

It does three things. First, it counts how often two games have the same player. Second, it adds one number to the diagonal. That is its only setting. Third, it inverts the matrix. One time.

**37** · *NO GRADIENT DESCENT. ONE KNOB.*

Then it divides each column by its diagonal value, and sets the diagonal to zero, so a game cannot recommend itself. And that is all. No training loop, no learning rate. The price is memory, because the matrix has a row and a column for every game.

**38** · *ALS: ONE SMALL SOLVE PER PLAYER*

Compare that with ALS. For each player, it solves one small system of equations. Then it does the same for each game. Then it repeats. The bright lines show where the extra trust for played games enters.

**39** · *BPR: PLAYED i VS. RANDOM j*

And BPR. It takes a game you played and a random game. It moves the played one higher. But look at the last bright line. When a pair is already in the correct order, almost nothing happens. Remember this line. It explains a mystery upstairs.

**40** · *SIMPLE VS. SCALABLE*

So we have a trade. EASE is simple, with one setting. ALS and BPR can handle bigger catalogs, but they need more care. Enough theory. Shirley, who found the missing game?

## Section 4: Evaluation (Penthouse, Interrogation, Strongroom, Clock Room)

**41** · *LIT FLOORS = NDCG@10. EASE WINS.*

Thank you, Diana. This is our evaluation section. The evaluation code is the function we showed you in the lift. Now, welcome to the penthouse, and look at that view. Each tower is one model. The more floors are lit, the better the model found the hidden game. The tallest light is on the right. That is EASE.

**42** · *EASE BEATS ALS BY 0.021. REAL?*

But the tower next to it is close. So is the lead real, or is it luck? We resampled the players with a paired bootstrap. The 95% interval for the lead is about plus 0.019 to plus 0.023. It does not include zero. The lead is small, but it is real. The full table is in notebook Section 4.3. And against Popularity, EASE is almost twice as good.

**43** · *RELIT BY AUC: BPR IS FIRST*

Now watch this. Same towers, same players. We only change the metric to AUC. The skyline changes. BPR is now the tallest. And EASE falls down to the level of Popularity.

**44** · *TWO METRICS, TWO WINNERS*

Two metrics, two different winners. Why? AUC grades the whole list of three and a half thousand games. Our top-ten metric grades only what a player sees. A store shows you ten games, not three thousand. So we trust the top ten.

**45** · *THE SUSPECT: BPR-MF*

But that leaves a mystery. Why is BPR so good on one metric and so weak on the other? We took it one floor up for questioning. We had three questions. The full diagnosis is in notebook Section 4.2.

**46** · *1. STOPPED TOO EARLY? NO.*

Question one. Did we stop training too early? No. Look at the curve. The learning stops after a few rounds. More training does not help.

**47** · *2. WRONG TARGET? YES.*

Question two. Is it aiming at the wrong target? Yes. Do you remember that line of code? At the end, ninety-six percent of the pairs are already in the correct order. So BPR has almost nothing left to learn. But the top ten is decided by the last few percent.

**48** · *3. HARDER NEGATIVES? WORSE.*

Question three. Can we fix it with harder examples? We tried. We showed it more popular games as negatives. The score got worse, not better.

**49** · *VERDICT: PAIRS, NOT THE TOP TEN*

And it is not a bug in our code. A well-known library gives a similar score. So here is the verdict. BPR is not broken. It does its job. Its job is pairs, not the top ten.

**50** · *THREE LOCKS ON THE VERDICT*

Now, should you believe our main result? We did not want you to trust only us. So we put three locks on it. Each lock is a check from the outside. All three are in notebook Section 4.4.

**51** · *LOCK 1: SOMEONE ELSE'S CODE*

Lock one. Someone else's code. We ran ALS from a public library. It gets almost exactly our score. We even gave it twice the capacity. It is still below EASE.

**52** · *LOCK 2: FOUR NEW SPLITS*

Lock two. Maybe we were lucky with our random split. So we made four new ones. EASE wins all four, and the scores almost do not move.

**53** · *LOCK 3: A DIFFERENT HIDDEN GAME*

Lock three. We changed the game we hide. Now it is a game the player played recently. EASE is still first. This check has a twist, and we show it on the next floor.

**54** · *ACCURACY IS NOT DISCOVERY*

All three locks open, so let us look inside. Each small box is a group of games. A lit box means the model recommends those games to somebody. Popularity lights only the top corner. EASE and BPR light a third of the wall. Being accurate and helping people discover games are two different things. This is notebook Section 4.6.

**55** · *SO FAR THE HIDDEN GAME WAS RANDOM*

We are behind the clock now. On the left are seven weights, one for each model. A higher weight is a better score. Until now, the hidden game was a random one.

**56** · *NOW HIDE A RECENT GAME*

But what do people really want to know? Which game they will play next. Our file has no dates. It does have the minutes played in the last two weeks. So now we hide a game the player touched recently.

**57** · *EVERY WEIGHT RISES*

Watch the weights. They all go higher. Recent games are usually popular games, so they are easier to guess. And look at Popularity on the left. It jumps the most.

**58** · *EASE'S LEAD: +90% BECOMES +24%*

Now look at the big hand of the clock. It shows how far EASE is ahead of Popularity. With a random hidden game, the lead is ninety percent. With a recent game, it is twenty-four. EASE still wins, but by much less. This was our biggest surprise.

**59** · *AND SECOND PLACE CHANGES HANDS*

And one more twist. Do you remember the table with the hours? The ALS that knows the hours now beats the ALS that does not. Hours tell the model what is current.

## Section 5: Related work and verdict (Roof)

**60** · *RELATED WORK: WHO USED THIS DATA?*

We made it to the roof. From here you can see who else worked on this case. These three papers use the same Steam data, but for other questions. They had dates or reviews, so we cannot compare our numbers with theirs. This is notebook Section 5.1.

**61** · *DO PUBLISHED RESULTS AGREE? YES.*

These three found what we found. EASE is better than matrix factorization. A carefully tuned ALS gets close. And BPR is strong on AUC but weak in the top ten. It felt good to see our results agree with theirs. Where we differ is the floor behind the clock: with a recent hidden game, the lead over Popularity is much smaller than a random split suggests.

**62** · *WHERE OUR METHOD COMES FROM*

And these gave us our method. Rank the full catalog. Tune the baselines as carefully as your own model. We followed both rules.

**63** · *WHAT WE DEFEND*

So what do we defend? EASE is first, and ALS is second. That holds with other people's code, with new splits, and with a different hidden game. And most of the gap in our first draft was only a tuning mistake.

**64** · *WHAT WE DISTRUST*

And where are we careful? This is an offline test on a sample, so the exact numbers can change. And we do not predict your next game. With real dates, that is the first thing we want to try.

**65** · *CASE 258 IS CLOSED*

The sun is up, and the case is closed. The missing game was found by one matrix inverse. Thank you for walking the tower with us.
