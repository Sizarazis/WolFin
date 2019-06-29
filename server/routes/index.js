var express = require('express');
var unirest = require('unirest');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;

// Yahoo API TEST
// unirest.get("https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-summary?region=US&lang=en")
// .header("X-RapidAPI-Host", "apidojo-yahoo-finance-v1.p.rapidapi.com")
// .header("X-RapidAPI-Key", "PRIVATE KEY")
// .end(function (result) {
//   console.log(result.status, result.headers, result.body);
// });