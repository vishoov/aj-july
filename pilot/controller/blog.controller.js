//this file will contain all the routes related to blogs



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


const createBlog = (req, res)=>{
    try{
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
    }
    catch(err){
        console.error("Error in /create-blog route:", err);
        res.status(500).send("Internal Server Error");
    }
}


const getBlogs = (req, res)=>{
    res.send({
        message: "All blogs fetched successfully",
        blogs: dummyBlogs
    })
}

const updateBlog= (req, res)=>{
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
}


const deleteBlog = (req, res)=>{
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
}

module.exports={
    createBlog,
    getBlogs,
    updateBlog,
    deleteBlog
}