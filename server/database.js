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
        if(i < num - 1) query += ", ";
    }

    mysqlcon.query(query, function(error, rows, fields) {
        if(error) {
            console.log('Error in query!');
        }
        else {
            console.log("Successfully entered " + num + " records!");
        }
    });
}

//FUNCTION TO RETURN NO OF HOTSPOTS IN GIVEN AREA
async function numhotspot(latmin, latmax, lngmin, lngmax) {
  var query = "SELECT lat, lng FROM `hotspots` WHERE (`lat` BETWEEN " + latmin + " AND " + latmax + ") AND (`lng` BETWEEN " + lngmin + " AND " + lngmax + ")"

  mysqlcon.query(query, function(error, rows, fields) {
      //console.log(rows);
      return Promise.resolve(rows);
  });
}

module.exports = {
  mysqlcon,
  genhotspot,
  numhotspot
};  