#!/usr/bin/env python
# coding: utf-8

pre_fix = 'controllers.'

urls = (
     '/',                     pre_fix + 'demo.Index', 
     '/analyzing.html',       pre_fix + 'demo.Analyzing',
     '/calculating.html',     pre_fix + 'demo.Calculating',
     '/publishing.html',      pre_fix + 'demo.Publishing',
     '/answered.html',        pre_fix + 'demo.Answered',
     '/(.*)',                 pre_fix + 'demo.Others',
)

