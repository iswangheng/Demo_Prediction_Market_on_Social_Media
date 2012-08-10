#!usr/bin/env python
# coding: utf-8

import web
import json
import os
import sys
import time
import commands
from config import settings


render = settings.render
config = settings.config
db = settings.db



def get_nodes():
    """
        will get all the nodes from db
    """
    query_str = "SELECT node_number, node_confidence, node_pic FROM nodes"
    result = db.query(query_str)
    nodes = []
    for node in result:
        node_label = node.node_number + "_testName"
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

# will return all the nodes and the edges TODO
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
        return render.index()

    def POST(self): 
        print 'post index'
        return


# To Render the Crowds Analyzing Page
class Analyzing:
    def GET(self):
        return render.analyzing()

# To Render the Wisdom Calculating Page
class Calculating:
    def GET(self):
        return render.calculating()

# To Render the Questions Publishing Page
class Publishing:
    def GET(self):
        return render.publishing()

# TO Render the Questions Answered Page
class Answered:
    def GET(self):
        return render.answered()

class Others:
    def GET(self,other): 
        if other == 'index.html':
            return render.index()
        elif other == 'contact.html':
            return render.contact()
        elif other == 'about.html':
            return render.about()
        elif other == 'springydemo.html':
            return render.springydemo()

    def POST(self):
        print 'post self'
        return
 

