//implement the features of our server 

const express  = require('express');
//import express module
const rateLimit = require('express-rate-limit');




//to be explained later 
const blogRoutes = require('./view/blogroutes');


const morgan = require('morgan');

//import all the modules 

//setup the express app -> the actual server 
const app = express();
app.use(express.json());




//rate limiting middleware
const limit = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 5, //limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later"
});


app.use(limit); //apply the rate limiting middleware to all routes


//Logging we are monitoring the requests that are coming to our server




// app.use(morgan('dev'))

//create a custom middleware that will help me in monitoring the requests
//Logger middleware function

app.use((req, res, next)=>{
    const method = req.method; //GET, POST, PUT, DELETE
    const url = req.url; //the url of the request
    const time = new Date().toLocaleString(); //the time of the request
    console.log(`[${time}] ${method} request to ${url}`);
    next(); //this will call the next middleware function in the stack
})


//app.use -> this is a middleware function that will be executed for every request that is defined after it 
// app.use((req, res, next)=>{
//     //this is a middleware function
//     console.log("Middleware function executed");
//     console.log("Request received at:", new Date().toLocaleString());
//     // next(); //this will call the next middleware function in the stack
// })

const middlewareFunction = (req, res, next)=>{
    //this is a middleware function
    console.log("Middleware function executed");
    next()
}

//basic route to test if the server is working
//root route -> localhost:3000/ get method 
//app.get -> this is the function that will handle the request and response
app.get('/', middlewareFunction, (req, res)=>{
    //req -> request object, res -> response object
    console.log("Root route accessed");
    res.send("Hello World!");

})
//this is a route
//syntax -> app.method('route), calbback function)

app.get("/searcher", (req, res)=>{
    const name = req.query.name || "Searcher";

    res.send({
        message: "This is the searcher route",
        greeting:`Hello from the ${name} route!`
    })
})

app.get("/request", (req, res)=>{
    console.log(req);
    res.send({
        message: "This is the request route",
        method: req.method,
        url: req.url,
        headers: req.headers,
        query: req.query,
        params: req.params
    })
})


app.use((err, req, res, next)=>{
    //this is a error handling middleware function
    console.error("Error occurred:", err);
    res.status(500).send("Internal Server Error");
})


app.get("/error", (req, res)=>{
    //this will throw an error
    throw new Error("This is a test error");
    //this will be caught by the error handling middleware function
})

app.use("/blog", blogRoutes);
//this will use the blogRoutes module for all the routes that start with /blog



//HTTP Methods -> GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD


//build the server

//advanced routing -> we are going to create routes for dynamic data 
//whenever i send my name 
//it should resturn a greeting message with my name 

///greet/vishoo -> "Hello Vishoo, welcome to the server!"
//greet/john -> "Hello John, welcome to the server!"
//greet/donald -> "Hello Donald, welcome to the server!"


//Dynamic Routing Advanced Routing
//Route Parameters -> dynamic data in the route

const authorization = (req, res, next)=>{
    const name = req.params.name;
    if(name === "vishoo"){
        console.log("Authorized user:", name);
        next(); //this will call the next middleware function in the stack
    }
    else{
        console.log("Unauthorized user:", name);
        res.status(403).send("Forbidden: You are not authorized to access this route");
    }
}


app.get("/greet/:name", authorization, (req, res)=>{

    try{
    //req.params -> the object that contains the route parameters
    const name = req.params.name; 
    //getting the name from the route parameters
    res.send(`Hello ${name}, welcome to the server!`);
    }
    catch(err){
        console.error("Error in /greet/:name route:", err);
        res.status(500).send("Internal Server Error");
    }
})


//Query Parameters -> dynamic data in the query string
//this is specially used for filtering data
//example: /search?query=blog
//this will return all the blogs that match the query
///search?query=blog&author=John
app.get("/search", (req, res)=>{
    //req.query-> the object that contains the query parameters
    const query = req.query.query;
    const author = req.query.author;
    //getting the query and author from the query parameters
    //filter the blogs based on the query and author

    const filteredBlogs = dummyBlogs.filter(blog=>{
        return (query && blog.title.includes(query) || blog.content.includes(query)) || (author && blog.author === author);
    })

    res.send({
        message: "Blogs fetched successfully",
        blogs: filteredBlogs
    })
})


//what kind of responses we can send to the client

//1. JSON response 
app.get("/json-response", (req, res)=>{
    res.json({
        message: "This is a JSON response",
        data: dummyBlogs
    });
});

//2. Text response
app.get("/text-response", (req, res)=>{
    res.send("This is a text response");
});


//3. HTML response
app.get("/html-response", (req, res)=>{
    res.send("<h1>This is an HTML response</h1>");
});

//4. File response
app.get("/file-response", (req, res)=>{
    res.sendFile(__dirname + "/index.html");
    //__dirname -> the current directory of the file
    //sendFile -> this function will send the file to the client

})

//5. Status codes
app.get("/status-code", (req, res)=>{
    //this will send a 404 status code
    res.status(404).send("This is a 404 status code");
})


//6. Redirect

app.get("/redirect", (req, res)=>{
    res.status(301); //301 is the status code for permanent redirect
    //this will redirect the client to the home page
    res.redirect("/");
    //redirect -> this function will redirect the client to the given route
})



//make it listen to a port
app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
})
//app.listen -> this is the function that will make our server listen to a port


//even if i use a single route this whole file will be executed
//this is because the server is running and it will listen to all the requests that come to it
//and it will execute the code in this file

//this makes our application a little computationally expensive 


//whenever there is a lot of requests coming to the server
//it will create a lot of load on the server and it will slow down the server
//bottlenecking the server

//we use MVC architecture to solve this problem
//Model View Controller architecture


//CODE ON DEMAND 
//whenever we need to add a new feature
//we can just add a new file and import it in the index.js file


//there is a driver between the server and the db 
//mongoose -> validating the data 

