var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', {title : 'test'});
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
       res.send({ status : "success"});
        //res.redirect('/index');
   } else {
       response.send({ status : "error", message : "This user does not exits"});
   }
});
module.exports = router;
