// This section is the code that was triggered through an AWS Lambda function. when the Dash button was pressed
// it would trigger the lambda function which would run the exports.handler function. the exports.handler would first
// run the request function getting data from our REST API DB with the list of registered users.
// once the data is recived, it comes as a string so we use JSON.parse to turn them into an array of objects and place in a variable.
// the list is iterated and using the value of the key "format" we check if the registered user wanted a call,text,or email and senc
// the object to the appropriate funciton.

const privateKey = require('fs').readFileSync("{{private.key FILE MADE THROUGH NEXMO-CLI}}");
const Nexmo = require('nexmo');
var AWS = require('aws-sdk');
const request = require('request');

//used for AWS SES to send email. only certain regions have SES so correct region is assigned
AWS.config.update({region: 'us-west-2'});

//creating instance and set up for calls using nexmo api
const nexmoCall = new Nexmo({
apiKey: "{{NEXMO API KEY}}",
apiSecret:"{{NEXMO SECRET KEY}}",
applicationId: "{{NEXMO APPLICATION ID}}",
privateKey: privateKey
});

//creating instance and set up for textmessages using nexmo api
const nexmoText= new Nexmo({
  apiKey:"{{NEXMO API KEY}}",
  apiSecret:"{{NEXMO SECRET KEY}}"
});

//empty array where list of registered users will be stored from data of REST API
var list = [];

/**
 * send notification through email
 * @function
 * @name email
 * @param {object} user - user object being sent from exports.handler trigger function
 */
function email(user){

  //format used by AWS SES to create an email
  var params = {
    Destination: { /* required */
      CcAddresses: [
        '{{SENDER EMAIL}}',
        /* more items */
      ],
      ToAddresses: [
        "{{RECIPENTS EMAIL}}"
        /* more items */
      ]
    },
    Message: { /* required */
      Body: { /* required */
        Text: {
         Charset: "UTF-8",
         Data: "{{EMAIL BODY / MESSAGE YOU WANT TO SEND}}"
        }
       },
       Subject: {
        Charset: 'UTF-8',
        Data: "{{SUBJECT FIELD}}" 
       }
      },
    Source: "{{SENDER EMAIL}}", /* required */
    ReplyToAddresses: [
      "{{RECIPIENTS EMAIL}}"
      /* more items */
    ],
  };

  //creating an instance of AWS SES that sends the email through a promise
  var sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

  //sending the email object to AWS and waiting for reply from server for errors.
  sendPromise.then(
  function(data) {
      console.log(data.MessageId);
  }).catch(
      function(err) {
      console.error(err, err.stack);
  });
}


/**
 * send notficiation through text
 * @function
 * @name text
 * @param {object} user - user object being sent from exports.handler trigger function
 */
function text(user){
  const from = '{{NEXMO VIRTUAL NUMBER}}';
  const to = '{{RECIPIENT PHONE NUMBER}}';
  const text = '{{MESSAGE}}';
  //sending from,to,and message information to nexmo api
  nexmoText.message.sendSms(from, to, text); 
}

/**
 * send notification through call
 * @function
 * @name call
 * @param {object} user -user object being sent from exports.handler trigger function
 */
function call(user){
  //using create function within nexmo instance that creates and sends the information to nexmo api
  //it logs any errors or responses from nexmo server to console.
  nexmoCall.calls.create({
    to: [{
    type: 'phone',
    number:'{{RECIPEINT NUMBER}}'
    }],
    from: {
    type: 'phone',
    number: '{{NEXMO VIRTUAL NUMBER}}'
    },
    answer_url: ["{{JSON SOURCE}}"]
    }, (err, res) =>{
    if(err) { console.log(err); }
    else { console.log(res); }
    });
    
}


/**
 * @function
 * @name exports.handler
 * @param {trigger} event - AWS Lambda function sends a trigger as 'event' to run code in exports.handler
 * @returns {string} just confirmation string that the exports.handler has ended
 */
exports.handler = function (event) {
  request('{{REST API URL}}', function(err,res,body){
    //parsing json from rest api, making into objects, and storing in variable 'list'
    list = JSON.parse(body);

    //iterating through list of users and accessing object keys to initiate corresponding function for user input of email, text message, phone call
    for(var i = 0; i < list.length;i++){
      if(list[i].format == "Email"){
        email(list[i]);
      }
      else if(list[i].format == "Text Message"){
        text(list[i]);
      }
  
      else if (list[i].format == "Phone Call"){
        call(list[i]);
      }
    }
  
  });

  return "function end";
  };
