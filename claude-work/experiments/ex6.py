from common import *
class B3(BPRMF):
    def __init__(self, *a, neg_pow=0.0, **k): super().__init__(*a, **k); self.neg_pow=neg_pow
    def fit(self, X, W=None):
        r = np.random.default_rng(SEED); n_u, n_i = X.shape; Xc = X.tocsr(); coo = X.tocoo()
        us, its = coo.row.astype(np.int64), coo.col.astype(np.int64)
        pop = np.asarray(X.sum(0)).ravel(); p = pop ** self.neg_pow; p = p / p.sum(); cdf = np.cumsum(p)
        samp = (lambda n: r.integers(0, n_i, n)) if self.neg_pow == 0 else (lambda n: np.minimum(np.searchsorted(cdf, r.random(n)), n_i - 1))
        self.P = r.normal(0, .1, (n_u, self.f)).astype(np.float32); self.Q = r.normal(0, .1, (n_i, self.f)).astype(np.float32); self.b = np.zeros(n_i, np.float32)
        for ep in range(self.epochs):
            perm = r.permutation(len(us)); gs=[]; acc=[]
            for s in range(0, len(us), self.batch):
                sel = perm[s:s + self.batch]; u, i = us[sel], its[sel]
                j = samp(len(sel))
                bad = np.asarray(Xc[u, j]).ravel() > 0
                if bad.any(): j[bad] = samp(int(bad.sum()))
                pu, qi, qj = self.P[u], self.Q[i], self.Q[j]
                x = (pu * (qi - qj)).sum(1) + self.b[i] - self.b[j]
                g = (1 / (1 + np.exp(np.clip(x, -30, 30)))).astype(np.float32)[:, None]
                gs.append(float(g.mean())); acc.append(float((x>0).mean()))
                scatter_mean_update(self.P, u, g * (qi - qj) - self.reg * pu, self.lr)
                scatter_mean_update(self.Q, i, g * pu - self.reg * qi, self.lr)
                scatter_mean_update(self.Q, j, -g * pu - self.reg * qj, self.lr)
                scatter_mean_update(self.b, i, g[:, 0] - self.reg * self.b[i], self.lr)
                scatter_mean_update(self.b, j, -g[:, 0] - self.reg * self.b[j], self.lr)
            if (ep+1) in (1,2,5,10,20,30): print(f'  pow={self.neg_pow} ep={ep+1} mean_grad_w={np.mean(gs):.3f} pair_acc={np.mean(acc):.3f} val={[round(float(v),4) for v in val_ndcg(self)]}', flush=True)
        return self
for pw in (0.0, 0.5, 0.75, 1.0):
    B3(64,0.05,0.01,30,neg_pow=pw).fit(X_train)
