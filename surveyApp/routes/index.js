var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});


router.post('/mainpage', function(request, response, next) {
   console.log(request.body);
   response.send({ status : "success"});
});

router.post('/login', function(request, response, next) {
   console.log(request.body);
   if(request.body.user == 'admin' && request.password == 'admin'){
        response.send({ status : "success"});
   } else {
       response.send({ status : "error", message : "This user does not exits"});
   }
});
module.exports = router;
