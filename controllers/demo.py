#!usr/bin/env python
# coding: utf-8

import web
import json
import sys
import math
import shlex
import time
from time import gmtime, strftime
import tweepy
from config import settings


render = settings.render
config = settings.config
db = settings.db


#just to get the api instance of tweepy
def get_tweepAPI(session):
    auth = tweepy.OAuthHandler(config.CONSUMER_KEY, config.CONSUMER_SECRET) 
    access_token_key = session.access_token_key
    access_token_secret = session.access_token_secret
    auth.set_access_token(access_token_key,access_token_secret)
    api = tweepy.API(auth)
    return api


# will get the user_screen_name's followers
def get_followers(user_screen_name):
    followers_list = []
    try:
        api = get_tweepAPI(web.ctx.session)
        api_followers = api.followers(user_screen_name)
        print 'Length: ', len(api_followers)
        count = 0
        for follower in api_followers:
            try:
                follower_dict = {"user_pic": follower.profile_image_url}
                follower_dict.update({"user_screen_name": follower.screen_name})
                follower_dict.update({"latest_tweet": follower.status.text})
                print 'img: ', follower.profile_image_url
                print 'user_screen_name: ', follower.screen_name
                print 'latest_tweet: ', follower.status.text
                followers_list.append(follower_dict)
                count = count + 1
                if count >= 35:
                    break
            except:
                print 'unknown error....doesnt matter, ignore...'
    except:
        print 'api.followers ERROR......................' 
        #TODO the reason I do this is that using twitter API in HKUST campus is 
        # a fucking nightmare
        # The api is simply not working in campus !! what the fuck
        follower_dict = {"user_pic": 'asd'}
        follower_dict.update({"user_screen_name": 'error'})
        follower_dict.update({"latest_tweet": 'asdf'})
        followers_list.append(follower_dict)
    return followers_list


# which_one has two kinds of options: graph and historical
# if graph: will return the node_confidence
# if historical: will return the node_historical_confidence
def get_nodes(which_one):
    """
        will get all the nodes from db
    """
    if(which_one == 'graph'):
        query_str = "SELECT node_number, node_label, node_confidence, node_pic FROM nodes"
    else:
        query_str = "SELECT node_number, node_label, node_historical_confidence, node_pic FROM nodes"
    result = db.query(query_str)
    nodes = []
    for node in result:
        node_label = node.node_label
        node_dict= {'node_label': node_label}
        node_dict.update({'node_number': node.node_number})
        node_dict.update({'node_label_answered': node.node_number})
        if(which_one == "graph"):
            node_dict.update({'node_confidence': node.node_confidence})
        else:
            node_dict.update({'node_confidence': node.node_historical_confidence})
        node_dict.update({'node_pic': node.node_pic})
        node_dict.update({'node_chosen': 0})    # 0 means not chosen, 1 means chosen
        node_dict.update({'node_answer': 2})   # 1 means yes, 0 means no, 2 means still not been answered
        nodes.append(node_dict) 
    return nodes


def set_nodes_chosen(nodes_list, chosen_nodes):
    """docstring for set_nodes_chosen"""
    for node in nodes_list:
        if node['node_number'] in chosen_nodes:
            node['node_chosen'] = 1
    return nodes_list

def set_nodes_answered(nodes_list, yes_nodes, no_nodes):
    """docstring for set_nodes_answered"""
    for node in nodes_list:
        if node['node_number'] in yes_nodes:
            node['node_answer'] = 1
            node['node_label_answered'] = node['node_number'] + ' (conf=' + str(node['node_confidence']) + ')'
            print 'yes node: ', node['node_label_answered']
        elif node['node_number'] in no_nodes:
            node['node_label_answered'] = node['node_number'] + ' (conf=' + str(node['node_confidence']) + ')'
            node['node_answer'] = 0
            print 'no node: ', node['node_label_answered']
    return nodes_list

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

def get_tweets_by_screenname(screen_name):
    tweets = []
    query_str = "SELECT tweet_text, tweet_created_at FROM tweets WHERE user_screen_name = '%s' ORDER BY tweet_created_at DESC LIMIT 15" % screen_name
    print 'query_str:------------------->  ', query_str
    result = db.query(query_str)
    for tweet in result:
        tweet_dict = {'tweet_text': tweet.tweet_text}
# below datatime has sth wrong. handle it in the future!!!  TODO
        #tweet_dict.update({'tweet_created_at': tweet.tweet_created_at})
        tweets.append(tweet_dict)
    return tweets



# just for demo only
# should not be useful anymore after Aug 20, 2012
# TODO to delete or edit  after Aug 20, 2012
def get_nodes_chosen_for_demo(which_case, parameter):
    if which_case == 'Market':
        if parameter < 0.55:
            node_nums = ['25', '30', '15']
        elif parameter < 0.6:
            node_nums = ['22','3','12']
        elif parameter < 0.65:
            node_nums = ['9','6','13']
        elif parameter < 0.7:
            node_nums = ['6','5','17','26','29']
        elif parameter < 0.75:
            node_nums = ['5','10','13','16','22']
        elif parameter < 0.8:
            node_nums = ['3','6','17','20','25']
        elif parameter < 0.85:
            node_nums = ['2','6','1','17','25']
        elif parameter < 0.9:
            node_nums = ['2','3','6','10','11','17','20']
        elif parameter < 0.95:
            node_nums = ['3','5','6','2','13','14','17']
        else:
            node_nums = ['1','3','6','11','17','20','30']
    else:           # pay as you go
        budget = parameter
        node_nums = []
        node_nums = get_nodes_chosen_by_budget(budget)
    return node_nums


# return nodes given a budget
# will use a simplified algorithm
def get_nodes_chosen_by_budget(budget):
    time.sleep(0.6)
    nodes_nums = []
    nodes_list = []
    node_confidence_dict = {}
    node_requirement_dict = {}
    query_str = "SELECT node_number, node_confidence, node_requirement FROM nodes"
    print 'query_str:    ', query_str
    result = db.query(query_str)
    for row in result:
        node_number = str(row.node_number)
        node_confidence_dict.update({node_number: row.node_confidence})
        node_requirement_dict.update({node_number: row.node_requirement})
        node_dict = {'node_num': node_number}
        node_dict.update({'confidence': row.node_confidence})
        node_dict.update({'requirement': row.node_requirement})
        node_dict.update({'ratio': row.node_confidence/row.node_requirement})
        nodes_list.append(node_dict)
    i = 0
    j = 1
    max_ratio = 1
    while i < len(nodes_list)-1:
        max_ratio = nodes_list[i]['ratio']
        j = i + 1
        while j < len(nodes_list):
            if nodes_list[j]['ratio'] > max_ratio:
                max_ratio = nodes_list[j]['ratio']
                temp_node = nodes_list[i]
                nodes_list[i] = nodes_list[j]
                nodes_list[j] = temp_node
            j = j + 1
        i = i + 1
    list_with_conf = []
    size_index = 1
    while size_index <= len(nodes_list):
        start_index = 0
        while True:
            temp_list = []
            list_index = start_index
            if (start_index + size_index) > len(nodes_list):
                break
            while list_index < start_index + size_index:
                print 'start_index: ', start_index
                print 'list_index: ', list_index
                print 'start_index+size_index', start_index+size_index
                temp_list.append(nodes_list[list_index])
                list_index = list_index + 1
            cost = 0
            for temp in temp_list:
                cost = cost + temp['requirement']
            if cost < budget:
                confidence = get_overall_confidence(temp_list)
                print 'templist: ', temp_list
                single_with_conf = {'nodes_list': temp_list}
                single_with_conf.update({'overall_confidence': confidence})
                list_with_conf.append(single_with_conf)
                break
            start_index = start_index + 1
        size_index = size_index + 2
    nodes_nums = []
    m = 0
    n = 1
    print 'list have found: ', list_with_conf
    while m < len(list_with_conf) - 1:
        max_conf = list_with_conf[m]['overall_confidence']
        n = m + 1
        while n < len(list_with_conf):
            if max_conf < list_with_conf[n]['overall_confidence']:
                max_conf = list_with_conf[n]['overall_confidence']
                temp_list_conf = list_with_conf[m]
                list_with_conf[m] = list_with_conf[n]
                list_with_conf[n] = temp_list_conf
            n = n + 1
        # just need the max conf one, no need to go through the entire list
        print 'MAX confidence list have found: ', list_with_conf[0]
        for node_list in list_with_conf[0]['nodes_list']:
            nodes_nums.append(node_list['node_num'])
        break
    return nodes_nums



# just for demo only
# should not be useful anymore after Aug 20, 2012
# TODO to delete or edit  after Aug 20, 2012
def get_users_nodes_for_demo(which_case, parameter):
    node_nums = get_nodes_chosen_for_demo(which_case, parameter)
    nodes_list = []
    print 'get_user_nodes_for_demo............'
    print 'node_nums.........', node_nums
    for node_num in node_nums:
        query_str = "SELECT node_label, node_pic, node_confidence FROM nodes WHERE node_number = '%s'" % str(node_num)
        print 'query_str:    ', query_str
        result = db.query(query_str)
        node = result[0]
        node_dict = {'node_num': node_num}
        node_dict.update({'node_pic': node.node_pic})
        node_dict.update({'node_name': node.node_label})
        node_dict.update({'node_confidence': node.node_confidence})
        nodes_list.append(node_dict)
    return nodes_list



def store_question(question_time, user_name, question, payment_method):
    """store_question into the db (table: question)"""
    try:
        db.insert('question', time=question_time, user_name=user_name, question=question, payment_method=payment_method)
        print "!!!!#####insert db@@@##questions##########"
    except:
        print "db insert error"



#store the current user info into the session
# of course we need to use the api to get the current user info
def store_user_into_session(api):
    try:
        user = api.me()
        user_img = user.profile_image_url
        user_name = user.name
        user_screen_name = user.screen_name 
        user_location = user.location 
        user_statuses_count = user.statuses_count
        user_following_count = user.friends_count
        user_followers_count = user.followers_count 
    except:
        user_img = "http://a0.twimg.com/profile_images/459277408/logo1_normal.jpg"
        user_name = "笨笨"
        user_screen_name = 'error_heng'
        user_location = 'Hong Kong'
        user_statuses_count = 1713
        user_following_count = 421
        user_followers_count = 184 
    web.ctx.session.user_img = user_img
    web.ctx.session.user_name = user_name
    web.ctx.session.user_screen_name = user_screen_name
    web.ctx.session.user_location = user_location
    web.ctx.session.user_statuses_count = user_statuses_count
    web.ctx.session.user_following_count = user_following_count
    web.ctx.session.user_followers_count = user_followers_count
    print 'web.ctx.session.user_name %s' % web.ctx.session.user_name 


# will connect the db and get confidence and requirement of those users
def get_user_conf_req(user_list_name):
    user_list_info = []
    for user_name in user_list_name:
        print user_name
        query_str = "SELECT node_confidence, node_requirement FROM nodes WHERE node_label = '%s'" % str(user_name)
        print 'query_str:    ', query_str
        result = db.query(query_str)
        node = result[0]
        user_info = {'confidence': node.node_confidence}
        user_info.update({'requirement': node.node_requirement})
        user_list_info.append(user_info)
    return user_list_info



# will calculate the overall confidence according to the given users confidence
def get_overall_confidence(user_list_info):
    mean_confidence = 0.6
    total_conf = 0
    for user in user_list_info:
        total_conf = total_conf + user['confidence']
    mean_confidence = total_conf/len(user_list_info)
    if mean_confidence > 0.5:
        exp_part = (mean_confidence - 0.5)/0.5
        overall_conf = (math.exp(exp_part)-1)/(2*(math.e-1)) + 0.5
    else:
        exp_part = (0.5 - mean_confidence)/0.5
        overall_conf = 0.5 - (math.exp(exp_part)-1)/(2*(math.e-1)) 
    overall_conf = "%.3f" % overall_conf
    return overall_conf


# will calculate the market cost according to the given users requirement
def get_market_cost(user_list_info):
    cost = 0
    for user in user_list_info:
        cost = cost + user['requirement']
    cost = cost - 0.334 * cost
    cost = "%.3f" % cost
    return cost

# will calculate the pay_as_you_go cost according to the given users requirement
def get_pay_cost(user_list_info):
    cost = 0
    for user in user_list_info:
        cost = cost + user['requirement']
    cost = "%.3f" % cost
    return cost


# will return at most 35 followers of current user
class ShowUserFollowers:
    def POST(self):
        print 'Show User Followers'
        followers_list = []
        followers_list = get_followers(web.ctx.session.user_screen_name)
        data = {'followers_list': followers_list}
        web.header('Content-Type', 'application/json')
        data_string = json.dumps(data)
        print "AJAX Show User Followers:  will now return~~~~~~~~~~~~"
        return data_string



# will return all the nodes and the edges 
class ShowGraph:
    def POST(self):
        print 'ShowGraph Class!!!!'
        nodes_list = []
        nodes_list = get_nodes('graph')
        edges_list = []
        edges_list = get_edges()
        data = {'nodes_list': nodes_list}
        data.update({'edges_list': edges_list})
        web.header('Content-Type', 'application/json')
        data_string = json.dumps(data)
        print "AJAX:  will now return~~~~~~~~~~~~"
        return data_string


# will get user tweets according to the user screen name
class GetUserTweets:
    def POST(self):
        print 'Get User Tweets by user_screen_name'
        user_screen_name = web.input().signal
        tweets_list = get_tweets_by_screenname(user_screen_name)
        data = {'tweets_list': tweets_list}
        web.header('Content-Type', 'application/json')
        data_string = json.dumps(data)
        print "Get User Tweets AJAX:  will now return~~~~~~~~~~~~"
        return data_string


# will return all the nodes confidence by their historical records
class ReturnHistoricalConfidence:
    def POST(self):
        print "Return Historical Confidence"
        nodes_list = []
        nodes_list = get_nodes('historical')
        data = {'nodes_list': nodes_list}
        web.header('Content-Type', 'application/json')
        data_string = json.dumps(data)
        print "AJAX ReturnHistoricalConfidence:  will now return~~~~~~~~~~~~"
        return data_string


# will return the calculation results of given users
class CrowdsAnalyzing:
    def POST(self):
        data = {'confidence': 0}
        data.update({'market_cost': 0})
        data.update({'pay_cost': 0})
        data_string = json.dumps(data)
        print 'Crowds Analyzing'
        users_selected_str = str(web.input().signal)
        print users_selected_str
        users_list_at = shlex.split(users_selected_str)
        print users_list_at
        if len(users_list_at) == 0:
            print '**********No User**********'
            return data_string
        users_list_name = []
        for user in users_list_at:
            username = user[1:]
            users_list_name.append(username)
        print users_list_name
        users_list_info = get_user_conf_req(users_list_name)
        print users_list_info
        data['confidence'] = get_overall_confidence(users_list_info)
        data['market_cost'] = get_market_cost(users_list_info)
        data['pay_cost'] = get_pay_cost(users_list_info)
        data_string = json.dumps(data)
        return data_string



# will return the relevant users according to different questions
class PublishingShowUsers:
    def POST(self):
        print 'Publishing Show Users'
        parameter_input = float(web.input().signal)
        which_case = web.input().payment
        nodes_list = []
        nodes_list = get_users_nodes_for_demo(which_case, parameter_input)
        chosen_list = get_nodes_chosen_for_demo(which_case,parameter_input)
        graph_nodes_list = get_nodes('graph')
        graph_nodes_list = set_nodes_chosen(graph_nodes_list, chosen_list)
        edges_list = []
        edges_list = get_edges()
        data = {'nodes_list': nodes_list}
        data.update({'edges_list': edges_list})
        data.update({'graph_nodes_list': graph_nodes_list})
        web.header('Content-Type', 'application/json')
        data_string = json.dumps(data)
        print "AJAX publishing SHow Users:  will now return~~~~~~~~~~~~"
        return data_string


# will take the input as the question and payment_method , store them into the question table and then tweet it.
class PublishQuestion:
    def POST(self):
        print "Publish Question"
        user_name = web.ctx.session.user_screen_name
        question = web.input().question
        payment_method = web.input().payment_method
        question_time = strftime("%Y-%m-%d %H:%M:%S", gmtime())
        print user_name, ' Question: ', question, " payment_method: ", payment_method, " time: ", question_time
        store_question(question_time, user_name, question, payment_method)
        print "AJAX Publish Question:  will now return~~~~~~~~~~~~"
        return 

# will return all the nodes and edges, but this time with the information of answers(yes or no)
class ReturnAnsweredNodes:
    def POST(self):
        print 'Return Answered Nodes'
        question_num = web.input().question_num
# TODO here is just for the demo of August 20, 2012
# this part should be rewrite after August 20, 2012
        if question_num == '1':
            yes_nodes = ['2','3','6','14','17']
            no_nodes = ['5','13']
        elif question_num == '2':
            yes_nodes = ['3','9','12']
            no_nodes = ['7', '20']
        else:       # question_num = 3 (pay as you go , budget = 4.0)
            yes_nodes = ['1']
            no_nodes = ['11', '12']
        nodes_list = []
        nodes_list = get_nodes('graph')
        nodes_list = set_nodes_answered(nodes_list, yes_nodes, no_nodes)
        edges_list = []
        edges_list = get_edges()
        data = {'nodes_list': nodes_list}
        data.update({'edges_list': edges_list})
        web.header('Content-Type', 'application/json')
        data_string = json.dumps(data)
        print "AJAX:  will now return~~~~~~~~~~~~"
        return data_string


# will return the questions and the answer to the default question
class ReturnQuestionsAnswer:
    def POST(self):
        print "return Questions and answer"
        questions_list = get_questions()
        default_question_info = get_default_question_info()
        question_title = default_question_info.question_title
        yes_num = default_question_info.yes_num
        no_num = default_question_info.no_num
        data = {'questions_list': questions_list}
        data.update({'question_title': question_title})
        data.update({'yes_num': yes_num})
        data.update({'no_num': no_num})
        web.header('Content-Type', 'application/json')
        data_string = json.dumps(data)
        print "AJAX----returnQuestions and Answer:  will now return~~~~~~~~~~~~"
        return data_string


#to render the index page
class Index:
    def GET(self):
        return render.index(web.ctx.session)

    def POST(self): 
        print 'post index'
        return

# To Render the User Followers Page
class Followers:
    def GET(self):
        try:
            print "web.ctx.session.user_name %s" % web.ctx.session.user_name
            if web.ctx.session.user_name == '':
                web.seeother('sign_in_with_twitter')
            return render.followers(web.ctx.session)
        except AttributeError, msg:
            print "ERROR.. : %s" % msg
            web.seeother('sign_in_with_twitter')
        return render.followers(web.ctx.session)


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
        try:
            print "web.ctx.session.user_screen_name %s" % web.ctx.session.user_screen_name 
          #  if web.ctx.session.user_screen_name == '':
          #      web.seeother('sign_in_with_twitter')
          #  return render.publishing(web.ctx.session)
            return render.publishing(web.ctx.session)
        except AttributeError, msg:
            print "ERROR.. : %s" % msg
            web.seeother('sign_in_with_twitter')

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
            web.seeother('followers.html')   
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
 

