from common import *
import implicit, threadpoolctl
from implicit.als import AlternatingLeastSquares as IALS
from implicit.bpr import BayesianPersonalizedRanking as IBPR
class Wrap:
    def __init__(s,m): s.m=m
    def fit(s,X,W=None): s.m.fit(X.astype(np.float32).tocsr(), show_progress=False); s.U=np.asarray(s.m.user_factors); s.Y=np.asarray(s.m.item_factors); return s
    def score(s,u): return s.U[u]@s.Y.T
trial('hand ALS f=32 a=10 reg=10 it=10', ImplicitALS(32,10,10.0,10))
trial('impl ALS f=32 alpha=11 reg=10 it=10', Wrap(IALS(factors=32,alpha=11,regularization=10.0,iterations=10,random_state=42,use_gpu=False)))
for f in (16,32,64,128):
  for a in (2,6,11,41):
    for reg in (1,10,50,200):
        trial(f'impl ALS f={f} alpha={a} reg={reg}', Wrap(IALS(factors=f,alpha=a,regularization=float(reg),iterations=15,random_state=42,use_gpu=False)))
