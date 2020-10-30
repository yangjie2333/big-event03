$(function() {
    var layer = layui.layer
    var form = layui.form

    // 渲染表格内容
    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    initArtCateList()
    var indexAdd, indexDel, indexEdit

    // 点击添加弹出层
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '249px'],
            title: '添加文章分类',
            content: $('#diaLogAdd').html()
        });
    })

    // 确认添加
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()

        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                initArtCateList()
                layer.close(indexAdd)
            }

        })
    })

    // 编辑弹出层
    $('body').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '249px'],
            title: '修改文章分类',
            content: $('#diaLogEdit').html()
        });

        var id = $(this).data('id')
        $.ajax({
            url: '/my/article/cates/' + id,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val('form-edit', res.data)
            }
        })
    })
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()

        $.ajax({
            type: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                initArtCateList()
                layer.close(indexEdit)
            }
        })
    })
    $('body').on('click', '.btn-del', function() {
        // e.preventDefault()

        var id = $(this).data('id')
        indexDel = layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                url: "/my/article/deletecate/" + id,
                type: 'get',
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    initArtCateList()
                    layer.close(indexDel)
                }
            })

        });
    })
})