var mysql = require('mysql');

var mysqlcon = mysql.createConnection({
  host: 'localhost',// Replace with your host name
  user: 'root',// Replace with your database username
  password:'',// Replace with your database password
  database: 'hac',// Replace with your database Name
  multipleStatements: true  
});

mysqlcon.connect(function(err) {
  if (err) {
      console.log('Error in Database Connection!')
  }
  else
    console.log('Database is connected successfully !');
});

module.exports = mysqlcon;