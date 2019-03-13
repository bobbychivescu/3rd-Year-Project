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

const partitionKeyName = "name";
const path = "/groups";
const hashKeyPath = '/:' + partitionKeyName;
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


/********************************
 * HTTP Get method for list objects *
 ********************************/

app.get(path, function(req, res) {
  const params = {};
  params[tableName] = {
    Keys: req.apiGateway.event.multiValueQueryStringParameters.names.map((item) => {
      return {
        name: item
      }
    }), ExpressionAttributeNames: {
      '#n': 'name'
    },
    ProjectionExpression:  '#n, endDate, description'
  };

  const q = {
    RequestItems: params
  };

  dynamodb.batchGet(q, (err, data) => {
    if (err) {
      res.json({error: 'Could not load items: ' + err});
    } else {
      const now = new Date();
      const result = data.Responses[tableName].filter(item => {
        const date = new Date(item.endDate);
        return now < date;
      });
      const toDelete = data.Responses[tableName].filter(item => {
        const date = new Date(item.endDate);
        return now >= date;
      }).map(item => item.name);
      console.log(toDelete)
      //consider generating a token to secure deletion
      res.json({data: result, toDelete: toDelete});
    }
  });

});

/*****************************************
 * HTTP Get method for get single object *
 *****************************************/

app.get(path + hashKeyPath, function(req, res) {
  const params = {};
  params[partitionKeyName] = req.params[partitionKeyName];

  let getItemParams = {
    TableName: tableName,
    Key: params
  };


  dynamodb.get(getItemParams,(err, data) => {
    if(err) {
      res.json({error: 'Could not load items: ' + err.message});
    } else {
      if (data.Item && data.Item.members.values.includes(req.apiGateway.event.requestContext.identity.cognitoIdentityId)) {
        res.json(data.Item);
      } else {
          res.json({error: 'Could not load item. It may not exist'});
      }
    }
  });
});

//put for adding/removing members

app.put(path +'/:action' + hashKeyPath, function(req, res) {

  const putItemParams = {
    TableName: tableName,
    Key: {
      name: req.params[partitionKeyName]
    }
  }

  let expression = req.params['action'] + ' ';
  const l = expression.length;
  const values = {};

  for (let property in req.body) {
    if (req.body.hasOwnProperty(property)) {
      if(expression.length > l) //something was added
        expression += ', ';

      expression += (property + ' :' + property);
      values[':' + property] = dynamodb.createSet(req.body[property]);
    }
  }

  values[':member'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId;
  values[':false'] = false;
  putItemParams['UpdateExpression'] = expression;
  putItemParams['ExpressionAttributeValues'] = values;
  putItemParams['ExpressionAttributeNames'] = {
    '#p': 'private',
    '#m': 'members'
  }
  putItemParams['ConditionExpression'] = '#p = :false OR contains(#m, :member)';
  putItemParams['ReturnValues'] = 'UPDATED_NEW';

  console.log(putItemParams)
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

  const putItemParams = {
    TableName: tableName,
    Key: {
      name: req.params[partitionKeyName]
    }
  }

  let expression = 'set ';
  const values = {};
  const names = {};

  for (let property in req.body) {
    if (req.body.hasOwnProperty(property)) {
      if(expression.length > 4) //something was added
        expression += ', ';

      expression += ('#' + property + ' = :' + property);
      names['#' + property] = property;
      values[':' + property] = req.body[property];
    }
  }
  values[':createdBy'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId;

  putItemParams['UpdateExpression'] = expression;
  putItemParams['ExpressionAttributeNames'] = names;
  putItemParams['ExpressionAttributeValues'] = values;
  putItemParams['ConditionExpression'] = 'createdBy = :createdBy';
  putItemParams['ReturnValues'] = 'UPDATED_NEW';

  console.log(putItemParams)
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
  req.body['members'] = dynamodb.createSet(req.body['members']);

  const putItemParams = {
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

app.delete(path, function(req, res) {
    const delParams = {
      '3ypGroups': req.apiGateway.event.multiValueQueryStringParameters.toDelete.map(item => {
        return {
          DeleteRequest: {
            Key: {
              name: item
            }
          }
        };
      })
    };
    console.log(JSON.stringify(delParams));
    dynamodb.batchWrite({ RequestItems: delParams }, (err, data) => {
      if (err) {
        res.json({err: err});
        console.log(err, err.stack)
      } else res.json({data:data});
    });
});


app.delete(path + hashKeyPath, function(req, res) {
  const params = {};
  params[partitionKeyName] = req.params[partitionKeyName];

  const values = {};
  values[':createdBy'] = req.apiGateway.event.requestContext.identity.cognitoIdentityId;

  const removeItemParams = {
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
