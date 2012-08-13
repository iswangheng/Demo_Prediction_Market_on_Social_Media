jQuery.noConflict();

//document.ready() function!
jQuery(function(){
	change_active_nav();

    var canvas_html = jQuery('#publishing_left').html();
    init_nodes();


    // Create and populate the data table.
        var data = google.visualization.arrayToDataTable([
          ['Task', 'Show Answer'],
          ['Yes', 11],
          ['No', 14]
        ]);


    drawAnsweredGraph(data);
    userClickQuestion();
});


//answered.html:	chang the nav-collapse active state
function change_active_nav(){
	jQuery('#nav_home_id').parent().find('li').removeClass('active');
	jQuery('#nav_answered_id').addClass('active');
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
 
    var springy = jQuery('#answered_canvas').springy({
            graph: new_graph,
            stiffness: 50,
            repulsion: 200,
            damping: 0.6
            });
}



function drawAnsweredGraph(data) {
        var chartArea = {left: 20, width:"100%", height:"75%"};

        var options = {
          title: 'The Answer to the Question',
          is3D: 'true',
          chartArea: chartArea,
          fontSize: 14,
          backgroundColor: '#eef',
        };
        // Create and draw the visualization.
        var chart = new google.visualization.PieChart(document.getElementById('answered_graph_div'));
        chart.draw(data, options);
}

function userClickQuestion() {
    jQuery('.answered_question').click(function() {
        alert(jQuery(this).next().val());
        var new_data = [['Task','Show Aadsnswer'], ['Yes', 3], ['No', 2]];
        var data_new = google.visualization.arrayToDataTable(new_data);
        drawAnsweredGraph(data_new);
    });
}
