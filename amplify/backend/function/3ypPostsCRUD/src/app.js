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

let tableName = "3ypPosts";

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "id";
const partitionKeyType = "S";
const sortKeyName = "";
const sortKeyType = "";
const hasSortKey = sortKeyName !== "";
const path = "/posts";
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



/********************************
 * HTTP Get method for list objects *
 ********************************/

app.get(path, function(req, res) {
  const params = {};
  params[tableName] = {
    Keys: req.apiGateway.event.multiValueQueryStringParameters.names.map((item) => {
      return {
        id: item
      }
    })
  };

  const q = {
    RequestItems: params
  };

  console.log(params);
  dynamodb.batchGet(q, (err, data) => {
    if (err) {
      res.json({error: 'Could not load items: ' + err});
    } else {
      res.json(data.Responses[tableName]);
    }
  });
});




/************************************
 * HTTP put method for insert comment *
 *************************************/

app.put(path +'/comment' + hashKeyPath, function(req, res) {

  const putItemParams = {
    TableName: tableName,
    Key: {
      id: req.params[partitionKeyName]
    }
  };

  putItemParams['UpdateExpression'] = 'SET comments = list_append(if_not_exists(comments, :empty), :comments)';
  putItemParams['ExpressionAttributeValues'] = {
    ':comments': [req.body.comment],
    ':empty': []
  };
  putItemParams['ReturnValues'] = 'UPDATED_NEW';

  console.log(putItemParams)
    dynamodb.update(putItemParams, (err, data) => {
      if(err) {
        res.json({error: err, url: req.url, body: req.body});
      } else{
        res.json({success: 'put call succeed!', url: req.url, data: data})
      }
    });


});


/************************************
* HTTP put method for insert yp *
*************************************/

app.put(path +'/:action' + hashKeyPath, function(req, res) {

  const putItemParams = {
    TableName: tableName,
    Key: {
      id: req.params[partitionKeyName]
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

  putItemParams['UpdateExpression'] = expression;
  putItemParams['ExpressionAttributeValues'] = values;
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
* HTTP post method for insert object *
*************************************/

app.post(path, function(req, res) {

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

//make batch del
app.delete(path, function(req, res) {
  const delParams = {
    '3ypPosts': req.apiGateway.event.multiValueQueryStringParameters.toDelete.map(item => {
      return {
        DeleteRequest: {
          Key: {
            id: item
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


app.listen(3000, function() {
    console.log("App started")
});

module.exports = app
