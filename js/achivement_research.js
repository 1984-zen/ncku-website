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
            // ?????? paper ???????????????
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
            // ??????????????????????????? scopus_id
            let id = $(this).data('scopus_id'); // Array [ 56460576600, 57226617602 ]
            membersScopus.push(id)
        });

        for (let id of membersScopus) {
            // [[??????1_scopus_id_1, ??????1_scopus_id_2], [??????2_scopus_id_1]]]
            // integratePapers ????????????paper ???????????????????????????????????????????????? json ?????????????????????????????????????????????????????????papers???????????? 
            // Zen ??????????????? Article ??????
            // [papers, papersCount] = await integratePapers(id);
            // Zen ??????????????? Article ??????
            // [articles, articlesCount] = await getArticles(papers);

            // ???????????????2?????? article title ?????? ???????????? ??????
            // let getTopTwoArticles = []
            // // i<2 ????????? 2 ?????? paper ??????
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
            //     // personalPaperList ?????? 2 ?????? paper HTML??????
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

            // ????????????????????? achievement HTML???????????? scopus_id
            $('.member').each(function (index, value) {
                // data ???????????? data-* ??????
                // ???????????????HTML???????????? scopus_id ???????????????????????????paper (personalPaperList) ??? scopus_id
                if ($(this).data('scopus_id') == id) {
                    
                    $(this).find(".article_index .count").text(articlesCount)
                    // ?????????????????? 2 ????????? append ?????????????????????
                    // $(this).append(personalPaperList)
                    let paperLinkOutsideButton = `<div><a href="${memberdata[index].outside_homepage}" class="paper_link_outside_button"><h3>???????????????????????????</h3></a></div>`
                    // ???"?????????????????????????????????"?????????(paperLinkOutsideButton) append ?????????????????????
                    $(this).append(paperLinkOutsideButton)
                }
            });
        }
    }
    // ??????????????????
    $(function () {
        $(".award_anchor").click(function () {
            $("html, body").animate(
                {scrollTop: $("#news").offset().top}, 
                1000)

            $(".research_anchor").removeClass("active")
            $(".award_anchor").addClass("active")
        })
    })
    // ???????????????
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