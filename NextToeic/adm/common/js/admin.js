var $window,           // window객체
	browser_type,      // 브라우져 체크
	lnb,               // 상단 공통 메뉴
	mobile,            // 모바일 체크
	searchb,           // 공통 검색 관련
	limit_byte,        // 글자수 제한
	c_layer,           // 공통 레이어
	c_alert,           // 공통 alert 레이어
	loading,           // 로딩바
	auto_search,       // 자동검색
	IMG_WEB_ROOT,      // 이미지 경로
	this_audio,        // 오디오 객체
	c_file,            // 공통 input:file
	add_templates,     // 영역 추가
	partial;           // 부분저장

	IMG_WEB_ROOT = '//img.pagodastar.com/adm';

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

		return verNum;
	}

	$(document).ready(function(){
		var br_num;

		br_num = individual_case();
		if(isNaN(br_num)){
			browser_type = 'standard';
		}else{
			browser_type = 'ie';
		}
	});

	//lnb
	lnb = {
		$wrap : $('.lnb'),
		$item : $('.lnb > li'),
		speed : 300,
		ease : 'easeOutCubic',
		init : function(obj, state){
			var current_sub;

			current_sub = obj.find('.lnb_sub');
			if(state){
				current_sub.stop().show().animate({opacity:1, marginTop:0},{duration:lnb.speed, easing:lnb.ease});
			}else{
				current_sub.stop().animate({opacity:0, marginTop:-20},{duration:lnb.speed, easing:lnb.ease, complete:function(){
					$(this).hide();
				}});
			}
		},
		set : function(){
			var lnb_sub,
				set_width;

			$('.lnb > li').each(function(){
				lnb_sub = $(this).find('.lnb_sub');
				set_width = lnb_sub.find('ul').outerWidth() + 6;
				lnb_sub.css({
					'width':set_width+'px',
					'margin-left':-(set_width/2)+'px',
					'display':'none'
				});
			});
		}
	}

	lnb.$item.on({
		mouseenter : function(){
			lnb.init($(this), true);
		},
		mouseleave : function(){
			lnb.init($(this), false);
		}
	});

	$(window).on('load', function(){
		if(lnb.$wrap.length > 0){
			lnb.set();
		}
	});

	// mobile
	mobile = {
		$btn_menu : $('#header .btn_menu'),
		$click_item : $('#header .lnb > li > a'),
		init: function(){
			if($('body.on').length > 0){
				$('body').removeClass('on');
			}else{
				$('body').addClass('on');
			}
		},
		sub_init : function(obj){
			var this_ul,
				this_li;

			this_ul = obj.closest('ul');
			this_li = obj.closest('li');
			if(this_li.attr('class') && this_li.attr('class').indexOf('on') > -1){
				this_ul.find('.on').removeClass('on');
			}else{
				this_ul.find('.on').removeClass('on');
				this_li.addClass('on');
			}
		}
	}

	mobile.$btn_menu.on('click', function(){
		mobile.init();
		return false;
	});

	mobile.$click_item.on('click', function(){
		mobile.sub_init($(this));
	});

	$(window).resize(function(){
		var check_w,
			w_width,
			resize_timeout;

		check_w = 799;
		w_width = $(this).outerWidth();
		if(w_width >= check_w){
			clearTimeout(resize_timeout);
			resize_timeout = setTimeout(function(){
				//lnb.set();
			}, 100);
		}
	});

	searchb = {
		$error : $('.error_rate'),
		error_init : function(state, obj){
			var this_wrap,
				inputs;

			this_wrap = obj.closest('.error_rate');
			inputs = this_wrap.find('input:text');
			if(state){
				inputs.attr('disabled', false);
			}else{
				inputs.attr('disabled', true);
			}
		},
		$criteria : $('.search_criteria'),
		$trigger : $('.searchBox .trigger'),
		view_init : function(obj){
			var this_class,
				this_target;

			this_class = obj.attr('class');
			this_target = $('.'+obj.attr('data-target'));
			if(this_class.indexOf('active') > -1){
				obj
				.removeClass('active')
				.find('span').text('검색 조건 더 보기');;
				this_target.stop().slideUp(300);

				$('#search_result_target02').hide();
			}else{
				obj
				.addClass('active')
				.find('span').text('검색 조건 닫기');
				this_target.stop().slideDown(300);

				$('#search_result_target02').show();
			}
		},
		$tag_btn : $('.btn_tag_code_view'),
		$tag_box : $('.tag_codes_box'),
		$tag_code : $('.tag_codes_box .tagA'),
		$code_item : $('.tc_item'),
		tag_init : function(obj){
			var this_box;

			this_box = obj.closest('.criteria_box').find('.tag_codes_box');
			if(this_box.is(':hidden')){
				this_box.show();
			}else{
				this_box.hide();
			}
		},
		tag_code_init : function(obj){
			var this_wrap,
				code_box,
				this_class,
				this_target;

			this_wrap = obj.closest('.tag_codes_box');
			code_box = this_wrap.find('.tag_codes_items');

			if(obj.attr('class').indexOf('active') > -1){
				this_wrap.find('.active').removeClass('active');
				code_box.hide(300);
			}else{
				this_wrap.find('.active').removeClass('active');
				code_box.hide(300);
				this_target = $(obj.attr('href'));
				this_target.show(300);
				obj.addClass('active');
			}
		},
		code_init : function(obj){
			var this_class,
				select_tags,
				insert_input,
				insert_arr;

			this_class = obj.attr('class');
			select_tags = '';
			insert_input = $('.tag_insert_input');
			insert_arr = insert_input.val().split(',');
			if(insert_arr[0] == ''){
				insert_arr.splice(0,1);
			}
			if(this_class.indexOf('checked') > -1){
				obj.removeClass('checked');
				insert_arr.splice(insert_arr.indexOf(obj.text()),1);
			}else{
				obj.addClass('checked');

				$('.tag_codes_items .checked').each(function(){
					var this_text;

					this_text = $(this).text();
					if(insert_arr.indexOf(this_text) == -1){
						insert_arr.push(this_text);
					}
				});
			}

			for(i = 0; i < insert_arr.length; i++){
				if(i > 0){
					select_tags += ',';
				}

				select_tags += insert_arr[i];
			}

			insert_input.val(select_tags);
			searchb.search_keyword_set();
		},
		search_keyword_set : function(){
			var form_items,
				form_names_arr,
				items_val,
				items_name,
				type,
				val_result,
				var_d_result,
				target_normal,
				target_detail;

			form_items = $('.search_items');
			val_result = '';
			var_d_result = '';
			target_normal = $('#search_result_target01');
			target_detail = $('#search_result_target02');

			form_items.each(function(index){
				var item_result;

				item_result = '';
				type = $(this).attr('data-type');
				items_name = $(this).attr('data-name');
				if(type == 'select'){
					items_val = $(this).find('option:selected').text();
				}else if(type == 'input_text'){
					items_val = $(this).val();
				}else if(type == 'checkbox'){
					if($(this).find('input:checkbox').prop('checked')){
						$(this).find('input:text').each(function(i){
							if(i > 0){
								items_val += ' ~ '+ $(this).val();
							}else{
								items_val = $(this).val();
							}
						});
					}else{
						items_val = '';
					}
				}else if(type == 'date'){
					var s_val,
						e_val;

					s_val = $(this).find('input:text').eq(0).val();
					e_val = $(this).find('input:text').eq(-1).val();
					if(s_val != ''){
						items_val = s_val + ' ~ ' + e_val;
					}else{
						items_val = e_val;
					}
				}else if(type == 'input_multi_text'){
					var item_tag_arr;

					items_val = $(this).val();
					item_tag_arr = $(this).val().split(',');
					items_val = '';
					if(item_tag_arr[0] == ''){
						item_tag_arr.splice(0,1);
					}
					for(i = 0; i < item_tag_arr.length; i++){
						items_val += '<em class="tagB">#'+item_tag_arr[i]+'</em>';
					}
				}else if(type == 'multi_select_input'){
					var item_wrap,
						item_text_val,
						item_select_val,
						item_select_name;

					item_wrap = $(this).closest('.multi_select_input');
					item_text_val = item_wrap.find('input:text').val();
					item_select_val = item_wrap.find('select option:selected').attr('data-name');
					items_val = '';
					if(item_text_val != ''){
						items_val = item_select_val + ' - ' + item_text_val;
					}
				}else if(type == 'multi_checkbox'){
					var check_items,
						items_val;

					check_items = $(this).find('input:checkbox');
					items_val = '';

					check_items.each(function(){
						if($(this).prop('checked')){
							items_val += '<em class="iconA">'+$(this).val()+'</em>';
						}
					});
				}else if(type == 'multi_date'){
					var r_val,
						s_val,
						e_val;

					r_val = $(this).find('input:radio:checked').parent('label').text();
					s_val = $(this).find('input:text').eq(0).val();
					e_val = $(this).find('input:text').eq(-1).val();

					if(s_val != ''){
						items_val = r_val +' '+ s_val + ' ~ ' + e_val;
					}else{
						items_val = r_val +' '+ e_val;
					}
				}

				if(items_val != '' && items_val.trim() != ''){
					if(items_name == '태그' || items_name == 'R/L' || items_name == '출처영역' || items_name == '그룹'){
						console.log(items_val);
						if(items_name == '태그'){
							var_d_result += '<span class="cr_tag">'+items_name+' '+items_val+'</span>';
						}else{
							var_d_result += '<span>'+items_name+' ('+items_val+')</span>';
						}

						target_detail.find('.cont').html(var_d_result);
					}else{
						val_result += '<span>'+items_name+' ('+items_val+')</span>';
						target_normal.find('.cont').html(val_result);
					}
				}
			});
		}
	}

	searchb.search_keyword_set();
	$('.search_items').each(function(){
		var this_type;

		this_type = $(this).attr('data-type');
		switch (this_type) {
		case 'select' :
			$(this).on('change', function(){
				searchb.search_keyword_set();
			});
			break;
		case 'checkbox' :
			var this_wrap;

			this_wrap = $(this);
			$(this).find('input:checkbox').on('click', function(){
				var this_state;

				this_state = $(this).prop('checked');
				if(this_state){
					this_wrap.find('input:text').on('keyup', function(){
						var this_val;

						this_val = $(this).val()
						if(this_val > 100){
							c_alert.init('0 ~ 100 사이의 값만 입력 가능합니다.');
							$(this).val(this_val.substr(0, this_val.length-1));
						}
						searchb.search_keyword_set();
					});
				}else{
					this_wrap.find('input:text').each(function(index){
						if(index == 0){
							$(this).val(0);
						}else{
							$(this).val(100);
						}
					});
				}

				searchb.search_keyword_set();
			});
			break;
		case 'date' :
			$(this).find('input:text').each(function(index){
				$(this).on('change',function(){
					searchb.search_keyword_set();
				});
			});

			break;

		case 'input_text' :
			$(this).on('keyup', function(){
				searchb.search_keyword_set();
			});
			break;

		case 'input_multi_text' :
			$(this).on('change', function(){
				searchb.search_keyword_set();
			});
			break;

		case 'multi_select_input' :
			$(this).find('select').on('change', function(){
				searchb.search_keyword_set();
			});

			$(this).find('input:text').on('keyup', function(){
				searchb.search_keyword_set();
			});
			break;

		case 'multi_checkbox' :
			$(this).find('input:checkbox').on('click', function(){
				searchb.search_keyword_set();
			});
			break;

		case 'multi_date' :
			$(this).find('input:radio').on('click', function(){
				searchb.search_keyword_set();
			});

			$(this).find('input:text').each(function(index){
				$(this).on('change',function(){
					searchb.search_keyword_set();
				});
			});
			break;

		default :
			c_alert.init('선택한 값이 없습니다.');
			break;
		}
	});

	searchb.$error.find('input:checkbox').on('click',function(){
		var this_state;

		this_state = $(this).prop('checked');
		searchb.error_init(this_state, $(this));
	});

	searchb.$trigger.on('click', function(){
		searchb.view_init($(this));
		return false;
	});

	searchb.$tag_btn.on('click',function(){
		searchb.tag_init($(this));
	});

	searchb.$tag_code.on('click',function(){
		searchb.tag_code_init($(this));
		return false;
	});

	searchb.$code_item.on('click',function(){
		searchb.code_init($(this));
		return false;
	});

	// tab Event
	var commonTab = {
		items : $('.tabEvent > ul > li > a'),
		contClass : ''
	}

	commonTab.items.on('click',function(){
		commonTab.contClass = $(this).parent().parent().parent().attr('data-class');
		if($('.tabEvent > ul > li.active').length> 0){
			$('.tabEvent > ul > li.active').removeClass('active');
		}
		$(this).parent().addClass('active');

		show_contID = $(this).attr('href');
		$('.'+commonTab.contClass).hide();
		$(show_contID).show();
		return false;
	});

	limit_byte = {
		item : $('.limit_byte'),
		init : function(obj){
			var this_val,
				limit_num,
				this_num;

			this_val = obj.val();
			limit_num = obj.attr('data-byte');
			this_num = this_val.length;
			console.log(this_num);
			if(this_num > limit_num){
				c_alert.init(limit_num+'자 이상 입력하실수 없습니다.');
				obj.val(this_val.substr(0, limit_num));
			}
		}
	}

	limit_byte.item.on('keyup', function(){
		var limit_num,
			this_num;

		limit_byte.init($(this));
	});

	c_layer = {
		trigger : $('.btnLayer'),
		close : $('.layerWrap .close, .layerWrap .btnClose'),
		active_layer : false,
		speed : 500,
		dim_func : function(state, type){
			var dim_html;

			dim_html = '<div class="dim"></div>';
			if(state){
				$('#wrap').append(dim_html);
				if(!type){
					$('.dim').fadeIn(c_layer.speed);
				}else{
					$('.dim').fadeIn(100);
				}
			}else{
				if(!type){
					$('.dim').fadeOut(c_layer.speed, function(){
						$(this).remove();
					});
				}else{
					$('.dim').fadeOut(100, function(){
						$(this).remove();
					});
				}

			}
		},
		cont_func : function(cont_obj, state, posi_type){
			var pos_t,
				margin_t;

			pos_t = $(window).scrollTop() + ($(window).outerHeight()/2);
			margin_t = -(cont_obj.outerHeight()/2);
			margin_l = -(cont_obj.outerWidth()/2);

			if(state){
				cont_obj.fadeIn(c_layer.speed);
				cont_obj.addClass('show');

				if(posi_type == 'fixed'){
					cont_obj.css({
						'margin' : margin_t+'px 0 0 '+margin_l+'px'
					});
				}else{
					cont_obj.css({
						'top' : pos_t,
						'margin' : margin_t+'px 0 0 '+margin_l+'px'
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
		init : function(layer_id, state, type){
			var this_layer,
				dim,
				this_cont,
				posi_type;

			this_layer = $('#'+layer_id);

			if(state){
				if($('.layerWrap').not(':hidden').length > 0){
					c_layer.active_layer = $('.layerWrap').not(':hidden');
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

			posi_type = 'fixed';
			if(this_layer.attr('class').indexOf('pos_abs') > -1){
				posi_type = 'absolute';
			}

			c_layer.dim_func(state);
			if(type == 'ajax' && state){
				$(document).ajaxStop(function() {
					c_layer.cont_func(this_layer, state, posi_type);
					state = false;
				});
			}else{
				c_layer.cont_func(this_layer, state, posi_type);
			}
		}
	}

	$(document).on('click', '.btnLayer', function(){
		var target_id;

		target_id = $(this).attr('data-target');
		c_layer.init(target_id, true);
		return false;
	});

	c_layer.close.bind('click',function(){
		var target_id;

		target_id = $(this).closest('.layerWrap').attr('id');

		c_layer.init(target_id, false);
		return false;
	});

	loading = {
		$item : $('.loading_box'),
		set : function(){
			var loading_html;

			loading_html = '<div class="loading_box"><div class="loading_icon"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>';
			$('#wrap').append(loading_html);
		},
		init :function(state){
			if(state){
				$('.loading_box').show();
			}else{
				$('.loading_box').hide();
			}
		}
	}

	c_alert = {
		speed : 300,
		set : function(msg){
			var alert_html;

			alert_html = '';
			alert_html += '<div class="alert_dim"></div>';
			alert_html += '<div class="alert_layer">';
			alert_html += '<h2>알림</h2>';
			alert_html += '<div class="msg">'+msg+'</div>';
			alert_html += '<div class="btn_wrap"><div class="btn_center"><button type="button" class="btnF ver5 close"><span>닫기</span></button></div></div>';
			alert_html += '<button type="button" class="close">닫기</button>';
			alert_html += '</div>';

			return alert_html;
		},
		dim_func : function(type,dim){
			if(type){
				dim.fadeIn(c_alert.speed);
			}else{
				dim.fadeOut(c_alert.speed,function(){
					$(this).remove();
				});
			}
		},
		layer_func : function(type,layer){
			if(type){
				layer.addClass('show')
				.show()
				.animate({opacity:1},c_alert.speed)
				.css('margin-top',-(layer.outerHeight()/2)+'px');

				layer.find('.close').eq(0).focus();
			}else{
				layer.removeClass('show').addClass('hide').fadeOut(c_alert.speed,function(){
					$(this).remove();
				});
			}
		},
		close : function(obj){
			var dim,
				layer;

			layer = obj.closest('.alert_layer');
			dim = $('.alert_dim');

			c_alert.dim_func(false,dim);
			c_alert.layer_func(false,layer);
		},
		init : function(msg){
			var layer_html,
				layer_obj,
				layer_dim;

			layer_html = c_alert.set(msg);
			$('body').append(layer_html);
			layer_dim = $('.alert_dim');
			layer_obj = $('.alert_layer');

			c_alert.dim_func(true,layer_dim);
			c_alert.layer_func(true,layer_obj);
		}
	}


	$(document).on('click','.alert_layer .close',function(){
		c_alert.close($(this));
		return false;
	});

	// ajax 통신시 처리
	$(document).ajaxStart(function() {
		loading.init(true);
	}).ajaxStop(function() {
		loading.init(false);
	});

	loading.set();

	/* window open evt */
	var wpop = {
		btn : $('.btn_blank'),
		close : $('#wrap_pop .close'),
		url : '',
		w : '',
		h : '',
		titles : ''
	}

	var wpop_option = function(options){
		arr_option = new Array();
		arr_option = options.split(',');
		wpop.url = arr_option[0];
		wpop.w = arr_option[1];
		wpop.h = arr_option[2];
		wpop.titles = arr_option[3];
	}

	wpop.btn.on('click',function(){
		wopt = '';
		wopt = $(this).attr('data-option');
		other_option = 'toolbar=no, menubar=no, location=no, status=no, channelmode=yes';
		wpop_option(wopt);
		window.open(wpop.url, wpop.titles, 'width='+wpop.w+', height='+wpop.h+','+other_option);
		return false;
	});

	/* 수정 저장 */
	var btnModify = {
		wrap : $('.modify_cont'),
		input_ : $('.modify_cont .modify_input')
	}

	btnModify.wrap.find('.modify').on('click',function(){
		modi_wrap = $(this).parent();
		modi_wrap.find('.modify_input').addClass('active').attr('disabled',false);
		modi_wrap.find('.save').show();
		$(this).hide();
	});

	btnModify.wrap.find('.save').on('click',function(){
		modi_wrap = $(this).parent();
		modi_wrap.find('.modify_input').removeClass('active').attr('disabled',true);
		modi_wrap.find('.modify').show();
		$(this).hide();
	});

	/* table 안의 데이터 펼침 접기 */
	var table_sh = {
		btn_show : $('.btnShow'),
		btn_hide : $('.btnHide')
	}

	table_sh.btn_hide.on('click',function(){
		have_td = $(this).parent().parent().parent().parent().parent();
		have_td.find('table').hide();
		have_td.find('.btnShow').show();
		return false;
	});

	table_sh.btn_show.on('click',function(){
		$(this)
		.hide()
		.find('+ table').show();
	});

	var delete_final = {
		btn : $('.delete_final'),
		cont : $('#delete_after_category')
	}

	var delete_cont_evt = function(obj){
		if(obj == 'show'){
			delete_final.cont.show();
		}else{
			delete_final.cont.hide();
		}
	}

	delete_final.btn.on('click',function(){
		delete_cont_evt('show');
	});

	// memo Layer
	var memo = {
		items : $('table td .memo'),
		layer : $('.memoLayerWrap'),
		close : $('.memoLayer a.close'),
		speed : 300
	}

	memo.close.on('click',function(){
		memo.layer.fadeOut(memo.speed);
		return false;
	});

	memo.items.on('click',function(){
		$(this).parent().find('.memoLayerWrap').fadeIn(memo.speed);
		return false;
	});

	// radioWrap head event
	var radioW = {
		items : $('.radioWrap .head > input[type="radio"]'),
		cont : $('.radio_cont')
	}

	radioW.items.on('click',function(){
		radioW.cont.hide();
		$('.'+$(this).attr('id')).show();
	});

	if($(document).width() > 1280){
		docu_width = $(document).width();
		//$('#footer').css('min-width',docu_width+'px');
		//$('#header').css('min-width',docu_width+'px');
	}

	// radio evt
	var radioL = {
		items : $('.radio_sort'),
		cont : $('.radio_sort_cont')
	}

	radioL.items.on('click',function(){
		radioL.cont.hide();
		$('#'+$(this).val()).show();
	});

	$(window).on("load", function(){
		if(radioL.items.length > 0){
			radioL.cont.hide();
			$('#'+$('.radio_sort:checked').val()).show();
		}
	});

	// input placeholder
	var placeholder_set = function(){
		$('.placeholder').each(function(){
			place_val = $(this).find('input').val();
			if(place_val != ''){
				$(this).find('input').css('z-index','5')
				.find('+label').css('text-indent','-9999px');
			}
		});
	}

	placeholder_set();

	var placeholder_input = $('.placeholder');
	placeholder_input.on('click',function(){
		$(this).find('input').focus().css('z-index','5')
		.find('+label').css('text-indent','-9999px');
	});

	placeholder_input.find('input').on('focusout',function(){
		input_text = $(this).val();
		if(input_text == ''){
			$(this).css('z-index','-1')
			.find('+label').css('text-indent','0');
		}else{

		}
	});

	// all check
	var allchcek = {
		btn : $('.allCheckWrap .allCheck'),
		inputs : $('.allCheckWrap .all_check'),
		items : $('.allCheckWrap table td input:checkbox')
	}

	allchcek.btn.on('click',function(){
		this_val = $(this).find('> span').text();
		if(this_val == '전체선택'){
			$(this).find('> span').text('선택해제');
			allchcek.items.prop('checked',true);
		}else{
			$(this).find('> span').text('전체선택');
			allchcek.items.prop('checked',false);
		}
	});

	allchcek.inputs.on('click',function(){
		this_val = $(this).attr('title');
		if(this_val == '전체선택'){
			$(this).attr('title','선택해제');
			$(this).parent().parent().parent().parent().find('input:checkbox').prop('checked',true);
		}else{
			$(this).attr('title','전체선택');
			$(this).parent().parent().parent().parent().find('input:checkbox').prop('checked',false);
		}
	});

	// Callendar class add
	$('.sheetCallendar tr').each(function(){
		$(this).find('th:first').addClass('sun');
		$(this).find('th:last').addClass('sat');
		$(this).find('td:first').addClass('sun');
		$(this).find('td:last').addClass('sat');
	});

	var dateFormat = "yy-mm-dd",
	from = $( "#from" )
	.datepicker({
		defaultDate: "+1w",
		changeMonth: true,
		changeYear: true, // 년을 바꿀 수 있는 셀렉트 박스를 표시한다.
		minDate: '-10y', // 현재날짜로부터 100년이전까지 년을 표시한다.
		dateFormat: "yy-mm-dd", // 텍스트 필드에 입력되는 날짜 형식.
		showMonthAfterYear: true , // 월, 년순의 셀렉트 박스를 년,월 순으로 바꿔준다.
		dayNamesMin: ['일','월', '화', '수', '목', '금', '토'], // 요일의 한글 형식.
		monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] // 월의 한글 형식.
	})
	.on( "change", function() {
		to.datepicker( "option", "minDate", getDate( this ) );
	}),
	to = $( "#to" ).datepicker({
		defaultDate: "+1w",
		changeMonth: true,
		changeYear: true, // 년을 바꿀 수 있는 셀렉트 박스를 표시한다.
		minDate: '-10y', // 현재날짜로부터 100년이전까지 년을 표시한다.
		dateFormat: "yy-mm-dd", // 텍스트 필드에 입력되는 날짜 형식.
		showMonthAfterYear: true , // 월, 년순의 셀렉트 박스를 년,월 순으로 바꿔준다.
		dayNamesMin: ['일','월', '화', '수', '목', '금', '토'], // 요일의 한글 형식.
		monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] // 월의 한글 형식.
	})
	.on( "change", function() {
		from.datepicker( "option", "maxDate", getDate( this ) );
	});

	from2 = $( "#from2" )
	.datepicker({
		defaultDate: "+1w",
		changeMonth: true,
		changeYear: true, // 년을 바꿀 수 있는 셀렉트 박스를 표시한다.
		minDate: '-10y', // 현재날짜로부터 100년이전까지 년을 표시한다.
		dateFormat: "yy-mm-dd", // 텍스트 필드에 입력되는 날짜 형식.
		showMonthAfterYear: true , // 월, 년순의 셀렉트 박스를 년,월 순으로 바꿔준다.
		dayNamesMin: ['일','월', '화', '수', '목', '금', '토'], // 요일의 한글 형식.
		monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] // 월의 한글 형식.
	})
	.on( "change", function() {
		to.datepicker( "option", "minDate", getDate( this ) );
	}),
	to2 = $( "#to2" ).datepicker({
		defaultDate: "+1w",
		changeMonth: true,
		changeYear: true, // 년을 바꿀 수 있는 셀렉트 박스를 표시한다.
		minDate: '-10y', // 현재날짜로부터 100년이전까지 년을 표시한다.
		dateFormat: "yy-mm-dd", // 텍스트 필드에 입력되는 날짜 형식.
		showMonthAfterYear: true , // 월, 년순의 셀렉트 박스를 년,월 순으로 바꿔준다.
		dayNamesMin: ['일','월', '화', '수', '목', '금', '토'], // 요일의 한글 형식.
		monthNamesShort: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'] // 월의 한글 형식.
	})
	.on( "change", function() {
		from.datepicker( "option", "maxDate", getDate( this ) );
	});

	function getDate( element ){
		var date;
		try{
			date = $.datepicker.parseDate( dateFormat, element.value );
		}catch( error ){
			date = null;
		}

		return date;
	}

	// sheetListB stylesheet
	$('.sheetListB > thead > tr > th:last').addClass('last_child');

	var $container = $('#container');
	var containerHeightSet = function(){
		winH = $(window).height();
		headerH = $('#header').height();
		footerH = $('#footer').height();
		minHeight = winH-(headerH+footerH);
		$container.css('min-height',minHeight+'px');
	}

	containerHeightSet();

auto_search = {
	$trigger : $('.auto_search_input'),
	data_init : function(obj_wrap){
		var this_items,
			data_arr;

		data_arr = new Array();
		this_items = obj_wrap.find('.addItems span');
		this_items.each(function(index){
			data_arr[index] = $(this).attr("data-val");
		});

		return data_arr;
	},
	add_data_init : function(obj_wrap){
		var data_field,
			insert_val;

		data_field = obj_wrap.find('.auto_input');
		insert_val = '';
		obj_wrap.find('.addItems span').each(function(index){
			insert_val += (index ==0 ) ? $(this).attr('data-val') : ','+$(this).attr('data-val');
		});

		data_field.val(insert_val);
	},
	add_init : function(data, keyword, wrap){
		keyword = keyword.toUpperCase();
		var data_arr,
			data_html;

		data_arr = data;
		data_html = '';
		if(data_arr.length > 0){
			data_html += '<div class="searchAutoBox">';
			for (key in data_arr) {

				data_html += '<a href="#" class="saItem" data-val="'+data_arr[key].id+'">'+data_arr[key].value.replace(keyword,'<em>'+keyword+'</em>')+'<span class="btn_add"><img src="'+IMG_WEB_ROOT+'/images/ico/ico_add.png" alt="추가"></span></a>';
			}
			data_html += '</div>';
		}
		wrap.find('.search_result_join').html(data_html);
	},
	add_result : function(data){
		var this_wrap,
			add_html,
			add_data,
			this_data_arr;

		this_wrap = data.closest('.addWrap');
		this_data_arr = auto_search.data_init(this_wrap);

		add_html = '';
		add_data = data.text();
		add_key = data.attr('data-val');

		if(this_data_arr.indexOf(add_key) == -1){
			add_html += '<span data-val="'+add_key+'" class="error">'+add_data+'<a href="#"><img src="'+IMG_WEB_ROOT+'/images/ico/ico_del.png" alt="삭제"></a></span>';
			this_wrap.find('.addItems').append(add_html);
		}else{
			c_alert.init('이미 추가되었습니다.');
		}

		auto_search.add_data_init(this_wrap);
	},
	call_init : function(term, url, wrap){
		$.ajax({
			type: "POST",
			dataType: "jsonp",
			url: url,
			data: {
				term: term
			},
			success: function(data){
				auto_search.add_init(data, term, wrap);
			}
		});
	},
	filter_init : function(input_obj){
		var keyword,
			this_wrap;

		keyword = input_obj.val();
		this_wrap = input_obj.closest('.addWrap');
		url = input_obj.attr('data-url');
		if(keyword.length > 1){
			auto_search.call_init(keyword, url, this_wrap);
		}
	}
}

$(document).on('keyup', '.auto_search_input', function(){
	auto_search.filter_init($(this));
});

$(document).on('click', '.saItem', function(){
	auto_search.add_result($(this));
	return false;
});

$(document).on('click', '.addItems a', function(){
	var this_type,
		this_wrap;

	this_type = $(this).attr('data');
	this_wrap = $(this).closest('.addWrap');
	if(this_type != ''){
		//
	}

	$(this).closest('span').remove();
	auto_search.add_data_init(this_wrap);

	return false;
});

$(document).on('click', '.photo_delete', function(){
	var this_wrap,
		this_item,
		clone_input_photo;

	this_wrap = $(this).closest('.input_file');
	this_item = $(this).closest('.add_photo_item');
	this_item.remove();

	clone_input_photo = this_wrap.html();
	this_wrap.html(clone_input_photo);
});

this_audio;
c_file = {
	$item : $('.input_file input:file'),
	set : () => {
		c_file.$item.each(function(index){
			$(this).attr('data-index', index);
		});
	},
	delete : (obj) => {
		var this_file_wrap,
			this_file_input_wrap,
			this_index,
			clone_input;

		clone_input = '';
		this_file_wrap = obj.closest('.file_name');
		this_file_input_wrap = this_file_wrap.closest('.input_file');
		this_file_wrap.html('');
		clone_input = this_file_input_wrap.html();
	},
	audio_init : (obj) => {
		var file_url,
			this_state;

		file_url = obj.attr('data-url');
		this_state = obj.attr('class');
		if(this_state.indexOf('pause') == -1){
			obj.addClass('pause');
			this_audio = new Audio(file_url);
			this_audio.play();
		}else{
			obj.removeClass('pause');
			this_audio.pause();
		}
	},
	init_type_img : (input_obj, img_url) => {
		var img_html,
			this_file,
			this_wrap;

		this_file = input_obj[0].files[0];
		this_wrap = input_obj.closest('.input_file');

		if(!this_file.type.match("image.*")){
			c_alert.init('이미지만 등록하실수 있습니다.');
		}else{
			img_html = '';
			img_html += '<div class="add_photo_item">';
			img_html += '<img src="'+img_url+'" />';
			img_html += '<button type="button" class="photo_delete">삭제</button></div>';

			if(img_html != ''){
				this_wrap.find('.add_photo_box').html(img_html);
			}
		}
	},
	init : (input_obj, mp3_url) => {
		var file_name,
			file_wrap,
			this_file,
			file_name_field,
			audio_field,
			file_url,
			audio_html;

		file_wrap = input_obj.closest('.input_file');
		file_name_field = file_wrap.find('.file_name');
		file_url = mp3_url;
		this_file = input_obj[0].files[0];

		if(window.FileReader){
			file_name = input_obj[0].files[0].name;
		}else{
			file_name = input_obj.val().split('/').pop().split('\\').pop();
		}

		if(file_name.indexOf('mp3') > -1){
			if(browser_type == 'standard'){
				audio_html = '<audio controls="controls"><source src="'+file_url+'" type="audio/mpeg" />Your browser does not support the audio element.</audio>';
			}else{
				audio_html = '<button type="button" class="audio_player" data-url="'+file_url+'"></button>';
			}
			audio_html += '<button type="button" class="voice_delete"><img src="'+IMG_WEB_ROOT+'/images/ico/ico_del.png" alt="삭제"></button>';

			file_name_field.html(file_name + audio_html);

		}else{
			c_alert.init('mp3파일만 등록하실수 있습니다.');
		}
	}
}

$(document).on('click', '.voice_delete', function(){
	c_file.delete($(this));
	return false;
});

$(document).on('click', '.audio_player', function(){
	c_file.audio_init($(this));
	return false;
});


$(document).on('click', function(event){
	var state_auto_search;

	// caetgory
	state_category = $('.searchAutoBox').length;
	if(state_category > 0){
		if(!$('.searchAutoBox').has(event.target).length){
			$('.searchAutoBox').remove();
		}
	}
});

$(document).on('change', '.input_file input:file', function(){
	var type,
		file_url;

	type = $(this).attr('file-type');
	file_url = URL.createObjectURL(this.files[0]);
	if(type == 'image'){
		c_file.init_type_img($(this), file_url);
	}else{
		c_file.init($(this), file_url);
	}
});

if(c_file.$item.length > 0){
	c_file.set();
}

add_templates = {
	$trigger : $('.qu_type_add'),
	delete : (obj) => {
		let this_box,
			this_index,
			this_wrap,
			boxs,
			confirm_result,
			number_label;

		this_box = obj.closest('.addBox');
		this_wrap = this_box.closest('.addContentsItem');

		confirm_result = confirm('삭제 하시겠습니까?');
		if(confirm_result){
			this_box.remove();
		}

		boxs = this_wrap.find('.addBox');
		$.each(boxs, function(index){
			number_label = $(this).find('.label input:text');
			if(number_label.length > 0){
				number_label.val(index + 1);
			}
		});
	},
	clone_reset : (clone_obj) => {
		let all_inputs,
			tag_type,
			type_name,
			tag_add_obj;

		all_inputs = clone_obj.find(':input');
		$.each(all_inputs, function(index){
			tag_type = this.tagName.toLowerCase();
			switch(tag_type){
				case 'input' :
					type_name = $(this).attr('type').toLowerCase();
					if(type_name == 'radio' || type_name == 'checkbox'){
						if($(this).prop('checked')){
							$(this).prop('checked', false);
						}
					}else if(type_name == 'file'){
						let file_box;

						file_box = $(this).closest('.input_file');
						file_box.find('.file_name').html('');
						file_box.html(file_box.html());
					}else{
						$(this).val('');
					}
					break;
				case 'textarea' :
					$(this).val('');
					break;
				case 'select' :
					if($(this).find('option:selected').length > 0){
						$(this).find('option:selected').prop('selected', false);
					}
					break;
			}
		});

		// 태그/어휘 자동검색 영역 있을때 초기화
		tag_add_obj = clone_obj.find('.addWrap');
		if(tag_add_obj.length > 0){
			$.each(tag_add_obj, function(){
				$(this).find('.addItems').html('');
				$(this).find('.search_result_join').hide();
			});
		}

		return clone_obj;
	},
	clone_init : (obj) => {
		let target,
			add_index,
			clone_container;

		target = $('#'+obj.attr('data-target'));
		add_index = target.find('.addBox').length;
		clone_container = add_templates.clone_reset(target.find('.addBox').eq(0).clone());
		clone_container.find('.label input:text').val(add_index + 1);
		target.append(clone_container);

		if(target.length  == 0){
			console.log('target 매칭 오류! 버튼의 data-target값과 해당 id값이 설정된 division 확인');
		}else{

		}
	}
}

add_templates.$trigger.on('click', function(){
	add_templates.clone_init($(this));
	return false;
});

$(document).on('click', '.qu_type_del', function(){ // 부분 삭제
	add_templates.delete($(this));
	return false;
});

partial = {
	file_init : (obj) => {
		var this_obj,
			target_form,
			this_file,
			this_name,
			other_data;

		this_obj = obj;
		target_form = $('#'+this_obj.attr('data-target'));
		var formData = new FormData();

		$("#toeic_origin").attr("disabled", false);
		$("#PART").attr("disabled", false);

		$.each(target_form.find('input:file'), function(){
			this_file = $(this)[0].files[0];
			this_name = $(this).attr('name');
			if(this_file) formData.append(this_name, this_file);
			if(this_name == '') console.log('name값이 미설정 되었습니다.');
		});

		other_data = target_form.find(':input').serializeArray();
		$.each(other_data,function(key, input){
			formData.append(input.name, input.value);
		});
		code = $("#QUESTION_MAIN_SEQ").val();
		mode = (code!='') ? 'edit' : 'add';  
		formData.append("mode", mode);
		$.ajax({
			url: '/question/question_proc',
			type: 'POST',
			dataType:'json',
			data: formData,
			processData: false,
			contentType: false,
			success: function(data){
				$("#toeic_origin").attr("disabled", true);
				$("#PART").attr("disabled", true);
			}
		});
	}
}
$(document).on('click', '.btn_partial_submit', function(){
	var this_form_data;

	this_form_data = partial.file_init($(this));
});
/*
var checkUnload = true;
$(window).on("beforeunload", function(){
	if(checkUnload) return "이 페이지를 벗어나면 작성된 내용은 저장되지 않습니다.";
});
*/
