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


# To Render the Crowds Analyzing Page
class Analyzing:
    def GET(self):
        return render.analyzing()

# To Render the Wisdom Calculating Page
class Calculating:
    def GET(self):
        return render.calculating()

# To Render the Questions Publishing Page
class Publishing:
    def GET(self):
        return render.publishing()

# TO Render the Questions Answered Page
class Answered:
    def GET(self):
        return render.answered()

class Others:
    def GET(self,other): 
        if other == 'index.html':
            return render.index()
        elif other == 'contact.html':
            return render.contact()
        elif other == 'about.html':
            return render.about()
        elif other == 'springydemo.html':
            return render.springydemo()

    def POST(self):
        print 'post self'
        return
 

