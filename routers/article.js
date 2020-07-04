/*
  文章路由模块
*/
const express = require('express')
const path = require('path')
const db = require(path.join(__dirname, '../common/db.js'))
const router = express.Router()

// 查询文章列表数据
router.get('/list', async (req, res) => {
  // 获取请求参数
  let param = req.query
  param.pagenum = parseInt(param.pagenum)
  param.pagesize = parseInt(param.pagesize)
  // ------------------------------------------------------
  // 分类id查询条件
  // cate_id = 1
  // let cate_id_condition = ''
  // if (param.cate_id) {
  //   // 客户端传递了分类id
  //   cate_id_condition = 'cate_id = ' + param.cate_id
  // }
  // // 文章状态
  // // state = 草稿
  // let article_state_condition  = ''
  // if (param.state) {
  //   article_state_condition = 'state = ' + param.state
  // }
  // // 查询条件关键字
  // let condition = ' where 1 = 1 '
  // if (cate_id_condition) {
  //   condition += ' and ' + cate_id_condition
  // }
  // if (article_state_condition) {
  //   condition += ' and ' + article_state_condition
  // }
  // 操作数据库
  // limit 后的第一个参数表示从第几条开始查询
  // limit 后的第二个参数表示查询多少条数据
  // select * from article where 1 = 1 and cate_id = 1 and state = '草稿' limit 1 10
  // --------------------------------------------------------------------------------
  // 更加优雅的写法：动态拼接查询条件
  let condition = ''
  // param = {pagenum: 1, pagesize: 10, cate_id: 1, state: '草稿'}
  for (let key in param) {
    if (key === 'cate_id' && param[key]) {
      condition += key + '=' + param[key] + ' and '
    } else if (key === 'state' && param[key]) {
      condition += key + '="' + param[key] + '" and '
    }
  }
  // condition = cate_id = 1 and state = '草稿' and
  // 去掉最后一个and 
  // condition = condition.substring(0, condition.lastIndexOf('and'))
  // let sql = 'select * from article limit ?, ?'
  let sql = 'select a.id, a.title, a.pub_date, a.state, c.name as cate_name from article as a join category as c on a.cate_id = c.id where a.is_delete = 0 limit ?, ?'
  // 查询列表总数
  let totalSql = 'select count(*) as total from article where is_delete = 0'
  if (condition) {
    condition += ' a.is_delete = 0 '
    // sql = 'select * from article where ' + condition + ' limit ?, ?'
    sql = 'select a.id, a.title, a.pub_date, a.state, c.name as cate_name from article as a join category as c on a.cate_id = c.id where ' + condition + ' limit ?, ?'
    // 携带条件时查询总数
    totalSql = 'select count(*) as total from article as a where ' + condition
  }
  // 查询列表数据
  let ret = await db.operateData(sql, [param.pagesize * (param.pagenum - 1), param.pagesize])
  // 查询列表总数
  let cret = await db.operateData(totalSql)
  
  if (ret && ret.length > 0) {
    res.json({
      status: 0,
      message: '查询文章列表数据成功！',
      data: ret,
      total: cret[0].total
    })
  } else {
    res.json({
      status: 1,
      message: '查询文章列表数据失败！'
    })
  }
})

// 删除文章
router.get('/delete/:id', async (req, res) => {
  // 获取要删除的文章的id
  let id = req.params.id
  // 操作数据库
  let sql = 'update article set is_delete = 1 where id = ?'
  let ret = await db.operateData(sql, id)
  // 响应请求
  if (ret && ret.affectedRows > 0) {
    res.json({
      status: 0,
      message: '删除文章成功！'
    })
  } else {
    res.json({
      status: 1,
      message: '删除文章失败！'
    })
  }
})


// 根据id查询文章详情
router.get('/:id', async (req, res) => {
  // 获取文章的id
  let id = req.params.id
  // 操作数据库
  let sql = 'select * from article where is_delete = 0 and id = ?'
  let ret = await db.operateData(sql, id)
  // 响应请求
  if (ret && ret.length > 0) {
    res.json({
      status: 0,
      message: '查询文章成功！',
      data: ret[0]
    })
  } else {
    res.json({
      status: 1,
      message: '查询文章失败！'
    })
  }
})

// 更新文章
router.post('/edit', async (req, res) => {
  // 获取文章相关的参数
  let param = req.body
  // 操作数据库
  let sql = 'update article set ? where id = ?'
  let ret = await db.operateData(sql, [{
    title: param.title,
    cate_id: param.cate_id,
    content: param.content,
    cover_img: param.cover_img,
    state: param.state
  }, param.Id])
  if (ret && ret.affectedRows > 0) {
    res.json({
      status: 0,
      message: '更新文章成功！'
    })
  } else {
    res.json({
      status: 1,
      message: '更新文章失败！'
    })
  }
})

// 发布文章
router.post('/add', async (req, res) => {
  // 获取文章相关的参数
  let param = req.body
  // 获取用户id
  let id = req.user.id
  // 操作数据库
  let sql = 'insert into article set ?'
  let ret = await db.operateData(sql, {
    title: param.title,
    cate_id: param.cate_id,
    content: param.content,
    cover_img: param.cover_img,
    state: param.state,
    is_delete: 0,
    author_id: id,
    pub_date: new Date()
  })
  if (ret && ret.affectedRows > 0) {
    res.json({
      status: 0,
      message: '添加文章成功！'
    })
  } else {
    res.json({
      status: 1,
      message: '添加文章失败！'
    })
  }
})

module.exports = router