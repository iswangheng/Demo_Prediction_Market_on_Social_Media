#!/usr/bin/env python
# coding: utf-8
import web

render = web.template.render('templates')

web.config.debug = True

config = web.storage(
    email='iswangheng@gmail.com',
    site_name = 'Demo Market',
    site_desc = '',
    #Below the the UTC +8 timezone, in the sub app may need to change according to the users timezone!!!! 
    utc_offset = 8, 
)


web.template.Template.globals['config'] = config
web.template.Template.globals['render'] = render
