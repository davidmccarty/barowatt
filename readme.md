# Barowatt UI

## Overview
Barowatt unit emits XML data on serial port:
- at 6 second intervals for current temp and enrgy
- at 2hr intervals for historic data

Application has 3 parts:
1. An express server that listens on the data and writes it to mongodb
2. A mongo server storing data
3. An angular client server from the same express server

Current weather data is also collected hourly and can be joined to history data.

## Run Mongo as local docker container
````sh
docker run --rm --name barowatt-db -p 27017:27017 -d mongo:latest
````

## Current weather from openweathermap
http://api.openweathermap.org/data/2.5/weather?q=vence&APPID=019a0a5e4df82183ca8fb6abc9fd3522


## TODO
- connect live device when cable arrives
- add weather details
- add peak/off-peakhours, price data and cost calculations
- convert to json and write in mongo
- expose routes to get data from mongo
- build UI with angular
- purge old data
- do something about time drift e.g. compare recorded time with current time and notify drift beyond limit so sensor clock can be manually adjusted
- package and deploy as docker containers (or windows service) on public port for green-mango
