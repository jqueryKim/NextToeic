'use strict';

var layout,
	omr,
	exam,
	ca_exam,
	nt_scroll,
	c_layer,
	weak,
	sort,
	c_tab,
	slide_items,
	slide_interv,
	intervals,
	per_num,
	chart_common,
	chart_circle,
	chart_scroll,
	sc_ai,
	jump,
	toast,
	memo,
	memo_object,
	memo_offset_x,
	memo_offset_y,
	byte_check,
	r_banner,
	scroll_block,
	leaning,
	bx,
	c_radio,
	voca,
	family,
	award;

layout = {
	wrap : $('#wrap'),
	init : function(pos){
		if(pos > 0){
			layout.wrap.addClass('fix-layout');
		}else{
			layout.wrap.removeClass('fix-layout');
		}

		if(omr.wrap.length > 0){
			omr.height_set(pos);
			exam.test_contents_set();
			//omr.position_set(pos);
		}

		if(ca_exam.wrap.length > 0){
			ca_exam.height_set(pos);
			ca_exam.ca_contents_set();
		}
	},
	col_init : function(pos, win_w){
		omr.position_set(pos, win_w);
		ca_exam.position_set(pos, win_w);
	},
	resize_init : function(pos, pos_col, win_w){
		if(omr.wrap.length > 0){
			omr.height_set(pos);
			omr.position_set(pos_col, win_w);
			exam.test_contents_set();
		}

		if(ca_exam.wrap.length > 0){
			ca_exam.height_set(pos);
			ca_exam.position_set(pos_col, win_w);
			ca_exam.ca_contents_set();
		}
	}
}

omr = {
	wrap : $('#omr-wrap'),
	contents : $('#omr-wrap .omr-card-contents'),
	title_ele : $('#omr-wrap .title-box'),
	foot_ele : $('#foot-nav'),
	items : $('#omr-wrap .omr-items'),
	items_trigger : $('#omr-wrap .omr-items .omr-radio input:radio'),
	height_set : function(pos){
		var head_tab,
			w_h,
			top_space,
			exception_h,
			this_top,
			sum_h;

		head_tab = $('.head-tab');
		if(head_tab.length > 0){ // head-tab이 있을경우 상단 여백높이
			if(pos > 0){ // scroll 값이 0 보다 클경우
				top_space = head_tab.outerHeight() + 63;
			}else{
				top_space = $('#header').outerHeight() + 86;
			}
		}else{
			if(pos > 0){ // scroll 값이 0 보다 클경우

			}else{

			}
		}

		w_h = $window.outerHeight();
		exception_h = omr.title_ele.outerHeight();
		sum_h = w_h - top_space - exception_h - 55;
		omr.contents.css('height',sum_h + 'px');
	},
	position_set : function(pos, win_w){
		if(win_w >= site_guide_width){
			omr.wrap.css('margin-left','290px');
		}else{
			omr.wrap.css('margin-left',-pos+'px');
		}
	},
	check_init : function(type){
		var radio_items;

		if(type == 'set'){
			radio_items = omr.items.find('input:radio');
		}else{
			radio_items = type.find('input:radio');
		}

		omr.items.find('.effect').removeClass('effect');

		radio_items.each(function(index){
			var checked,
				this_ele,
				this_parent_index,
				exam_answer_obj,
				this_exam_obj;

			checked = $(this).prop('checked');
			this_ele = $(this).closest('.omr-radio');
			this_parent_index = $(this).closest('.omr-items').attr('data-omr');
			exam_answer_obj = exam.wrap.find('.exam-items[data-exam="'+this_parent_index+'"]');

			if(checked){
				this_ele.addClass('checked')
				.addClass('effect');
				this_exam_obj = exam_answer_obj.find('li').eq(index);
				exam.omr_call(this_exam_obj, exam_answer_obj);
			}else{
				this_ele.removeClass('checked')
				.removeClass('effect');
			}
		});
	}
}

omr.items_trigger.on('click',function(){
	var this_ele;

	this_ele = $(this).closest('.omr-select');
	omr.check_init(this_ele);
});

if(omr.wrap.length > 0){
	omr.height_set($window.scrollTop());
}

exam = {
	wrap : $('.exams'),
	items : $('.exams .exam-items'),
	trigger : $('.exams .answer-items a'),
	state_trigger : $('.exams .answer-items .icon-state'),
	number_set : function(){
		if(exam.items.length > 1){
			exam.wrap.addClass('multi-exam');
		}
	},
	init : function(obj, ans){
		var exam_index,
			omr_item_obj,
			cons_index;

		exam_index = ans.attr('data-exam');
		omr_item_obj = omr.wrap.find('.omr-items[data-omr="'+exam_index+'"]');
		cons_index = obj.index();

		ans.find('li').removeClass('selected');
		obj.addClass('selected');
		omr_item_obj.find('input:radio').eq(cons_index).click();
		omr.check_init(omr_item_obj.find('.omr-select'));
	},
	omr_call : function(obj, ans){
		var exam_index,
			omr_item_obj,
			cons_index;

		exam_index = ans.attr('data-exam');
		cons_index = obj.index();

		// OMR 카드에서 체크한 경우는 제외처리를 초기화 하면서 선택된다.
		ans.find('li').removeClass('selected');
		obj
		.removeClass('earse')
		.addClass('selected');
	},
	init_state : function(obj_parent, obj_index, state){
		if(state == 'earse'){
			var earse_num,
				earse_len,
				auto_select_obj;

			obj_parent.find('.answer-items li').eq(obj_index).addClass(state);
			earse_num = obj_parent.find('.answer-items li.earse').length;
			earse_len = obj_parent.find('.answer-items li').length;

			if(earse_num == earse_len-1){
				auto_select_obj = obj_parent.find('.answer-items li').not('.earse');
				exam.init(auto_select_obj, obj_parent);
			}
		}else{
			obj_parent.find('.answer-items li').eq(obj_index).removeClass();
		}
	},
	test_contents_set : function(){
		var test_contents,
			test_contents_h,
			test_exams_h;

		test_contents = $('.test-contents');
		test_contents_h = test_contents.outerHeight();
		test_exams_h = omr.wrap.outerHeight();

		if(test_contents_h < test_exams_h){
			test_contents.css('min-height',test_exams_h+'px');
		}

	}
}

if(exam.items.length > 0){
	exam.number_set();
}

exam.trigger.on('click',function(){
	var this_obj,
		this_ans,
		this_class;

	this_obj = $(this).closest('li');
	this_class = this_obj.attr('class');
	if(!this_class){
		this_ans = this_obj.closest('.exam-items');
		exam.init(this_obj, this_ans);
	}

	return false;
});

exam.state_trigger.on('click',function(){
	var this_exam,
		this_li,
		this_class,
		this_index;

	this_exam = $(this).closest('.exam-items');
	this_li =  $(this).closest('li');
	this_class =this_li.attr('class');
	this_index = this_li.index();

	if(this_class){
		exam.init_state(this_exam, this_index, 'reset');
	}else{
		exam.init_state(this_exam, this_index, 'earse');
	}
});

ca_exam = {
	wrap : $('.ca-exams'),
	contents : $('.ca-exams .ca-exams-container'),
	height_set : function(pos){
		var head_tab,
			w_h,
			top_space,
			this_top,
			sum_h;

		top_space = $('#header').outerHeight();

		w_h = $window.outerHeight();
		sum_h = w_h - top_space - 79;
		ca_exam.contents.css('height',sum_h + 'px');
	},
	position_set : function(pos, win_w){
		var pos_result,
			top_space;

		if(win_w >= site_guide_width){
			ca_exam.wrap.css('margin-left','241px');
		}else{
			ca_exam.wrap.css('margin-left',-pos+'px');
		}
	},
	ca_contents_set : function(){
		var ca_contents,
			ca_contents_h,
			ca_exams_h;
		ca_contents = $('.ca-contents');
		ca_contents_h = ca_contents.outerHeight();
		ca_exams_h = ca_exam.wrap.outerHeight();

		if(ca_contents_h < ca_exams_h){
			ca_contents.css('min-height',ca_exams_h+'px');
		}

	}
}

if(ca_exam.wrap.length > 0){
	ca_exam.height_set($window.scrollTop());
}


nt_scroll = {
	items : $('#omr-wrap .omr-card-contents .scroll-box, .ca-exams .ca-exams-container, .memo-layer-body .scroll-box'),
	theme : ['dark','light-2','dark-2','light-3','dark-3','light-thick','dark-thick','light-thin','dark-thin','minimal','minimal-dark','inset','inset-dark','inset-2','inset-2-dark','inset-3','inset-3-dark','rounded','rounded-dark','rounded-dots','rounded-dots-dark','3d','3d-dark','3d-thick','3d-thick-dark']
}

nt_scroll.items.each(function(){
	var theme_index;

	theme_index = Number($(this).attr('data-theme-index'));
	$(this).mCustomScrollbar({theme:nt_scroll.theme[theme_index]});
});

c_layer = {
	trigger : $('.btn-layer'),
	close : $('.layer_wrap .close'),
	active_layer : false,
	speed : 500,
	dim_func : function(dim_obj, state){
		if(state){
			dim_obj.fadeIn(c_layer.speed);
		}else{
			dim_obj.fadeOut(c_layer.speed);
		}
	},
	cont_func : function(cont_obj, state, posi_type){
		var pos_t,
			margin_t;


		pos_t = $window.scrollTop() + ($window.outerHeight()/2);
		margin_t = -(cont_obj.outerHeight()/2);

		if(state){
			cont_obj.fadeIn(c_layer.speed);
			cont_obj.addClass('show');

			if(posi_type == 'fixed'){

			}else{
				cont_obj.css({
					'top' : pos_t,
					'margin-top' : margin_t+'px'
				});
			}

			if(cont_obj.attr('data-theme-index')){
				cont_obj.find('.scroll-box').mCustomScrollbar({theme:nt_scroll.theme[cont_obj.attr('data-theme-index')]});
			}
		}else{
			cont_obj.fadeOut(c_layer.speed)
			.removeClass('show');
		}
	},
	init : function(layer_id, state){
		var this_layer,
			dim,
			this_cont,
			posi_type;

		this_layer = $('#'+layer_id);

		if(state){
			if($('.layer_wrap').not(':hidden').length > 0){
				c_layer.active_layer = $('.layer_wrap').not(':hidden');
			}

			$('#wrap').append(this_layer);
		}

		if(c_layer.active_layer){
			if(state){
				c_layer.active_layer.addClass('ready');
			}else{
				c_layer.active_layer.removeClass('ready');
			}
		}

		dim = this_layer.find('.dim');
		this_cont = this_layer.find('.layer_wrap');

		posi_type = 'absolute';

		if(this_layer.attr('class').indexOf('memo-contents-layer') > -1){
			posi_type = 'fixed';
		}

		c_layer.dim_func(dim, state);
		c_layer.cont_func(this_cont, state, posi_type);
	}
}

c_layer.trigger.on('click',function(){
	var target_id;

	target_id = $(this).attr('data-target');
	c_layer.init(target_id, true);
	return false;
});

c_layer.close.on('click',function(){
	var target_id;

	if($(this).closest('.common_layer').length > 0){
		target_id = $(this).closest('.common_layer').attr('id');
	}else{
		target_id = $(this).closest('.c_layer').attr('id');
	}

	c_layer.init(target_id, false);
	return false;
});

weak = {
	wrap : $('.weak-type-list'),
	items : $('.weak-type-list li'),
	trigger : $('.weak-type-list div.subject'),
	speed : 300,
	ease : 'easeOutCubic',
	init : function(li_obj){
		var wrap_h,
			wrap_obj,
			this_class;

		this_class = li_obj.attr('class');
		wrap_obj = li_obj.find('.cont');
		if(this_class){
			li_obj.removeClass('active')
			.find('.cont').stop().animate({height:0},{duration:weak.speed,easing:weak.ease});
		}else{
			weak.wrap.find('.active')
			.removeClass('active')
			.find('.cont').stop().animate({height:0},{duration:weak.speed,easing:weak.ease});

			li_obj.addClass('active');
			wrap_h = li_obj.find('.cont .wrap').outerHeight();
			wrap_obj.stop().animate({height:wrap_h},{duration:weak.speed,easing:weak.ease});
		}
	}
}

weak.trigger.on('click',function(){
	var this_li;

	this_li = $(this).closest('li');
	weak.init(this_li);
});

if($('.hidden-select').length > 0){
	$('.hidden-select').selectric();
}

sort = {
	select : $('.sort-select'),
	init : function(items, type, ttl){
		var item_ele,
			part_items,
			ttl_obj,
			items_index;

		item_ele = items.find('.list-items li');
		part_items = items.find('.part-ttl').closest('li');
		ttl_obj = items.closest('.exam-list-wrap').find('> h3');

		ttl_obj.text(ttl+' 문제');
		if(type == 'all'){
			item_ele.show();
		}else{
			item_ele.each(function(){
				var this_state;

				this_state = $(this).attr('class');
				if(this_state && this_state.indexOf(type) > -1){
					$(this).show();
				}else{
					if($(this).find('.part-ttl').length == 0){
						$(this).hide();
					}
				}
			});
		}
	}
}

sort.select.on('change',function(){
	var c_contents,
		sort_type,
		sort_txt;

	c_contents = $('.'+$(this).attr('data-target'));
	sort_type = $(this).find('option:selected').attr('data-sort');

	if(sort_type == 'earse'){
		sort_txt = '오답';
	}else if(sort_type == 'memo'){
		sort_txt = '메모 체크';
	}else{
		sort_txt = '전체';
	}

	sort.init(c_contents, sort_type, sort_txt);
});

c_tab = {
	trigger : $('.func-tab a, .func-tab button'),
	init : function(){

	},
	click_func : function(tab_obj){
		var tab_wrap,
			tab_cont,
			all_cont;

		tab_wrap = tab_obj.closest('.func-tab');
		tab_cont = $(tab_obj.attr('href'));
		all_cont = $('.'+tab_wrap.attr('data-contents'));

		tab_wrap.find('.active').removeClass('active');
		tab_obj.addClass('active');

		if(!all_cont){
			console.log('func-tab에 data-contents 값을 지정해 주세요.');
		}

		all_cont.hide();
		tab_cont.show();

		if($('#jump-layer .scroll-box').length > 0){
			$('#jump-layer .scroll-box').not(':hidden').mCustomScrollbar({theme:'dark-3'});
		}
	}
}

c_tab.trigger.on('click',function(){
	c_tab.click_func($(this));
	return false;
});

slide_items = {
	wrap : $('.slide-wrap'),
	controller : $('.slide-wrap .controller button'),
	speed : 300,
	interv : 5000,
	course : 'next',
	ease : 'easeOutCubic',
	init : function(obj){
		var list_wrap,
			list_w;

			list_wrap = obj.find('.course-list ul');
			list_w = list_wrap.find('li:first').outerWidth() + 20;

		if(list_wrap.find('li').length > 3){
			if(slide_items.course == 'next'){
				list_wrap.stop().animate({left:-list_w},{duration:slide_items.speed, easing:slide_items.ease,complete:function(){
					$(this)
					.css('left',0)
					.find('li:first').appendTo($(this));
				}});
			}else{
				slide_items.course = 'next';

				list_wrap
				.css('left',-list_w+'px')
				.find('li:last').prependTo(list_wrap);

				list_wrap.stop().animate({left:0},{duration:slide_items.speed, easing:slide_items.ease});
			}
		}

	},
	interv_init : function(obj){
		slide_interv = setInterval(function(){
			slide_items.init(obj);
		}, slide_items.interv);
	}
}

slide_items.controller.on('click',function(){
	var this_wrap;

	this_wrap = $(this).closest('.slide-wrap');
	if(!this_wrap.find('ul').is(':animated')){
		clearInterval(slide_interv);
		slide_items.course = $(this).attr('class');
		slide_items.init(this_wrap);
		slide_items.interv_init(this_wrap);
	}
	return false;
});

if(slide_items.wrap.length > 0){
	//slide_items.interv_init($('.slide-wrap'));
}

intervals = new Array();
per_num = new Array();

chart_common = {
	init : function(chart_obj){
		var chart_class,
			type,
			items,
			result;

		chart_class = chart_obj.attr('class');
		items = chart_obj.find('.chart-items');

		if(chart_class.indexOf('chart-type-col') > -1){
			type = 'col';
		}else if(chart_class.indexOf('chart-type-row') > -1){
			type = 'row';
		}else if(chart_class.indexOf('chart-type-point') > -1){
			type = 'point';
		}

		switch (type) {
			case 'col' : //

				break;

			case 'row' : //

				break;

			case 'point' : //
				var max_result,
					percent,
					bar,
					active_index,
					rows,
					rows_reverse,
					rows_num,
					rows_h;

				max_result = Number(chart_obj.attr('data-max'));
				rows = chart_obj.find('.chart-rows');
				rows_reverse = rows.find('span').get().reverse();
				rows.html(rows_reverse);
				rows_num = rows.find('span').length - 1;
				rows_h = 100 / rows_num;
				rows.find('span').css('height',rows_h+'%');

				active_index = items.length - 1;
				items.each(function(index){
					result = Number($(this).attr('data-num'));
					bar = $(this).find('.chart-bar');

					if(result > 0){
						percent = Math.round((result / max_result) * 100);
						bar.css('height',percent+'%');
					}else{
						active_index--;
						bar.find('.chart-num').hide();
					}
				});

				items.eq(active_index).find('.chart-num').addClass('active');

				break;
		}

	}
}

if($('.chart-type-point').length > 0){
	chart_common.init($('.chart-type-point'));
}

chart_circle = {
	items : $('.chart-circle'),
	set : function(obj, per, index){
		var path,
			pathLen,
			perLen;

		path = $('.chart-circle-progress').get(index);
		//pathLen = Math.round(path.getTotalLength());
		pathLen = Math.round((obj.outerHeight() - 15) * 3.14);
		perLen = Math.round(pathLen - (per*(pathLen/100)));
		path.setAttribute('stroke-dasharray', pathLen);
		path.setAttribute('stroke-dashoffset', pathLen);
		setTimeout(function(){
			chart_circle.num_evt(per, obj, index);
			chart_circle.init(obj, path, perLen);
		}, 100);
	},
	init : function(obj, path, perLen){
		obj.addClass('active');
		path.setAttribute('stroke-dashoffset', perLen);
	},
	num_evt : function(per, obj, index){
		chart_circle.num_interval(per, obj, index);
	},
	num_interval : function(per, obj, index){
		var interv,
			per_box;

		per_num[index] = 0;
		interv = 1000/per;

		per_box = obj.find('.per-num span');
		intervals[index] = setInterval(function(){
			chart_circle.num_set(obj, per_box, per, index);
		}, interv);
	},
	num_set : function(obj, per_box, per, index){
		per_num[index]++;
		if(per_num[index] >= per){
			clearInterval(intervals[index]);
		}

		per_box.text(per_num[index]);
	},
	call : function(pos){
		chart_circle.items.each(function(index){
			var per,
				active,
				check_num;

			active = sc_ai.init($(this), pos);
			if(active){
				if($(this).attr('class').indexOf('call_finish') == -1){
					$(this).addClass('call_finish');
					per = $(this).attr('data-percent');
					chart_circle.set($(this), per, index);
				}
			}
		});
	}
}

// chart_scroll
chart_scroll = {
	trigger : $('.over-scroll .trigger'),
	speed : 300,
	ease : 'easeOutCubic',
	init : function(trigger_obj){
		var wrap,
			item_len,
			state_class,
			chart_box,
			move_chart,
			move_w;

		wrap = trigger_obj.closest('.over-scroll');
		item_len = wrap.find('.chart-items').lengrh;
		state_class = trigger_obj.attr('class');
		chart_box = wrap.find('.chart-item-wrap');
		move_chart = chart_box.find('.display-table');
		move_w = move_chart.outerWidth() - chart_box.outerWidth();
		if(state_class.indexOf('prev') == -1){
			trigger_obj
			.addClass('prev')
			.find('span').text('이전');
			move_chart.stop().animate({marginLeft:-move_w},{duration:chart_scroll.speed, easing:chart_scroll.ease});
		}else{
			trigger_obj
			.removeClass('prev')
			.find('span').text('다음');
			move_chart.stop().animate({marginLeft:0},{duration:chart_scroll.speed, easing:chart_scroll.ease});
		}
	}
}

chart_scroll.trigger.on('click',function(){
	chart_scroll.init($(this));
	return false;
});

sc_ai = {
	init : function(obj, pos){
		var obj_pos,
			check_pos,
			btm_h;

		if($('#contents-btm').length > 0){
			btm_h = $('#contents-btm').outerHeight();
		}else{
			btm_h = 0;
		}

		obj_pos = obj.offset().top;
		// 약간의 유격을 위해 btnm_h를 2로 곱해서 사용
		check_pos = $(window).outerHeight() + pos - (btm_h*2);

		if(check_pos >= obj_pos){
			return true;
		}else{
			return false;
		}
	}
}

// jump 레이어
jump = {
	trigger : $('#header .ver-all'),
	contents : $('#jump-layer'),
	close : $('#jump-layer .close'),
	speed : 500,
	ease : 'easeOutCubic',
	init : function(state){
		if(state == 'show'){
			jump.contents.stop().show().animate({opacity:1, marginTop:0},{duration:jump.speed, easing:jump.ease});
			jump.contents.find('.scroll-box').mCustomScrollbar({theme:'dark-3'});
		}else{
			jump.contents.stop().animate({opacity:0, marginTop:-30},{duration:jump.speed, easing:jump.ease,complete:function(){
				$(this).hide();
			}});
		}
	}
}

jump.trigger.on('click',function(){
	jump.init('show');
	return false;
});

jump.close.on('click',function(){
	jump.init('hide');
	return false;
});

toast = {
	hide_time : 3000,
	hide_init : function(){
		$('.layer-toast')
		.removeClass('show')
		.addClass('hide');

		setTimeout(function(){
			$('.layer-toast').remove();
		},1000);
	},
	init : function(msg){
		var toast_html;

		toast_html = '';
		toast_html += '<div class="layer-toast">';
		toast_html += '<p>'+msg+'</p>';
		toast_html += '</div>';

		$('body').append(toast_html);
		$('.layer-toast').show().addClass('show');

		setTimeout(function(){
			toast.hide_init();
		}, toast.hide_time);
	}
}

memo_object = {};

memo = {
	wrap : $('#memo'),
	trigger : $('#memo .btn-box button'),
	guide : $('#memo .memo-guide-message'),
	que_wrap : $('.questions-wrap'),
	gid : 0,
	speed : 200,
	set : function(){
		var guide_html;

		guide_html = '<div class="memo-guide-message memo-box">메모하고 싶은 위치에 <em>마우스를 클릭</em>하세요.</div>';
		memo.que_wrap.append(guide_html);
	},
	btn_ani : function(obj, state){
		var btn_img,
			mr_top;

		btn_img = obj.find('span img');

		if(state == 'on'){
			mr_top = -52;
		}else{
			mr_top = 0;
		}

		btn_img.stop().animate({left:50+'%', width:0},{duration:memo.speed, easing:'easeInCubic',complete:function(){
			$(this)
			.css('margin-top',mr_top + 'px')
			.stop().animate({left:0, width:100+'%'},{duration:memo.speed, easing:'easeOutCubic'});
		}});
	},
	click_evt : function(obj, state){
		var this_class;

		this_class = obj.attr('class');

		if(this_class && this_class.indexOf('on') > -1){
			obj.removeClass('on');
			memo.btn_ani(obj, 'off');
			memo.init('reset');
		}else{
			obj.addClass('on');
			memo.btn_ani(obj, 'on');
			memo.init(state);
		}
	},
	init : function(state){
		var click_area,
			guide_ele;

		click_area = $('.questions-wrap');
		guide_ele = $('.memo-guide-message');

		if(state == 'add'){ // 메모 추가
			click_area.addClass('memo-active');
			memo_offset_x = click_area.offset().left;
			memo_offset_y = click_area.offset().top;

			$(document).on('keyup','.memo-form input:text', function(){
				var this_val,
					max_len,
					byte_len,
					byte_ele;

					this_val = $(this).val();
					max_len = 20;

					byte_ele = $(this).closest('.memo-form').find('.byte em');
					byte_len = byte_check.init(this_val, max_len);
					if(byte_len > max_len){
						alert('최대 20자 까지 입력하실수 있습니다.');
						var this_str;
						this_str = this_val.substr(0, max_len);
						$(this).val(this_str);
					}else{
						byte_ele.text(byte_len);
					}
			});
		}else if(state == 'list'){ // 목록 보기
			var layer,
				layer_class;

			layer = $('.memo-items-layer');
			layer_class = layer.attr('class');
			if(layer_class.indexOf('show') > -1){
				layer.removeClass('show');
			}else{
				layer.addClass('show');
			}

			layer.find('.close').on('click',function(){
				$('#memo .btn-box .list').click();
				//layer.removeClass('show');
			});

		}else if(state == 'reset'){
			memo.wrap.removeClass('active');
			click_area.removeClass('memo-active');
			guide_ele.removeClass('active');

			if($('.memo-items-layer').length > 0){
				$('.memo-items-layer').removeClass('show');
			}
		}
	},
	memo_apply : function(x, y, result){
		var memo_app_html,
			memo_area,
			m_gid;

		memo_area = $('.questions-wrap');
		memo_app_html = '';
		memo_app_html += '<div class="memo-box memo-item" style="left:'+x+'px; top:'+y+'px" data-gid="'+memo.gid+'">';
		memo_app_html += result;
		memo_app_html += '<button type="button" class="delete"><span>삭제</span></button>';
		memo_app_html += '</div>';

		m_gid = memo.gid;
		memo_object[m_gid] = {
			pos_x : x,
			pos_y : y,
			memo_result : result,
			gid : memo.gid
		}

		memo_area.append(memo_app_html);
		memo.gid++;
	},
	memo_delete : function(obj){
		var del_check;

		obj.remove();
	}
}

var guide_ele,
	click_area;

$(document).on('mouseenter','.memo-active',function(){
	var guide_ele,
		move_x,
		move_y,
		min_x,
		click_area,
		memo_form;

	memo_form = $('.memo-form');
	if(memo_form.length > 0){
		memo.memo_delete(memo_form);
	}

	guide_ele = $('.memo-guide-message');
	click_area = $('.memo-active');

	$(document).on('mousemove', '.memo-active', function(event){
		move_x = event.pageX - memo_offset_x;
		move_y = event.pageY - memo_offset_y;

		min_x = click_area.outerWidth() - guide_ele.outerWidth();
		if(move_x > min_x){
			move_x = min_x;
		}

		guide_ele.
		addClass('active').show()
		.css({
			'left':move_x+'px',
			'top':move_y+'px'
		});
	});
});

$(document).on('click', '.memo-active', function(event){
	var memo_html,
		click_x,
		click_y,
		posi_x,
		posi_y,
		min_x,
		exception,
		guide_ele;

	memo_html = '';
	exception = new Array();
	exception = [$('.memo-form')];
	guide_ele = $('.memo-guide-message');
	click_area = $('.memo-active');

	if(!$('.memo-form').has(event.target).length){
		click_x = event.pageX;
		click_y = event.pageY;

		posi_x = click_x - memo_offset_x;
		posi_y = click_y - memo_offset_y;

		min_x = click_area.outerWidth() - guide_ele.outerWidth();

		if(posi_x > min_x){
			posi_x = min_x;
		}

		memo_html += '<div class="memo-form memo-box" style="left:'+posi_x+'px; top:'+posi_y+'px" data-x="'+posi_x+'" data-y="'+posi_y+'">';
		memo_html += '<div class="input"><input type="text" name="" title=""></div>';
		memo_html += '<div class="btns">';
		memo_html += '<button type="button" class="btn-type04 complete"><span>확인</span></button>';
		memo_html += '<button type="button" class="btn-type04 ver2 cancel"><span>취소</span></button>';
		memo_html += '</div>';
		memo_html += '<div class="byte"><em>0</em> / 20</div>';
		memo_html += '</div>';


		click_area.append(memo_html);
		click_area.find('.memo-form').eq(-1)
		.addClass('show').find('input:text').focus();

		$('#memo .btn-box .add').click();
		guide_ele.removeClass('active').hide();

		$('.memo-form input:text').on('keydown',function(key){
			var kcode;

			kcode = key.keyCode;
			if(kcode == 13){
				$('.memo-form .complete').click();

			}
		});
	}
});

$(document).on('click','.memo-form .btns button',function(){
	var btn_class,
		btn_state,
		btn_parent,
		data_x,
		data_y,
		data_memo;

	btn_class = $(this).attr('class');
	btn_parent = $(this).closest('.memo-form');
	if(btn_class.indexOf('complete') > -1){
		data_x = btn_parent.attr('data-x');
		data_y = btn_parent.attr('data-y');
		data_memo = btn_parent.find('input:text').val();

		if(data_memo.trim() != '' && data_memo != 'undefined' && data_memo != 'null'){
			memo.memo_apply(data_x, data_y, data_memo);
			memo.memo_delete(btn_parent);
		}else{
			alert('메모내용을 입력하세요.');
			btn_parent.find('input:text').val('').focus();
		}

	}else{
		memo.memo_delete(btn_parent);
	}
	return false;
});

$(document).on('click','.memo-item .delete',function(){
	var this_parent,
		del_check,
		del_gid;

	this_parent = $(this).closest('.memo-item');
	del_check = confirm('정말 메모를 삭제하시겠습니까?');

	if(del_check){ // 메모삭제
		del_gid = this_parent.attr('data-gid');
		this_parent.remove();
		delete memo_object[del_gid];

		//console.log(memo_object);
	}
	return false;
});

$(document).on('mouseenter','.memo-item',function(){
	$(this).find('.delete').stop().show(200);
});

$(document).on('mouseleave','.memo-item',function(){
	$(this).find('.delete').stop().hide(200);
});

memo.trigger.on('click',function(){
	var state_class;

	state_class = $(this).attr('class');
	memo.click_evt($(this), state_class);
	return false;
});

if(memo.wrap.length > 0){
	memo.set();
}

byte_check = {
	init : function(str,lengths){
		var len = 0;
		var newStr = '';

		for (var i=0;i<str.length; i++){
			var n = str.charCodeAt(i);

			var nv = str.charAt(i);
			if ((n>= 0)&&(n<256)) len ++; // ASCII 문자코드 set.
			else len += 1; // 한글이면 2byte
		}
		return len;
	}
}

r_banner = {
	wrap : $('.report-banner'),
	init : function(pos){
		r_banner.wrap.css('top',pos+'px');
	}
}

scroll_block = $('.memo-items-layer .scroll-box, .jump-body .scroll-box');

scroll_block.on('mousewheel', function(event, delta) {
	return false;
});

leaning = {
	wrap : $('.leaning-list'),
	item : $('.leaning-list .items-wrap .item'),
	trigger : $('.leaning-list .items-wrap .item a.wrap'),
	controller : $('.leaning-detail .controller button'),
	close : $('.leaning-detail .close'),
	speed : 800,
	ease : 'easeOutBack',
	scroll_evt : function(obj){
		$('html, body').stop().animate({scrollTop:obj.offset().top},300);
	},
	init : function(obj, type, item_obj){
		var obj_h;

		if(type == 'show'){
			obj_h = obj.find('.outer').outerHeight();
			obj.addClass('show');
		}else{
			obj_h = 0;
			obj.removeClass('show');
		}

		obj.css('height',obj_h+'px');
	},
	click_evt : function(trigger_obj){
		var target,
			this_class,
			this_parent,
			this_index,
			this_detail,
			evt_type,
			obj_move_top;

		this_parent = trigger_obj.closest('.item');
		this_index = this_parent.attr('data-index');
		this_detail = $('.leaning-detail[data-index="'+this_index+'"]');

		if(this_detail.length > 0){
			this_class = this_parent.attr('class');

			if(this_class.indexOf('active') == -1){
				leaning.reset();
				this_parent.addClass('active');
				evt_type = 'show';
			}else{
				leaning.reset();
				evt_type = 'hide';
			}

			target = $('#'+trigger_obj.attr('data-detail'));
			leaning.init(target, evt_type, this_parent);

			setTimeout(function(){
				leaning.scroll_evt(this_parent);
			}, 200);

		}
	},
	controller_evt : function(obj){
		var state,
			this_index,
			result_index,
			detail_ele_s;

		state = obj.attr('class');
		detail_ele_s = leaning.wrap.find('.leaning-detail');
		this_index = obj.closest('.leaning-detail').attr('data-index');

		detail_ele_s.each(function(index){
			var data_index;

			data_index = $(this).attr('data-index');
			if(data_index == this_index){
				if(state == 'next'){
					result_index = detail_ele_s.eq(index+1).attr('data-index');
				}else{
					result_index = detail_ele_s.eq(index-1).attr('data-index');
				}
			}
		});

		leaning.click_evt(leaning.item.eq(result_index).find('a.wrap'));
	},
	reset : function(){
		var reset_obj,
			hide_detail;

		reset_obj = leaning.wrap.find('.active');
		hide_detail = $('#'+reset_obj.find('.wrap').attr('data-detail'));
		leaning.wrap.find('.active').removeClass('active');

		leaning.init(hide_detail, 'hide');
	},
	set : function(){
		var detail_ele,
			posi_index,
			detail_ele_s,
			detail_ele_leng;

		posi_index = 0;
		leaning.item.each(function(index){
			detail_ele = $(this).find('.leaning-detail');
			$(this).attr('data-index',index);

			if(detail_ele.length > 0){
				detail_ele.attr('data-index',index);
			}

			if(index % 4 == 0){
				posi_index++;
			}
			detail_ele.css({
				'transform-origin':(25*(index % 4))+'% 0'
			});

			if(leaning.item.eq(posi_index*4).length == 0){
				$(this).parent().append(detail_ele);
			}else{
				leaning.item.eq(posi_index*4).before(detail_ele);
			}
		});

		// leaning-detail navigation setting
		detail_ele_s = $('.leaning-detail');
		detail_ele_leng = detail_ele_s.length;

		detail_ele_s.each(function(index){
			var this_controller,
				tc_prev,
				tc_next;

			this_controller = $(this).find('.controller');
			tc_prev = this_controller.find('.prev');
			tc_next = this_controller.find('.next');

			if(index == 0){
				tc_prev.remove();
				if(detail_ele_leng <= 1){
					tc_next.remove();
				}
			}

			if(index == (detail_ele_leng-1)){
				tc_next.remove();
			}
		});
	}
}

leaning.trigger.on('click',function(){
	leaning.click_evt($(this));
	return false;
});

leaning.close.on('click',function(){
	leaning.reset();
	return false;
});

leaning.controller.on('click',function(){
	leaning.controller_evt($(this));
	return false;
});

if(leaning.wrap.length > 0){
	leaning.set();
}

bx = {
	items : $('.pagoda_awards'),
	call : function(obj, sw, min, max, move, mar){
		obj.bxSlider({
			slideWidth: sw,
			minSlides: min,
			maxSlides: max,
			moveSlides: move,
			slideMargin: mar
		});
	}
}

c_radio = {
	item : $('.radio-btn'),
	set : function(){
		c_radio.item.each(function(){
			var checked;

			checked = $(this).find('input:radio').prop('checked');
			if(checked){
				$(this).addClass('checked');
			}else{
				$(this).removeClass('checked');
			}
		});
	}
}

if(c_radio.item.length > 0){
	c_radio.set();
}

c_radio.item.on('click',function(){
	c_radio.set();
	return false;
});

if(bx.items.length > 0){
	bx.items.each(function(){
		var this_class;

		this_class = $(this).attr('class');
		if(this_class.indexOf('pagoda_awards') > -1){
			bx.call($(this), 210, 4, 4, 1, 10);
		}
	});
}

voca = {
	item : $('.card-rotate-wrap'),
	trigger : $('.card-rotate-wrap'),
	word : $('.word-items-wrap'),
	blind_trigger : $('.word-items-wrap .word-sort-box .btn-dim'),
	word_items : $('.word-item'),
	memorizing_trigger : $('.word-item .state-box input:checkbox'),
	init : function(state){
		if(state == 'turn'){
			voca.item.closest('.card-meaning').addClass('turn');
			voca.item.addClass('turn');
			$('.voca-radio-btns').show();
		}
	},
	word_set : function(){
		voca.word.find('.state-box input:checkbox').each(function(){
			var this_state,
				this_word;
			this_state = $(this).prop('checked');
			this_word = $(this).closest('.word-item');
			if(this_state){
				this_word.addClass('memorizing');
			}else{
				this_word.removeClass('memorizing');
			}
		});
	},
	blind_check : function(obj){
		var this_class,
			type,
			state,
			txt;

		this_class = obj.attr('class');
		txt = obj.find('em').text();

		if(this_class.indexOf('type-word') > -1){
			type = 'word';
		}else{
			type = 'meaning';
		}

		if(this_class.indexOf('active') > -1){
			state = false;
			obj.removeClass('active');
			//txt = txt.replace('보기', '가리기');
		}else{
			state = true;
			obj.addClass('active');
			//txt = txt.replace('가리기', '보기');
		}
		//obj.find('em').text(txt);

		voca.init_blind(type, state);
	},
	init_blind : function(type, state){
		var area;

		if(type == 'word'){
			area = $('.word-item .word-box');
		}else{
			area = $('.word-item .meaning-box');
		}

		if(state){
			area.addClass('blind');
		}else{
			area.removeClass('blind');
		}
	}
}

voca.trigger.on('click',function(){
	voca.init('turn');
	return false;
});

voca.blind_trigger.on('click',function(){
	voca.blind_check($(this));
	return false;
});

voca.memorizing_trigger.on('click',function(){
	voca.word_set();
});

if(voca.word_items.find('.state-box').length > 0){
	voca.word_set();
}

// 기존 footer javscript
$(function() {
	$("#footer.foot_area .btn_f_site > a").click(function() {
		$(this).parent().toggleClass('on');
	});

	$("#footer.foot_area .ly_fsite li").click(function() {
		$('.btn_f_site').removeClass('on');
	});
});


if(voca.word.length > 0){
	var each_num,
		left_item,
		right_item,
		left_h,
		right_h;

	each_num = -1;
	voca.word_items.find('.wrap').each(function(index){
		each_num++;
		if(each_num > 1){
			each_num = 0;
		}

		if(each_num == 0){
			left_item = $(this);
			left_h = left_item.outerHeight() - 2;
		}else{
			right_item = $(this);
			right_h = right_item.outerHeight() - 2;

			if(left_h > right_h){
				right_item.find('.word-box').css('height',left_h+'px');
			}else if(left_h < right_h){
				left_item.find('.word-box').css('height',right_h+'px');
			}
		}
	});
}

// family
family = {
	$wrap : $('.family-site'),
	$trigger : $('.family-site .btn-trigger'),
	$items : $('.family-site .fs-items'),
	speed : 300,
	init : function(){
		var this_state;

		this_state = family.$wrap.attr('class');
		if(this_state.indexOf('on') == -1){
			family.$wrap.addClass('on');
			family.$items.stop().slideDown(family.speed);
		}else{
			family.$wrap.removeClass('on');
			family.$items.stop().slideUp(family.speed);
		}
	}
}

family.$trigger.on('click', function(){
	family.init();
	return false;
});


// award
award = {
	$wrap : $('.award-items-wrap'),
	$items : $('.award-items'),
	$nav : $('.award-items-wrap .nav button'),
	view_len : 4,
	course : 'next',
	speed : 300,
	ease : 'easeOutCubic',
	evt_filter : function(obj_trigger){
		var item_len;

		item_len = award.$items.find('li').length;
		if(item_len > award.view_len && !award.$items.is(':animated')){
			award.course = obj_trigger.attr('class');
			award.init();
		}
	},
	init : function(){
		var item_w;

		item_w = award.$items.find('li').eq(0).outerWidth();
		if(award.course == 'next'){
			award.$items.stop().animate({left:-item_w},{duration:award.speed, ease:award.ease, complete:function(){
				$(this)
				.css('left','0')
				.find('li').eq(0).appendTo(award.$items);
			}});
		}else{
			award.$items
			.css('left',-item_w+'px')
			.find('li').eq(-1).prependTo(award.$items);

			award.$items.stop().animate({left:0},{duration:award.speed, ease:award.ease});
		}
	}
}

award.$nav.on('click', function(){
	award.evt_filter($(this));
	return false;
});
