var express = require('express');
var app = express();
app.set('view engine', 'pug');


/*
simple twitter ctient 
*/
var Twitter = require('twitter')

var client  = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

//index
app.get('/',function(req,res) {
  var params = {screen_name: process.env.TWITTER_SCREEN_NAME,count:30};
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
        client.get('lists/list',params,function(er,ls,respo2) {
          res.render('user',{user:us,list:ls});
        });
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

//limit
app.get('/lm',function(req,res) {
  var params = {};
  client.get('application/rate_limit_status', params, function(error, limit, respo) {
    if(!error) {
        res.render('limit',{lm:limit});
    }
  });
});

//retweet
app.get('/rt',function(req,res) {
  var params = {trim_user:false,count:50};
  var ids = req.query.rt
  client.get('statuses/retweets/'+ids, params, function(error, stt, respo) {
    if(!error) {
        res.render('retweet',{tw:stt});
    }else{
      console.log(error)
    }
  });
});

//listed
app.get('/listed',function(req,res) {
  var params = {screen_name:req.query.nm,count:50};
  client.get('lists/memberships', params, function(error, lts, respo) {
    if(!error) {
        res.render('listed',{tw:lts});
    }else{
      console.log(error)
    }
  });
});

//search
app.get('/sc',function(req,res) {
  var params = {q:req.query.q,count:50};
  client.get('search/tweets', params, function(error, tweets, respo) {
    if(!error) {
        res.render('index',{tw:tweets.statuses});
    }else{
      console.log(error)
    }
  });
});

//listmenber
app.get('/listmember',function(req,res) {
  var params = {owner_screen_name:req.query.nm,slug:req.query.slug};
  client.get('lists/members', params, function(error, member, respo) {
    if(!error) {
        res.render('member',{mem:member.users});
    }else{
      console.log(error)
    }
  });
});

console.log("listen 3000")
app.listen(3000);
