import gzip, ast, json, sys, collections
import numpy as np
path=sys.argv[1]
n=0; uid=collections.Counter(); mism=0; empty=0
own=collections.Counter(); played=collections.Counter(); p2w_pairs=0; pairs=0; zero=0
dup_items_in_user=0; users_with_2w=0; names={}
tot_min=collections.Counter()
for line in gzip.open(path,'rt',encoding='utf8'):
    try: d=json.loads(line)
    except Exception: d=ast.literal_eval(line)
    n+=1; uid[d['user_id']]+=1
    items=d.get('items',[])
    if d.get('items_count')!=len(items): mism+=1
    if not items: empty+=1
    seen=set(); any2=False
    for it in items:
        i=it['item_id']; names[i]=it.get('item_name')
        if i in seen: dup_items_in_user+=1
        seen.add(i); pairs+=1; own[i]+=1
        pt=it.get('playtime_forever',0)
        if pt>0: played[i]+=1; tot_min[i]+=pt
        else: zero+=1
        if it.get('playtime_2weeks',0)>0: p2w_pairs+=1; any2=True
    users_with_2w+=any2
dups=sum(c-1 for c in uid.values() if c>1)
print('lines',n,'unique user_id',len(uid),'duplicate lines',dups)
print('items_count != len(items):',mism,'| empty libraries:',empty)
print('pairs',pairs,'zero-playtime share',round(zero/pairs,4),'dup item within user',dup_items_in_user)
print('pairs with playtime_2weeks>0:',p2w_pairs,round(p2w_pairs/pairs,4),'| users with any:',users_with_2w,round(users_with_2w/n,4))
print('games owned',len(own),'games played by >=1',len(played))
print('--- most owned: owners, played share, median? (name)')
for i,c in own.most_common(15):
    print(f'{names[i][:38]:38s} owners={c:6d} played_share={played[i]/c:.2f} mean_h_per_player={tot_min[i]/max(played[i],1)/60:7.1f}')
