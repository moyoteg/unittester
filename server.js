// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var assets = require('./assets');
var fs = require('fs');
var AssetUrlGetter = require('./assetUrlGetter.js')

app.set('view engine', 'pug')
app.use("/assets", assets);
// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

app.locals.siteName = "VIVResource Manager"

// endpoints available
var endpointList = {
  jsonTest:"/jsontest",
  fetchResourceURL:"/fetchResourceURL",
  failUntilRetryCount:"/failUntilRetryCount",
  retryAfter:"/retryAfter",
  etagAsset:"/etagAsset",
  etag:"/etag",
  pugTemplate:"/pugTemplate",
  getRandomAssetURLArray:"/getRandomAssetURLArray"
}

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (request, response) {
  
  var endpointListKeys = Object.keys(endpointList)
  console.log(endpointListKeys)
  response.render('index', { 
    title: ' VIVResource Unit Tester Server',
    header: 'Endpoints for tests:',
    message: 'Welcome, ',
    endpointList: endpointListKeys
  })
});

/*
  JSON testing example No More
*/
app.get(endpointList['jsonTest'], function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify({ a: 1 }));
});

// Fetch resource url -> in order to get a URL you must request another URL first
app.get(endpointList['fetchResourceURL'], function (request, response) {
  response.setHeader('Content-Type', 'application/json');
  response.send(JSON.stringify({ url: "https://viv-resource-manager.glitch.me/failUntilRetryCount" }));
  console.log('fetchResourceURL endpoint called')
});

/*
  failUntilRetryCount
  
  In this example I behave like a thumbnail whose URL has been created but the resource is NOT available
  until trying for <failUntilRetryCount> times.
*/

var failUntilRetryCount = 0;
var failUntilRetryCountMax = 3

app.get(endpointList['failUntilRetryCount'], function (request, response) {
  if (failUntilRetryCount < failUntilRetryCountMax) {
    
    response.status(404) // HTTP status 404: NotFound
      .send('Not found yet, ' + 'try ' + (failUntilRetryCountMax - failUntilRetryCount) + ' more time(s).')
    
    var urlString = request.protocol + "://" + request.get('host') + request.originalUrl
  
    console.log(urlString + ' endpoint has been hit ' + failUntilRetryCount + ' times.')

    // increase the count    
    failUntilRetryCount++
  } else {
      
    response.status(200)
    var filepath = "https://cdn.glitch.com/a8a4385f-dee0-49f0-84ca-a26ec63b2c5e%2FMoi.png?1516739408816"
    response.redirect(filepath)
    
    console.log('redirected to get image asset')
    console.log('failUntilRetryCount endpoint called')

    // reset the count
    failUntilRetryCount = 0
  }
});

/* 
Retry after testing
*/
app.get(endpointList["retryAfter"], function (request, response) {
  response.status(429)  
  response.send(JSON.stringify({ message: "you are trying to fetch new thumbmnails and we won't send you any new ones until: _" }));

  console.log('retryAfter endpoint called')
});

/*
Etag asset testing
*/ 
var etagAssetRequestCount = 0
var etagAssetRequestCountMax = 9

var imageURLs = [
  "https://cdn.glitch.com/a8a4385f-dee0-49f0-84ca-a26ec63b2c5e%2F0.png?1517350764482",
  "https://cdn.glitch.com/a8a4385f-dee0-49f0-84ca-a26ec63b2c5e%2F1.png?1517350764469",
  "https://cdn.glitch.com/a8a4385f-dee0-49f0-84ca-a26ec63b2c5e%2F2.png?1517350764409",
  "https://cdn.glitch.com/a8a4385f-dee0-49f0-84ca-a26ec63b2c5e%2F3.png?1517350764496",
  "https://cdn.glitch.com/a8a4385f-dee0-49f0-84ca-a26ec63b2c5e%2F4.png?1517350764504",
  "https://cdn.glitch.com/a8a4385f-dee0-49f0-84ca-a26ec63b2c5e%2F5.png?1517350764475",
  "https://cdn.glitch.com/a8a4385f-dee0-49f0-84ca-a26ec63b2c5e%2F6.png?1517350764616",
  "https://cdn.glitch.com/a8a4385f-dee0-49f0-84ca-a26ec63b2c5e%2F7.png?1517350764500",
  "https://cdn.glitch.com/a8a4385f-dee0-49f0-84ca-a26ec63b2c5e%2F8.png?1517350764222",
  "https://cdn.glitch.com/a8a4385f-dee0-49f0-84ca-a26ec63b2c5e%2F9.png?1517350764508"
  ]

app.get(endpointList["etagAsset"], function (request, response) {
  if (etagAssetRequestCount > etagAssetRequestCountMax) {
    etagAssetRequestCount = 0
  }
  var filepath = imageURLs[etagAssetRequestCount]
  response.redirect(filepath)
  console.log('etag changed')
  console.log('redirected to get image asset')
  etagAssetRequestCount++
  console.log('etagAsset endpoint called')
});

/*
Etag testing
*/ 
var etagRequestCount = 0
var etagRequestCountMax = 0

app.get(endpointList["etag"], function (request, response) {
  var etagString = 'v' + etagRequestCount  
  response.set({
  'ETag': etagString
  })
  etagRequestCount++
  response.render('etag', { 
    title: 'Etag Unit Test',
    header: 'Etag Unit Test',
    message: 'Current Etag version: ' + etagString,
    explanation: 'This test is meant to pretend we have an ever changing etag therefore we must download a new VERSION of an asset.',
    warning: 'DO NOT CONFUSE with Etag Asset testing'    
  })
  console.log('etag endpoint called')
});

/*
Template for creating HTML renders with pug(much easier)
*/
app.get(endpointList["pugTemplate"], function (request, response) {
  response.render('template', { 
    title: 'Etag Unit Test',
    header: 'Etag Unit Test',
    message: 'message'
  })
  console.log('pugTemplate endpoint called')
});

/*
This endpoint es meant to give random asset urls that are needed for testing
look into "assetUrlGetter.js"
*/
app.get(endpointList["getRandomAssetURLArray"], function (request, response) {
  
  let ag = new AssetUrlGetter()

  ag.getArray(function(assets) {
      var messageData = {
      assetsArray:assets 
    }    
      console.log(messageData)
      response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify(messageData));
    }) 
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
