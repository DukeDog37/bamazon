var mysql = require('mysql');
var myDataKeys = require("./keys.js");
var keys = myDataKeys.dtkeys;
var pool  = mysql.createPool({
    host     : 'localhost',
    user     : keys['user'],
    password : keys['password'],
    database : keys['database']
});


exports.pool = pool;