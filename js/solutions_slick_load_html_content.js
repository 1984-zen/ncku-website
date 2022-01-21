$(document).ready(function() {
    // 啟動 slick slide 套件
    $('#solutions_slides_container').slick({
        dots: true
    });
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