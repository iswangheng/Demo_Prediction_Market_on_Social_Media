jQuery.noConflict();

//document.ready() function!
jQuery(function(){
	change_active_nav();
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
