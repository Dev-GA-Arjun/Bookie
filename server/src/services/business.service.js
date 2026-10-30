import prisma from "../lib/prisma.js";

const updateBusinessProfileService = async (updatedData, businessId) => {
    const updatedBusiness = await prisma.business.update({
        where: {id: businessId},
        data: updatedData
    })
    if (!updatedBusiness){
        throw new Error("Business not found")
    }
    return updatedBusiness;
}

export { updateBusinessProfileService };