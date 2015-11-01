import django
from models import SatelliteTLE

django.setup()

f = open('geo.txt','r')

lines = f.readlines()
    
# define satellite
# find the coresponding satellite
for n in range(0,len(lines),3):
    
# clean the data
    name = lines[n]
    line1 = lines[n+1][0:69]
    line2 = lines[n+2][0:69]
    
    name = ' '.join(name.split())
    
    s = SatelliteTLE(satellite_name = name, line_1 = line1, line_2 = line2)
    s.save()

f.close()

