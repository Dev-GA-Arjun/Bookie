
import { registerUserService } from "../services/auth.service.js";
import { loginUserService } from "../services/auth.service.js";

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

export { registerUserController,  loginUserController };