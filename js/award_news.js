(async function($) {

    var newsDataPromise = (async function fetchNewsData (fileName) {
        // 頁面重新整理的時候會先去fetch()拿到 newsData 清單的 json 檔
        response = await fetch(`${fileName}.json`, {
            cache: 'no-cache',
            method: 'GET',
            headers: new Headers({
                'Accet': 'application/json',
                }),
        })
        
        return response
        
    })('json/award_news_data')

    // 這裡在處理把 promise 狀態的 newsData 轉成 json
    var newsData = await newsDataPromise
    var newsData = await newsData.json()
    // 處理完後 newsData 就是 json 了
    var tempData = newsData

    const pagerCount = 5; //每頁顯示幾筆
    var currentIndex = 1; //目前在第幾頁

    function show(data) {

        let maxPagerIndex = Math.ceil(tempData.length / pagerCount);
        let paginatorNumbers = ''
        let newsContentStr = ''
        
        for (let i=0;i<data.length;i++) {

            newsContentStr += ` \
            <article class="award_news ${data[i].year} ${data[i].display}"> \
                <a href="${data[i].link}"></a> \
                <header> \
                    <h3>${data[i].title}</h3> \
                </header> \
                <p>${data[i].date}</p> \
            </article>`
        }
        $("#news_list").html(newsContentStr);
        const showPagerSize = 3; //顯示分頁的數量
        let endPager;
        let initPager = 0;
        let showPagerStart = 1;
 
        // 如果currentIndex處於頁數列不移動的情況下: currentIndex 小於顯示頁數，因為currentIndex需要大於showPagerSize無條件進位的一半的時候，頁數列才會移動，showPagerSize=5的時候第4頁才會開始移動
        if (parseInt(currentIndex) <= showPagerSize && parseInt(currentIndex) <= Math.ceil(showPagerSize/2)) {
            // 但是有例外，而且當if 走進來裡面的 if 的時候就會停住。不繼續往外層的 else if 往下判斷了
            if (maxPagerIndex <= showPagerSize) {

                endPager = maxPagerIndex
                showPagerStart = initPager + 1
            } else {

                endPager = showPagerSize
                showPagerStart = initPager + 1
            }
            // 如果 currentIndex 符合頁數列移動的條件:
        } else if (parseInt(currentIndex) > Math.ceil(showPagerSize/2) && parseInt(currentIndex) + Math.ceil(showPagerSize/2) -1 < maxPagerIndex) {

            endPager = parseInt(currentIndex) + Math.ceil(showPagerSize/2) -1
            showPagerStart = parseInt(currentIndex) - Math.ceil(showPagerSize/2) +1
            // 如果 currentIndex 超過符合頁數列移動時:
        } else if (parseInt(currentIndex) + Math.ceil(showPagerSize/2) -1 >= maxPagerIndex) {

            endPager = maxPagerIndex
            initPager = maxPagerIndex - showPagerSize
            showPagerStart = initPager + 1
        }

        for (let j=showPagerStart;j<=endPager;j++) {

            if (j == currentIndex) {

                paginatorNumbers += ` \
                <span class="change_page active"> \
                    ${j} \
                </span>`
            } else {

                paginatorNumbers += ` \
                <span class="change_page"> \
                    ${j} \
                </span>`
            }
        }

        $("#paginatorNumbers").html(paginatorNumbers);

        return false;
    }
    
    function pager(data, count, index) {
        
        return data.filter(function(a) { // return True/ False 去放到陣列

            let i = data.indexOf(a); //目前資料的索引位置,data 就是裝True/Flase的陣列， i = [A, B, C, D].indexOf(B)
            return i >= count * (index - 1) && i < count * index;
        });
    }
    
    function rewriteTempData (newsData) {
        // tempData 等待接收更新好 newsData 的 display的資料
        tempData = []

        for (let i=0;i<newsData.length;i++) {
            // 如果 newsData 的 display 狀態是 'show' 的話
            if (newsData[i].display === 'show') {

                tempData.push(newsData[i])
            }
        }
    }

    function filterSelection(c) {
        // 這個 function 是依據 c 這個關鍵字去更新 newsData 的 display 狀態
        if (c == "all") {
            c = "";
        }

        // 直接更新獲獎消息的 newsData 中的 display 狀態
        for (let j=0; j<newsData.length;j++) {
            // 如果tempData[j].year這個字串中含有關鍵字c, 因為字串本身就是一個array，另外如果c=''的話.indexOf()值必定是0
            if (newsData[j].year.indexOf(c) > -1) {

                newsData[j].display = "show"
            } else {

                newsData[j].display = ""
            }
        }
        // 將更新好的 display 狀態的 newsData 準備要 push 進 tempData
        rewriteTempData(newsData);
        // 網頁顯示更新後的 newsData 也就是 tempData
        show(pager(tempData, pagerCount, currentIndex=1));
    }

    //######################### 分頁的 call back ####################

    $("#first").click(function() {
        currentIndex = 1;
        show(pager(tempData, pagerCount, currentIndex));
    });

    $("#prev").click(function() {
        currentIndex--;
        if (currentIndex < 1) {
            currentIndex = 1;
            alert("沒有上一頁了");
        } else {
            show(pager(tempData, pagerCount, currentIndex));
        }
    });

    $("#next").click(function() {
        currentIndex++;
        let maxPagerIndex = Math.ceil(tempData.length / pagerCount);
        if (currentIndex > maxPagerIndex) {
            currentIndex = maxPagerIndex;
            alert("沒有下一頁了");
        } else {
            show(pager(tempData, pagerCount, currentIndex));
        }
    });

    $("#last").click(function() {
        currentIndex = Math.ceil(tempData.length / pagerCount);
        show(pager(tempData, pagerCount, currentIndex));
    });

    $("#paginatorNumbers").on("click", ".change_page", function(e) {

        currentIndex = $(this).text().trim();
        show(pager(tempData, pagerCount, currentIndex));
        e.preventDefault();
    });

    
    //######################### 年份篩選的 call back ####################

    $(".selectYear").click(function() {
        const year = $(this).text().split('年')[0].trim();
        filterSelection(year);
    })

    $(".allYears").click(function() {
        filterSelection("all");
    })


    show(pager(tempData, pagerCount, currentIndex));
})(jQuery);