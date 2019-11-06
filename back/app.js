var express = require('express');
var app = express();
var JwtUtil = require('./rsa/jwt')

//session配置
const session = require('express-session');

var cookieParser = require('cookie-parser');
const router = require('./routes/index')

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:8000");
	res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("X-Powered-By",' 3.2.1')
	if (req.method == 'OPTIONS') {
    res.sendStatus(200); //让options请求快速返回/
  }
  else {
    next();
  }
});

app.use(session({
    secret: 'I18n',
    resave: false,
    saveUninitialized: true
}))

//获取post请求的参数
const bodyParser = require('body-parser');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))


app.use(function (req, res, next) {
  // 把登陆和注册请求去掉，其他的多有请求都需要进行token校验
  if (req.url != '/api/login/account' && req.url != '/user/register') {
      let token = req.header('Authorization');
      var tokenObj
      console.log(token)
      if (token && token !== '') {
        tokenObj = JSON.parse(token)
        let jwt = new JwtUtil(tokenObj.token);
        let result = jwt.verifyToken();
        // 如果考验通过就next，否则就返回登陆信息不正确
        if (result == 'err') {
            console.log(result);
            res.send({status: 403, msg: '登录已过期,请重新登录'});
            // res.render('login.html');
        } else {
            next();
        }
      } else {
        res.send({status: 403, msg: '登录已过期,请重新登录'});
      }
  } else {
      next();
  }
});

app.use(router)

module.exports = app
