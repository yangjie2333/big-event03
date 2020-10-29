$(function() {
    var form = layui.form

    // 1.验证表单
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '请输入1~6个字符'
            }
        }
    })

    // 2.表单赋值
    function getUserInfo() {
        $.ajax({
            type: 'get',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                // 表单赋值
                form.val("setForm", res.data)
            }
        })
    }
    getUserInfo()

    // 3.重置
    $('#setForm').on('reset', function(e) {
        e.preventDefault()

        // 重新表单赋值
        getUserInfo()
    })

    // 4.提交修改
    $('#setForm').on('submit', function(e) {
        e.preventDefault()

        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)

                // 将欢迎文本渲染为最新
                window.parent.getUserInfo()
            }
        })
    })
})