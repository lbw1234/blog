var express = require('express');
var router = express.Router();
var articleModel = require('../db/articleModel')
var moment = require('moment')

/* 首页路由 */
router.get('/', function(req, res, next) {
  //数据类型，要求int
  let page=parseInt(req.query.page||1)
  let size=parseInt(req.query.size||2)
  let username = req.session.username
  //第一步:查询文章总数和总页数
  articleModel.find().count().then((total)=>{
    //获取总页数
    var pages=Math.ceil(total/size)

    // 第二步：分页查询
    // sort()按文章时间，倒序查询
    // limit() 每页显示多少条
    // skip() 分页实现
    articleModel.find().sort({"createTime":-1}).limit(size).skip((page-1)*size).then((docs)=>{
      //docs不是数组，要转换成数组
      var arr=docs.slice()
      for(let i=0;i<arr.length;i++){
        // 添加一个新的字段，来表示格式化的时间字段
        arr[i].createTimes=moment(arr[i].createTime).format('YYYY-MM-DD HH:mm:ss')
      }
      res.render('index',{data:{list:arr,total:pages,username:username}})
    }).catch((err)=>{
      res.redirect('/')
    })
  }).catch((err)=>{
    res.redirect('/')
  })


});

//注册页路由
router.get('/regist', function(req, res, next) {
  res.render('regist', {});
});

//登录页路由
router.get('/login', function(req, res, next) {
  res.render('login', {});
});

//写文章路由
router.get('/write', function(req, res, next) {
  var id=req.query.id

  if(id){
    //编辑文章
    id=new Object(id)

    articleModel.findById(id).then((doc)=>{
      res.render('write',{doc:doc})
    }).catch((err)=>{
      res.redirect('/')
    })
  }else{
    //新增文章

    //创建空对象
    var doc = {
      _id: '',
      username: req.session.username,
      title: '',
      content: ''
    }
    res.render('write', {doc: doc});
  }
});

//文章详情页路由
router.get('/detail', function(req, res, next) {

  var id=new Object(req.query.id)

  //用id查询数据库
  articleModel.findById(id).then((doc)=>{
    doc.createTimes = moment(doc.createTime).format("YYYY-MM-DD HH:mm:ss")
    res.render('detail', {doc: doc})
  }).catch((err)=>{
    res.send(err)
  })
});

module.exports = router;
