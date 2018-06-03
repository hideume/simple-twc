var express = require('express');
var app = express();
app.locals.title = 'simple-twitter'

app.set('title','simple-twitter');
app.set('view engine', 'pug');
app.set('compileDebug',true)
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
  var params = {}
  if(!req.query.nextid) {
     params = {screen_name: process.env.TWITTER_SCREEN_NAME,count:80};
  }else{
    params = {screen_name: process.env.TWITTER_SCREEN_NAME,count:80,max_id: req.query.nextid};
  }
  client.get('statuses/home_timeline', params, function(error, tweets, respo) {
    if(!error) {
      if(req.query.preid) {
        res.render('index',{tw:tweets,
          name:process.env.TWITTER_SCREEN_NAME,
          preid:req.query.preid});
      }else{
        res.render('index',{tw:tweets,
          name:process.env.TWITTER_SCREEN_NAME,
          preid:0});
        }
    }else {
        //console.log("err"+error[0].message)
        res.render('err',{msg:error[0].message});
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
    }else{
      res.render('err',{msg:error[0].message});
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
      } else if (req.query.sp=="1"){
        res.render('timeindex',{tw:tweets,name:req.query.nm});
      } else {
        res.render('analysys',{tw:tweets,name:req.query.nm});
      }
    }else{
      console.log(error)
      res.render('err',{msg:error[0].message});
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
  var params = {count:100,stringify_ids:false};
  var ids = req.query.rt
  client.get('statuses/retweets/'+ids, params, function(error, stt, respo) {
    if(!error) {
        res.render('retweet',{tw:stt});
    }else{
      console.log(error)
      res.render('err',{msg:error[0].message});
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
      res.render('err',{msg:error[0].message});
    }
  });
});

//listed
app.get('/listed',function(req,res) {
  var params = {screen_name:req.query.nm,count:50};
  client.get('lists/memberships', params, function(error, lts, respo) {
    if(!error) {
        res.render('listed',{tw:lts,listedname:req.query.nm});
    }else{
      console.log(error)
      res.render('err',{msg:error[0].message});
    }
  });
});

//search
app.get('/sc',function(req,res) {
  var xx = encodeURIComponent(req.query.q);
  var params = {q:req.query.q,lang:"ja",src:"typd",count:"50"};
  //console.log(xx);
  client.get('search/tweets', params, function(error, tweets, respo) {
    if(!error) {
        res.render('index',{tw:tweets.statuses});
    }else{
      console.log(error)
      res.render('err',{msg:error[0].message});
    }
  });
});

//listmenber
app.get('/listmember',function(req,res) {
  var params = {owner_screen_name:req.query.nm,slug:req.query.slug,cursor:req.query.cursor};
  client.get('lists/members', params, function(error, member, respo) {
    if(!error) {
        res.render('member_list',{mem:member.users,
          next:member.next_cursor,pre:member.previous_cursor,
          sn:req.query.nm,slug:req.query.slug,cnt:req.query.cnt
        });
    }else{
      console.log(error)
      res.render('err',{msg:error[0].message});
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
        res.render('member_n',{mm:friends,nm:req.query.nm,cnt:req.query.cnt});
    }else{
      console.log(error);
      res.render('err',{msg:error[0].message});
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
      res.render('err',{msg:error[0].message});
    }
  });
});

/////////post
//tweet
app.get('/tw',function(req2,res) {
  var msg=req2.query.q
  var params={status:msg}
  client.post('statuses/update', params,function(error, friends) {
    if(error) {
      console.log(error)
      res.render('err',{msg:error[0].message});
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
      res.render('err',{msg:error[0].message});
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
  var params={screen_name:req.query.nm,slug:"mark2",owner_screen_name:process.env.TWITTER_SCREEN_NAME}
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
