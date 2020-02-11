var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var unirest = require('unirest');
var request = require('request');

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
app.get('/api/predictor/:symbol', function(req,res) {
  var stock = req.params.symbol;
  var response = new Array(3);
  var requester = req.header('x-forwarded-for') || req.connection.remoteAddress;
  console.log("New request from: ",  requester);
  console.log("Requesting...", stock);

  // get company summary data
  const p1 = getSummaryData(stock);
  p1.then(function(summary) {
    response[0] = summary;
  }, function(error) {
    console.log("Error occurred in getSummaryData...", error);
  });

  // get historical stock data
  const p2 = getHistoryData(stock, "1d", "5y");
  p2.then(function(history) {
    response[1] = history;
  }, function(error) {
    console.log("Error occured in getHistoryData...", error.json().toString());
  });

  Promise.all([p1, p2]).then(function(values) {
    // get next day's prediction
    getAWSresponse(response[1]).then(function(prediction) {
      response[2] = prediction;
      console.log("Prediction recieved: " + response[2])

      // send all the data to the client
      console.log("Sending response for..." + stock + ", to..." + requester);
      res.json(response);
    },
    function(error) {
        //TODO: HANDLE ERRORS FOR getAWSresponse
        res.json(["error", "Failed to connect to the AWS endpoint."]);
        console.log("Error occurred in getAWSresponse...", error);
    });
  }).catch(error => { 
    //TODO: HANDLE ERRORS FOR YAHOO FINANCE RAPIDAPI CALLS
    res.json(["error", "Failed to retrieve the stock's information from the Yahoo Finance API."]);
    console.error("Error occured in retrieving the company's information...", error.json().toString());
  })
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


// TODO: set timeout
// Request Summary Data from Yahoo Finance API
function getSummaryData(stock) {
  return new Promise(function(resolve, reject) { 
    unirest.get("https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-summary?region=US&symbol=" + stock)
    .header("X-RapidAPI-Host", "apidojo-yahoo-finance-v1.p.rapidapi.com")
    .header("X-RapidAPI-Key", "PRIVATE KEY")
    .end(function (result) {
      console.log(result.status, "Received summary response from Yahoo Finance API (via RapidAPI).");

      var tempSummary = result;

      if (result.status < 400 && result.body != null) {
        summary = new StockSummary(tempSummary);
        //console.log("SUMMARY RESOLVED");
        resolve(summary);
      }
      else {
        //console.log("SUMMARY REJECTED");
        reject(Error(result));
      }
    })
  })
}

// TODO: set timeout
// Request Historical Data from Yahoo Finance API
function getHistoryData(stock, interval, range) {
  return new Promise(function(resolve, reject) {
    unirest.get("https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-charts?comparisons=%5EGDAXI%2C%5EFCHI&region=US&lang=en&symbol=" + stock + "&interval=" + interval + "&range=" +  range)
    .header("X-RapidAPI-Host", "apidojo-yahoo-finance-v1.p.rapidapi.com")
    .header("X-RapidAPI-Key", "PRIVATE KEY")
    .end(function (result) {
      console.log(result.status, "Received history response from Yahoo Finance API (via RapidAPI).");
      //console.log(result.body);

      if (result.status < 400 && result.body.chart.result != null) {
        //console.log("HISTORY RESOLVED");
        resolve(new StockHistory(result));
      }
      else {
        //console.log("HISTORY REJECTED");
        reject(Error(result));
      }
    })
  })
}

//TODO: set timeout
// Contacts the AWS server to get the next day's prediction for the stock
function getAWSresponse(historyData) {
  return new Promise(function(resolve, reject) {
    try {
      var formattedData = prepareHistoryRequest(historyData);
      
      request.post({ 
        headers: {'content-type' : 'application/json', 'accept' : 'application/json'}, 
        url: 'PRIVATE URL', 
        body: JSON.stringify(formattedData) }, 
        function(error, res, body){
          console.log(res.statusCode, "Recieved prediction response from WolFin AWS endpoint.");
          //console.log("body: " + body.includes("errorMessage"));
          //console.log("error: " + error);

          if (res.statusCode >= 400 || body.includes("errorMessage")) {
            //console.log("AWS REJECTED");
            reject(Error(res.body));
          }
          else {
            var prediction = body;
            //console.log("AWS RESOLVED");
            resolve(prediction);
          }
      });
    } catch(error) {
      reject(Error(error));
    }
  });
}

// Parses the history response from the Yahoo Finance API into the required format for the AWS body.
function prepareHistoryRequest(historyData) {
  var indicators = historyData.body.chart.result[0].indicators.quote[0].close;

  var epoch = historyData.body.chart.result[0].timestamp[0];
  var date = new Date(epoch * 1000);

  var months = { Jan:'01', Feb:'02', Mar:'03', Apr:'04', May:'05', Jun:'06', Jul:'07', Aug:'08', Sep:'09', Oct:'10', Nov:'11', Dec:'12' }
  var split = date.toString().split(" ");
  
  var year = split[3];
  var month = split[1];
  var day = split[2];
  var time = split[4];

  var goodDate = year + "-" + months[month] + "-" + day + " " + time;

  //NOTE: I should test the epoch multiplication thing. Seems a bit wonky.
  //I want: 2019-12-04 06:30:00
  // console.log("epoch: " + epoch);
  // console.log("Updated date: " + goodDate);
  
  var formattedData = {"instances": [{"start": goodDate, "target": indicators}]};
  //console.log(formattedData)
  
  return formattedData;
}