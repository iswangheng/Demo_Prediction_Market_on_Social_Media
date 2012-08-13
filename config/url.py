#!/usr/bin/env python
# coding: utf-8

pre_fix = 'controllers.'

urls = (
     '/',                     pre_fix + 'demo.Index', 
     '/sign_in_with_twitter', pre_fix + 'demo.SignIn', 
     '/callback',             pre_fix + 'demo.Callback',
     '/analyzing.html',       pre_fix + 'demo.Analyzing',
     '/show_nodes_from_server',  pre_fix + 'demo.ShowGraph',
     '/calculating.html',     pre_fix + 'demo.Calculating',
     '/publishing.html',      pre_fix + 'demo.Publishing',
     '/answered.html',        pre_fix + 'demo.Answered',
     '/sign_out',             pre_fix + 'demo.SignOut',
     '/(.*)',                 pre_fix + 'demo.Others',
)

