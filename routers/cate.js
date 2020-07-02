/*
  文章分类接口
*/
const express = require('express')
const path = require('path')
const db = require(path.join(__dirname, '../common/db.js'))
const router = express.Router()

// 查询文章分类列表数据
router.get('/cates', async (req, res) => {
  // 直接操作数据库查询所有的文章分类列表数据
  let sql = 'select * from category'
  let ret = await db.operateData(sql)
  if (ret && ret.length > 0) {
    // 正常查询到数据
    res.json({
      status: 0,
      message: '查询分类成功！',
      data: ret
    })
  } else {
    res.json({
      status: 1,
      message: '查询分类失败！'
    })
  }
})

// 添加分类接口
router.post('/addcates', async (req, res) => {
  // 获取请求参数
  let param = req.body
  // 操作数据库
  let sql = 'insert into category set ?'
  let ret = await db.operateData(sql, param)
  // 响应请求
  if (ret && ret.affectedRows > 0) {
    res.json({
      status: 0,
      message: '添加分类成功！'
    })
  } else {
    res.json({
      status: 1,
      message: '添加分类失败！'
    })
  }
})

// 删除分类
router.get('/deletecate/:id', async (req, res) => {
  // 获取要删除的分类ID
  let id = req.params.id
  // 操作数据库
  let sql = 'delete from category where id = ?'
  let ret = await db.operateData(sql, id)
  // 响应请求
  if (ret && ret.affectedRows > 0) {
    res.json({
      status: 0,
      message: '删除分类成功！'
    })
  } else {
    res.json({
      status: 1,
      message: '删除分类失败！'
    })
  }
})

// 根据id查询分类的详情
router.get('/cates/:id', async (req, res) => {
  // 获取分类的id
  let id = req.params.id
  // 数据库操作
  let sql = 'select * from category where id = ?'
  let ret = await db.operateData(sql, id)
  if (ret && ret.length > 0) {
    res.json({
      status: 0,
      message: '查询分类信息成功！',
      data: ret[0]
    })
  } else {
    res.json({
      status: 1,
      message: '查询分类信息失败！'
    })
  }
})

// 更新分类
router.post('/updatecate', async (req, res) => {
  // 获取请求参数
  let param = req.body
  console.log(param)
  // 数据库操作
  let sql = 'update category set ? where Id = ?'
  let ret = await db.operateData(sql, [{name: param.name, alias: param.alias}, param.Id])
  // 响应请求
  if (ret && ret.affectedRows > 0) {
    res.json({
      status: 0,
      message: '更新分类成功！'
    })
  } else {
    res.json({
      status: 1,
      message: '更新分类失败！'
    })
  }
})

module.exports = router