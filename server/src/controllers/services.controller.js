import { createServicesService, getServicesService, getOneServiceService, updateServicesService, deleteServicesService } from "../services/services.service.js";

 
const createServices = async (req, res, next) => {
    try{
        const businessId = req.user.businessId

        const service = await createServicesService(req.body, businessId);
        return res.status(201).json({
            success: true,
            data: service
        })

    }catch(err){
        next(err)
    }
}

const getServices = async (req, res, next) => {
    try{
        const businessId = req.user.businessId;

        const services = await getServicesService(businessId);
        return res.status(200).json({
            success: true,
            data: services
        })
    }catch(err){
        next(err)
    }
}

const getOneService = async (req, res, next) => {
    try{
        const businessId = req.user.businessId;
        const serviceId = req.serviceId;

        const service = await getOneServiceService(businessId, serviceId);
        if(!service){
            return res.status(404).json({
                success: false,
                message: "Service not found"
            })
        }
        return res.status(200).json({
            success: true,
            data: service
        })
    }catch(err){
        next(err)
    }  
}

const updateServices = async (req, res, next) => {
    try{
        const businessId = req.user.businessId;
        const serviceId = req.serviceId;
        const existingService = await getOneServiceService(businessId, serviceId);
        if(!existingService){
            return res.status(404).json({
                success: false,
                message: "Service not found"
            })
        }
        
        const updatedService = await updateServicesService(req.body, businessId, serviceId);
        if(!updatedService){
            return res.status(404).json({
                success: false,
                message: "Failed to retrieve Service"
            })
        }

        return res.status(200).json({
            success: true,
            data: updatedService
        })
    }catch(err){
        next(err)
    }
}

const deleteServices = async (req, res, next) => {
    try{
        const businessId = req.user.businessId;
        const serviceId = req.serviceId;

        const existingService = await getOneServiceService(businessId, serviceId);
        if(!existingService){
            return res.status(404).json({
                success: false,
                message: "Service not found"
            })
        }
        await deleteServicesService(businessId, serviceId);
        return res.status(204).end()

    }catch(err){
        next(err)
    }
}

export { createServices, getServices, getOneService, updateServices, deleteServices };