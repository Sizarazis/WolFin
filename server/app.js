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

// An api endpoint that returns info on a public company
app.get('/api/:symbol', function(req,res) {
  var stock = req.params.symbol;
  var response = new Array(2);

  getSummaryData(stock).then(function(summary) {
    response[0] = summary;
    console.log("summary set.");
  }).then(getHistoryData(stock, "5m", "1d").then(function(history) {
    response[1] = history;
    console.log("history set.");
  })).then(function() {
    res.json(response);
    console.log("response sent.");
    }
  )});


  // Request Summary Data from Yahoo Finance API
  function getSummaryData(stock) {
    return new Promise(function(resolve, reject) { 
      unirest.get("https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary?region=US&symbol=" + stock)
      .header("X-RapidAPI-Host", "apidojo-yahoo-finance-v1.p.rapidapi.com")
      .header("X-RapidAPI-Key", "PRIVATE")
      .end(function (result) {
        console.log(result.status, "Received summary response from Yahoo API.");

        var tempSummary = result;

        if (result.status == 200) {
          summary = new StockSummary(tempSummary);
          resolve(summary);
        }
        else {
          reject(Error(result.status));
        }
      })
    })
  }

  // Request Historical Data from Yahoo Finance API
  function getHistoryData(stock, interval, range) {
    return new Promise(function(resolve, reject) {
      unirest.get("https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-charts?comparisons=%5EGDAXI%2C%5EFCHI&region=US&lang=en&symbol=" + stock + "&interval=" + interval + "&range=" +  range)
      .header("X-RapidAPI-Host", "apidojo-yahoo-finance-v1.p.rapidapi.com")
      .header("X-RapidAPI-Key", "PRIVATE")
      .end(function (result) {
        console.log(result.status, "Received history response from Yahoo API.");

        var tempHistory = result;

        if (result.status < 400) {
          history = new StockHistory(tempHistory);
          resolve(history)
        }
        else {
          reject(Error(result.status));
        }
      })
    })
  }

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
