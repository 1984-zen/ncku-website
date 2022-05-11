(function ($) {

    let aboutMemberStr = ''

    async function fetchMemberData (fileName) {

        return response = await fetch(`${fileName}.json`, {
            cache: 'no-cache',
            method: 'GET',
            headers: new Headers({
                'Accet': 'application/json',
                }),
        })
    }

    function showAboutMembers (member_data) {

        for (let i=0;i<member_data.length; i++) {

            aboutMemberStr += ` \
            <div class="member" data-scopus_id ="${member_data[i].scopus_id}"> \
                <article class="about_member article_container_hidden"> \
                    <ul class="member_name"> \
                        <li> \
                            <h3>${member_data[i].name}</h3><span>${member_data[i].en_name}</span> \
                            <p>${member_data[i].occupation}</p> \
                        </li> \
                    </ul> \
                    <ul class="paper_status"> \
                        <li class="article_index"> \
                            <span class="count"></span> \
                            <!-- Article --> \
                        </li> \
                    </ul> \
                </article> \
            </div>`
        }
        $(".research_container").append(aboutMemberStr)
    }

    async function fetchJason (scopusId, startPage) {
        const url = new URL(`https://api.elsevier.com/content/search/scopus?query=AU-ID(${scopusId})&start=${startPage}&sort=+coverDate`)
        return response = await fetch(url, {
            cache: 'no-cache',
            method: 'GET',
            headers: new Headers({
                'Accet': 'application/json',
                'X-ELS-APIKey': '9f783b04aced809da35d7d96a4155fc5'
                }),
        })
    }

    async function getPersonalPapers (scopusId) {

        let data;
        let personalPaperArr = []
        // let startPage = 0
        // let response = await fetchJason(scopusId, startPage);
        

        // let data = await response.json();

        // let maxPage = Math.ceil(parseInt(data["search-results"]["opensearch:totalResults"])/25)
        let articleCount = parseInt(data["search-results"]["opensearch:totalResults"])

        let papers = data["search-results"]["entry"]

        for(let paperDetail of papers) {

            personalPaperArr.push(paperDetail)
        }

        return [personalPaperArr, articleCount]
    }

    async function getArticles (papers) {

        let results = [];

        for (let paper of papers) {

            if (paper["subtypeDescription"] == "Article") {

                results.push(paper)
            }
        }

        return [results, results.length]
    }

    async function integratePapers (id) {

        let papers;
        let results = [];

        for (let i=0;i<id.length;i++) {
                
            let response = await fetchMemberData(`json/${id[i]}`)
            response = await response.json()
            papers = response["search-results"]["entry"]

            for (let paper of papers) {

                results.push(paper)
            }
            // 所有 paper 按日期排序
            results.sort((a, b) => a["prism:coverDate"] - b["prism:coverDate"]);
        }

        return [results, results.length]
    }    

    async function main () {

        let memberdata = await fetchMemberData('json/member_data')
        memberdata = await memberdata.json()
        await showAboutMembers (memberdata)

        let membersScopus = [];
        let papers, papersCount;
        let articles, articlesCount;

        $('.member').each(async function (index, values) {
            // 一個一個拿到網頁的 scopus_id
            let id = $(this).data('scopus_id'); // Array [ 56460576600, 57226617602 ]
            membersScopus.push(id)
        });

        for (let id of membersScopus) {
            // [[醫生1_scopus_id_1, 醫生1_scopus_id_2], [醫生2_scopus_id_1]]]
            // integratePapers 整合醫生paper 檔案，因為可能一個醫生會擁有多個 json 檔案，所以需要先合併成一個存在解構賦值papers變數裡面 
            // Zen 取消掉顯示 Article 數量
            // [papers, papersCount] = await integratePapers(id);
            // Zen 取消掉顯示 Article 數量
            // [articles, articlesCount] = await getArticles(papers);

            // 開始收集前2筆的 article title 以及 年份日期 連結
            // let getTopTwoArticles = []
            // // i<2 只拿前 2 筆的 paper 資料
            // for (i=0;i<2;i++) {

            //     getTopTwoArticles.push(
            //         {
            //             articleTitle: articles[i]["dc:title"],
            //             coverDate: articles[i]["prism:coverDate"],
            //             link: articles[i]["prism:doi"]
            //         }
            //     )
            // }

            // let personalPaperList = '<div class="papers">'
            // for (article of getTopTwoArticles) {
            //     // personalPaperList 是前 2 筆的 paper HTML資料
            //     personalPaperList += `\
            //         <article class="paper_list_results"> \
            //             <a href="http://dx.doi.org/${article.link}"></a> \
            //             <header class="paper_list"> \
            //                 <h3>${article.articleTitle}</h3> \
            //             </header> \
            //             <p>Article, ${article.coverDate}</p> \
            //         </article>`
            // }
            // personalPaperList += '</div>'

            // 再一個一個比對 achievement HTML頁面上的 scopus_id
            $('.member').each(function (index, value) {
                // data 可以找到 data-* 的值
                // 如果網頁上HTML中的這個 scopus_id 等於這位醫師的個人paper (personalPaperList) 的 scopus_id
                if ($(this).data('scopus_id') == id) {
                    
                    $(this).find(".article_index .count").text(articlesCount)
                    // 把該醫師最新 2 筆資料 append 進該醫師的名下
                    // $(this).append(personalPaperList)
                    let paperLinkOutsideButton = `<div><a href="${memberdata[index].outside_homepage}" class="paper_link_outside_button"><h3>查看他所有研究文獻</h3></a></div>`
                    // 把"連到該醫師的臨醫所首頁"的按鈕(paperLinkOutsideButton) append 進該醫師的名下
                    $(this).append(paperLinkOutsideButton)
                }
            });
        }
    }
    // 捲到獲獎消息
    $(function () {
        $(".award_anchor").click(function () {
            $("html, body").animate(
                {scrollTop: $("#news").offset().top}, 
                1000)

            $(".research_anchor").removeClass("active")
            $(".award_anchor").addClass("active")
        })
    })
    // 捲到最上面
    $(function () {
        $(".research_anchor").click(function () {
            $("html, body").animate(
                {scrollTop: $("#app").offset().top}, 
                1000)

            $(".award_anchor").removeClass("active")
            $(".research_anchor").addClass("active")
        })
    })
    main()
})(jQuery);