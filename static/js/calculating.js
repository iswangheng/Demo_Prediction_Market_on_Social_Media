jQuery.noConflict();

//document.ready() function!
jQuery(function(){
	change_active_nav();
    var canvas_html = jQuery('#calculating_left').html();

    init_nodes();
    calculating_calculate_btn();
    calculating_clear_btn(canvas_html);
});


//calculating.html:	chang the nav-collapse active state
function change_active_nav(){
	jQuery('#nav_home_id').parent().find('li').removeClass('active');
	jQuery('#nav_calculating_id').addClass('active');
} 


function init_nodes() {
    var new_graph = new Graph();
	var post_data = "show_nodes_from_server";
    /*var new_graph = new Graph();*/
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
                    var node = new_graph.newNode({label: nodes_list[i].node_number, name: nodes_list[i].node_label, confidence: nodes_list[i].node_confidence, chosen: 0});
                    nodes_key_value_list[nodes_list[i].node_number] = node;
                }
                for (var i = 0; i < edges_list.length; i++) {
					var col = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 156)) + ',' + (Math.floor(Math.random() * 256)) + ')';
					var edge_data = {color: col};
                    new_graph.newEdge(nodes_key_value_list[edges_list[i].follower], nodes_key_value_list[edges_list[i].node], edge_data);
                }
               			}
		}).done(function() {
                //TODO
			});
 
    var springy = jQuery('#calculating_canvas').springy({
            graph: new_graph,
            stiffness: 50,
            repulsion: 140,
            damping: 0.6
            });
}

function calculating_calculate_btn() {
    jQuery('#calculate_btn').click(function(){
        var users_selected_str = jQuery("#calculating_textarea").val();
        jQuery.ajax({
            url: "crowds_analyzing_calculating",
            type: 'POST',
            data: {signal: users_selected_str},
            dataType: 'json',
            success: function(data) {
                jQuery('#publishing_market_confidence_input').val(data.confidence);
                jQuery('#publishing_market_cost_input').val(data.market_cost);
                jQuery('#publishing_pay_confidence_input').val(data.confidence);
                jQuery('#publishing_pay_cost_input').val(data.pay_cost);
                jQuery('#calculating_sidebar_confidence_cost').hide().fadeIn(1000);
            }
        });
    });
}

function calculating_clear_btn(canvas_html) {
    jQuery('#clear_btn').click(function() {
        //here I use two sentences is for different browsers
        jQuery('#calculating_textarea').val("");
        jQuery('#calculating_textarea').text("");
        jQuery('#calculating_left').html("");
        jQuery('#calculating_left').html(canvas_html);
        init_nodes();
    });
}
