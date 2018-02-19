'use strict';

var exam,
	highlighter,
	j_layer,
	c_layer,
	call_swiper,
	nav_num_set,
	intervals,
	chart_common,
	chart_circle,
	per_num,
	sc_ai,
	sort_select,
	player,
	move_top,
	touch_evt,
	toast,
	nt_scroll,
	voca;

exam = {
	wrap : $('#exam-wrap'),
	trigger : $('#exam-wrap .trigger-tabs button'),
	answer_trigger : $('#exam-wrap .exam-answer input:radio'),
	state_trigger : $('#exam-wrap .exam-answer .icon_state'),
	default_step : 2,
	now_step : 2,
	default_percent : 0.43, // 디폴트 높이값 지정 ex) 0.44 = 44%
	spec_sum : function(step){
		var refer_tab,
			refer_head,
			refer_point,
			current_height,
			refer_foot;

		refer_tab = $('#exam-wrap .trigger-tabs');
		refer_head = $('#contents-top');
		refer_foot = $('#contents-btm');
		switch (step) {
			case 1 : // 완전 접힘
				refer_point = exam.wrap.find('.exam-questions').eq(0);
				current_height = Math.round(($(window).outerHeight() - (refer_head.outerHeight() + refer_foot.outerHeight())) * 0.21);
				break;
			case 2 : // 기본 형태
				var exception_type,
					que_wrap;

				exception_type = $('#contents-body').attr('data-part');
				refer_point = exam.wrap.find('.exam-container');

				if(exception_type && exception_type <= 4){ // part1 ~ part4 일때 예외처리
					current_height = $('.exam-container .exam-items').eq(0).outerHeight() + refer_tab.outerHeight();
				}else{
					current_height = Math.round(($(window).outerHeight() - (refer_head.outerHeight() + refer_foot.outerHeight())) * exam.default_percent);
				}
				break;
			default : // 완전 펼침
				var player_refer,
					sum_height;

				player_refer = $('#cb-player');
				refer_point = $('.refer_checkpoint');

				if(player_refer.length > 0){ // 체크포인트가 player 기준일때
					sum_height =  refer_head.outerHeight() + refer_point.outerHeight() + refer_tab.outerHeight() + 12;
				}else{
					if(refer_point.length > 0){
						sum_height = refer_head.outerHeight() + refer_point.offset().top + refer_point.outerHeight();
					}else{
						sum_height = refer_head.outerHeight() + refer_tab.outerHeight();
					}

				}

				current_height = $(window).outerHeight() - sum_height;

				if(refer_point.length == 0){
					current_height = Math.round(current_height * 0.8);
				}
				break;
		}

		return current_height;
	},
	init : function(step){
		var h;

		h = exam.spec_sum(step);
		exam.wrap
		.css('height', h+'px')
		.attr('data-step', step)
		.removeClass()
		.addClass('step'+step);
	},
	exam_reset : function(){
		var answers;

		answers = exam.wrap.find('.exam-answer .answer-items');
		answers.each(function(){
			var this_class;

			this_class = $(this).attr('class');
			if(this_class.indexOf('selected') > -1){ //선택된 문항
				$(this).find('input:radio').prop('checked',true);
			}else if(this_class.indexOf('erase') > -1){ //제외처리한 문항
				$(this).find('input:radio').prop('disabled',true);
			}
		});
	},
	exam_set : function(type){
		var answers,
			answers_num,
			answers_total_num;

		if(type == 'all'){
			answers = exam.wrap.find('.exam-answer .answer-items');
			answers_total_num = 4;
		}else{
			answers = type.find('.answer-items');
			answers_total_num = type.find('.answer-items').length;
		}

		answers_num = 0;
		answers.each(function(index){
			var this_state,
				this_radio,
				this_erase,
				auto_check_index;

			this_radio = $(this).find('input:radio');
			this_state = this_radio.prop('checked');
			this_erase = this_radio.prop('disabled');

			if(this_state){
				$(this).addClass('selected');
			}else{
				$(this).removeClass('selected');
				if(this_erase){
					$(this).addClass('erase');
					answers_num++;
				}else{
					$(this).removeClass('erase');
				}
			}
		});

		if(answers_num == answers_total_num-1){
			answers.not('.erase')
			.addClass('selected')
			.find('input:radio')
			.prop('checked',true)
			.prop('disabled',false);
		}

	},
	exam_ui_set : function(current_obj){
		var this_class,
			this_answers;

		this_class = current_obj.attr('class');
		this_answers = current_obj.closest('.exam-answer');

		if(this_class.indexOf('erase') > -1){ // 되돌리기 요청
			current_obj.find('input:radio').prop('disabled',false);
		}else{ // 제외 요청
			current_obj.find('input:radio').prop('disabled',true);
		}

		exam.exam_set(this_answers);
	}
}

exam.answer_trigger.on('click',function(){
	var this_answer;

	this_answer = $(this).closest('.exam-answer');
	exam.exam_set(this_answer);
});

exam.state_trigger.on('click',function(){
	var this_answer;

	this_answer = $(this).closest('.answer-items');
	exam.exam_ui_set(this_answer);
});

exam.trigger.on('click', function(){
	var exam_obj,
		state,
		course;

	exam_obj = $(this).closest('#exam-wrap');
	if(exam_obj.attr('data-step')){
		state = exam_obj.attr('data-step');
	}else{
		state = 2;
	}

	course = $(this).attr('class');

	if(course == 'down'){
		state--;
		if(state < 1){
			state = 1;
		}
	}else{
		state++;
		if(state > 3){
			state = 3;
		}
	}

	exam.init(state);
	return false;
});


//highlighter
highlighter = {
	wrap : $('#highlighter'),
	state : 1,
	trigger : $('#highlighter .highlighter-btn'),
	func_trigger : $('#highlighter .highlighter_layer .select_btns button'),
	select_layer : $('#highlighter .highlighter_layer'),
	func_layer : $('#highlighter_evt_layer'),
	dim : $('#highlighter .dim'),
	speed : 300,
	init : function(evt){
		if(evt == 'show'){
			highlighter.select_layer.fadeIn(highlighter.speed);
			highlighter.wrap.addClass('ver_step1');
		}else{
			highlighter.select_layer.fadeOut(highlighter.speed);
			highlighter.wrap.removeClass('ver_step1');
			highlighter.trigger.find('button').removeClass();
			highlighter.trigger.find('button').addClass('ver'+highlighter.state);
		}
	}
}

highlighter.dim.on('click',function(){
	highlighter.init('hide');
});

highlighter.trigger.on('click',function(){
	var constant_answer;

	constant_answer = $('.ver-ca');
	if(constant_answer.length > 1){

	}else{
		highlighter.init('show');
	}
	return false;
});

highlighter.func_trigger.on('click',function(){
	var this_class;

	this_class = $(this).attr('class');
	if(this_class.indexOf('active') == -1){

		if(this_class.indexOf('highlighter_evt') > -1){ // 형광펜
			highlighter.state = 1;
		}else{
			highlighter.state = 2;
		}

		highlighter.func_trigger.removeClass('active');
		$(this).addClass('active');
	}else{
		$(this).removeClass('active');
		highlighter.state = 0;
	}

	return false;
});

// jump layer
j_layer = {
	wrap : $('.exam-jump-layer'),
	trigger : $('.btn-jump-layer'),
	close : $('.exam-jump-layer .close'),
	init : function(state){
		if(state == 'show'){
			j_layer.wrap.addClass('show');
			$('body').addClass('keep-mode');
			//touch_evt.init('keep');
		}else{
			j_layer.wrap.removeClass('show');
			$('body').removeClass('keep-mode');
			//touch_evt.init('release');
		}
	}
}

j_layer.trigger.on('click',function(){
	j_layer.init('show');
	return false;
});

j_layer.close.on('click',function(){
	j_layer.init('hide');
	return false;
});

// c_layer
c_layer = {
	wrap : $('.common-layer'),
	btn : $('.btn-layer'),
	close : $('.common-layer .close'),
	speed : 300,
	init_close : function(obj){
		obj.fadeOut(c_layer.speed);
		$('body').removeClass('keep-mode');
	},
	init : function(obj){
		obj.fadeIn(c_layer.speed);
		$('body').addClass('keep-mode');
	}
}

c_layer.close.on('click',function(){
	var current_layer;

	current_layer = $(this).closest('.common-layer');
	c_layer.init_close(current_layer);
	return false;
});

c_layer.btn.on('click',function(){
	var layer_obj;

	layer_obj = $('#'+$(this).attr('data-layer'));
	c_layer.init(layer_obj);

	return false;
});


// swiper
call_swiper = function(obj, obj_name, space, ex_num){
	var obj_name = new Swiper(obj, {
		pagination: '.swiper-pagination',
		nextButton: obj.find('.nav-next'),
		prevButton: obj.find('.nav-prev'),
		slidesPerView: 1,
		paginationClickable: true,
		spaceBetween: space,
		loop: false
	});

	if(ex_num){
		var ex_items;

		ex_items = obj_name.slides;
		ex_items.each(function(index){
			if($(this).attr('data-number') == ex_num){
				obj_name.slideTo(index);
			}
		});
	}
}

nav_num_set = function(obj_index, obj){
	var current_obj,
		active_index,
		prev_nav,
		next_nav;

	current_obj = obj.wrapper;
	active_index = Number(current_obj.find('.swiper-slide-active').attr('data-number'));
	prev_nav = current_obj.parent().parent().find('.nav-prev .exam-num');
	next_nav = current_obj.parent().parent().find('.nav-next .exam-num');

	if(current_obj.find('.swiper-slide-prev').length > 0){
		prev_nav.text(active_index-1);
	}else{
		prev_nav.text(active_index);
	}

	if(current_obj.find('.swiper-slide-next').length > 0){
		next_nav.text(active_index+1);
	}else{
		next_nav.text(active_index);
	}

}

if($('.exam-swiper').length > 0){ // 문제 풀이 영역이 존재할때
	call_swiper($('.exam-swiper'), 'exam', 0);
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
					rows_num,
					rows_h;

				max_result = Number(chart_obj.attr('data-max'));
				rows = chart_obj.find('.chart-rows');
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
						bar.find('.chart-num').hide();
					}
				});

				items.eq(active_index).find('.chart-num').addClass('active');

				if(chart_obj.find('.scroll-col-box').length > 0){
					var over_w;
					over_w = chart_obj.find('.scroll-col-box').outerWidth() + 20;
					rows.css('width',over_w+'px');
				}
				break;
		}

	}
}

if($('.chart-type-point').length > 0){
	$('.chart-type-point').each(function(){
		chart_common.init($(this));
	});
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

sort_select = {
	trigger : $('.sort-select'),
	init : function(target, select_val, select_txt){
		var current_item,
			current_ttl_item,
			current_ttl_txt;

		current_ttl_item = target.closest('.exam-box').find('.exam-title > a');
		current_ttl_item.text(select_txt);
		current_ttl_txt = '전체';
		switch (select_val) {
			case 'all' : //
				current_item = target.find('li');
				break;
			case 'incorrect' : //
				current_item = target.find('li.state-incorrect');
				current_ttl_txt = '오답';
				break;
			case 'highlighter' : //
				current_item = target.find('.jump_highlighter').closest('li');
				current_ttl_txt = '형관펜';
				break;
		}

		if(current_item.length > 0){
			target.find('li').hide();
			current_item.show();
		}else{
			alert(current_ttl_txt+' 정보가  없습니다.');
		}
	}
}

sort_select.trigger.on('change',function(){
	var target,
		select_val,
		select_txt;

	target = $('#'+$(this).attr('data-content'));
	select_val = $(this).find('option:selected').attr('data-sort');
	select_txt = $(this).find(':selected').text();
	sort_select.init(target, select_val, select_txt);
});


player = {
	wrap : $('#cb-player'),
	did : true,
	last_sctop : 0,
	delta : 5,
	navbarHeight : $('#cb-player').outerHeight(),
	interval_func : function(){
		setInterval(function() {
			if (player.did) {
				player.has_init($(window).scrollTop());
				player.did = false;
			}
		}, 250);

	},
	has_init : function(pos){
		if(Math.abs(player.last_sctop - pos) <= player.delta)
			return;

		if (pos > player.last_sctop && pos > player.navbarHeight){
			// Scroll Down
			$('body').addClass('hide-player');
		}else{
			// Scroll Up
			if(pos + $(window).height() < $(document).height() && pos >= 0) {
				$('body').removeClass('hide-player');
			}
		}

		player.last_sctop = pos;
	}
}

move_top = {
	trigger : $('#move_top'),
	did : true,
	last_sctop : 0,
	delta : 5,
	navbarHeight : $('#move_top').outerHeight(),
	interval_func : function(){
		setInterval(function() {
			if (move_top.did) {
				move_top.has_init($(window).scrollTop());
				move_top.did = false;
			}
		}, 250);

	},
	has_init : function(pos){
		if(Math.abs(move_top.last_sctop - pos) <= move_top.delta)
			return;

		if (pos > move_top.last_sctop){
			// Scroll Down
			move_top.trigger.stop().animate({opacity:1},300);
		}else{
			// Scroll Up
			move_top.trigger.stop().animate({opacity:0},300);
		}
		move_top.last_sctop = pos;
	}
}

move_top.trigger.on('click',function(){
	$('html, body').stop().animate({scrollTop:0},300);
	return false;
});

touch_evt = {
	init : function(state){
		if(state == 'keep'){
			$('#contents').css('overflow','visible').on('touchmove', function(e){e.preventDefault()});
		}else{
			$('#contents').unon('touchmove');
		}
	}
}

toast = {
	hide_time : 2000,
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
		$('.layer-toast')
		.css('margin-top',-($('.layer-toast').outerHeight()/2)+'px')
		.addClass('show');

		setTimeout(function(){
			toast.hide_init();
		}, toast.hide_time);
	}
}

voca = {
	item : $('.voca-card'),
	trigger : $('.voca-card'),
	word : $('.word-items-wrap'),
	blind_trigger : $('.word-items-wrap .word-sort-box .btn-dim'),
	word_items : $('.word-item'),
	memorizing_trigger : $('.word-item .state-box input:checkbox'),
	init : function(state){
		if(state == 'turn'){
			voca.item.addClass('turn');
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
		txt = obj.text();

		if(this_class.indexOf('type-word') > -1){
			type = 'word';
		}else{
			type = 'meaning';
		}

		if(this_class.indexOf('active') > -1){
			state = false;
			obj.removeClass('active');
			txt = txt.replace('보기', '가리기');
		}else{
			state = true;
			obj.addClass('active');
			txt = txt.replace('가리기', '보기');
		}
		obj.text(txt);

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

$(window).load(function(){

	if(exam.wrap.length > 0){
		exam.init(exam.default_step);
		exam.exam_reset();
	}

	if(chart_circle.items.length > 0){
		chart_circle.call($(window).scrollTop());
	}

	if(player.wrap.length > 0){
		player.interval_func();
	}

	if(move_top.trigger.length > 0){
		move_top.interval_func();
	}

	$('.fingerprint img').each(function(){
		var img_w,
			img_h;

		img_w = $(this).width();
		img_h = $(this).height();

		if(img_h > img_w){
			$(this).addClass('row_img');
		}
	});
});

$(window).on('scroll', function(){
	var pos;

	pos = $(this).scrollTop();
	if(chart_circle.items.length > 0){
		chart_circle.call(pos);
	}

	if(player.wrap.length > 0){
		player.did = true;
	}
	if(move_top.trigger.length > 0){
		move_top.did = true;
	}
});

$(window).on('resize', function(){
	if(exam.wrap.length > 0){
		let now_step;

		now_step = Number(exam.wrap.attr('data-step'));
		exam.init(now_step);
	}
});
