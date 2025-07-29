const jwt = require("jsonwebtoken");


//create the token
const createToken = async (user)=>{
    try{
        const token = await jwt.sign(
            {
                id:user._id,
                role:user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d", // Token will expire in 1 day
                algorithm: "HS256" // Using HMAC SHA-256 algorithm
            }
        )

        return token;
    }
    catch(err){
        console.error("Error creating token:", err);
        throw new Error("Token creation failed");
    }
}



//verify the token
const verifyToken = async (req, res, next)=>{
    try{
        const token = req.headers.authorization?.split(" ")[1];


        if(!token){
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = await jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({ message: "Invalid token" });
        }

        // req.user= decoded;
        next();
    }
    catch(err){
        console.error("Error verifying token:", err);
        return res.status(401).json({ message: err.message || "Unauthorized" });
    }
}




module.exports = {
    createToken,    
    verifyToken
}