#!/usr/bin/env python
# coding: utf-8

pre_fix = 'controllers.'

urls = (
     '/',                     pre_fix + 'demo.Index', 
     '/sign_in_with_twitter', pre_fix + 'demo.SignIn', 
     '/callback',             pre_fix + 'demo.Callback',
     '/analyzing.html',       pre_fix + 'demo.Analyzing',
     '/show_nodes_from_server',  pre_fix + 'demo.ShowGraph',
     '/get_user_tweets',      pre_fix + 'demo.GetUserTweets',
     '/show_nodes_historical_confidence', pre_fix + 'demo.ReturnHistoricalConfidence',
     '/calculating.html',     pre_fix + 'demo.Calculating',
     '/publishing.html',      pre_fix + 'demo.Publishing',
     '/publish_question',     pre_fix + 'demo.PublishQuestion',
     '/answered.html',        pre_fix + 'demo.Answered',
     '/show_answered_nodes',  pre_fix + 'demo.ReturnAnsweredNodes',
     '/show_questions_answer',pre_fix + 'demo.ReturnQuestionsAnswer',
     '/sign_out',             pre_fix + 'demo.SignOut',
     '/(.*)',                 pre_fix + 'demo.Others',
)

