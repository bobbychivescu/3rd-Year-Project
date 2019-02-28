
const AWS = require('aws-sdk')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')
var generateName = require('sillyname');

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "3ypUsers";


const partitionKeyName = "userId";
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

app.get(path + '/contacts', function(req, res) {
  const params = {};
  params[tableName] = {
    Keys: req.apiGateway.event.multiValueQueryStringParameters.ids.map((item) => {
      return {
        userId: item
      }
    }),
    ProjectionExpression: 'userId, bio, emailPublic, nickname, email'
  };

  const q = {
    RequestItems: params
  };

  dynamodb.batchGet(q, (err, data) => {
    if (err) {
      res.json({error: 'Could not load items: ' + err});
    } else {
      res.json(data.Responses[tableName]);
    }
  });
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path, function(req, res) {
  const params = {};
  params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId;

  const getItemParams = {
    TableName: tableName,
    Key: params
  };

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


//put for adding/removing groups, contacts

app.put(path +'/:action', function(req, res) {

  //consider if this should ever be done by other user
  //add extra userId parama to request
  const putItemParams = {
    TableName: tableName,
    Key: {
      userId: req.body.userId ? req.body.userId : req.apiGateway.event.requestContext.identity.cognitoIdentityId
    }
  }

  let expression = req.params['action'] + ' ';
  const l = expression.length;
  const values = {};

  for (var property in req.body) {
    if (req.body.hasOwnProperty(property) && property !== 'userId') {
      if(expression.length > l) //something was added
        expression += ', ';

      expression += (property + ' :' + property);
      values[':' + property] = dynamodb.createSet(req.body[property]);
    }
  }

  putItemParams['UpdateExpression'] = expression;
  putItemParams['ExpressionAttributeValues'] = values;
  putItemParams['ReturnValues'] = 'UPDATED_NEW';


  if(expression.length > l) {
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
 * HTTP put method for edit user
 *************************************/

app.put(path, function(req, res) {
  const putItemParams = {
    TableName: tableName,
    Key: {
      userId: req.apiGateway.event.requestContext.identity.cognitoIdentityId
    }
  }

  let expression = 'set ';
  const values = {};

  for (let property in req.body) {
    if (req.body.hasOwnProperty(property)) {
      if(expression.length > 4){ //something was added
        expression += ', ';
      }
      expression += (property + ' = :' + property);
      values[':' + property] = req.body[property];
    }
  }

  putItemParams['UpdateExpression'] = expression;
  putItemParams['ExpressionAttributeValues'] = values;
  putItemParams['ReturnValues'] = 'UPDATED_NEW';

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
  req.body['emailNotifications'] = true;
  req.body['emailPublic'] = true;

  const putItemParams = {
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
  const params = {};
  params[partitionKeyName] = req.apiGateway.event.requestContext.identity.cognitoIdentityId;

  const removeItemParams = {
    TableName: tableName,
    Key: params
  };

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

