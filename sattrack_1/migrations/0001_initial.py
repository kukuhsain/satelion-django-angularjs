# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SatelliteTLE',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('satellite_name', models.CharField(max_length=30)),
                ('line_1', models.CharField(max_length=69)),
                ('line_2', models.CharField(max_length=69)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
