from common import *
from ex2w import *
import sys
if sys.argv[1]=='impl':
    for f in (32,64,128):
      for reg in (0.05,0.1,0.2):
        for it in (30,60,100):
            trial(f'impl BPR f={f} lr=0.01 reg={reg} it={it}', Wrap(IBPR(factors=f,learning_rate=0.01,regularization=reg,iterations=it,random_state=42,use_gpu=False,num_threads=1)))
else:
    class B2(BPRMF):
        def fit(self, X, W=None):
            E=self.epochs; self.epochs=10; first=True; done=0
            # warm-start loop: re-run 10 epochs at a time keeping parameters
            r = np.random.default_rng(SEED); n_u, n_i = X.shape; Xc = X.tocsr(); coo = X.tocoo()
            us, its = coo.row.astype(np.int64), coo.col.astype(np.int64)
            self.P = r.normal(0, .1, (n_u, self.f)).astype(np.float32); self.Q = r.normal(0, .1, (n_i, self.f)).astype(np.float32); self.b = np.zeros(n_i, np.float32)
            for ep in range(E):
                perm = r.permutation(len(us))
                for s in range(0, len(us), self.batch):
                    sel = perm[s:s + self.batch]; u, i = us[sel], its[sel]
                    j = r.integers(0, n_i, len(sel))
                    bad = np.asarray(Xc[u, j]).ravel() > 0
                    if bad.any(): j[bad] = r.integers(0, n_i, bad.sum())
                    pu, qi, qj = self.P[u], self.Q[i], self.Q[j]
                    x = (pu * (qi - qj)).sum(1) + self.b[i] - self.b[j]
                    g = (1 / (1 + np.exp(np.clip(x, -30, 30)))).astype(np.float32)[:, None]
                    scatter_mean_update(self.P, u, g * (qi - qj) - self.reg * pu, self.lr)
                    scatter_mean_update(self.Q, i, g * pu - self.reg * qi, self.lr)
                    scatter_mean_update(self.Q, j, -g * pu - self.reg * qj, self.lr)
                    scatter_mean_update(self.b, i, g[:, 0] - self.reg * self.b[i], self.lr)
                    scatter_mean_update(self.b, j, -g[:, 0] - self.reg * self.b[j], self.lr)
                if (ep+1)%10==0: print(f'  hand BPR f={self.f} lr={self.lr} reg={self.reg} ep={ep+1}', [round(float(v),4) for v in val_ndcg(self)], flush=True)
            return self
    for f,lr,reg in ((64,0.05,0.01),(64,0.05,0.05),(64,0.2,0.01),(128,0.05,0.02)):
        B2(f,lr,reg,60).fit(X_train)
