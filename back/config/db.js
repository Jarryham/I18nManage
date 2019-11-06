/**
 * Created by Administrator on 2017/2/6.
 */
'use strict';
const mysql=require('mysql');
const config = require('./config');
let db={};
let pool  = mysql.createPool({
    connectionLimit : config.connectionLimit,
    host            : config.host,
    port            : config.dbPort,
    user            : config.user,
    password        : config.password,
    database        : config.database
});

let flowPool = mysql.createPool({
  connectionLimit : config.flowbase.connectionLimit,
  host            : config.flowbase.host,
  port            : config.flowbase.dbPort,
  user            : config.flowbase.user,
  password        : config.flowbase.password,
  database        : config.flowbase.database
});
// db.query=function(sql,param,callback){
//     pool.query(sql,param,(err,results,fields)=>{
//         callback(err,results)
//     })
// }
db.configPool = pool

db.query=function query(sql, sqlParams, callback, type) {
  var sqlpool = pool
  if (type === 'flow') {
    sqlpool = flowPool
  }
  sqlpool.getConnection(function (err, conn) {
      if (err) {
          callback(err, null, null);
      } else {
          conn.query(sql, sqlParams, function (qerr, vals, fields) {
              callback(qerr, vals, fields);
          });
      }
      // conn.release(); // not work!!!
      sqlpool.releaseConnection(conn);
  });
};
module.exports = db;