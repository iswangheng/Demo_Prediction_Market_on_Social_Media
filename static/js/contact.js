jQuery.noConflict();

//document.ready() function!
jQuery(function(){
	change_active_nav();
});


//analyzing.html:	chang the nav-collapse active state
function change_active_nav(){
	jQuery('#nav_home_id').parent().find('li').removeClass('active');
	jQuery('#nav_contact_id').addClass('active');
} 

