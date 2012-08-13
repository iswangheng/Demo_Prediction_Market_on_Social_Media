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
        jQuery("#analyzing_user_tbody").hide().fadeIn(1000);
        new_nodes(new_graph);
	});

    jQuery('#historical_records_li').click(function() {
        jQuery('#analyzing_left').html("");
    });
});


//analyzing.html:	chang the nav-collapse active state
function change_active_nav(){
	jQuery('#nav_home_id').parent().find('li').removeClass('active');
	jQuery('#nav_analyzing_id').addClass('active');
} 


function show_user_confidence(nodes_list) {
    var before = jQuery("#analyzing_user_1");
    var before_first_td = before.find('td').first();
    var before_user_screen_name = before_first_td.next();
    var before_user_confidence = before_user_screen_name.next();
    before_first_td.find('img').attr('src', nodes_list[0].node_pic);
    before_user_screen_name.text("@" + nodes_list[0].node_label);
    before_user_confidence.text(nodes_list[0].node_confidence);
    for (var i = 1; i < nodes_list.length; i++) {
        var tr_clone = before.clone();
        var td_items_first = tr_clone.find('td').first();
        var td_items_second = td_items_first.next();
        var td_items_third = td_items_second.next();
        td_items_first.find('img').attr('src', nodes_list[i].node_pic);
        td_items_second.text("@" + nodes_list[i].node_label);
        td_items_third.text(nodes_list[i].node_confidence);
        tr_clone.removeAttr('id');
        tr_clone.insertAfter(before);
        before = tr_clone;
    }
    jQuery("#analyzing_user_tbody").hide().fadeIn(1000);
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
                    var node = new_graph.newNode({label: nodes_list[i].node_number, chosen: 0});
                    nodes_key_value_list[nodes_list[i].node_number] = node;
                }
                for (var i = 0; i < edges_list.length; i++) {
                    new_graph.newEdge(nodes_key_value_list[edges_list[i].follower], nodes_key_value_list[edges_list[i].node]);
                }
                show_user_confidence(data.nodes_list);
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
