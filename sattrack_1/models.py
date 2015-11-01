from django.db import models

# Create your models here.
class SatelliteTLE(models.Model):
    satellite_name = models.CharField(max_length=30)
    line_1 = models.CharField(max_length=69)
    line_2 = models.CharField(max_length=69)
    
    def __unicode__(self):
        return self.satellite_name