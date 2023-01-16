
$(document).ready(function () {
    show_play_comment();
});
function show_play_comment(){

    $.ajax({
        type: "GET",
        url: "/play",
        data: {},
        success: function (response) {
            let rows = response["play"]
            for(i=0; i<rows.length;i++){
                let play_comment = rows[i]['comment']
                let num = rows[i]['num']
                let temp_html = `<li>
                                    <p>${play_comment}</p>
                                     <button onclick="comment_remove(${num})"type = "button"  class = "btn btn-dark" >삭제</button>
                                 </li>`
                $('#comment_box').append(temp_html)
            }
        }
    });
}
function save_play_comment(){
    let comment= $('#comment-detail').val()
    if(bucket.trim() == ''){
        alert('코멘드를 작성해주세요')
    }else {
        $.ajax({
            type: "POST",
            url: "/play",
            data: {comment_give:comment},
            success: function (response) {
                alert(response["msg"])
                window.location
            }
        });
    }
}
function comment_remove(num){
    $.ajax({
        type: "POST",
        url: "/play/remove",
        data: {num_give:num},
        success: function (response) {
            alert(response["msg"])
            window.location.reload()
        }
    });
}
