//implement the features of our server 

const express  = require('express');
//import express module

//to be explained later 

const dummyBlogs = [
    {
        id: 1,
        title: "First Blog",
        content: "This is the content of the first blog",
        author: "John Doe",
        createdAt: new Date(),
        updatedAt: new Date()
    }
]


//import all the modules 

//setup the express app -> the actual server 
const app = express();
app.use(express.json());


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
//route for creating a blog
app.post("/create-blog", (req, res)=>{
    //this is a route for creating a blog   
    const title = req.body.title;
    const content = req.body.content;
    const author = req.body.author;

    const newBlog = {
        id: dummyBlogs.length + 1,
        title: title,
        content: content,
        author: author,
    }

    
    console.log("New blog created:", newBlog);


    //add the new blog to the dummyBlogs array
    //we are mimicking the database here
    dummyBlogs.push(newBlog);
    console.log(dummyBlogs);
    res.send({
        message: "Blog created successfully",
        blog: newBlog
    })
})

//route for getting all blogs
app.get("/blogs", (req, res)=>{
    res.send({
        message: "All blogs fetched successfully",
        blogs: dummyBlogs
    })
})

//route for deleting a blog -> /deleteblog route -> title in body -> delete the blog with that title 


//HTTP Methods -> GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD


//build the server


//make it listen to a port
app.listen(3000, ()=>{
    console.log('Server is running on port 3000');
})
//app.listen -> this is the function that will make our server listen to a port
