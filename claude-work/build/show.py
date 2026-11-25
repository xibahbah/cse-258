import json,re,sys
nb=json.load(open(sys.argv[1])); keys=sys.argv[2:]
def txt(o):
    if 'text' in o: return ''.join(o['text'])
    d=o.get('data',{})
    if 'text/markdown' in d: return ''.join(d['text/markdown'])
    if 'text/html' in d:
        h=''.join(d['text/html']); h=re.sub(r'<style.*?</style>','',h,flags=re.S); h=re.sub(r'</tr>','\n',h); return re.sub(r'[ \t]+',' ',re.sub(r'<[^>]+>',' ',h))
    return ''
for i,c in enumerate(nb['cells']):
    if c['cell_type']!='code': continue
    s=c['source'] if isinstance(c['source'],str) else ''.join(c['source'])
    if any(k in s for k in keys):
        print(f'--- cell {i}')
        for o in c['outputs']:
            if o.get('output_type')=='error': print('ERROR',o.get('ename'),o.get('evalue'))
            t=txt(o)
            if t.strip(): print(re.sub(r'\n\s*\n','\n',t)[:int(3000)])
