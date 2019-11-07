const express = require('express')
const router = express.Router()

var sqlModel = require('../controllers/sqlModelCtr')
var Users = require('../controllers/users')
var i18n = require('../controllers/i18n')

router.get("/",function(req,res){
	res.send('hello world')
});

// 登陆
router.post("/api/login/account", Users.login);

router.post("/i18nItemSave", i18n.save);

router.get("/api/currentUser", Users.currentUser);

router.post("/api/getI18n", i18n.queryI18nListWithDb);
router.get("/api/i18ndb", i18n.db)
router.get("/api/DbList", i18n.dbList)

// app.get("/:id",testModel.test);
router.post('/data', sqlModel.sqlResolve)
module.exports = router