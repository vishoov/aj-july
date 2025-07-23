//here we'll be implementing the JWT authentication strategy
const jwt = require('jsonwebtoken');


//1. creating the token
const createToken = (user)=>{
    try{
        //jwt.sign() method to create a token
        const token = jwt.sign(
            {
                //payload
                id:user._id,
                email:user.email,
                role:user.role
            },
            process.env.JWT_SECRET //replace with your actual secret key
            ,{
                //options
                expiresIn:'1h', //token will expire in 1 hour
                algorithm: 'HS256' //using HMAC SHA-256 algorithm

            }
        )
        return token;
    }
    catch(error)
    {
        console.error("Error creating token:", error);
        throw new Error("Token creation failed");
    }
    
}



//2. verifying the token 
const verifyToken = (req, res, next)=>{
    try{
        //jwt.verify() metho that is used to verify the token

        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error("Authorization header is missing or invalid");
        }


        const token = authHeader.split(' ')[1]
        //['bearer', '<token>']

        console.log("Token received for verification:", token);
        //verify the token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            {
                algorithms: ['HS256'] //specifying the algorithm used to sign the token
            }
        )
        if(!decoded){
            throw new Error("Token verification failed");
        }
        next();
    }
    catch(error){
        console.error("Error verifying token:", error);
        throw new Error("Token verification failed");
    }
}

//header-> 
//Authorization : Bearer <token>




module.exports = {
    createToken,
    verifyToken // Uncomment this line when you implement the verifyToken function
}