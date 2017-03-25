var express = require('express');
var app = express();
app.set('view engine', 'pug');


/*
simple twitter ctient 
*/
var Twitter = require('twitter')

var client  = new Twitter({
  consumer_key: '6GIV52GesBwULyq0m0X2Uw',
  consumer_secret: 'wMtOaPC8IqxBGI3K1K4yoYqZQXPo7YPfN4iViEf4Qnw',
  access_token_key: '133929955-TJAEQi91oNrLSDt0la1sHb9trwkngrAswdJZ1O7z',
  access_token_secret: 'BwzjaUM4GZMh9L2NJqA6czzyFUCGPFoDx7TVKnJQ'
});

//index
app.get('/',function(req,res) {
  var params = {screen_name: 'hawaii_hahaha',count:30};
  client.get('statuses/home_timeline', params, function(error, tweets, respo) {
    if(!error) {
        res.render('index',{tw:tweets});
    }
  });
});

//user show
app.get('/us',function(req,res) {
  var params = {screen_name: req.query.nm};
  client.get('users/lookup', params, function(error, us, respo) {
    if(!error) {
        res.render('user',{user:us});
    }
  });
});

//user timeline
app.get('/tl',function(req,res) {
  var params = {screen_name: req.query.nm,count:30};
  client.get('statuses/user_timeline', params, function(error, tweets, respo) {
    if(!error) {
        res.render('index',{tw:tweets});
    }
  });
});

console.log("listen 3000")
app.listen(3000);
