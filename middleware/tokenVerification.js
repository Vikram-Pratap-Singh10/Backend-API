import Jwt from "jsonwebtoken"
export const tokenVerification = async (req,res,next)=>{
    try{
        let token = await req.headers.authorization
        if(!token)
         throw new Error();
        token = token.split(" ")[1]
        Jwt.verify(token,"dfdfjdkfdjfkdjf")

        next();
    }
    catch(err){
        console.log(err)
        return res.status(400).json({error:"Unauthorization User",status:false})
    }
}
