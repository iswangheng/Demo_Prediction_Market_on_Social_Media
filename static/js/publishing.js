jQuery.noConflict();

//document.ready() function!
jQuery(function(){
	change_active_nav();

    jQuery('#publishing_textarea').keyup(monitor_textarea);

    var canvas_html = jQuery('#publishing_left').html();
    init_nodes();


    publishing_show_users();
    publishing_publish_question();
});


//publishing.html:	chang the nav-collapse active state
function change_active_nav(){
	jQuery('#nav_home_id').parent().find('li').removeClass('active');
	jQuery('#nav_publishing_id').addClass('active');
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
                    var node = new_graph.newNode({label: nodes_list[i].node_label, chosen: 0});
                    nodes_key_value_list[nodes_list[i].node_number] = node;
                }
                for (var i = 0; i < edges_list.length; i++) {
                    new_graph.newEdge(nodes_key_value_list[edges_list[i].follower], nodes_key_value_list[edges_list[i].node]);
                }
               			}
		}).done(function() {
                //TODO
			});
 
    var springy = jQuery('#publishing_canvas').springy({
            graph: new_graph,
            stiffness: 50,
            repulsion: 200,
            damping: 0.6
            });
}


//publishing.html:	monitor the publishing_textarea for word counter
function monitor_textarea(){
	var maxLength = 140;
	var textareaVal = jQuery('#publishing_textarea').val().replace(/^\s*|\s*$/g,'');
	if(jQuery('#publishing_textarea').val().length > maxLength) {
		jQuery('#publishing_textarea').val(jQuery('#publishing_textarea').val().substring(0,maxLength));	
		jQuery('#publishing_textarea_input_counter').css({'background-color': '#E00000'});
	} else {	
		jQuery('#publishing_textarea_input_counter').css({'background-color': 'transparent'});
		var leftwords = maxLength - jQuery('#publishing_textarea').val().length;
		jQuery('#publishing_textarea_input_counter').val(leftwords);
	}
} 

function publishing_publish_question() {
    jQuery("#publishing_publish_btn").click(function(){
        var question = jQuery("#publishing_textarea").val();
        jQuery("#publishing_textarea").val('');
        jQuery("#publishing_question_show_textarea").text(question);
    });
}

function publishing_show_users() {
    jQuery('#publishing_show_btn').click(function() {
        jQuery('#publishing_user_1').text('test user');
    });
}
