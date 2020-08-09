# NoCovidStreet

The aim is to build a webapp for showing the safest route between two locations by considering all the nearby COVID hotspots.

## Problem that our project addresses

In the times of corona pandemic the main concern of all residents is how to reach a destination without going through hotspots or in which we have least exposure to hotspots.
Since Unlock procedure has started there is no containment zones of 200-300m radius created as they were initially, instead now only the building is being sealed that too just a banner is put outside the building ith no restrictions in going in and out.
Thus to be safe from exposure to covid infected patients we need a route which goes through as many least hotspots as possible.

### Prerequisites
  ```
  npm should be installed in the computer
  ```
  if not installed go to https://phoenixnap.com/kb/install-node-js-npm-on-windows

### Installing

A step by step series of how to set up code locally

Say what the step will be

```
clone the code using git clone "https://github.com/HAC-2020/CodeZera.git"
```

```
run npm install in the CodeZera folder
```
```
api keys needs to be changed
```
```
.env file needs to be added to connect to your local database 
```
refer to server/databse.js for what all values are needed in .env file

```
first comment second last line of server,js file and start server using node server/sevrer.js
```
this to to generate database. After gnerating press cntrl+C
```
then comment the code and again start server
```
```
at last open index.html
```
## Running the tests

To generate route one needs to enter source and destination location. (Both loations should be of Surat city)

## Deployment

The project can de deployd using heroku server
```
If u dont how to deploy using heroku please go through https://devcenter.heroku.com/categories/deployment
```

## Built With

* [HTML](https://www.w3schools.com/html/) [CSS](https://www.w3schools.com/css/) [Javascript] (https://www.javascript.com/) - The web framework used
* [HERE Map API](https://developer.here.com/) [Google Maps API](https://developers.google.com/maps/documentation)- APIs Used
* [Node JS](https://nodejs.org/) - Used for Back-End
* [MySQL](https://www.mysql.com/) - Used for database

