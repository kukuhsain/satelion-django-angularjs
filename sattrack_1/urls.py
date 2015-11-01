from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.satellite),
    url(r'^data/list_satellite_json/$', views.list_satellite),
    url(r'^data/get_TLE_json/$', views.get_TLE),
    url(r'^data/get_prediction_path_json/$', views.get_prediction_path),
    url(r'^data/get_time_and_sat_param_json/$', views.get_time_and_sat_param),
    url(r'^data/get_antenna_param_json/$', views.get_antenna_param),
    ]
