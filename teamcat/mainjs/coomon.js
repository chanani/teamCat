$(document).ready(function() {
	
	// GNB 메뉴
	$('.sub_gnbBg').hide();
	$('#gnb div.sub_gnb').hide();
	$('.depth2 .depth3').hide(); // 이미 없애놓음

	$('#gnb > ul > li > a').on("mouseover focusin", function(e) { 	
		e.preventDefault(); 
		$('#gnb div.sub_gnb').hide();
		$('.sub_gnbBg').hide();
		$('#gnb > ul > li').removeClass("active");
		
		$(this).parents("li").addClass("active");
		
		$(".sub_gnbBg").show();
		$(".sub_gnbBg").slideDown(10);
		$(this).parents("li").children(".sub_gnb").show();
		//$(this).addClass("on");

		var subGnbH = $(this).next('.sub_gnb').height();
		
		$('.sub_gnbBg').css('height', subGnbH + 40);
		$(this).parents("li").find(".info").css('height', subGnbH);
	});
	
	$('.gnb_area').mouseleave(function(e) {
		e.preventDefault(); gnbClose();
	});

	$('#gnb .help_job').focusin(function(e) {
		e.preventDefault(); gnbClose();
	});

	//$('#gnb a.gnb_close').click(function(e) {
	//	e.preventDefault();	gnbClose();
	//});
	
	$('.depth2 > li > a').hover (
			function() {
				$('.depth2 > li > a').parents(".depth").removeClass("active");
				$(this).parents(".depth").addClass("active");
				$('.depth2 > li > a').next(".depth3").hide()
				$(this).next(".depth3").show()
			}
	);
});

function gnbClose() {
	$('.sub_gnbBg').slideUp(10);
	$('#gnb div.sub_gnb').each( function (){
		$(this).slideUp(10);
	});
	$('#gnb > ul > li').removeClass("active");
}

//www/js/common.js 기존 사용안함 20161012 일자리포탈 리뉴얼에서 제거함 
//top navigation
//function topNavigation(mn) {
//	var nav = document.getElementById('gnb');
//	var navmn = nav.getElementsByTagName('li');
//
//	for (i=0; i<navmn.length; i++) {
//		if (i==mn) {
//			navmn[i].className = navmn[i].className + ' on';
//		}
//	}
//}
//
////left navigation
//function leftNavigation(mn,submn) {
//	var mn = document.getElementById('lnbmn'+mn);
//	var sbmn = mn.getElementsByTagName('li');
//	mn.className = 'on';
//
//	for (i=0; i<sbmn.length; i++) {
//		if (i==submn) {
//			sbmn[i].className = 'on';
//		}
//	}
//}
//
//
////tab navigation
//function tabNavigation(id,mn) {
//	var nav = document.getElementById(id);
//	var navmn = nav.getElementsByTagName('li');
//	
//	for (i=0; i<navmn.length; i++) {
//		navmn[i].className = '';
//		if (i==mn) {
//			navmn[i].className = navmn[i].className + ' on';
//		}
//	}
//}
//
////calender layer
//function calenData(num,leftpos,toppos) {
//	var calend = document.getElementById('calenderData'+num);
//	var anchor = calend.getElementsByTagName('table')[0].childNodes;
//
//	calend.style.left = leftpos + 'px';
//	calend.style.top = toppos + 'px';
//
//	document.getElementById('calenAct'+num).onclick = function() {
//		calend.style.display = 'block';
//		calend.focus();
//		return false;
//	};
//
//	for (i=0; i<anchor.length; i++) {
//		anchor[i].onclick = function() {
//			calend.style.display = 'none';
//			document.getElementById('calenAct'+num).focus();
//			return false;
//		};
//	}
//}
//
////action layer
///*
//function layerAction(id,leftpos,toppos) {
//	var target = document.getElementById(id+'Layer');
//	var anchor = document.getElementById(id+'Act');
//	var close = document.getElementById(id+'Close');
//
//	target.style.left = leftpos + 'px';
//	target.style.top = toppos + 'px';
//
//	anchor.onclick = function() {
//	tyView();
//		target.style.display = 'block';
//		target.focus();
//		return false;
//	};
//
//	close.onclick = function() {
//		target.style.display = 'none';
//		anchor.focus();
//		return false;
//	};
//}
//*/
//
////toggle
//function toggleList(id, tit_tag) {
//	var wrapper = document.getElementById(id),
//		titles = wrapper.getElementsByTagName(tit_tag),
//		tit_anchors = [];
//	init();
//	binder();
//	function init() {
//		var len = titles.length,
//			title,
//			anchor,
//			cont_id,
//			i = 0;
//		for (; i < len; i++) {
//			title = titles[i];
//			anchor = title.getElementsByTagName('a')[0];
//			tit_anchors.push(anchor);
//			cont_id = anchor.getAttribute('href', 2).split('#')[1];
//			anchor.content = document.getElementById(cont_id);
//		}
//	}
//	function binder() {
//		var t_len = titles.length,
//			ta_len = tit_anchors.length,
//			anchor,
//			i = 0;
//		for (; i < ta_len; i++) {
//			anchor = tit_anchors[i];
//			anchor.onclick = function () {
//				hideAll();
//				this.parentNode.className += ' on';
//				this.content.style.display = 'block';
//				return false;
//			};
//		}
//	}
//	function hideAll() {
//		var len = tit_anchors.length,
//			title,
//			anchor,
//			i = 0;
//		for (; i < len; i++) {
//			anchor = tit_anchors[i];
//			title = anchor.parentNode;
//			title.className = title.className.replace('on', '');
//			anchor.content.style.display = 'none';
//		}
//	}
//}
//
//window.onload = function () {
//	toggleList('toggListArea', 'h4');
//	toggleList('ntcListArea', 'h3');
//};