const config = {
  http: '',
  port: 9999,
  connectionLimit: 10, //数据库连接池
  host: '106.54.4.67',
  user: 'root',
  dbPort: 3306,
  password: 'root',
  database: 'center',
  flowbase: {
    connectionLimit: 10, //数据库连接池
    host: '106.54.4.67',
    dbPort: 3306,
    user: 'root',
    password: 'root',
    database: 'i18n',
  }
}

module.exports = config


