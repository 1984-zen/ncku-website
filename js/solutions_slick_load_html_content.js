(function ($) {

    $.urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results==null) {
            return null;
        }

        return decodeURI(results[1]) || 0;
    }
    // 判斷是否為數字
    function isRealNum(val){
        if (val === "" || val == null) {
            return false;
        }

        if (!isNaN(val)) {
            return true; 
        }
        else {
            return false;
        }
    }

    $(document).ready(function() {
        var slide_index = 0;
        
        // 啟動 slick slide 套件
        $('#solutions_slides_container').slick({
            dots: true,
            prevArrow: false,
            nextArrow: false
        });

        let max_index = $('.slick-slide:not(.slick-cloned)').length
        slide_index = decodeURIComponent($.urlParam('slide_index'));

        if (isRealNum(slide_index)) {
            slide_index = slide_index
        } else {
            slide_index = 0
        }

        if (slide_index <= max_index) {
            slide_index = slide_index
        }
        if (slide_index > max_index) {
            slide_index = 0
        }

        // 跑去指定的 slide index，第一張 slide index = 0
        $('#solutions_slides_container').slick('slickGoTo', slide_index);
        // 只執行第一次，拿到第一張 slide 的 html 名稱
        var currentHTMLFileName = $('.slick-active').data('href');
        // 載入第一張 slide 的 html
        $("main").load(`${currentHTMLFileName} main`)

        $('.slick-slide').bind('DOMSubtreeModified', async function() {
            // 監聽，每次執行滑動 slide 的時候就會抓取 html 名稱
            var currentHTMLFileName = $('.slick-active').data('href');
            // 載入每次滑動的該 html
            await $("main").load(`${currentHTMLFileName} main`)
        })
    });
})(jQuery);