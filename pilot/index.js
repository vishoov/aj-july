//implement the features of our server 

const express  = require('express');
//import express module





//import all the modules 

//setup the express app -> the actual server 
const app = express();


//basic route to test if the server is working
//root route -> localhost:3000/ get method 
//app.get -> this is the function that will handle the request and response
app.get('/', (req, res)=>{
    //req -> request object, res -> response object
    res.send("Hello World!");
})
//this is a route
//syntax -> app.method('route), calbback function)

// app.get("/")


//HTTP Methods -> GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD


//build the server


//make it listen to a port
app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
})
//app.listen -> this is the function that will make our server listen to a port
