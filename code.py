#!/usr/bin/env python
# coding: utf-8
from config.url import urls
from config import settings
import web


db = settings.db
web.config.debug = True
app = web.application(urls, globals())
store = web.session.DBStore(db, 'sessions')


if web.ctx.get('session') is None:
    session = web.session.Session(app, store, {'request_token_key':'', 'request_token_secret':'', 'access_token_key ':'','access_token_secret':'',
                                  'user_img':'',
                                  'user_name':'',
                                  'user_screen_name':'',
                                  'user_location':''})

    print "!!!! init the session la !!!"
    web.ctx.session = session
else:
    print "@@@@ I already have session la @@@@@"
    session = web.ctx.session


def session_hook():
    web.ctx.session = session


if __name__ == "__main__": 
    app.add_processor(web.loadhook(session_hook))  
    app.run()

