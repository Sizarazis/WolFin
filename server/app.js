var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var unirest = require('unirest');

var indexRouter = require('./routes/index');
var StockSummary = require('./models/StockSummary').StockSummary;
var StockHistory = require('./models/StockHistory').StockHistory;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


// TEMPLATED FROM:
// https://dev.to/nburgess/creating-a-react-app-with-react-router-and-an-express-backend-33l3

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/')));

// An api endpoint that returns a short list of items
app.get('/api/:symbol', (req,res) => {
    var list = ["item1", "item2", "item3"]; 
    var stock = req.params.symbol;
    res.json(list);
    console.log("Sent list of items");

    // Request Summary Data
    unirest.get("https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary?region=US&symbol=" + stock)
    .header("X-RapidAPI-Host", "apidojo-yahoo-finance-v1.p.rapidapi.com")
    .header("X-RapidAPI-Key", "PRIVATE KEY")
    .end(function (result) {
      var tempSummary = result;

      if (result.status == 200) {
        var summary = new StockSummary(tempSummary);
      }

      console.log(result.status, "Received summary response.");
      console.log(summary);

      //TEMP: TO UNDERSTAND THE PARSING      
      // var fs = require('fs');
      // fs.writeFile(stock + "_summary" + '.json', JSON.stringify(tempSummary), 'utf8', function(err){
      //   if (err) throw err;
      //   });
      });

    //Request Historical Data
    unirest.get("https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-charts?comparisons=%5EGDAXI%2C%5EFCHI&region=US&lang=en&symbol=" + stock + "&interval=5m&range=1d")
    .header("X-RapidAPI-Host", "apidojo-yahoo-finance-v1.p.rapidapi.com")
    .header("X-RapidAPI-Key", "PRIVATE KEY")
    .end(function (result) {

      var tempHistory = result;

      if (result.status == 200) {
        var history = new StockHistory(tempHistory);
      }

      console.log(result.status, "Received history response.");
      console.log(history);  
    });
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/public/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
