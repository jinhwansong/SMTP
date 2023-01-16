

function sign_submit(){
    $(".login").hide()
    $(".register").show()
}
function signup_cance(){
    $(".login").show()
    $(".register").hide()
}

function signup() {
    let pass = $('#register-pass').val()
    let id = $('#register-id').val()
    let pass_check = $('#register-pass-check').val()
    $.ajax({
        type: "POST",
        url: "/api/register",
        data: {id_give: id, pw_give: pass,pw_check_give: pass_check},
        success: function (response) {
            if (response['result'] == 'success') {
                alert('회원가입이 완료되었습니다.')
                window.location.href = '/index'
            } else {
                alert(response['msg'])
            }
        }
    })
}

