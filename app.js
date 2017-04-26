var express = require('express');
var app = express();
app.set('view engine', 'pug');
app.use(express.static('public'));

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
  var params = {screen_name: process.env.TWITTER_SCREEN_NAME,count:50};
  client.get('statuses/home_timeline', params, function(error, tweets, respo) {
    if(!error) {
        res.render('index',{tw:tweets,name:process.env.TWITTER_SCREEN_NAME});
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
  var params = {screen_name: req.query.nm,count:50};
  client.get('statuses/user_timeline', params, function(error, tweets, respo) {
    if(!error) {
      if(!req.query.sp){
        res.render('index',{tw:tweets,name:req.query.nm});
      } else {
        res.render('timeindex',{tw:tweets,name:req.query.nm});
      }
    }else{
      console.log(error)
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

//retweet graph
app.get('/rtg',function(req,res) {
  var params = {trim_user:false,count:200};
  var ids = req.query.rt
  client.get('statuses/retweets/'+ids, params, function(error, stt, respo) {
    if(!error) {
        res.render('retweetgraph',{tw:stt,id:ids});
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
  var params = {q:req.query.q,count:50,lang:"ja"};
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

//trend
app.get('/tr',function(req,res) {
  var params = {id:'23424856'}
  client.get('trends/place', params, function(error, tren, respo) {
    if(!error) {
        res.render('trend',{tr:tren[0].trends});
    }
  });
});

//friends/list
app.get('/fr',function(req,res) {
  if(req.query.next) {
    params = {screen_name:req.query.nm,cursor:req.query.next,count:50}
  } else {
    params = {screen_name:req.query.nm,count:50}
  }
  client.get('friends/list', params, function(error, friends, respo) {
    if(!error) {
        res.render('member_n',{mem:friends,user:req.query.nm,no:req.query.no});
    }else{
      console.log(error);
    }
  });
});

//favorites
app.get('/fv',function(req,res) {
  var params={screen_name:req.query.nm}
  client.get('favorites/list', params,function(error, tweets, respo) {
    if(!error) {
      res.render('index',{tw:tweets});
    } else {
      console.log(error)
    }
  });
});

/////////post
//tweet
app.get('/tw',function(req,res) {
  var params={status:req.query.q}
  client.post('statuses/update', params,function(error, friends) {
    if(error) {
      console.log(error)
    }else{
      res.redirect('back');
    }
  });
});
//follow
app.get('/pflc',function(req,res) {
  var params={screen_name:req.query.nm}
  client.post('friendships/create', params,function(error, friends, respo) {
    if(error) {
      console.log('err')
    }else{
      res.redirect('back');
    }
  });
});
//unfollow
app.get('/pfld',function(req,res) {
  var params={screen_name:req.query.nm}
  client.post('friendships/destroy', params,function(error, friends, respo) {
    if(error) {
      console.log(error)
    }else{
      res.redirect('back');
    }
  });
});
//retweet
app.get('/prt',function(req,res) {
  var params={}
  client.post('statuses/retweet/'+req.query.id, params,function(error, friends, respo) {
    if(error) {
      console.log(error)
    }else{
      res.redirect('back');
    }
  });
});
//retweet
app.get('/pladd',function(req,res) {
  var params={screen_name:req.query.nm,slug:"mark",owner_screen_name:process.env.TWITTER_SCREEN_NAME}
  client.post('lists/members/create/', params,function(error, friends, respo) {
    if(error) {
      console.log(error)
    }else{
      res.redirect('back');
    }
  });
});

console.log("listen 3000")
app.listen(3000);
