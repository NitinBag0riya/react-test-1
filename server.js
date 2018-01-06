const express = require('express');
const app = express();
const Pusher = require('pusher');
const cors = require("cors");
const bodyParser = require('body-parser');
var randomInt = require('random-int');
var http = require('http');
var https = require('https');
var fs = require('fs');


var sslOptions = {
    key: fs.readFileSync('key.pem', 'utf8'),
    cert: fs.readFileSync('cert.pem', 'utf8'),
    passphrase: 'holas'
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

var pusher = new Pusher({
  appId: "451686",
  key: "375b50047c7705f219a4",
  secret: "8ad2a8d0f5b20b705bd3",
  cluster: "ap2",
  encrypted: true,
});

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));


app.post("/pusher/auth", function(req, res) {
  var socketId = req.body.socket_id;
  var channel = req.body.channel_name;
  var presenceData = {
    user_id: randomInt(100,1000)
  };
  var auth = pusher.authenticate(socketId, channel, presenceData);
  res.send(auth);
});


app.post('/message/send' , (req, res) => {

  pusher.trigger("presence-my-channel", "my-event", {
      username: req.body.username,
      message: req.body.message
  });

    res.json({ username: req.body.username, message: req.body.message });
});



app.get('/get', function(req, res){
    res.send('Hello World');
});

//http.createServer(app).listen(5000, () => console.log('your website is running on http'));
https.createServer(sslOptions, app).listen(5000, () => console.log('your website is running on https'))

//app.listen(5000, () => console.log('your website is running'));

