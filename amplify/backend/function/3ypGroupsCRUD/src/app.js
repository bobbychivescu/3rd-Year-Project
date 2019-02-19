/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/
const AWS = require('aws-sdk')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "3ypGroups";

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "name";
const partitionKeyType = "S";
const sortKeyName = "endDate";
const sortKeyType = "S";
const hasSortKey = sortKeyName !== "";
const path = "/groups";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch(type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

/********************************
 * HTTP Get method for list objects *
 ********************************/

app.get(path + hashKeyPath, function(req, res) {
  var condition = {}
  condition[partitionKeyName] = {
    ComparisonOperator: 'EQ'
  }

  if (userIdPresent && req.apiGateway) {
    condition[partitionKeyName]['AttributeValueList'] = [req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH ];
  } else {
    try {
      condition[partitionKeyName]['AttributeValueList'] = [ convertUrlType(req.params[partitionKeyName], partitionKeyType) ];
    } catch(err) {
      res.json({error: 'Wrong column type ' + err});
    }
  }

  let queryParams = {
    TableName: tableName,
    KeyConditions: condition
  }

  dynamodb.query(queryParams, (err, data) => {
    if (err) {
      res.json({error: 'Could not load items: ' + err});
    } else {
      res.json(data.Items);
    }
  });
});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + hashKeyPath, function(req, res) {
  var params = {};
  params[partitionKeyName] = req.params[partitionKeyName];

  let getItemParams = {
    TableName: tableName,
    Key: params
  }

  console.log(params);

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

//put for adding/removing members

app.put(path +'/:action' + hashKeyPath, function(req, res) {

  let putItemParams = {
    TableName: tableName,
    Key: {
      name: req.params[partitionKeyName]
    }
  }

  let expression = req.params['action'] + ' ';
  let l = expression.length;
  let values = {};

  for (var property in req.body) {
    if (req.body.hasOwnProperty(property)) {
      if(expression.length > l) //something was added
        expression += ', ';

      expression += (property + ' :' + property);
      values[':' + property] = dynamodb.createSet(req.body[property]);
    }
  }

  //who can add new memebers?
  //values[':createdBy'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId;

  putItemParams['UpdateExpression'] = expression;
  putItemParams['ExpressionAttributeValues'] = values;
  //putItemParams['ConditionExpression'] = 'createdBy = :createdBy';

  console.log(putItemParams);

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
 * HTTP put method for update object *
 *************************************/

app.put(path + hashKeyPath, function(req, res) {

  let putItemParams = {
    TableName: tableName,
    Key: {
      name: req.params[partitionKeyName]
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
  values[':createdBy'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId;

  putItemParams['UpdateExpression'] = expression;
  putItemParams['ExpressionAttributeValues'] = values;
  putItemParams['ConditionExpression'] = 'createdBy = :createdBy';

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
 * HTTP post method for insert object *
 *************************************/

app.post(path, function(req, res) {

  req.body['createdBy'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId;
  req.body['members'] = dynamodb.createSet([req.apiGateway.event.requestContext.identity.cognitoIdentityId]);

  let putItemParams = {
    TableName: tableName,
    Item: req.body,
    ExpressionAttributeNames: {
      '#n': 'name'
    },
    ConditionExpression: 'attribute_not_exists(#n)'
  };

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

app.delete(path + hashKeyPath, function(req, res) {
  var params = {};
  params[partitionKeyName] = req.params[partitionKeyName];

  let values = {};
  values[':createdBy'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId;

  let removeItemParams = {
    TableName: tableName,
    Key: params,
    ExpressionAttributeValues: values,
    ConditionExpression : 'createdBy = :createdBy'

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

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
