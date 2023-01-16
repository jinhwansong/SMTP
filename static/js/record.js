function register() {
    let url = $('#url').val()
    let title = $('#title').val()
    let category = $('#category option:selected').val()
    let comment = $('#comment').val()

    $.ajax({
        type: "POST",
        url: "/record",
        data: {url_give: url, title_give: title, category_give: category, comment_give: comment},
        success: function (response) {
            alert(response["msg"])
            window.location.reload()
        }
    });
}


