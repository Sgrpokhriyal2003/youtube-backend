import jwt from 'jsonwebtoken'

export const authMiddleware = async(req, res, next) => {
    try{
        const token = req.headers.authorization?.split(" ")[1]
        if(!token){
            return res.status(401).json({
                error: "token is not found!"
            })
        }

        const decodedUser = jwt.verify(token, process.env.JWT_SECRET)
        if(!decodedUser){
            return res.status(400).json({
                error: "token is invalid"
            })
        }

        req.user = decodedUser
        next();
    }
    catch(err){
        res.status(500).json({
            error: "something went wrong!",
            message: err.message
        })
    }
}