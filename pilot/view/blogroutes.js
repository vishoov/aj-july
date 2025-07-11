//i want all the blog routes to be in a separate file
const express = require("express");
const router = express.Router();
//Router-> this is a function that will create a new router object
const { createBlog, getBlogs, updateBlog, deleteBlog } = require("../controller/blog.controller");



// app.get("/")
//route for creating a blog
router.post("/create-blog", createBlog)

//route for getting all blogs
router.get("/blogs", getBlogs)

//route for deleting a blog -> /deleteblog route -> title in body -> delete the blog with that title 
//delete
//route-> delete-blog
//body -> { "title": "First Blog" } -> array method to filter out the blog with that title
//response -> { "message": "Blog deleted successfully" }
//handler functions HANDLES the request and response 
router.delete("/delete-blog", deleteBlog)

//update a blog
router.put("/update-blog", updateBlog)


module.exports = router; //export the router object so that it can be used in index.js