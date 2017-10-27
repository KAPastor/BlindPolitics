var express = require("express");
var app     = express();
var path    = require("path");

var PythonShell = require('python-shell');

app.use(function(req, res, next) {
  // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use("/public", express.static(path.join(__dirname, 'public')));
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/views/index.html'));
});

app.get('/load_tweet',function(req,res){
  // Run python

  var pyshell = new PythonShell("get_random_tweet.py",{scriptPath:__dirname+"/python/"});
  pyshell.on('message', function (message) {
    // received a message sent from the Python script (a simple "print" statement)
    console.log(message);
    res.json(message)
  });
  // end the input stream and allow the process to exit
  pyshell.end(function (err) {
    if (err) throw err;
    console.log(err);
  });
});

app.get('/add_guess',function(req,res){
  party = req.query.party;
  twitter_handle = req.query.twitter_handle;
  tweet = req.query.tweet;
  guess = req.query.guess;
  location = req.query.location;

  // Send the python submit guess method
  var pyshell = new PythonShell("submit_guess.py",{scriptPath:__dirname+"/python/"});
  pyshell.send(party);
  pyshell.send(twitter_handle);
  pyshell.send(tweet);
  pyshell.send(guess);
  pyshell.send(location);
  // end the input stream and allow the process to exit
  pyshell.end(function (err) {
    if (err) throw err;
    console.log(err);
  });


});
app.listen(3000);
console.log("Running at Port 3000");
