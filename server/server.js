const express = require('express');
const bodyParser = require('body-parser');

// //database util
const utils = require('./database.js');

var app = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static('public'));
app.use(bodyParser.json());
app.listen(3000, () => {
    console.log(`started on port 3000`);
});

//route for sending sorted routes
app.post('/routes',(req,res)=>{
    var routeArr = req.body.routeArr;
    var minmax = findSquare(routeArr);
    utils.numhotspot(minmax.latmin,minmax.latmax,minmax.lngmin,minmax.lngmax).then((response)=>{
        var pointArr = response;
        var ans = dissort(routeArr,pointArr);
        res.send({ans});
    });
})

//route for sending covid hotspots
app.post('/covidroute',(req,res)=>{
    utils.covid(500).then((response)=>{
        var covidArr = response;
        res.send({covidArr});
    });
})

function findSquare(arr){
    var latmin = 360;
    var latmax = 0;
    var lngmin = 180;
    var lngmax= -180;
    arr.forEach(element => {
        element.forEach((el) =>{
            latmin = Math.min(latmin,el.lat);
            latmax = Math.max(latmax,el.lat);
            lngmin = Math.min(latmin,el.lng);
            lngmax = Math.max(latmax,el.lng);
        })
    });
    return {latmin,latmax,lngmin,lngmax};
}

function distance(lat1, lat2, lon1, lon2) 
{ 

lon1 = toRadians(lon1); 
lon2 = toRadians(lon2); 
lat1 = toRadians(lat1); 
lat2 = toRadians(lat2); 

// Haversine formula  
var dlon = lon2 - lon1;  
var dlat = lat2 - lat1; 
var a = Math.pow(Math.sin(dlat / 2), 2) 
+ Math.cos(lat1) * Math.cos(lat2) 
* Math.pow(Math.sin(dlon / 2),2); 
var c = 2 * Math.asin(Math.sqrt(a)); 
var r = 6371;  
return(c * r); 
} 

function dissort(routeArr,pointArr){
    var ans = [];
    var i=0;
    routeArr.forEach((route)=>{
        var dis = 0;
        route.forEach((obj)=>{
            pointArr.forEach((point)=>{
                dis+=distance(obj.lat,point.lat,obj.lng,point.lng);
            })
        })
        dis *= pointArr.length;
        ans.push({dis,i});
        i++;   
    })
    ans.sort(function(a,b) {return b.dis - a.dis});
    return ans;
}

function toRadians(degree) 
{ 
    one_deg = Math.PI / (180); 
    return (one_deg * degree); 
}

//UNCOMMENT THIS TO GENERATE HOTSPOTS ()
// utils.genhotspot(21.060000, 21.219999, 72.720000, 72.870000, 100, 0, 0);

// utils.numhotspot(22,23,45,46).then(response => console.log(response));