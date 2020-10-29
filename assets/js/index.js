// 入口函数
$(function() {
    // 获取登录用户数据
    getUserInfo()

    var layer = layui.layer
    $('#btnLogOut').on('click', function() {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something

            // 确定退出,删除本地token
            localStorage.removeItem('token')

            // 跳转到登录页面
            location.href = '/login.html'

            // 添加登录拦截
            // 在baseAPI.js添加

            layer.close(index);
        });
    })
})

// 将函数封装在全局
function getUserInfo() {
    +$.ajax({
        type: 'get',
        url: '/my/userinfo',
        success: function(res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            // 获取用户信息成功
            // 调用一个渲染头像的函数
            renderAvatar(res.data)
        }
    })
}

function renderAvatar(user) {
    // 优先渲染昵称
    var name = user.nickname || user.username

    // 渲染欢迎的文字
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name)

    // 判断用户是否有头像
    if (user.user_pic) {
        // 有头像
        $('.layui-nav-img').show().prop('src', user.user_pic)
        $('.text-avatar').hide()
    } else {
        // 没有头像,将用户名第一个字大写作为头像
        var first = name[0].toUpperCase()
        $('.text-avatar').show().html(first)
        $('.layui-nav-img').hide()
    }
}