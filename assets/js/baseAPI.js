baseUrl = 'http://ajax.frontend.itheima.net'
$.ajaxPrefilter(function(options) {
    options.url = baseUrl + options.url
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token')
        }
    }

    options.complete = function(res) {
        // console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 删除本地token
            localStorage.removeItem('token')

            // 跳转到登录页面
            location.href = '/login.html'
        }
    }
})