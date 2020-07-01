/*
  用户信息相关接口
*/
const express = require('express')
const router = express.Router()

// 路由配置

// 获取用户信息
router.get('/userinfo', (req, res) => {
  res.send('userinfo')
})

// 更新用户信息
router.post('/userinfo', (req, res) => {
  res.send('update userinfo')
})

router.post('/updatepwd', (req, res) => {
  res.send('updatepwd')
})

router.post('/update/avatar', (req, res) => {
  res.send('update/avatar')
})

module.exports = router