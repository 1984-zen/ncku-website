$('button').click(function(){ //只有用HTML的標籤和id能夠分辨出使用者是按了哪個按鈕，為了減少重複一樣的的code，所以決定用button標籤去做，在這個網站，只有播放影片才會使用button標籤
    var videoName = $(this).attr('data-videoName'); // 抓出摸到這個 button 的 data-videoName 值
    var videoPath = `./videos/${videoName}.mp4`;
    $('source')[0].src = videoPath; // 因為本頁只有一個HTML5的video標籤，裡面只包含1個source標籤，所以$('source')[0]是取第一個 source 標籤
    $("#video_light_box").fadeIn(400); // 讓用來播放 video 的父層css改為 display: block
    let autoplayVideo = $("#videoclip")[0];
    autoplayVideo.load(); // 一定要這才能順利開始自動播放，否則會沒有任何影像
    autoplayVideo.play(); // 一定要這才能順利開始自動播放，否則會沒有任何影像
});

$('.video_closebtn').click(function(){
    $("#video_light_box").fadeOut(400); // 讓用來播放 video 的父層css改為 display: none
});