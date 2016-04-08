var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/mainpage', function(request, response, next) {
   console.log(request.body);
   response.send({ status : "success"});
});
module.exports = router;
