import prisma from "../lib/prisma.js";

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

    const updatedService = await prisma.service.update({ where: {id: serviceId, businessId}, data});
    return updatedService;
}

const deleteServicesService = async (businessId, serviceId) => {
    await prisma.service.delete({ where: {id: serviceId, businessId}});
    return
}

export { createServicesService, getServicesService, getOneServiceService, updateServicesService, deleteServicesService};