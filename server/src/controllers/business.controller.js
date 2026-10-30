import { updateBusinessProfileService } from "../services/business.service.js";



//update business profile
const updateBusinessProfile = async (req, res, next) => {
    try{
        const updatedData = req.body;
        const businessId = req.user.businessId;
        
        const updatedProfile = await updateBusinessProfileService(updatedData, businessId);
        if(!updatedProfile){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }
        return res.status(200).json({
            success: true,
            data: updatedProfile
        })

    }catch(err){
        next(err)
    }
    
}

export { updateBusinessProfile };