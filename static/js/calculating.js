jQuery.noConflict();

//document.ready() function!
jQuery(function(){
	change_active_nav();
    init_nodes('#calculating_canvas');
    calculating_calculate_btn();
    calculating_clear_btn();
});


//calculating.html:	chang the nav-collapse active state
function change_active_nav(){
	jQuery('#nav_home_id').parent().find('li').removeClass('active');
	jQuery('#nav_calculating_id').addClass('active');
} 


function init_nodes(canvas) {
	var graph = new Graph();

	var nodes_list = new Array();
	var nodes = new Array();
//	nodes_list = [{label:'Swarm', con:'1'}, {label: 'Benben', con:'2'}, {label:'james', con:'3'}];
	for(var i = 0; i < 38; i++) {
		var default_node = {label: 'default', con: '1', chosen: 0}
		default_node.label = "default_"+ i + "";
		default_node.con = i;
		nodes_list.push(default_node);
	}

	for (var i = 0; i < nodes_list.length; i++) {
		var new_node = graph.newNode({label: nodes_list[i].label, con: nodes_list[i].con, chosen: nodes_list[i].chosen});
		nodes.push(new_node);
	}

	for (var i = 1; i < nodes.length; i++) {
		graph.newEdge(nodes[0], nodes[i]);
	}		

    var springy = jQuery(canvas).springy({
            graph: graph,
            stiffness: 200,
            repulsion: 400,
            damping: 0.7
            });
}

function calculating_calculate_btn() {
    jQuery('#calculate_btn').click(function(){
        jQuery('#calculating_sidebar_confidence_cost').hide().fadeIn(1000);
    });
}

function calculating_clear_btn() {
    jQuery('#clear_btn').click(function() {
        location.reload();
/*      //the reason I use location.reload is that there is still some problem with the canvas springy, 
 *      //god, i guess I will handle this until very later
        //here I use two sentences is for different browsers
        jQuery('#calculating_textarea').val("");
        jQuery('#calculating_textarea').text("");*/
    });
}
