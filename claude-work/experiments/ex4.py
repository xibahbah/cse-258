from common import *
from ex2w import *
t=time.time(); m=BPRMF(64,0.05,0.01,20).fit(X_train); print('hand BPR f=64 lr=.05 reg=.01 20ep', val_ndcg(m), round(time.time()-t),'s',flush=True)
for f in (64,128):
  for lr in (0.01,0.05):
    for reg in (0.001,0.01,0.05):
      for it in (100,300):
        trial(f'impl BPR f={f} lr={lr} reg={reg} it={it}', Wrap(IBPR(factors=f,learning_rate=lr,regularization=reg,iterations=it,random_state=42,use_gpu=False)))
