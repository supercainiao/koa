const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'myblog',
    port: 3306 
});

connection.connect();

connection.query("select * from blogs", function(error,result,fields){
    if(error) throw error;
    console.log(result);
    console.log(fields);
});

connection.end();