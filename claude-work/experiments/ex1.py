from common import *
for k in (50,100,200,400,800,1600):
    for a in (0.3,0.5,0.7): trial(f'kNN k={k} a={a}', ItemKNN(k,a))
for f in (4,8,12,16,24,32,64): trial(f'SVD f={f}', PureSVD(f))
for lam in (5,10,20,50,100,200,500,2000): trial(f'EASE lam={lam}', EASE(lam))
