const db=require('../config/db');

// 用户查询
// *根据用户名查找用户
// * @param username
// * @param callback
// */
exports.findUserByUsername = function (username,callback){
   db.query('select * from i18n_accounts where account= ?',[username],callback)
}