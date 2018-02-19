
// 이미지 정보
var thumb_list = [];
var thumbImgFileSelect = function (e) {
	var files = e.target.files;
	f = files[0];
	if(!f.type.match("image.*")) {
		alert("확장자는 이미지 확장자만 가능합니다.");
		return;
	}

	thumb_list.push(f);
	var reader = new FileReader();
	reader.onload = function(e) {
		html = "<a href=\"javascript:;\" onclick=\"thumbImgFileDel()\" id=\"thumb_img_id\">";
		html += "<img src=\"" + e.target.result + "\" data-file='"+f.name+"' style='width:100px;' title='Click to remove'>";
		html += f.name + " 삭제</a>";
		$(".bn-img").html(html);
	};
	reader.readAsDataURL(f);
}
var thumbImgFileDel = function () {
	thumb_list.splice(0, 1);
	$("#thumb_img_id").remove();
}

// 이미지 정보들을 담을 배열
var detail_list = [];
var detailImgFileSelect = function (e) {
	var files = e.target.files;
	var filesArr = Array.prototype.slice.call(files);
	var htmlArr =[];
	for(var kk=0;kk<filesArr.length;kk++) {
			var key = filesArr[kk].name;
			var val = filesArr[kk];
			htmlArr[key] = val;
	}
	var idx = 0;
	htmlArr = SortArrayByKeys(htmlArr);
	for(key in htmlArr) {
			f = htmlArr[key];
			setHtml(idx, f);
			idx++;
	}
}

var setHtml = function (idx, f) {
		if(!f.type.match("image.*")) {
			alert("확장자는 이미지 확장자만 가능합니다.");
			return;
		}

		detail_list.push(f);
		var classname = makerandom(10)+idx;
		var reader = new FileReader();
		div = $('<li class="'+classname+'"></li>');
		$(".bn-img2").append(div);

		reader.onload = function(e) {
			html = "<a href=\"javascript:;\" onclick=\"detailImgFileDel('"+classname+"', '"+idx+"')\" id=\"img_id_"+classname+"\">";
			html += "<img src=\"" + e.target.result + "\" data-file='"+f.name+"' style='width:100px;' title='Click to remove'>";
			html += f.name + " 삭제</a>";
			$("."+classname).append(html);
		};
		reader.readAsDataURL(f);
}


var detailImgFileDel = function (classname, idx) {
	detail_list.splice(idx, 1);
	var img_id = "#img_id_"+classname;
	$(img_id).remove();
}

// 이벤트 등록하기
var promotion_submit = function (opt) {

	if (is_promotion()) {

		cnt1= $(".bn-img > img").size();
		if(thumb_list.length < 1 && cnt1 < 1) {
			alert("쎔네일 파일을 선택해주세요.");
			return;
		}

		cnt2= $(".bn-img2 > li").size();
		if(detail_list.length < 1 && cnt2 < 1) {
			alert("한개이상의 파일을 선택해주세요.");
			return;
		}
		var formData = new FormData();
		formData.append("thumb_img", thumb_list[0]);
		for(var i=0, len=detail_list.length; i<len; i++) {
			formData.append("detail_img[]", detail_list[i]);
		}
		var other_data = $('#promotion_form').serializeArray();
		$.each(other_data,function(key,input){
			formData.append(input.name,input.value);
		});
		$.ajax({
			url: '/promotion/insert/'+opt,
			type: 'POST',
			dataType:'json',
			data: formData,
			processData: false,
			contentType: false,
			success: function(data){
					if(Number(data[0]) == 1){
						alert(data[1]);
						location.href="/promotion/";
					}else {
						alert(" 오류 관리자에게 문의 바람");
					}
			},
			error: function(e) {
				alert("에러발생!!");
				console.log(e);
			}
		});

	}

} // function


