#!usr/bin/env python
# coding: utf-8

import web
import json
import os
import sys
import time
import commands
import tweepy
from config import settings


render = settings.render
config = settings.config
db = settings.db



def get_nodes():
    """
        will get all the nodes from db
    """
    query_str = "SELECT node_number, node_label, node_confidence, node_pic FROM nodes"
    result = db.query(query_str)
    nodes = []
    for node in result:
        node_label = node.node_label
        node_dict= {'node_label': node_label}
        node_dict.update({'node_number': node.node_number})
        node_dict.update({'node_confidence': node.node_confidence})
        node_dict.update({'node_pic': node.node_pic})
        nodes.append(node_dict) 
    return nodes

def get_edges():
    """ 
        will get all the edges from db
    """
    edges = []
    query_str = "SELECT node, follower FROM edges"
    result = db.query(query_str)
    for edge in result:
        edge_dict = {'node': edge.node}
        edge_dict.update({'follower': edge.follower})
        edges.append(edge_dict)
    return edges



#just to get the api instance of tweepy
def get_tweepAPI(session):
    auth = tweepy.OAuthHandler(config.CONSUMER_KEY, config.CONSUMER_SECRET) 
    access_token_key = session.access_token_key
    access_token_secret = session.access_token_secret
    auth.set_access_token(access_token_key,access_token_secret)
    api = tweepy.API(auth)
    return api


#store the current user info into the session
# of course we need to use the api to get the current user info
def store_user_into_session(api):
    try:
        user = api.me()
        user_img = user.profile_image_url
        user_name = user.name
        user_screen_name = user.screen_name 
        user_location = user.location 
    except:
        user_img = "http://a0.twimg.com/profile_images/459277408/logo1_normal.jpg"
        user_name = "笨笨"
        user_screen_name = 'error_heng'
        user_location = 'Hong Kong'
    web.ctx.session.user_img = user_img
    web.ctx.session.user_name = user_name
    web.ctx.session.user_screen_name = user_screen_name
    web.ctx.session.user_location = user_location
    print 'web.ctx.session.user_name %s' % web.ctx.session.user_name 





# will return all the nodes and the edges 
class ShowGraph:
    def POST(self):
        print 'ShowGraph Class!!!!'
        nodes_list = []
        nodes_list = get_nodes()
        edges_list = []
        edges_list = get_edges()
        data = {'nodes_list': nodes_list}
        data.update({'edges_list': edges_list})
        web.header('Content-Type', 'application/json')
        data_string = json.dumps(data)
        print "AJAX:  will now return~~~~~~~~~~~~"
        return data_string



#to render the index page
class Index:
    def GET(self):
        return render.index(web.ctx.session)

    def POST(self): 
        print 'post index'
        return


# To Render the Crowds Analyzing Page
class Analyzing:
    def GET(self):
        return render.analyzing(web.ctx.session)

# To Render the Wisdom Calculating Page
class Calculating:
    def GET(self):
        return render.calculating(web.ctx.session)

# To Render the Questions Publishing Page
class Publishing:
    def GET(self):
        return render.publishing(web.ctx.session)

# TO Render the Questions Answered Page
class Answered:
    def GET(self):
        return render.answered(web.ctx.session)


#when use click the sign in with twitter button
class SignIn:
    def GET(self): 
        auth = tweepy.OAuthHandler(config.CONSUMER_KEY, config.CONSUMER_SECRET)
        try:
            redirect_url = auth.get_authorization_url()
            web.ctx.session.request_token_key = auth.request_token.key 
            web.ctx.session.request_token_secret = auth.request_token.secret     
            print "redirect_url: ", redirect_url
            print "request_token_key: ",  web.ctx.session.request_token_key
            print "request_token_secret: ", web.ctx.session.request_token_secret
            web.seeother(redirect_url) 
        except tweepy.TweepError:
            print 'Error! Failed to get request token.'  
            web.seeother('sign_in_with_twitter')   


#when the twitter signing in action takes the user to the call back page
class Callback:
    def GET(self):
        print 'call back page: '      
        auth = tweepy.OAuthHandler(config.CONSUMER_KEY, config.CONSUMER_SECRET) 
        try:
            REQUEST_TOKEN_KEY = web.ctx.session.request_token_key
            REQUEST_TOKEN_SECRET = web.ctx.session.request_token_secret 
            print "request_token_key: ", REQUEST_TOKEN_KEY 
            print "request_token_secret: ", REQUEST_TOKEN_SECRET 
        except:
            print "RequestTokenKey ERROR...---+++: ",sys.exc_info()[0]
        auth.set_request_token(REQUEST_TOKEN_KEY, REQUEST_TOKEN_SECRET) 
        try:
            form = web.input() 
            verifier = form.oauth_verifier  
            print '---->form.oauth_verifier:  %s' % verifier
            try:
                auth.get_access_token(verifier)
            except tweepy.TweepError, err:
                print 'Error.. Failed to get access token ---->%s' % err  
            web.ctx.session.access_token_key = auth.access_token.key
            web.ctx.session.access_token_secret = auth.access_token.secret  
            print 'will now go to the index.html' 
            api = get_tweepAPI(web.ctx.session) 
            store_user_into_session(api)
            web.seeother('index.html')   
        except:
            print 'Error: ', sys.exc_info()[0]
            web.seeother('sign_in_with_twitter') 


class SignOut:
    def GET(self):
        print "WILL SIGN OUT~~~~~~~~~~~~~~~~~~~~~~~~"
        web.ctx.session.kill()
        web.seeother('index.html')




class Others:
    def GET(self,other): 
        if other == 'index.html':
            return render.index(web.ctx.session)
        elif other == 'contact.html':
            return render.contact(web.ctx.session)
        elif other == 'about.html':
            return render.about(web.ctx.session)

    def POST(self):
        print 'post self'
        return
 

