
const express = require("express");
const bodyParser = require("body-parser");
const https = require('node:https');
//const axios = require("axios");
//const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.get("/", function(req, res){ // if the client need a response
 res.send("Hello World");
});


app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;
  /*res.write(`<h1>First Name: <b>${firstName}</b> Last Name: <b>${lastName}</b> </h1>`);
  res.write(`<h2>Your email is: <b>${email}</b></h2>`);
  res.send();*/

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us12.api.mailchimp.com/3.0/lists/6b02dd2bd4";

  const options = {
    method: "POST",
    auth: "renzo1:9271144fa70914ec10b4dcfc75195007-us12"
  }

  const request = https.request(url, options, function(response){

    if (response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
      // console.log(response.statusCode);
      console.log(data.error);
    } else {
      res.sendFile(__dirname + "/failure.html");
      // console.log(response.statusCode);
      console.log(data.error);
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });
  });


  request.write(jsonData);
  request.end();

});




app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});


// API Keys
// 9271144fa70914ec10b4dcfc75195007-us12

//List Id
//6b02dd2bd4
