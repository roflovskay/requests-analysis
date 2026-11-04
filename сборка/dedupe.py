import zipfile, hashlib, sys, re
src, dst = sys.argv[1], sys.argv[2]
z = zipfile.ZipFile(src)
canon, mp = {}, {}
for n in z.namelist():
    if n.startswith('ppt/media/') and not n.endswith('/'):
        h = hashlib.sha1(z.read(n)).hexdigest()
        if h in canon: mp[n.split('/')[-1]] = canon[h].split('/')[-1]
        else: canon[h] = n
out = zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED)
for i in z.infolist():
    n = i.filename
    if n.startswith('ppt/media/') and n.split('/')[-1] in mp: continue
    data = z.read(n)
    if n.endswith('.rels'):
        t = data.decode('utf8')
        for a, b in mp.items(): t = t.replace('media/' + a + '"', 'media/' + b + '"')
        data = t.encode('utf8')
    out.writestr(i, data, compress_type=zipfile.ZIP_STORED if n.endswith('.png') else zipfile.ZIP_DEFLATED)
out.close(); print('removed', len(mp), 'duplicates')
