import numpy as np
from implicit.als import AlternatingLeastSquares as IALS
from implicit.bpr import BayesianPersonalizedRanking as IBPR
class Wrap:
    def __init__(s,m): s.m=m
    def fit(s,X,W=None): s.m.fit(X.astype(np.float32).tocsr(), show_progress=False); s.U=np.asarray(s.m.user_factors); s.Y=np.asarray(s.m.item_factors); return s
    def score(s,u): return s.U[u]@s.Y.T
