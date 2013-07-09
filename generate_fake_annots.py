import random
import string
import json

n = 60
vals = ['Smith','Wadden','Hu','Greenside','Natoli','Hogstrom','Flynn','Liberzon','Narayan','Subramanian','Gould']
annots = []
for i in xrange(n):
	d = {}
	d.update({'id':''.join(random.choice(string.ascii_uppercase + string.digits) for x in range(N))})
	d.update({'lastname':vals[random.randint(0,len(vals)-1)]})
	d.update({'temperature':round(random.random(),4)})

	annots.append(d)
fid = open('/Users/rogerhu/SkyDrive/quicklys/heatmap/sample_annots.txt','w')
json.dump(annots,fid)
fid.close()