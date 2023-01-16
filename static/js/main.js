$(document).ready(function () {
show_record();
});

function show_record() {
    $.ajax({
        type: 'GET',
        url: '/record_data',
        data: {},
        success: function (response) {
            console.log(response)
            let rows = response['records']
            for (let i = 0; i < rows.length; i++) {
                let name = rows[i]['name']
                let comment = rows[i]['comment']
                let category = rows[i]['category']
                let image = rows[i]['image']
                let num = rows[i]['num']
                let done = rows[i]['done']
                let temp_html =  `<li>
                                 <a href="javascrip:void(0)">
                                     <div class="img_wrap">
                                         <img src="${image}" alt="플레이 리스트">
                                     </div>
                                     <div class="text_wrap">
                                         <p>${name}</p>
                                         <span>조회수 : ${num}</span>
                                     </div>
                                 </a>
                            </li>`
                $('#list-form').append(temp_html)
            }
        }
    });
}

