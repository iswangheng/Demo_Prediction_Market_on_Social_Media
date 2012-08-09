jQuery.noConflict();

//document.ready() function!
jQuery(function(){
	change_active_nav();
    jQuery('#publishing_textarea').keyup(monitor_textarea);
    publishing_show_users();
    publishing_publish_question();
});


//publishing.html:	chang the nav-collapse active state
function change_active_nav(){
	jQuery('#nav_home_id').parent().find('li').removeClass('active');
	jQuery('#nav_publishing_id').addClass('active');
} 


function init_nodes() {
	var springy = jQuery('#analyzing_canvas').springy({
			graph: graph,
			stiffness: 200,
			repulsion: 400,
			damping: 0.7
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
