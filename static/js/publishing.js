jQuery.noConflict();

//document.ready() function!
jQuery(function(){
	change_active_nav();

    jQuery('#publishing_textarea').keyup(monitor_textarea);

    var canvas_html = jQuery('#publishing_left').html();
    init_nodes();

    publishing_show_users_btn(canvas_html);
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
                    var node = new_graph.newNode({label: nodes_list[i].node_number, name: nodes_list[i].node_label, confidence: nodes_list[i].node_confidence, chosen: nodes_list[i].node_chosen});
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
 
    var springy = jQuery('#publishing_canvas').springy({
            graph: new_graph,
            stiffness: 50,
            repulsion: 140,
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


function publishing_show_users_btn(canvas_html) {
    jQuery('#publishing_show_btn').click(function() {
        jQuery('#publishing_left').html(canvas_html);
        var first_tab_div = jQuery("#publishing_user_tab1").clone();
        var li_before = jQuery('#publishing_user_ul').find('li').first().clone();
        // first clear the users part
        jQuery('#publishing_user_tab_div').html(first_tab_div);
        jQuery('#publishing_user_ul').html(li_before);

        // here post_data is just for demo
        // 0 means payment_method == 'Pay s you go' and will use the pay as you go and budget
        // 1 means 'Market' and confidence should be larger than 0.9
        // 2 means 'Market' and confidence should be larget than 0.8
	    var post_data = "";
        var payment_method = "Market";
        if (jQuery('#tab_market').hasClass('active')) {
            payment_method = "Market";
        } else {
            payment_method = "Pay as you go";
        }
        if (payment_method == 'Market') {
            post_data = jQuery('#publishing_confidence_input').val();
        } else {
            post_data = jQuery("#publishing_budget_input").val();         // use the Pay as You go
        }
	    jQuery.ajax({
            url: 'publishing_show_users',
		    type: 'POST',
            data: {signal: post_data, payment: payment_method},
            dataType: 'json',
		    success: function(data){
                // will show user graph in the left first
                var new_graph = new Graph();
                var nodes_key_value_list = new Array();
                graph_nodes_list = data.graph_nodes_list;
                edges_list = data.edges_list;
                for (var i = 0; i < graph_nodes_list.length; i++) {
                    var node = new_graph.newNode({label: graph_nodes_list[i].node_number, name: graph_nodes_list[i].node_label, confidence: graph_nodes_list[i].node_confidence, chosen: graph_nodes_list[i].node_chosen});
                    nodes_key_value_list[graph_nodes_list[i].node_number] = node;
                }
                for (var i = 0; i < edges_list.length; i++) {
					var col = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 156)) + ',' + (Math.floor(Math.random() * 256)) + ')';
					var edge_data = {color: col};
                    new_graph.newEdge(nodes_key_value_list[edges_list[i].follower], nodes_key_value_list[edges_list[i].node], edge_data);
                }

                var springy = jQuery('#publishing_canvas').springy({
                    graph: new_graph,
                    stiffness: 50,
                    repulsion: 140,
                    damping: 0.6
                });


                // show right bottom users
                var nodes_list = data.nodes_list;
                // user_number: means that how many users are recommended
                var user_number = nodes_list.length;
                // tab_number means that how many tabs are needed to show the users
                var tab_number = Math.ceil(user_number/3);
                var last_tab_user_number = user_number%3;
        
                // below is to change the content of the first tab
                var first_tab_tbody = jQuery("#publishing_user_tbody_1");
                var first_tab_tbody_first_tr = first_tab_tbody.find('tr').first();
                var first_tab_tbody_second_tr = first_tab_tbody_first_tr.next();
                var first_tab_tboby_third_tr = first_tab_tbody_second_tr.next();
                first_tab_tbody_first_tr.find('td').first().text(nodes_list[0].node_num);
                first_tab_tbody_first_tr.find('td').first().next().find('img').attr('src', nodes_list[0].node_pic);
                first_tab_tbody_first_tr.find('td').first().next().next().text('@' + nodes_list[0].node_name);
                first_tab_tbody_first_tr.find('td').first().next().next().next().text(nodes_list[0].node_confidence);
                first_tab_tbody_second_tr.find('td').first().text(nodes_list[1].node_num);
                first_tab_tbody_second_tr.find('td').first().next().find('img').attr('src', nodes_list[1].node_pic);
                first_tab_tbody_second_tr.find('td').first().next().next().text('@' + nodes_list[1].node_name);
                first_tab_tbody_second_tr.find('td').first().next().next().next().text(nodes_list[1].node_confidence);
                first_tab_tboby_third_tr.find('td').first().text(nodes_list[2].node_num);
                first_tab_tboby_third_tr.find('td').first().next().find('img').attr('src', nodes_list[2].node_pic);
                first_tab_tboby_third_tr.find('td').first().next().next().text('@' + nodes_list[2].node_name);
                first_tab_tboby_third_tr.find('td').first().next().next().next().text(nodes_list[2].node_confidence);

                var tab_div_clone = first_tab_div.clone();
                var before_tab_div = first_tab_div;
                tab_div_clone.removeClass('active');

        // this for belong to the jQuery.ajax part
        for (var i = 1; i < tab_number; i++) {
            // j is the index of nodes_list[]
            // just to get one node from the nodes_list
            var j = 3 + (i-1) * 3;
            if (i != tab_number -1) {
                var tab_n = i + 1;
                var tab_div_id = "publishing_user_tab" + tab_n;
                var tbody_id = "publishing_user_tbody_" + tab_n;
                tab_div_clone.attr('id', tab_div_id);
                var tab_tbody = tab_div_clone.find('tbody');
                tab_tbody.attr('id', tbody_id);
                 /*below is to change the content of the current tab*/
                var tab_tbody_first_tr = tab_tbody.find('tr').first();
                var tab_tbody_second_tr = tab_tbody_first_tr.next();
                var tab_tboby_third_tr = tab_tbody_second_tr.next();
                tab_tbody_first_tr.find('td').first().text(nodes_list[j].node_num);
                tab_tbody_first_tr.find('td').first().next().find('img').attr('src', nodes_list[j].node_pic);
                tab_tbody_first_tr.find('td').first().next().next().text(nodes_list[j].node_name);
                tab_tbody_first_tr.find('td').first().next().next().next().text(nodes_list[j].node_confidence);
                tab_tbody_second_tr.find('td').first().text(nodes_list[j+1].node_num);
                tab_tbody_second_tr.find('td').first().next().find('img').attr('src', nodes_list[j+1].node_pic);
                tab_tbody_second_tr.find('td').first().next().next().text(nodes_list[j+1].node_name);
                tab_tbody_second_tr.find('td').first().next().next().next().text(nodes_list[j+1].node_confidence);
                tab_tboby_third_tr.find('td').first().text(nodes_list[j+2].node_num);
                tab_tboby_third_tr.find('td').first().next().find('img').attr('src', nodes_list[j+2].node_pic);
                tab_tboby_third_tr.find('td').first().next().next().text(nodes_list[j+2].node_name);
                tab_tboby_third_tr.find('td').first().next().next().next().text(nodes_list[j+2].node_confidence);

                tab_div_clone.insertAfter(before_tab_div);
                before_tab_div = tab_div_clone;
                tab_div_clone = tab_div_clone.clone();

                 /*below is to add the control part (ul --> li)*/
                var li_clone = li_before.clone();
                li_clone.removeClass('active');
                li_clone.find('a').attr('href', '#publishing_user_tab'+tab_n);
                li_clone.find('a').text(tab_n);
                li_clone.insertAfter(li_before);
                li_before = li_clone;
            } else {
                  /*when dealing with the last tab*/
                var tab_n = i + 1;
                var tab_div_id = "publishing_user_tab" + tab_n;
                var tbody_id = "publishing_user_tbody_" + tab_n;
                tab_div_clone.attr('id', tab_div_id);
                var tab_tbody = tab_div_clone.find('tbody');
                tab_tbody.attr('id', tbody_id);
                var tab_tbody_tr = tab_tbody.find('tr').first();
                 /*below is to change the content of the current tab*/
                for (var i = 0; i < 3; i++) {
                    if (i < last_tab_user_number) {
                        tab_tbody_tr.find('td').first().text(nodes_list[j+i].node_num);
                        tab_tbody_tr.find('td').first().next().find('img').attr('src', nodes_list[j+i].node_pic);
                        tab_tbody_tr.find('td').first().next().next().text(nodes_list[j+i].node_name);
                        tab_tbody_tr.find('td').first().next().next().next().text(nodes_list[j+i].node_confidence);
                        tab_tbody_tr = tab_tbody_tr.next();
                    } else {
                        tab_tbody_tr_next = tab_tbody_tr.next();
                        tab_tbody_tr.remove();
                        tab_tbody_tr = tab_tbody_tr_next; 
                    }
                };
                tab_div_clone.insertAfter(before_tab_div);
                
                 /*below is to add the control part (ul --> li)*/
                var li_clone = li_before.clone();
                li_clone.removeClass('active');
                li_clone.find('a').attr('href', '#publishing_user_tab'+tab_n);
                li_clone.find('a').text(tab_n);
                li_clone.insertAfter(li_before);
                li_before = li_clone;
            }  // end of else
        };      // end of for , belongs to the jQuery.ajax() part

            }   // end of success: function(data){
		});
    });
}


function publishing_publish_question() {
    jQuery("#publishing_publish_btn").click(function(){
        var question = jQuery("#publishing_textarea").val();
        var payment_method = "market";
        jQuery("#publishing_textarea").val('');
        jQuery("#publishing_question_show_textarea").text(question);
        if (jQuery('#tab_market').hasClass('active')) {
            payment_method = "Market";
        } else {
            payment_method = "Pay as you go";
        }
	    jQuery.ajax({
            url: 'publish_question',
		    type: 'POST',
            data: {question: question, payment_method: payment_method},
            dataType: 'json',
		    success: function(){
            }
		});
    });
}

