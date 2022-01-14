(function($) {

    var slideIndex = 1;
    showSlides(slideIndex);

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }

    $(".prev").click(function() {
        plusSlides(-1)
    })
    $(".next").click(function() {
        plusSlides(1)
    })

    function currentSlide(n) {
        showSlides(slideIndex = n);
    }

    $(".dot").click(function() {
        currentSlide($(this).attr("data-dotNum"))
    })

    async function showSlides(n) {
        var i;
        var slides = document.getElementsByClassName("mySlides");
        var dots = document.getElementsByClassName("dot");
        if (n > slides.length) { slideIndex = 1 }
        if (n < 1) { slideIndex = slides.length }
        for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
        }
        for (i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" active", "");
        }
        slides[slideIndex - 1].style.display = "block";
        dots[slideIndex - 1].className += " active";
        var get_HTML_file_name = slides[slideIndex - 1].getAttribute('data-href')
        await $("main").load(`${get_HTML_file_name} main`)
    }
})(jQuery);