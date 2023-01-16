
$(document).ready(function () {
show_record();
});



function show_record() {
    $.ajax({
        type: 'GET',
        url: '/record_data',
        data: {},
        success: function (response) {

            let rows=response['records']

            for (let i = 0; i < rows.length; i++) {
                let name = rows[i]['name']
                let url = rows[i]['url']
                let comment = rows[i]['comment']
                let category = rows[i]['category']
                let category_genre = ' '
                if(category==1){
                    category_genre='힙합'
                }
                else if (category==2){
                    category_genre='발라드'
                }
                else if (category==3){
                    category_genre='재즈'
                }else if (category==4){
                    category_genre='락'
                }
                let image = rows[i]['image']
                let num = rows[i]['num']
                let done = rows[i]['done']
                let temp_html =  ``
                if(done == 0){
                    temp_html = `<li>
                                     <a href="${url}">
                                         <div class="img_wrap">
                                             <img src="${image}" alt="플레이 리스트">
                                         </div>
                                         <div class="text_wrap">
                                             <p>${name}</p>
                                             <p>${category_genre}</p>
                                             <span>코멘트 : ${comment}</span>
                                         </div>
                                     </a>
                                     <button onclick="jjim_done(${num})">찜♥</button>
                                </li>`
                }else if(done == 1){
                    temp_html = `<li>
                                     <a href="${url}">
                                         <div class="img_wrap">
                                             <img src="${image}" alt="플레이 리스트">
                                         </div>
                                         <div class="text_wrap">
                                             <p>${name}</p>
                                             <p>${category_genre}</p>
                                             <span>코멘트 : ${comment}</span>
                                         </div>
                                     </a>
                                     <button onclick="jjim_del(${num})">찜취소</button>
                                </li>`
                }
                $('#list-form').append(temp_html)
            }
        }

    });
}


// 검색 기능
function searching(){

    // let search_genre = $('#search').val()
    // alert(search_genre)

    $.ajax({
        type: 'GET',
        url: '/record_search',
        data: {},
        success: function (response) {
            let rows = response['searching']

            $('#list-form').empty()

            let search_name = $('#search').val()

                for(let i = 0; i<rows.length; i++){
                    let name = rows[i]['name']
                    let url = rows[i]['url']
                    let comment = rows[i]['comment']
                    let category = rows[i]['category']
                    let category_genre = ' '
                    if(category==1){
                        category_genre='힙합'
                    }
                    else if (category==2){
                        category_genre='발라드'
                    }
                    else if (category==3){
                        category_genre='재즈'
                    }else if (category==4){
                        category_genre='락'
                    }
                    let image = rows[i]['image']
                    let num = rows[i]['num']
                    let done = rows[i]['done']


                    if(search_name == category_genre){
                        let temp_html =  `<li>
                                     <a href="${url}">
                                         <div class="img_wrap">
                                             <img src="${image}" alt="플레이 리스트">
                                         </div>
                                         <div class="text_wrap">
                                             <p>${name}</p>
                                             <p>${category_genre}</p>
                                             <span>코멘트 : ${comment}</span>
                                         </div>
                                     </a>
                                </li>`
                    $('#list-form').append(temp_html)
                    } else if(name.includes(search_name)){
                        let temp_html =  `<li>
                                     <a href="${url}">
                                         <div class="img_wrap">
                                             <img src="${image}" alt="플레이 리스트">
                                         </div>
                                         <div class="text_wrap">
                                             <p>${name}</p>
                                             <p>${category_genre}</p>
                                             <span>코멘트 : ${comment}</span>
                                         </div>
                                     </a>
                                </li>`
                    $('#list-form').append(temp_html)
                    }else if (search_name == ' '){
                        let temp_html =  `<li>
                                     <a href="${url}">
                                         <div class="img_wrap">
                                             <img src="${image}" alt="플레이 리스트">
                                         </div>
                                         <div class="text_wrap">
                                             <p>${name}</p>
                                             <p>${category_genre}</p>
                                             <span>코멘트 : ${comment}</span>
                                         </div>
                                     </a>
                                </li>`
                    $('#list-form').append(temp_html)
                    }
                }
        }
    });

}

function jjim_post() {
    $('#list-form').empty()
   $.ajax({
        type: 'GET',
        url: '/jjim',
        data: {},
        success: function (response) {
            let rows = response['jjim']

            alert('test')

                for(let i = 0; i<rows.length; i++){
                    let name = rows[i]['name']
                    let url = rows[i]['url']
                    let comment = rows[i]['comment']
                    let category = rows[i]['category']
                    let category_genre = ' '
                    if(category==1){
                        category_genre='힙합'
                    }
                    else if (category==2){
                        category_genre='발라드'
                    }
                    else if (category==3){
                        category_genre='재즈'
                    }else if (category==4){
                        category_genre='락'
                    }
                    let image = rows[i]['image']
                    let num = rows[i]['num']
                    let done = rows[i]['done']
                    let temp_html = ``


                    if(done == 1){
                        temp_html = `<li>
                                     <a href="${url}">
                                         <div class="img_wrap">
                                             <img src="${image}" alt="플레이 리스트">
                                         </div>
                                         <div class="text_wrap">
                                             <p>${name}</p>
                                             <p>${category_genre}</p>
                                             <span>코멘트 : ${comment}</span>
                                         </div>
                                     </a>
                                     <button onclick="jjim_del(${num})">찜취소</button>
                                </li>`
                    } else {
                        console.log(done)
                    }
                    $('#list-form').append(temp_html)
                }
        }
    });
}


function jjim_done(num) {
    $.ajax({
                type: "POST",
                url: "/record_jjim_done",
                data: {num_give: num},
                success: function (response) {
                    // 새로고침
                    alert(response['msg'])
                    window.location.reload()
                }
            });
}

function jjim_del(num){
    $.ajax({
                type: "POST",
                url: "/record_jjim_del",
                data: {num_give: num},
                success: function (response) {
                    // 새로고침
                    alert(response['msg'])
                    window.location.reload()
                }
            });
}