var mysql = require('mysql');
require('dotenv').config();
const { DB_NAME, DB_USER, DB_HOST, DB_PASS, DB_PORT } = process.env;
var mysqlcon = mysql.createConnection({
  host: DB_HOST,// Replace with your host name
  user: DB_USER,// Replace with your database username
  port: DB_PORT,
  password: DB_PASS,// Replace with your database password
  database: DB_NAME,// Replace with your database Name
  multipleStatements: true
});

mysqlcon.connect(function (err) {
  if (err) {

    console.log('Error in Database Connection!')
  }
  else
    console.log('Database is connected successfully !');
});

//RANDOM COVID HOTSPOTS GENERATION
function genhotspot(latmin, latmax, lngmin, lngmax, num, latmar, lngmar) {

  var latdif = latmax - latmin - (2 * latmar);
  var lngdif = lngmax - lngmin - (2 * lngmar);

  var query = "INSERT INTO `hotspots` (`id`, `lat`, `lng`) VALUES ";

  for (var i = 0; i < num; i++) {
    var latrand = Math.random() * latdif;
    var lngrand = Math.random() * lngdif;

    var latcur = latmin + latmar + latrand;
    var lngcur = lngmin + lngmar + lngrand;

    query += "(NULL, '" + latcur + "', '" + lngcur + "')";
    if (i < num - 1) query += ", ";
  }

  mysqlcon.query(query, function (error, rows, fields) {
    if (error) {
      console.log('Error in query!');
    }
    else {
      console.log("Successfully entered " + num + " records!");
    }
  });
}

//FUNCTION TO RETURN NO OF HOTSPOTS IN GIVEN AREA
const numhotspot = (latmin, latmax, lngmin, lngmax) => {
  var query = "SELECT lat, lng FROM `hotspots` WHERE (`lat` BETWEEN " + latmin + " AND " + latmax + ") AND (`lng` BETWEEN " + lngmin + " AND " + lngmax + ")";
  return new Promise(function (resolve, reject) {

    mysqlcon.query(query, function (error, rows, fields) {
      if (rows) {
        resolve(rows);
      }
      else {
        reject(error);
      }
    });
  })
}

//FUNCTION TO RETURN COVID HOTSPOTS
const covid = (num) => {
  var query = "SELECT lat, lng from `hotspots` LIMIT " + num;
  return new Promise(function (resolve, reject) {
    mysqlcon.query(query, function (error, rows, fields) {
      if (rows) {
        resolve(rows);
      }
      else {
        reject(error);
      }
    });
  })
}

module.exports = {
  mysqlcon,
  genhotspot,
  numhotspot,
  covid
};