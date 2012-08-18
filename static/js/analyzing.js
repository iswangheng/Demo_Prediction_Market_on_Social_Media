jQuery.noConflict();

//document.ready() function!
jQuery(function(){
	change_active_nav();

    var new_graph = new Graph();
    var canvas_html = jQuery('#analyzing_left').html();
    new_graph = get_new_graph();
	new_nodes(new_graph);

	jQuery('#graph_structure_li').click(function() {
        jQuery('#analyzing_left').html("");
        jQuery('#analyzing_left').html(canvas_html);
		new_graph = get_new_graph();
        jQuery("#analyzing_user_tbody").hide().fadeIn(1000);
        new_nodes(new_graph);
	});

    jQuery('#historical_records_li').click(function() {
		var analyzing_left_user_tweets = jQuery("#analyzing_left_user_tweets").clone();
		analyzing_left_user_tweets.attr('id', '#analyzing_left_user_tweets_clone');
		analyzing_left_user_tweets.removeClass('make_it_hidden');
        jQuery('#analyzing_left').html(analyzing_left_user_tweets);
		show_user_confidence_by_historical();
		// TODO get_user_tweets('haibilly') smells bad coz it is not configurable
		get_user_tweets('haibilly');
        jQuery("#analyzing_user_tbody").hide().fadeIn(500);
    });
});


//analyzing.html:	chang the nav-collapse active state
function change_active_nav(){
	jQuery('#nav_home_id').parent().find('li').removeClass('active');
	jQuery('#nav_analyzing_id').addClass('active');
} 


// will show user confidence in the sidebar
// which_one means is it based on "graph structure" or "historical records"
function show_user_confidence(nodes_list, which_one) {
    var before = jQuery("#analyzing_user_1");
    var before_first_td = before.find('td').first();
	var before_user_pic = before_first_td.next();
    var before_user_screen_name = before_user_pic.next();
    var before_user_confidence = before_user_screen_name.next();
	before_first_td.text(nodes_list[0].node_number);
    before_user_pic.find('img').attr('src', nodes_list[0].node_pic);
	if(which_one == 'graph'){
		before_user_screen_name.html("<a target ='_blank' href=http://twitter.com/"+ nodes_list[0].node_label +" class='analyzing_user_sidebar_username'>@" + nodes_list[0].node_label + "</a>");
	} else {
		before_user_screen_name.html("<a href='#' class='analyzing_user_sidebar_username'>@" + nodes_list[0].node_label + "</a>");
	}
    before_user_confidence.text(nodes_list[0].node_confidence);
    for (var i = 1; i < nodes_list.length; i++) {
        var tr_clone = before.clone();
		var td_items_number = tr_clone.find('td').first();
        var td_items_first = td_items_number.next();
        var td_items_second = td_items_first.next();
        var td_items_third = td_items_second.next();
		td_items_number.text(nodes_list[i].node_number);
        td_items_first.find('img').attr('src', nodes_list[i].node_pic);

		if(which_one == 'graph'){
			td_items_second.html("<a target ='_blank' href=http://twitter.com/"+ nodes_list[i].node_label +" class='analyzing_user_sidebar_username'>@" + nodes_list[i].node_label + "</a>");
		} else {
			td_items_second.html("<a href='#' class='analyzing_user_sidebar_username'>@" + nodes_list[i].node_label + "</a>");
		}
        td_items_third.text(nodes_list[i].node_confidence);
        tr_clone.removeAttr('id');
        tr_clone.insertAfter(before);
        before = tr_clone;
    }
    jQuery("#analyzing_user_tbody").hide().fadeIn(1000);
	if(which_one == 'historical') {
		jQuery(".analyzing_user_tr").find('td').next().click(function() {
			var screen_name = jQuery(this).text().substring(1)
			get_user_tweets(screen_name);
		}); 
	}
}


function get_new_graph() {
    var new_graph = new Graph();
	var post_data = "show_nodes_from_server";
    var nodes_key_value_list = new Array();
	jQuery.ajax({
        url: 'show_nodes_from_server',
		type: 'POST',
        data: {signal: post_data},
        dataType: 'json',
		success: function(data){
                nodes_list = data.nodes_list;
                edges_list = data.edges_list;
                for (var i = 0; i < nodes_list.length; i++) {
                    var node = new_graph.newNode({label: nodes_list[i].node_number, confidence: nodes_list[i].node_confidence, chosen: 0});
                    nodes_key_value_list[nodes_list[i].node_number] = node;
                }
                for (var i = 0; i < edges_list.length; i++) {
					var col = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 156)) + ',' + (Math.floor(Math.random() * 256)) + ')';
					var edge_data = {color: col};
                    new_graph.newEdge(nodes_key_value_list[edges_list[i].follower], nodes_key_value_list[edges_list[i].node], edge_data);
                }
                show_user_confidence(data.nodes_list, 'graph');
            }
		});
    return new_graph;
}

function new_nodes(new_graph) {
    jQuery('#analyzing_canvas').springy({
        graph: new_graph,
        stiffness: 48,
        repulsion: 100,
        damping: 0.6
        });
}


function show_user_tweets(user_screen_name, tweets_list) {
	var before = jQuery("#analyzing_user_tweets_1");
    var before_user_screen_name = before.find('td').first();
    var before_user_tweet = before_user_screen_name.next();
    before_user_screen_name.text("@" + user_screen_name);
    before_user_tweet.text(tweets_list[0].tweet_text);
    for (var i = 1; i < tweets_list.length; i++) {
        var tr_clone = before.clone();
        var td_items_first = tr_clone.find('td').first();
        var td_items_second = td_items_first.next();
        td_items_first.text("@" + user_screen_name);
        td_items_second.text(tweets_list[i].tweet_text);
        tr_clone.removeAttr('id');
        tr_clone.insertAfter(before);
        before = tr_clone;
    }
    jQuery("#analyzing_user_tweets_tbody").hide().fadeIn(300);
}

// will get user tweets from the server
function get_user_tweets(user_screen_name) {
	var post_data = user_screen_name;
	jQuery.ajax({
		url: 'get_user_tweets',
		type: 'POST',
		data: {signal: post_data},
		dataType: 'json',
		success: function(data) {
			show_user_tweets(user_screen_name, data.tweets_list);
		}
	});
	return false;
}


function show_user_confidence_by_historical() {
	var post_data = "show_nodes_historical_confidence";
	jQuery.ajax({
        url: 'show_nodes_historical_confidence',
		type: 'POST',
        data: {signal: post_data},
        dataType: 'json',
		success: function(data){
                show_user_confidence(data.nodes_list, 'historical');
            }
		});
	return false;	
}
