$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;


    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    template.defaults.imports.dataFormat = function(date) {
        var date = new Date(date)
        var y = date.getFullYear()
        var m = padZero(date.getMonth() + 1)
        var d = padZero(date.getDate())
        var h = padZero(date.getHours())
        var mm = padZero(date.getMinutes())
        var ss = padZero(date.getSeconds())
        return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + ss
    }

    function padZero(n) {
        return n < 10 ? '0' + n : n
    }

    function initTable() {
        $.ajax({
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 定义模板字符串
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }
    initTable()

    // 渲染下拉框分类
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 定义模板字符串
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)

                // 重新渲染表单
                form.render()
            }
        })
    }
    initCate()

    // 筛选
    $('#form-search').on('submit', function(e) {
        e.preventDefault()

        q.state = $('[name=state]').val()
        q.cate_id = $('[name=cate_id]').val()
        initTable()
    })

    // 分页
    function renderPage(total) {

        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,
            curr: q.pagenum,
            limits: [2, 3, 5, 7, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数

                //首次不执行
                if (!first) {
                    //do something
                    q.pagesize = obj.limit
                    q.pagenum = obj.curr
                    initTable()
                }
            }
        })
    }

    // 删除
    $('body').on('click', '.btn-del', function(e) {
        e.preventDefault()
        var id = $(this).data('id')

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                url: '/my/article/delete/' + id,
                success: function(res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }

                    layer.msg(res.message)
                    if ($('.btn-del').length === 1 && q.pagenum > 1) q.pagenum--

                        initTable()

                }
            })

            layer.close(index);
        });
    })

})