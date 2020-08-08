const express = require('express');
const bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.listen(3000, () => {
    console.log(`started on port 3000`);
});

app.post('/routes',(req,res)=>{
    var routeArr = req.body.routeArr;
    var minmax = findSquare(routeArr);
    //From db using minmax
    var pointArr = [];
    var ans = dissort(routeArr,pointArr);
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

lon1 = Math.toRadians(lon1); 
lon2 = Math.toRadians(lon2); 
lat1 = Math.toRadians(lat1); 
lat2 = Math.toRadians(lat2); 

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
    routeArr.forEach((route)=>{
        var dis = 0;
        route.forEach((obj)=>{
            pointArr.forEach((point)=>{
                dis+=distance(obj.lat,point.latmobj.lng,point.lng);
            })
        })
        ans.push({route,dis});   
    })
    ans.sort(function(a,b) {return a.dis - b.dis});
    return ans;
}