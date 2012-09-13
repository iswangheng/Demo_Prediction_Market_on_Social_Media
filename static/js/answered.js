jQuery.noConflict();

//document.ready() function!
jQuery(function(){
	change_active_nav();

    var canvas_html = jQuery('#answered_left').html();
    init_nodes('1');
    /*show_questions_answer();*/

    // Create and populate the data table.
        var data = google.visualization.arrayToDataTable([
          ['Task', 'Show Answer'],
          ['Yes', 5],
          ['No', 2]
        ]);
        var chartArea = {left: 20, width:"100%", height:"75%"};
        var options = {
          title: 'The Answer to the Question 1',
          is3D: 'true',
          chartArea: chartArea,
          fontSize: 14,
          backgroundColor: '#eef',
        };

    drawAnsweredGraph(data, options);
    userClickQuestion(canvas_html);
});


//answered.html:	chang the nav-collapse active state
function change_active_nav(){
	jQuery('#nav_home_id').parent().find('li').removeClass('active');
	jQuery('#nav_answered_id').addClass('active');
} 


function init_nodes(question_number) {
    var new_graph = new Graph();
	// here post_data stroes the question_num 
	var post_data = question_number;
    /*var new_graph = new Graph();*/
    var nodes_key_value_list = new Array();
	jQuery.ajax({
        url: 'show_answered_nodes',
		type: 'POST',
        data: {question_num: post_data},
        dataType: 'json',
		success: function(data){
                nodes_list = data.nodes_list;
                edges_list = data.edges_list;
                for (var i = 0; i < nodes_list.length; i++) {
                    var node = new_graph.newNode({label: nodes_list[i].node_label_answered, name: nodes_list[i].node_label, confidence: nodes_list[i].node_confidence, chosen: nodes_list[i].node_chosen, answer: nodes_list[i].node_answer});
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
 
    var springy = jQuery('#answered_canvas').springy({
            graph: new_graph,
            stiffness: 50,
            repulsion: 140,
            damping: 0.6
            });
}


function drawAnsweredGraph(data, options) {
        /*var chartArea = {left: 20, width:"100%", height:"75%"};*/
        /*var options = {
          title: 'The Answer to the Question',
          is3D: 'true',
          chartArea: chartArea,
          fontSize: 14,
          backgroundColor: '#eef',
        };*/

        // Create and draw the visualization.
        var chart = new google.visualization.PieChart(document.getElementById('answered_graph_div'));
        chart.draw(data, options);
}


function show_questions_answer(){
	var post_data = "show_questions_answer";
	jQuery.ajax({
        url: 'show_questions_answer',
		type: 'POST',
        data: {signal: post_data},
        dataType: 'json',
		success: function(data){
                }
		});
}


function userClickQuestion(canvas_html) {
    jQuery('.answered_question').click(function() {
		jQuery('#answered_left').html(canvas_html);
        if (jQuery(this).next().val() == 1) {
			var new_data = [['Task','Show Aadsnswer'], ['Yes', 5], ['No', 2]];
			var data_new = google.visualization.arrayToDataTable(new_data);
			var chartArea = {left: 20, width:"100%", height:"75%"};
			var new_options = {
				title: 'The Answer to the Question 1',
				is3D: 'true',
				chartArea: chartArea,
				fontSize: 14,
				backgroundColor: '#eef',
			};
			drawAnsweredGraph(data_new, new_options);

			init_nodes('1');
			jQuery('#answered_confidence').text('0.901');
			jQuery('#answered_cost').text('5.169');
			jQuery('#answered_total_result_div').hide().fadeIn(500);
		} else if (jQuery(this).next().val() == 2){
			var new_data = [['Task','Show Answer'], ['Yes', 3], ['No', 2]];
			var data_new = google.visualization.arrayToDataTable(new_data);
			var chartArea = {left: 20, width:"100%", height:"75%"};
			var new_options = {
				title: 'The Answer to the Question 2',
				is3D: 'true',
				chartArea: chartArea,
				fontSize: 14,
				backgroundColor: '#eef',
			};
			drawAnsweredGraph(data_new, new_options);

			init_nodes('2');

			jQuery('#answered_confidence').text('0.803');
			jQuery('#answered_cost').text('3.648');
			jQuery('#answered_total_result_div').hide().fadeIn(500);
		} else {
			var new_data = [['Task','Show Answer'], ['Yes', 1], ['No', 2]];
			var data_new = google.visualization.arrayToDataTable(new_data);
			var chartArea = {left: 20, width:"100%", height:"75%"};
			var new_options = {
				title: 'The Answer to the Question 3',
				is3D: 'true',
				chartArea: chartArea,
				fontSize: 14,
				backgroundColor: '#eef',
			};
			drawAnsweredGraph(data_new, new_options);

			init_nodes('3');

			jQuery('#answered_payment_method').text('Pay as you go');
			jQuery('#answered_confidence').text('0.947');
			jQuery('#answered_cost').text('1.72');
			jQuery('#answered_total_result_div').hide().fadeIn(500);
		}
    });
}
