import json,base64,sys
nb=json.load(open(sys.argv[1])); out=sys.argv[2]
want={'eda':'users_df = raw.groupby','checks':'def fit_and_score','heat':'def heat(ax','bpr':'neg_rows = []','final':'# paired bootstrap','tune':'edge_rows = []'}
for name,key in want.items():
    for c in nb['cells']:
        s=c['source'] if isinstance(c['source'],str) else ''.join(c['source'])
        if c['cell_type']=='code' and key in s:
            for o in c['outputs']:
                p=o.get('data',{}).get('image/png')
                if p:
                    open(f'{out}/{name}.png','wb').write(base64.b64decode(p if isinstance(p,str) else ''.join(p))); print(name,'ok'); break
