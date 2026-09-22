
import { registerUserService, loginUserService, getUserInfoService } from "../services/auth.service.js";


// registerUser
// inputs req, res calls registerUsr function from service (req.body)
// returns token with code 201 on success 
const registerUserController = async (req, res) => {
    try{
        const { token } = await registerUserService(req.body);
        return res.status(201).json({
            success: true,
            token
        })

    }catch(err){
        if (err.message == "User with this email already exists"){
            return res.status(409).json({
                success: false,
                error: err.message
            })
        }
        return res.status(500).json({
            success: false,
            error: err.message
        })
    }

}

// loginUser
// inputs req, res, call service function with req.body
// return token with code 200 on success
const loginUserController = async (req, res) => {
    try{
        const { token } = await loginUserService(req.body);
        return res.status(200).json({
            success: true,
            token
        })
    }catch(err){
        if(err.message == "Invalid email or password"){
            return res.status(401).json({
                success: false,
                error: err.message
            })
        }
        return res.status(500).json({
            success: false,
            error: err.message
        })
    }
}

// test route - protected
// retrives user info when user has token
const getUserInfo = async (req, res) => {
    try{
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')){
            return res.status(401).json({
                success: false,
                message: "User not logged-in"
            })
        }

        const token = header.split(" ")[1];
        if(!token){
            return res.status(401).json({
                success: false,
                message: "No token provided"
            })
        }
        const user = await getUserInfoService(req.user);
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        } 

        return res.status(200).json({
            success: true,
            data: user
        })

        

    }catch(err){

    }
}

export { registerUserController,  loginUserController, getUserInfo };