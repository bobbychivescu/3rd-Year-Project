/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

var express = require('express');
var bodyParser = require('body-parser');
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

const AWS = require('aws-sdk');
var nodemailer = require('nodemailer');
var ses = new AWS.SES();

// declare a new express app
var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});


app.post('/email', function(req, res) {

  var mailOptions = {
    from: "projectmanagementapp8@gmail.com",
    subject: req.body.subject,
    text: req.body.text,
    to: req.body.to
  };

  // create Nodemailer SES transporter
  var transporter = nodemailer.createTransport({
    SES: ses
  });

  // send email
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log("Error sending email: " + JSON.stringify(err));
      res.json({error: 'something happened: ' + err, url: req.url, body: req.body});
    } else {
      console.log("Email sent successfully");
      res.json({success: 'post call succeed!', url: req.url, body: req.body})
    }
  });

});


app.listen(3000, function() {
  console.log("App started")
});

module.exports = app