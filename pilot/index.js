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
//delete
//route-> delete-blog
//body -> { "title": "First Blog" } -> array method to filter out the blog with that title
//response -> { "message": "Blog deleted successfully" }
//handler functions HANDLES the request and response 
app.delete("/delete-blog", (req, res)=>{
    const title = req.body.title;
    
    //filter out the blog with that title
    const filteredBlogs = dummyBlogs.filter(
        (blog)=>blog.title !== title
    )

    //if the length of the filteredBlogs is same as dummyBlogs, then the blog was not found
    if(filteredBlogs.length === dummyBlogs.length){
        res.send({message: "Blog was not found"})
    }

    else{
        res.send({
            message: "Blog deleted successfully",
            blogs: filteredBlogs
        })
    }
})

//update a blog
app.put("/update-blog", (req, res)=>{
    const { id, title, content, author } =req.body;

    //find the blog with the given id
    const blogIndex = dummyBlogs.findIndex(blog=>blog.id === id);

    //if the blog is not found, return an error message
    if(blogIndex === -1){
        return res.status(404).send({
            message: "Blog not found"
        });
    }

    //update the blog with the given id
    const updatedBlog= {
        ...dummyBlogs[blogIndex],
        title: title || dummyBlogs[blogIndex].title,
        content: content || dummyBlogs[blogIndex].content,
        author: author || dummyBlogs[blogIndex].author,
        updatedAt: new Date() //update the updatedAt field
    }

    //replace the old blog with the updated blog
    dummyBlogs[blogIndex] = updatedBlog;

    res.send({
        message: "Blog updated successfully",
        blog: updatedBlog
    })
})

app.get("/searcher", (req, res)=>{
    const name = req.query.name || "Searcher";

    res.send({
        message: "This is the searcher route",
        greeting:`Hello from the ${name} route!`
    })
})





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
app.get("/greet/:name", (req, res)=>{
    //req.params -> the object that contains the route parameters
    const name = req.params.name; 
    //getting the name from the route parameters
    res.send(`Hello ${name}, welcome to the server!`);
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
