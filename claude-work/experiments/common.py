import pickle, numpy as np, time, itertools, sys
from models_orig import *
P=pickle.load(open(__import__('os').path.join(__import__('os').path.dirname(__file__),'prep.pkl'),'rb'))
globals().update({k:v for k,v in P.items() if k!='rng_state'})
rng=np.random.default_rng(42); rng.bit_generator.state=P['rng_state']
ncand_val  = n_items - np.diff(X_train.indptr)
ncand_test = n_items - np.diff(X_trval.indptr)
tune_users = rng.choice(n_users, min(5000, n_users), replace=False)
def val_ndcg(m, users=None):
    users = tune_users if users is None else users
    rk = rank_of_targets(m, X_train, val_item, users)
    mt = metrics_from_ranks(rk, ncand_val[users]); return mt['NDCG'].mean(), mt['HR'].mean()
def trial(name, m):
    t=time.time(); m.fit(X_train, W_train); n,h=val_ndcg(m); print(f'{name:45s} NDCG={n:.4f} HR={h:.4f} ({time.time()-t:.0f}s)', flush=True); return n
