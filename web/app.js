var express = require("express");
var app     = express();
var path    = require("path");

var PythonShell = require('python-shell');

app.use("/public", express.static(path.join(__dirname, 'public')));
app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/views/index.html'));
});

app.get('/load_tweet',function(req,res){
  // Run python
  var pyshell = new PythonShell(__dirname+"/python/get_random_tweet.py");
  pyshell.on('message', function (message) {
    // received a message sent from the Python script (a simple "print" statement)
    console.log(message);
    res.json(message)
  });
});

app.get('/add_guess',function(req,res){
  party = req.query.party;
  twitter_handle = req.query.twitter_handle;
  tweet = req.query.tweet;
  guess = req.query.guess;
  location = req.query.location;

  // Send the python submit guess method
  var pyshell = new PythonShell(__dirname+"/python/submit_guess.py");
  pyshell.send(party);
  pyshell.send(twitter_handle);
  pyshell.send(tweet);
  pyshell.send(guess);
  pyshell.send(location);

});
app.listen(3000);
console.log("Running at Port 3000");
