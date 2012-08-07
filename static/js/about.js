jQuery.noConflict();

//document.ready() function!
jQuery(function(){
	change_active_nav();
	init_nodes();

});


//analyzing.html:	chang the nav-collapse active state
function change_active_nav(){
	jQuery('#nav_home_id').parent().find('li').removeClass('active');
	jQuery('#nav_about_id').addClass('active');
} 


function init_nodes() {
	var springy = jQuery('#analyzing_canvas').springy({
			graph: graph,
			stiffness: 200,
			repulsion: 400,
			damping: 0.7
			});
}
