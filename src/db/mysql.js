const mysql = require('mysql');

const { MYSQL_CONF } = require('../conf/db');

const connection = mysql.createConnection(MYSQL_CONF);

connection.connect();

function exec(sql) {
   return new Promise((succ,reject) => {
            connection.query(sql, (err,res,fields) => {
                if(err) reject(err);
                console.log(res);
                succ(res);
            })
    });
   
}

module.exports = {
    exec
}