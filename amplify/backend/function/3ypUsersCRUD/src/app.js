
const AWS = require('aws-sdk')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')
var generateName = require('sillyname');

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "3ypUsers";


const partitionKeyName = "userId";
const partitionKeyType = "S";
const path = "/profile";
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});


/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path, function(req, res) {
  var params = {};
  params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId;

  let getItemParams = {
    TableName: tableName,
    Key: params
  }

  dynamodb.get(getItemParams,(err, data) => {
    if(err) {
      res.json({error: 'Could not load items: ' + err.message});
    } else {
      if (data.Item) {
        res.json(data.Item);
      } else {
        res.json(data) ;
      }
    }
  });
});


/************************************
 * HTTP put method for edit user
 *************************************/

app.put(path, function(req, res) {

  let putItemParams = {
    TableName: tableName,
    Key: {
      userId: req.apiGateway.event.requestContext.identity.cognitoIdentityId
    }
  }

  let expression = 'set ';
  let values = {};

  for (var property in req.body) {
    if (req.body.hasOwnProperty(property)) {
      if(expression.length > 4) //something was added
        expression += ', ';

      expression += (property + ' = :' + property);
      values[':' + property] = req.body[property];
    }
  }

  putItemParams['UpdateExpression'] = expression;
  putItemParams['ExpressionAttributeValues'] = values;

  console.log(putItemParams);

  if(expression.length > 4) {
    dynamodb.update(putItemParams, (err, data) => {
      if(err) {
        res.json({error: err, url: req.url, body: req.body});
      } else{
        res.json({success: 'put call succeed!', url: req.url, data: data})
      }
    });
  } else {
    res.json({status: 'nothing changed', url: req.url});
  }


});


/************************************
 * HTTP post method for new user *
 *************************************/

app.post(path, function(req, res) {
  req.body['userId'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId;
  req.body['nickname'] = generateName();
  req.body['bio'] = 'no bio added';

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }

  dynamodb.put(putItemParams, (err, data) => {
    if(err) {
      res.json({error: err, url: req.url, body: req.body});
    } else{
      res.json({success: 'post call succeed!', url: req.url, data: data})
    }
  });
});


/**************************************
 * HTTP remove method to delete object *
 ***************************************/

app.delete(path, function(req, res) {
  var params = {};
  params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId;

  let removeItemParams = {
    TableName: tableName,
    Key: params
  }

  dynamodb.delete(removeItemParams, (err, data)=> {
    if(err) {
      res.json({error: err, url: req.url});
    } else {
      res.json({url: req.url, data: data});
    }
  });
});

app.listen(3000, function() {
  console.log("App started")
});

module.exports = app

