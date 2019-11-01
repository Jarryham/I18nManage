var userModel = require('../models/user')
const utils = require('utility');
// 引入jwt token工具
const JwtUtil = require('../rsa/jwt');

exports.login = function(req,res,next) {
  const userForm = req.body
  var str = ''
  var params
  req.on("data",function(chunk){  str+=chunk  })
  req.on("end",function(){  
    params = JSON.parse(str)
    console.log(params, 'params')
    const { password } = params

    userModel.findUserByUsername(params.userName, (err, result) => {
      if(err) next(err);
      if(result.length === 0) {
        res.send({
          status: false,
          msg: '用户不存在'
        })
      } else {
        var currentUser = result[0]
        if (password === currentUser.password) {
          let _id = currentUser.id.toString();
          let jwt = new JwtUtil(_id);
          let token = jwt.generateToken();
          req.session.user = result[0]//存储session
          res.send({
              status: 'ok',
              type: "account",
              currentAuthority: 'admin',
              token
          })
        }
      }
    })
  })

  
  console.log(userForm)
}

exports.currentUser = function(req, res, next) {
  const userForm = req.body
  res.send({
    status: false
  })
}