/* global $:true */
/*jshint unused: false*/
+function ($) {
  "use strict";

  var getPage = function() {
    var $page = $(".page-current");
    if(!$page[0]) $page = $(".page").addClass("page-current");
    return $page;
  };

  //初始化页面中的JS组件
  $.initPage = function(page) {
    var $page = page ? $(page) : getPage();
    if(!$page[0]) $page = $(document.body);
    var $content = $page.hasClass("content") ? $page : $page.find(".content");

    $.initPullToRefresh($content);
    $.initInfiniteScroll($content);
    $.initCalendar($content);
    $.initIndexList($content);

    //extend
    if($.initSwiper) $.initSwiper($content);
    if($.initSwipeout) $.initSwipeout();  // don't pass $content because the swipeout element is not $content
  };


  if($.smConfig.showPageLoadingIndicator) {
    //这里的 以 push 开头的是私有事件，不要用
    $(window).on("pageLoadStart", function() {
      $.showIndicator();
    });
    $(window).on("pageAnimationStart", function() {
      $.hideIndicator();
    });
    $(window).on("pageLoadCancel", function() {
      $.hideIndicator();
    });
    $(window).on('pageLoadComplete', function() {
      $.hideIndicator();
    });
    $(window).on("pageLoadError", function() {
      $.hideIndicator();
      $.toast("加载失败");
    });
  }

  $(window).on('pageInit pageReinit', function() {
    $.hideIndicator();
    $.lastPosition({
      needMemoryClass: [
        '.content'
      ]
    });
  });

  $.init = function() {
    var $page = getPage().first();
    var id = $page[0].id;
    $.initPage();
    if($page.hasClass("page-inited")) {
      $page.trigger("pageReinit", [id, $page]);
    } else {
      $page.addClass("page-inited");
      $page.trigger("pageInit", [id, $page]);
    }
  };

  $(function() {
    FastClick.attach(document.body);
    if($.smConfig.autoInit) {
      $.init();
    }

    $(document).on("pageInitInternal", function(e, id, $page) {
      $.init();
    });
  });


}($);
