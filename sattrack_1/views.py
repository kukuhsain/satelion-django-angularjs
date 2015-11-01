from django.shortcuts import render
from django.http import HttpResponse
import json

from .models import SatelliteTLE

########### PyEphem ###########
# import important modules
import ephem
import datetime

# function tledata
def tledata(name, line1, line2):

    # process TLE data
    tle_rec = ephem.readtle(name, line1, line2)

    latitude = []
    longitude = []
    altitude = []
    right_asc = []
    declination = []
    speed = []

    # define time
    date_utcnow = datetime.datetime.utcnow()

    # get the data into the table
    for t in range(90):

        # interval a second
        date_delta = datetime.timedelta(seconds=t)
        date_prediction = date_utcnow + date_delta

        # compute TLE data
        tle_rec.compute(date_prediction)

        latitude.append(tle_rec.sublat / ephem.degree)
        longitude.append(tle_rec.sublong / ephem.degree)
        altitude.append(tle_rec.elevation)
        right_asc.append(str((tle_rec.ra)))
        declination.append(str(ephem.hours(tle_rec.dec)))
        #speed.append(tle_rec.range_velocity)

    # return as dictionary (python) or object (JavaScript)
    return {'latitude': latitude, 'longitude': longitude, 'altitude': altitude, 'right_asc': right_asc, 'declination': declination,}
########### PyEphem ###########

########### PyEphem 2 ###########
def prediction_path(name, line1, line2):
    # define variables as lists
    longitude = []
    latitude = []

    # define time
    date_utcnow = datetime.datetime.utcnow()

    # read TLE data into ephem
    tle_rec = ephem.readtle(name, line1, line2)

    # for loop to predict satellite coordinate for 36 hours ahead
    # start from now (t=0)
    for t in range(24*60):

        # interval an hour
        date_delta = datetime.timedelta(minutes=t)
        date_prediction = date_utcnow + date_delta

        # compute TLE data
        tle_rec.compute(date_prediction)

        # write the data into lists
        longitude.append(tle_rec.sublong / ephem.degree)
        latitude.append(tle_rec.sublat / ephem.degree)

    # return dictionary (python) or object (JavaScript)
    return {'latitude': latitude, 'longitude': longitude}
########### PyEphem 2 ###########



# Create your views here.
def index(request):
    return render(request, "sattrack_1/index.html")

def satellite(request):
    satellite_name = request.GET["sat"]
    return render(request, "sattrack_1/index4ng.html", {'satellite_name' : satellite_name})

def list_satellite(request):
    list_satName = []
    for i in range(1, SatelliteTLE.objects.count()+1):
        sat = SatelliteTLE.objects.get(pk = i)
        list_satName.append(str(sat.satellite_name))

    list_satName.sort()
    list_satellite = {"listSatellite":list_satName}
    return HttpResponse(json.dumps(list_satellite))


def get_TLE(request):
    sat_name = request.GET["sat"]
    sat_name = ' '.join(sat_name.split('_'))
    #print 'sat_name', sat_name
    sat = SatelliteTLE.objects.get(satellite_name = sat_name)
    #print 'sat', sat
    satTLE = {"satName":str(sat.satellite_name), "satLine1":str(sat.line_1), "satLine2":str(sat.line_2)}
    #print 'satTLE', satTLE

    return HttpResponse(json.dumps(satTLE))

def get_time_and_sat_param(request):
    sat_name = request.GET["sat"]
    sat_name = ' '.join(sat_name.split('_'))
    sat = SatelliteTLE.objects.get(satellite_name = sat_name)
    sat_param = tledata(str(sat.satellite_name), str(sat.line_1), str(sat.line_2))

    return HttpResponse(json.dumps(sat_param))

def get_sun_outage():
    pass

def get_time():
    pass

def get_antenna_param(request):
    antenna = ephem.Observer()
    print request

    antenna.lat = request.GET["latitude"]
    antenna.lon = request.GET["longitude"]

    print antenna.lat
    print antenna.lon

    sat_name = request.GET["sat"]
    sat_name = ' '.join(sat_name.split('_'))

    print sat_name

    sat = SatelliteTLE.objects.get(satellite_name = sat_name)
    sat_param = ephem.readtle(str(sat.satellite_name), str(sat.line_1), str(sat.line_2))
    sat_param.compute(antenna)

    antenna_param = {"azimuth": sat_param.az / ephem.degree, "elevation": sat_param.alt / ephem.degree}

    return HttpResponse(json.dumps(antenna_param))


def get_prediction_path(request):
    sat_name = request.GET["sat"]
    sat_name = ' '.join(sat_name.split('_'))
    sat = SatelliteTLE.objects.get(satellite_name = sat_name)
    pred_path = prediction_path(str(sat.satellite_name), str(sat.line_1), str(sat.line_2))

    return HttpResponse(json.dumps(pred_path))
