$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-pub', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    initCate()

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 点击选择图片文件
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click()
    })

    // 绑定文件域change事件
    $('#coverFile').on('change', function() {
        var file = this.files

        if (file.length === 0) {
            return
        }

        var url = URL.createObjectURL(file[0])
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', url) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    var state = '已发布'
    $('#btnSave2').on('click', function() {
        state = '草稿'
    })
    $('#form-pub').on('submit', function(e) {
        e.preventDefault()

        // 获取formData数据
        var fd = new FormData(this)

        fd.append('state', state)
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)

                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })

    // 发表文章
    function publishArticle(fd) {
        $.ajax({
            type: 'post',
            url: '/my/article/add',
            data: fd,
            processData: false,
            contentType: false,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)

                // location.href = '/article/art_list.html'
                //    优化
                setTimeout(function() {
                    window.parent.document.getElementById('art-list').click()
                }, 5000)

            }
        })
    }
})