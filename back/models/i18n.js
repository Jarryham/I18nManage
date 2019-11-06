const db=require('../config/db');

/**
 *修改模块
 * @param object
 * @param callback sys_i18n
 */
exports.EditI18nItem = function (obj,callback){
  // id key version zh en oth
  var sumbmit = {
    id: obj.id,
    key: obj.key,
    version: ((obj.version === '' || !obj.version) ? null : obj.version),
    zh: obj.zh,
    en: obj.en,
    oth: obj.oth
  }
  if (sumbmit.id && sumbmit.id !== '') {
    // 修改
    db.query('update sys_i18n set `key` = ?, `version` = ?, `zh` = ?, `en` = ?, `oth` = ? where `id` = ?',[sumbmit.key, sumbmit.version, sumbmit.zh, sumbmit.en, sumbmit.oth, sumbmit.id],callback)
  } else {
    // 新增
    db.query('insert into sys_i18n (key,version,zh,en,oth) values (?,?,?,?,?)',[sumbmit.key, sumbmit.version, sumbmit.zh, sumbmit.en, sumbmit.oth],callback)
  }
}


exports.addLog = function (params, callback) {
  var sumbmit = {...params}
  if (params) {
    db.query('insert into i18_update_log (`time`,`history`,`current`,`userId`,`ip`, `type`, `database`,`target_id`) values (?,?,?,?,?,?,?,?)',[sumbmit.time, sumbmit.history, sumbmit.current, sumbmit.userId, sumbmit.ip, sumbmit.type, sumbmit.database,sumbmit.target_id],callback)
  }
}

exports.qureyItem = function(id, callback) {
  db.query('select * from sys_i18n where id = ?', [id], callback)
}


exports.qureyAll = function(callback) {
  db.query('select * from sys_i18n', [], callback)
}

// exports.updateInfoById = (picPath,userId,callback) => {
//   db.query('update users set pic = ? where id = ?',[picPath,userId],callback)
// }

/**
 * 查询数据库列表
 */
exports.queryDbs = function(callback) {
  db.query('select `id`, `host`, `dbPort`, `database` from i18n_databases', [], callback)
}