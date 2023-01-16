function register() {
    $.ajax({
        type: "POST",
        url: "/api/register",
        data: {
            id_give: $('#register-id').val(),
            pw_give: $('#register-pass').val(),
            nickname_give: $('#register-char_name').val(),
        },
        success: function (response) {
            if (response['result'] == 'success') {
                alert('회원가입이 완료되었습니다.')
                window.location.href = '/'
            } else {
                alert(response['msg'])
            }
        }
    })
}

