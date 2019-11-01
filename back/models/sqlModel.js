'use strict';
const db=require('../config/db');
var async = require('async')

function isNull(str){
  if ( str == "" ) return true;
  var regu = "^[ ]+$";
  var re = new RegExp(regu);
  return re.test(str);
  }
/**
 *根据id查找数据模块
 * @param id
 * @param callback
 */
exports.excuModel = function (id,callback){
    db.query('select * from sql_model where id = ?',[id],callback)
}

/**
 *根据数据模块的查询语句进行解析查询
 * @param sqlGroup
 * @param callback
 */
exports.resolveSql = function (req,sqlGroup,callback){
  var text = sqlGroup.sql
  var reqParams = req.body // 请求参数
  text = text.replace(/[\r\n]/g,"");
  var sqlArray = text.split('##')
  sqlArray = sqlArray.filter(function(d) { return d !== '' && !isNull(d) })
  // 用于存放查询结果
  var qureyRes = {};
  // 结果集的name即其他参数集合
  var queryNames = []

  async.eachSeries(sqlArray, function(item, fn) {
    // 遍历每条SQL并执行
    var sqlText = item.trim()
    var sqlArr = sqlText.split('$')
    sqlArr = sqlArr.filter(function(d) { return d !== '' && !isNull(d) })
    if (sqlArr[0]) {
      var sqlObjtxt = sqlArr[0] // name的对象
      var sqlTxt = sqlArr[1]
      var sqlObj = JSON.parse(sqlObjtxt)
      queryNames.push(sqlObj)
      if (sqlObj && sqlObj.name) {
        qureyRes[sqlObj.name] = []
        var matches = sqlTxt.match(/\{(.+?)\}/g);
        var searchParms = []
        if (matches) {
          matches.forEach(d => {
            var result = d.substring(1, d.length - 1).trim()
            var resultParam = reqParams[result]
            var listReg = `{${result}}`
            if (resultParam !== undefined) {
              searchParms.push(resultParam)
            } else if(qureyRes[result]){
              // topList的查询方式，取之前的结果集做嵌套查询，只支持in的单个字段的查询in(?,?,?,...)
              // var listReg = new RegExp(`/\{(${result})\}/`)
              var matches2 = sqlTxt.match(listReg);
              var topList = qureyRes[result]
              // console.log(topList, 'cus')
              if (topList && topList.length > 0) {
                var paramsQuo = ''
                for (var i = 0; i < topList.length; i++) {
                  if (i > 0 && i !== topList.length - 1) {
                    paramsQuo += '?,'
                  } else if(i === 0 && topList.length > 0) {
                    paramsQuo += '?,'
                  } else {
                    paramsQuo += '?'
                  }
                  var paramObjVal = null
                  for (var k in topList[i]) {
                    paramObjVal = topList[i][k]
                  }
                  searchParms.push(paramObjVal)
                }
                sqlTxt = sqlTxt.replace(listReg, paramsQuo)
                
              } else {
                searchParms.push(null)
                sqlTxt = sqlTxt.replace(listReg, '?')
                console.log(sqlTxt)
              }
            } 
          })
        }
        sqlTxt = sqlTxt.replace(/\{(.+?)\}/g, '?')
        var type;
        if (sqlObj.db) {
          type = sqlObj.db
        }
        db.query(sqlTxt, searchParms, function(err, res, field) {
          if (err) {
            console.log(err)
          } else {
            qureyRes[sqlObj.name] = res
          }
          fn()
        }, type)
        // console.log('aaaa')
      }
    }
    // console.log(sqlArr)
  }, function(err) {
    // 所有SQL执行完成后回调
    if(err) {
      console.log(err);
    } else {
      callback(qureyRes)
    }
  });

  // console.log(sqlArray)
}