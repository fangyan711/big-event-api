/*
  文章分类接口
*/
const express = require('express')
const router = express.Router()

router.get('/cates', (req, res) => {
  res.send('/cates')
})

router.get('/addcates', (req, res) => {
  res.send('/addcates')
})

router.get('/deletecate/:id', (req, res) => {
  res.send('/deletecate/:id')
})

router.get('/cates/:id', (req, res) => {
  res.send('/cates/:id')
})

router.get('/updatecate', (req, res) => {
  res.send('/updatecate')
})

module.exports = router