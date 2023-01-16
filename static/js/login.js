function login() {
    $.ajax({
        type: "POST",
        url: "/api/login",
        data: {id_give: $('#floatingInput').val(), pw_give: $('#floatingPassword').val()},
        success: function (response) {
            if (response['result'] == 'success') {
                $.cookie('mytoken', response['token']);

                alert('로그인 완료!')
                window.location.href = '/main'
            } else {
                // 로그인이 안되면 에러메시지를 띄웁니다.
                alert(response['msg'])
            }
        }
    })
}