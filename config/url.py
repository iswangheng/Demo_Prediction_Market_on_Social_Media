#!/usr/bin/env python
# coding: utf-8

pre_fix = 'controllers.'

urls = (
     '/',                     pre_fix + 'demo.Index', 
     '/(.*)',                 pre_fix + 'demo.Others',
)

