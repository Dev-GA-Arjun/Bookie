import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";


const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

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