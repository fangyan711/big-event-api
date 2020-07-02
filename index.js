const express = require('express')
const cors = require('cors')
const path = require('path')
const jwt = require('express-jwt')
const loginRouter = require(path.join(__dirname, 'routers/login.js'))
const userRouter = require(path.join(__dirname, 'routers/user.js'))
const cateRouter = require(path.join(__dirname, 'routers/cate.js'))
const app = express()

// 处理客户端请求post参数
// for parsing application/json
app.use(express.json()) 
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })) 

// 设置跨域
app.use(cors())

// 通过中间件统一处理token
// unless的作用：排除一些路径不需要进行token解析
// app.use(jwt({secret: 'bigevent'}).unless({path: ['/api/login', '/api/reguser']}))
// path路径支持正则，/^\/api/该正则表示以 /api开始
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRvbSIsImlkIjo4LCJpYXQiOjE1OTM1ODc2MzgsImV4cCI6MTU5MzU5MTIzOH0.UHnhiaOgW7LYR7txwdkqCkVY_kucjabamPHWUDWsCh0
// jwt中间件的作用：从token中解析用户信息添加到req.user属性中
// req.user={id: 8, username: "tom"}
app.use(jwt({secret: 'bigevent'}).unless({path: /^\/api/}))

// 设置路径
app.use('/api', loginRouter)
app.use('/my', userRouter)
app.use('/my/article', cateRouter)

// 统一处理不存在的路由
// app.all表示处理所有形式的请求（get/post/put/delete...）
app.all('*', (req, res) => {
  res.status(404).json({
    status: 404,
    message: '请求额资源不存在！'
  })
})

// 添加一个中间件，统一处理异常信息
app.use((err, req, res, next) => {
  if (err.status === 401) {
    // token验证失败
    // status参数401表示http协议的响应状态码
    res.status(401).json({
      status: 401,
      message: err.message
    })
  } else {
    res.json({
      status: 500,
      message: '服务器错误' + err.message
    })
  }
})

app.listen(8888, () => {
  console.log('running...')
})
