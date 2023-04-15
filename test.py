

import os

ffs = [a.split('.jpg')[0] for a in os.listdir('public/images') if '.jpg' in a ]
ff = open('data.txt','r').read().split('\n')

print(len(ff),len(ffs))

for a in ff :
	b = a.split('__')[0]
	if b not in ffs :
		print(a)