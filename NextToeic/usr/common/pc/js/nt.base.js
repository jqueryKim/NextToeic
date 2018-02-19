'use strict';

var $window,
	$body,
	set_ui,
	AgentFlag,
	browser,
	get_version_of_IE,
	individual_case,
	getObjLength,
	site_guide_width;

$window = $(window);

set_ui = function(){ // device check
	var UserAgent = navigator.userAgent;
	var UserFlag  = true;
	if (UserAgent.match(/iPhone|iPad|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) !== null || UserAgent.match(/LG|SAMSUNG|Samsung/) !== null)
	{
		//mobile!!
		UserFlag = false;
	}
	return UserFlag;
}

AgentFlag = set_ui();

browser = {
	ie : false,
	opera : false,
	chrome : false,
	firefox : false,
	safari : false
}

get_version_of_IE = function(){ // browser check
	var word;
	var version = "N/A";

	var agent = navigator.userAgent.toLowerCase();
	var name = navigator.appName;
	if(name == "Microsoft Internet Explorer") word = "msie ";

	else {
		// IE 11
		if(agent.search("trident") > -1) word = "trident/.*rv:";

		// Microsoft Edge
		else if(agent.search("edge/") > -1) word = "edge/";

		// Opera
		else if(agent.search("opr") > -1) word = "opera";

		// Chrome
		else if(agent.search("chrome") > -1) word = "chrome";

		// Firefox
		else if(agent.search("firefox") > -1) word = "firefox";

		// Safari
		else word = "safari";
	}

	if(word == "edge/" || word == "trident/.*rv:") browser.ie = true;
	else eval("browser."+word+"=true");

	var reg = new RegExp( word + "([0-9]{1,})(\\.{0,}[0-9]{0,1})");

	if(reg.exec(agent) != null){
		version = RegExp.$1 + RegExp.$2;
	}

	return version;
}

individual_case = function(){
	var verNum = parseInt(get_version_of_IE());

	if (isNaN(verNum) || verNum >= 9) {
		// ie9
	}else{

	}
}

$(document).ready(function(){
	site_guide_width = 1154; // 가이드 width값
	if( $(document).outerHeight() > $window.outerHeight() ){
		site_guide_width = site_guide_width - 17; // scroll width 17px sum
	}

	individual_case(); // document
	if(browser.chrome){
		console.log('%cNEXT TOEIC by - Pagoda', 'font-family:verdana;font-size:15px;color:#fff;line-height:1.35;padding:1px 5px 2px;border-radius:3px;background:#315bbf;');
	}else{
		//console.log('NEXT TOEIC by - Pagoda')
	}

	$window.on('scroll', function(){
		var win_pos,
			win_pos_left,
			win_width;

		win_pos = $(this).scrollTop();
		win_pos_left = $(this).scrollLeft();
		win_width = $(this).outerWidth();

		layout.init(win_pos);

		if(win_pos_left > 0){
			layout.col_init(win_pos_left, win_width);
		}else{
			layout.col_init(0, win_width);
		}

		if(chart_circle.items.length > 0){
			chart_circle.call(win_pos);
		}

		if(r_banner.wrap.length > 0){
			r_banner.init(win_pos);
		}
	});

	$window.on('load',function(){
		layout.init($window.scrollTop());
		if(chart_circle.items.length > 0){
			chart_circle.call($window.scrollTop());
		}
	});

	$window.on('resize',function(){
		var win_pos,
			win_pos_left,
			win_width;

		win_pos = $window.scrollTop();
		win_pos_left = $window.scrollLeft();
		win_width = $(window).outerWidth(true);
		layout.resize_init(win_pos, win_pos_left, win_width);
	});

});
