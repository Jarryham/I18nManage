/**
 * Created by Administrator on 2017/2/6.
 */
'use strict';
const mysql=require('mysql');
let db={};
// db.query=function(sql,param,callback){
//     pool.query(sql,param,(err,results,fields)=>{
//         callback(err,results)
//     })
// }
db.setPool = function(config) {
  return mysql.createPool({
    connectionLimit : 10,
    host            : config.host,
    port            : config.dbPort,
    user            : config.user,
    password        : config.password,
    database        : config.database
  });
}
db.query=function query(sql, sqlParams, callback, pool) {
  pool.getConnection(function (err, conn) {
      if (err) {
          callback(err, null, null);
      } else {
          conn.query(sql, sqlParams, function (qerr, vals, fields) {
              callback(qerr, vals, fields);
          });
      }
      // conn.release(); // not work!!!
      pool.releaseConnection(conn);
  });
};
module.exports = db;