jQuery.noConflict();

//document.ready() function!
jQuery(function(){
	change_active_nav();

	new_nodes();
	jQuery('#graph_structure_li').click(function() {
        /*location.reload();*/
        new_nodes();
	});
});


//analyzing.html:	chang the nav-collapse active state
function change_active_nav(){
	jQuery('#nav_home_id').parent().find('li').removeClass('active');
	jQuery('#nav_analyzing_id').addClass('active');
} 

function new_nodes() {
	var post_data = "show_nodes_from_server";
    var new_graph = new Graph();
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
                jQuery('#analyzing_canvas').springy({
                    graph: new_graph,
                    stiffness: 100,
                    repulsion: 200,
                    damping: 0.7
                });
			}
		}).done(function() {
                //TODO
			});
    return false;
}
