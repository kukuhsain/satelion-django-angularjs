### tle data analysis using ephem ###
### being used as module ###
### time : utcnow() ###

# import important modules
import ephem
import datetime

# function tledata
def tledata(name, line1, line2):

    # process TLE data
    tle_rec = ephem.readtle(name, line1, line2)
    tle_rec.compute()

    # get the data into the table
    latitude = tle_rec.sublat / ephem.degree
    longitude = tle_rec.sublong / ephem.degree
    altitude = tle_rec.elevation
    right_asc = str((tle_rec.ra))
    declination = str(ephem.hours(tle_rec.dec))
    
    # return as dictionary (python) or object (JavaScript)
    return {'latitude': latitude, 'longitude': longitude, 'altitude': altitude, 'right_asc': right_asc, 'declination': declination}