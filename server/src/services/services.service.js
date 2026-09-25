import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL})
const prisma = new PrismaClient({ adapter });

const createServicesService = async (data, businessId) => {
    const newService = await prisma.service.create({ data: {...data, businessId}});
    return newService;
}

const getServicesService = async (businessId) => {
    const services = await prisma.service.findMany({ where: {businessId}});
    return services;
}

const getOneServiceService = async (businessId, serviceId) => {
    const service = await prisma.service.findFirst({ where: {businessId, id: serviceId}});
    return service;
}

const updateServicesService = async (data, businessId, serviceId) => {

    const updatedService = await prisma.service.update({ where: {id: serviceId}, data});
    return updatedService;
}

const deleteServicesService = async (businessId, serviceId) => {
    await prisma.service.delete({ where: {id: serviceId}});
    return
}

export { createServicesService, getServicesService, getOneServiceService, updateServicesService, deleteServicesService};