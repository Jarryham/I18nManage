var mysql      = require('mysql');

function targetDbQuery(config, sql, params, callback) {
    var connection = mysql.createConnection({
        host     : config.host,
        user     : config.user,
        password : config.password,
        database : config.database
    });
    connection.connect();
    connection.query(sql, params, function (qerr, vals, fields) {
        callback(qerr, vals, fields);
    });
    connection.end();
}
module.exports = targetDbQuery
