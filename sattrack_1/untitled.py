url(r'^satel/(?P<satellite>\w+)/$', views.pick_TLE_satellite),
url(r'^satellite/$', views.get_satellite),


def cleaning(satellite_name):
    return ' '.join(satellite_name.split('_'))

def unpick_satellite(request, satellite):
    satellite_name = cleaning(satellite)
    
    sat = SatelliteTLE.objects.get(satellite_name = satellite_name)
    
    #sat = SatelliteTLE.objects.get(satellite_name = satellite_name)
    
    #latlong = tledata(str(sat.satellite_name), str(sat.line_1), str(sat.line_2))
    
    satTLE = str(sat.satellite_name) + str(sat.line_1) + str(sat.line_2)
    
    return HttpResponse(satTLE)
    
def pick_TLE_satellite(request, satellite):
    
    satellite_name = cleaning(satellite)
    
    sat = SatelliteTLE.objects.get(satellite_name = satellite_name)
    
    satTLE = {"satName":str(sat.satellite_name), "satLine1":str(sat.line_1), "satLine2":str(sat.line_2)}
    
    return HttpResponse(json.dumps(satTLE))
    

def pick_satellite(request):
    
    satellite_name = request.GET["sat"]
    
    sat = SatelliteTLE.objects.get(satellite_name = satellite_name)
    latlong = tledata(str(sat.satellite_name), str(sat.line_1), str(sat.line_2))
    
    return HttpResponse(str(latlong))