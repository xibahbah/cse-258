from common import *
from ex2w import *
import sys
which=sys.argv[1]
if which=='als':
    for f in (64,128,256):
      for a in (1.5,2,3,4):
        for reg in (20,35,50,80,120):
            trial(f'impl ALS f={f} alpha={a} reg={reg}', Wrap(IALS(factors=f,alpha=a,regularization=float(reg),iterations=15,random_state=42,use_gpu=False)))
else:
    t=time.time(); m=BPRMF(64,0.05,0.01,20).fit(X_train); print('hand BPR f=64 lr=.05 20ep', val_ndcg(m), round(time.time()-t),'s',flush=True)
    for f in (32,64,128):
      for lr in (0.01,0.05):
        for reg in (0.001,0.01,0.05):
          for it in (100,300):
            trial(f'impl BPR f={f} lr={lr} reg={reg} it={it}', Wrap(IBPR(factors=f,learning_rate=lr,regularization=reg,iterations=it,random_state=42,use_gpu=False)))
