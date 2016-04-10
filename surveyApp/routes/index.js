var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title : 'test'});
});


router.post('/mainpage', function(req, res, next) {
   console.log(req.body);
   res.send({ status : "success"});
});

router.get('/index', function(req, res, next){
    console.log(req.body);
    res.render('index.jade');
});

router.post('/index', function(req, res, next){
    console.log('this');
});

router.post('/login', function(req, res, next) {
   console.log(req.body);
   if(req.body.user == 'admin' && req.body.password == 'admin'){
       res.write({ status : "success"});
       res.writeHead(300, {'Location': '/index' });
       res.end();
       //res.redirect('/index');
   } else {
       res.send({ status : "error", message : "The user " + req.body.user + " does not exits"});
   }
});
module.exports = router;
