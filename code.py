#!/usr/bin/env python
# coding: utf-8
from config.url import urls
from config import settings
import web


web.config.debug = True
app = web.application(urls, globals())


if __name__ == "__main__": 
    app.run()

