var express = require('express');
var router = express.Router();
var userModel = require('../db/userModel')

/* GET users listing. */
router.get('/', function (req, res, next) {
  userModel.find().then((docs) => {
    console.log("查询成功", docs)
    res.send({ err: 0, msg: 'success', data: docs })
  }).catch((err) => {
    console.log("查询失败", err)
    res.send({ err: -1, msg: 'fail' })
  })

  // res.send('respond with a resource');
});

//注册接口
router.post('/regist', (req, res, next) => {
  let { username, password, passwors2 } = req.body

  userModel.find({ username }).then((docs) => {
    if (docs.length > 0) {
      res.send('用户已存在')
    } else {
      let createTime = Date.now()

      userModel.insertMany({ username, password, createTime }).then((data) => {
        res.redirect('/login')
      }).catch((err) => {
        res.redirect('/regist')
      })
    }
  })
})




//登录接口
router.post('/login', (req, res, next) => {
  //接受post数据
  let { username, password } = req.body
  //数据库查询
  userModel.find({ username, password }).then((docs) => {
    if (docs.length > 0) {
      // 登录成功后，在服务端使用session记录用户信息
      req.session.username = username
      req.session.isLogin = true
      res.redirect('/')
    } else {
      res.redirect('/login')
    }
  }).catch((err) => {
    res.redirect('/login')
  })
})

// 退出登录
router.get('/logout', (req, res, next) => {
  req.session.username = null
  req.session.isLogin = false
  // req.session.destroy()
  res.redirect('/login')
})

module.exports = router;
