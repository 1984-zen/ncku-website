$(function() {
    // 將 navigator 和 回首頁 logo 載入到 HTML
    $(".header_container").load("header.html");
    $("footer").last().load("footer.html");
});

$(window).scroll(function() {
    if ($(this).scrollTop() > 60)  {         /* 要滑動到選單的距離 */
        $('.header_container').addClass('navFixed');    /* 幫選單加上固定效果 */
    } else {
        $('.header_container').removeClass('navFixed'); /* 移除選單固定效果 */
    }
});

// ===============================偵測螢幕寬度 start
// 瀏覽器在 refresh 的時候做一次性判斷(refresh 當下只做一次)
$(document).ready(function() {
    if ($(this).width() > 768)  {
        $('.big_banner_container_mobile').addClass('big_banner_container_desktop');
        $('.big_banner_container_desktop').removeClass('big_banner_container_mobile');
    } else {
        $('.big_banner_container_desktop').addClass('big_banner_container_mobile');
        $('.big_banner_container_mobile').removeClass('big_banner_container_desktop');
    }
})
// 當瀏覽器在觸發寬度調整的時候執行(即時)
$(window).resize(function() {
    if ($(this).width() > 768)  {
        $('.big_banner_container_mobile').addClass('big_banner_container_desktop');
        $('.big_banner_container_desktop').removeClass('big_banner_container_mobile');
    } else {
        $('.big_banner_container_desktop').addClass('big_banner_container_mobile');
        $('.big_banner_container_mobile').removeClass('big_banner_container_desktop');
    }
});
// ===============================偵測螢幕寬度 end

// ===============================solutions 影片播放 start
$('main').on('click', '.introduce_video_container>button', function(event){ //只有用HTML的標籤和id能夠分辨出使用者是按了哪個按鈕，為了減少重複一樣的的code，所以決定用button標籤去做，在這個網站，只有播放影片才會使用button標籤
    var videoName = $(this).attr('data-videoName'); // 抓出摸到這個 button 的 data-videoName 值
    var videoPath = `./videos/${videoName}.mp4`;
    $('source')[0].src = videoPath; // 因為本頁只有一個HTML5的video標籤，裡面只包含1個source標籤，所以$('source')[0]是取第一個 source 標籤
    $("#video_light_box").fadeIn(400); // 讓用來播放 video 的父層css改為 display: block
    $("#video_light_box").css("display", "flex");
    let autoplayVideo = $("#videoclip")[0];
    autoplayVideo.load(); // 一定要這才能順利開始自動播放，否則會沒有任何影像
    autoplayVideo.play(); // 一定要這才能順利開始自動播放，否則會沒有任何影像
    event.preventDefault();
});

$('main').on('click', '.video_closebtn', function(event){
    $("#video_light_box").fadeOut(400); // 讓用來播放 video 的父層css改為 display: none
    event.preventDefault();
});

$('main').on('click', '.video_closebtn_full_screen_area', function(event){
    $("#video_light_box").fadeOut(400); // 讓用來播放 video 的父層css改為 display: none
    event.preventDefault();
});
// ===============================solutions 影片播放 end

// =============================== explore_genomics.html頁面蒐集使用者要搜尋 NCBI搜尋引擎 的關鍵字 start
// 滑鼠點擊送出
$('#formId>.button>.blue_button').click(function(){
    let myInputText = $('#myInputText').val();
    $('#formId').attr('action', `https://www.ncbi.nlm.nih.gov/medgen/?term=${myInputText}`);
    document.getElementById("formId").submit();
})
//鍵盤 Enter 送出
function EnterKey2Submit(keyCode){
    if (keyCode == 13) {
        let myInputText = $('#myInputText').val();
        $('#formId').attr('action', `https://www.ncbi.nlm.nih.gov/medgen/?term=${myInputText}`);
        document.getElementById("formId").submit();
    }
}
// =============================== end