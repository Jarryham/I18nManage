const db=require('../config/db');
const dbAny = require('../config/dbAny'); // 可指定对应的数据库进行查询

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

exports.queryDbsById = function(id, callback) {
  db.query('select * from i18n_databases where id = ?', [id], callback)
}

/**
 * 同步信息使用的数据库查询 修改
 */
exports.asynEditItem = function(config, params, callback, addFlag) {
  var sumbmit = {
    id: params.id,
    key: params.key,
    version: ((params.version === '' || !params.version) ? null : params.version),
    zh: params.zh,
    en: params.en,
    oth: params.oth
  }
  if (sumbmit.id && sumbmit.id !== '') {
    // 修改
    if (!addFlag) {
      dbAny(config, 'update sys_i18n set `key` = ?, `version` = ?, `zh` = ?, `en` = ?, `oth` = ? where `id` = ?',[sumbmit.key, sumbmit.version, sumbmit.zh, sumbmit.en, sumbmit.oth, sumbmit.id],callback)
    } else {
      // 同步的时候未发现该条记录，需要新增该记录
      console.log('adddd')
      dbAny(config, 'insert into sys_i18n (`id`,`key`,`version`,`zh`,`en`,`oth`) values (?,?,?,?,?,?)',[sumbmit.id,sumbmit.key, sumbmit.version, sumbmit.zh, sumbmit.en, sumbmit.oth],callback)
    }
    
  } else {
    // 新增
    dbAny(config, 'insert into sys_i18n (`key`,`version`,`zh`,`en`,`oth`) values (?,?,?,?,?)',[sumbmit.key, sumbmit.version, sumbmit.zh, sumbmit.en, sumbmit.oth],callback)
  }
}

exports.asynQueryItem = function(config, id, callback) {
  dbAny(config, 'select * from sys_i18n where id = ?', [id], callback)
}

exports.asynQueryI18nList = function(config, callback) {
  dbAny(config, 'select * from sys_i18n', [], callback)
}

exports.asynQueryItemByIdWidthDb = function(config, id, callback) {
  dbAny(config, 'select * from sys_i18n where id = ?', [id], callback)
}

exports.asynQueryItemByKeyWidthDb = function(config, key, callback) {
  dbAny(config, 'select * from sys_i18n where `key` = ?', [key], callback)
}

exports.logsDb = function(callback) {
  db.query('select  a.`id`, a.`ip`, a.`target_id`, a.`time`, a.`type`, b.`name`, a.`current`, a.`database`, a.`history` from  i18_update_log a left join i18n_accounts b on a.`userId` = b.`id`', [], callback)
}
