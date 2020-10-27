$(function() {
    // 1.点击链接切换页面
    $('.link-reg').on('click', function() {
        $('.loginbox').hide()
        $('.regbox').show()
    })
    $('.link-login').on('click', function() {
        $('.regbox').hide()
        $('.loginbox').show()
    })

    // 2.表单验证
    var form = layui.form;
    var layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repwd: function(value, item) { //value：表单的值、item：表单的DOM对象
            var pwd = $('.regbox [name=password]').val()
            if (pwd !== value) {
                return '两次输入的密码不一致';
            }
        }
    })

    // 3.注册
    $('#form-reg').on('submit', function(e) {
        // 阻止默认事件
        e.preventDefault()

        $.ajax({
            type: 'post',
            url: '/api/reguser',
            data: {
                username: $('#form-reg [name=username]').val(),
                password: $('#form-reg [name=password]').val()
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)

                // 注册成功自动跳转到登录
                $('.link-login').trigger('click')

                // 清空注册页面表单内容
                $('#form-reg')[0].reset()
            }
        })
    })

    // 4.登录
    $('#form-login').on('submit', function(e) {
        // 阻止默认事件
        e.preventDefault()

        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }

                // 登录成功将token保存到本地
                localStorage.setItem('token', res.token)

                location.href = '/index.html'
            }
        })
    })
})