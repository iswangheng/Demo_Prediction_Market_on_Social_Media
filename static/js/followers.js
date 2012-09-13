
jQuery.noConflict();

//document.ready() function!
jQuery(function(){
	change_active_nav();

    show_user_followers();
});


//followers.html:	change the nav-collapse active state
function change_active_nav(){
	jQuery('#nav_home_id').parent().find('li').removeClass('active');
	jQuery('#nav_followers_id').addClass('active');
} 


function show_user_followers() {
    var post_data = "show_user_followers";
	jQuery.ajax({
		url: 'show_user_followers',
		type: 'POST',
		data: {signal: post_data},
		dataType: 'json',
		success: function(data) {
            display_user_followers(data.followers_list);

		}
	});
	return false;
}


// called by show_user_followers(), just to display the user's followers
function display_user_followers(followers_list) {
    var before = jQuery("#followers_tr_1");
    var before_user_pic = before.find('td').first();
    var before_user_screen_name = before_user_pic.next();
    var before_user_tweet = before_user_screen_name.next();
    before_user_pic.find('img').attr('src', followers_list[0].user_pic);
	before_user_screen_name.html("<a target ='_blank' href=http://twitter.com/"+ followers_list[0].user_screen_name+" >@" + followers_list[0].user_screen_name + "</a>");
    before_user_tweet.text(followers_list[0].latest_tweet);
    
    for (var i = 1; i < followers_list.length; i++) {
        var tr_clone = before.clone();
		var td_items_pic = tr_clone.find('td').first();
        var td_items_screen_name = td_items_pic.next();
        var td_items_tweet = td_items_screen_name.next();
        td_items_pic.find('img').attr('src', followers_list[i].user_pic);
	    td_items_screen_name.html("<a target ='_blank' href=http://twitter.com/"+ followers_list[i].user_screen_name+" >@" + followers_list[i].user_screen_name + "</a>");
        td_items_tweet.text(followers_list[i].latest_tweet);
        tr_clone.removeAttr('id');
        tr_clone.insertAfter(before);
        before = tr_clone;
    }
}


