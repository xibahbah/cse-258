from common import *
for f,a,reg in ((64,1,50),(64,3,80),(128,1,50),(128,3,80),(256,3,80)):
    trial(f'hand ALS f={f} a={a} reg={reg}', ImplicitALS(f,a,float(reg),10))
for a,reg in ((0.3,50),(1,50),(1,100),(3,100)):
    trial(f'hand wALS f=64 a={a} reg={reg}', ImplicitALS(64,a,float(reg),10,weighted=True))
