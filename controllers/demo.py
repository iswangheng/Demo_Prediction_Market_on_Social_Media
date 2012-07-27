#!usr/bin/env python
# coding: utf-8

import web
import json
import os
import sys
import time
import commands
from config import settings


render = settings.render
config = settings.config


#to render the index page
class Index:
    def GET(self):
        return render.index()

    def POST(self): 
        print 'post index'
        return


class Others:
    def GET(self,other): 
        if other == 'index.html':
            return render.index()
        elif other == 'about.html':
            return render.about()

    def POST(self):
        print 'post self'
        return
 

