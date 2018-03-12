// ui-search 定义
$.fn.UiSearch = function(){
	var ui = $(this);

	$('.ui-search-selected',ui).on('click',function(){
		$('.ui-search-select-list').show();
		return false;
	});

	$('.ui-search-select-list a',ui).on('click',function(){
		$('.ui-search-selected').text( $(this).text() );
		$('.ui-search-select-list').hide();
		return false;
	});

	$('body').click(function(){
		$('.ui-search-select-list').hide();
	});
}

/**
* @para (string) header tab组件的选项卡切换部分className,里面有若干个item
* @para (string) content tab组件的内容区域部分className，里面有若干个item
*/
// ui-tab 定义
$.fn.UiTab = function(header,content){
	var ui = $(this);
	var tabs = $(header,ui);
	var cons = $(content,ui);

	tabs.on('click',function(){
		// var index = tabs.index($(this));
		var index = $(this).index();
		tabs.removeClass('item_focus').eq(index).addClass('item_focus');
		cons.hide().eq(index).show();
		return false;
	});

	
}

// ui-backtop 定义
$.fn.UiBackTop = function(){
	var ui = $(this);
	var el = $('<a href="#" class="ui-backtop"></a>');
	ui.append(el);
	el.hide();

	var documentHeight = $(document).height();
	$(window).on('scroll',function(){
		var top = $(this).scrollTop();
		 // console.log(documentHeight);
		 // console.log(top);
		if(top > 200){
			el.show();
		}else{
			el.hide();
		}
	});
	el.on('click',function(){
		$(window).scrollTop(0);
	});
}


// ui-slider 定义
$.fn.UiSlider = function(){
	var ui = $(this);
	var slide_prev = $('.banner-slide-arrow .left');
	var slide_next = $('.banner-slide-arrow .right');
	var items = $('.banner-slide-wrap .item');
	var processItem = $('.banner-slide-process .item');
	var index = 0;
	var len = items.length;
	var timer = null;

	// 向前翻页的实现
	slide_prev.on('click',function(){
		index--;
		if(index < 0){
			index = len - 1;
		}
		
		changeImg();
		return false;
	});

	// 向后翻页的实现
	slide_next.on('click',function(){
		index++;
		if(index >= len){
			index = 0;
		}
		
		changeImg();
		return false;
	});

	// 自动轮播图片的函数
	$('.ui-slider').mouseover(function(){
		if(timer) clearInterval(timer);
	});
	$('.ui-slider').mouseout(function(){
		timer = setInterval(function(){
			index++;
			if(index >= len){
			index = 0;
		}
		changeImg();
		},3000);
	});
	$('.ui-slider').mouseout();

	// processItem点击修改图片
	processItem.on('click',function(){
		index = $(this).index();
		changeImg();
		return false;
	});

	// 封装的修改图片的函数
	function changeImg(){
		items.hide().eq(index).show();
		processItem.removeClass('item_focus').eq(index).addClass('item_focus');
	}
}


// ui-cascading
$.fn.UiCascading = function(){
	var ui = $(this);
	var selects = $('select',ui);

	selects.on('change',function(){
		var val = $(this).val;
		var index = selects.index(this);
		
		// 触发下一个select的更新，根据当前的值
		var where = $(this).attr('data-where');
		where = where ? where.split(','):[];
		where.push( $(this).val() );
		// 触发下一个之后的select的初始化
		selects.eq(index + 1).attr('data-where',where.join(','))
			   .triggerHandler('reloadOptions');

		ui.find('select:gt('+(index+1)+')').each(function(){
		  $(this).attr('data-where','')
		         .triggerHandler('reloadOptions');
		});
		 
	}).on('reloadOptions',function(){
		var method = $(this).attr('data-search');
		var args = $(this).attr('data-where').split(',');
		var data = AjaxRemoteGetData[ method ].apply(this,args);

		var select = $(this);
		select.find('option').remove();
		$.each( data ,function(i,item){
			// debugger;
			var el = $('<option value="'+item+'">'+item+'</option>');
			select.append(el);
		});

	});
	selects.eq(0).triggerHandler('reloadOptions');
}

// 页面的脚本逻辑
$(function(){
	$('.ui-search').UiSearch();
	$('.content-tab').UiTab('.caption > .item','.block > .item');
	$('.content-tab .block > .item').UiTab('.block-caption > .block-caption-item','.block-content > .block-content-item');
	$('body').UiBackTop();
	$('.ui-slider').UiSlider();
	$('.ui-cascading').UiCascading();
});