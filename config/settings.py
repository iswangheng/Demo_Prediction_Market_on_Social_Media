#!/usr/bin/env python
# coding: utf-8
import web

db = web.database(dbn='mysql', db='prediction_market', user='root', pw='swarm')
 
render = web.template.render('templates')

web.config.debug = True

config = web.storage(
    email='iswangheng@gmail.com',
    site_name = 'Demo Market',
    site_desc = '',
    CONSUMER_KEY = "Bim7MtyWZjYvYIqImZWw",
    CONSUMER_SECRET = "zwGggVuRJsDoomJWl8GJUGxQcPUi7OUVkbtgOOLpx0w",
    #Below the the UTC +8 timezone, in the sub app may need to change according to the users timezone!!!! 
    utc_offset = 8, 
)


web.template.Template.globals['config'] = config
web.template.Template.globals['render'] = render
