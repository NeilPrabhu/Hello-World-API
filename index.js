/*
 * Primary file for the Hello World API
 *
 */

 // Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

// Instantiate the http Server
var server = http.createServer(function(req,res){

  // Get URL + parse
  var parsedUrl = url.parse(req.url,true);

  // Get path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g,'');

  // Get the query string as an object
  var queryStringObject = parsedUrl.query;

  // Get the HTTP method
  var method = req.method.toLowerCase();

  // Get the headers as an object
  var headers = req.headers;

  // Get payload
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data',function(data){
    buffer += decoder.write(data);
  });
  req.on('end',function(){
    buffer += decoder.end();

    // Choose the handler this request should go to/ If one is not found use the not found handler
    var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Construct the data object to send to the handlers
    var data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : buffer
    };

    chosenHandler(data,function(statusCode,payload){
      // default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      // default to an empty obj
      payload = typeof(payload) == 'object' ? payload : {};

      // Convert the payload to a string
      var payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      console.log('Returning this response: ',statusCode, payloadString);
    });
  });
});

// Start the server
server.listen(3000,function(){
  console.log('The server is up and running now');
});

// Define the handlers
var handlers = {};

// Hello World handler
handlers.hello = function(data,callback){
  callback(200,{'hello':'Hello, Welcome!'});
};

// Not found handler
handlers.notFound = function(data,callback){
  callback(404);
}

// Define a request router
var router = {
  'hello' : handlers.hello
};
