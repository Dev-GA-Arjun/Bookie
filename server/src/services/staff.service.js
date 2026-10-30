import prisma from "../lib/prisma.js";

const getAllStaffService = async (businessId) => {
    const staffs = await prisma.staff.findMany({ where: {businessId}});
    return staffs;
}

const getStaffByIdService = async (businessId, staffId) => {
    const staff = await prisma.staff.findFirst({
        where: {id: staffId, businessId}
    })

    return staff;
}

const createStaffService = async (businessId, data) => {
    const newStaff = await prisma.staff.create({ data:{
        ...data,
        businessId
    }})
    return newStaff;
}

const updateStaffService = async (businessId, staffId, data) => {
    const updatedStaff = await prisma.staff.update({where: {id: staffId, businessId}, data});
    return updatedStaff;
}

const deleteStaffService = async (businessId, staffId) => {
    await prisma.staff.update({
        where: {id: staffId, businessId},
        data: {isActive: false}
    });
}

const assignStaffServicesService = async (businessId, staffId, serviceIds) => {
    return prisma.$transaction(async (tx) => {
        const staff = await tx.staff.findFirst({
            where: {id: staffId, businessId, isActive: true},
            select: {id: true}
        });
        if (!staff) {
            return {status: 'staff-not-found'};
        }

        const services = await tx.service.findMany({
            where: {id: {in: serviceIds}, businessId, isActive: true},
            select: {id: true}
        });
        const availableServiceIds = new Set(services.map(service => service.id));
        const unavailableServiceIds = serviceIds.filter(serviceId => !availableServiceIds.has(serviceId));
        if (unavailableServiceIds.length > 0) {
            return {status: 'services-not-found', unavailableServiceIds};
        }

        await tx.staffService.createMany({
            data: serviceIds.map(serviceId => ({staffId, serviceId})),
            skipDuplicates: true
        });

        const assignments = await tx.staffService.findMany({
            where: {staffId, serviceId: {in: serviceIds}},
            include: {service: true},
            orderBy: {serviceId: 'asc'}
        });
        return {status: 'assigned', assignments};
    });
}

const getStaffWorkingHoursService = async (businessId, staffId) => {
    const staff = await prisma.staff.findFirst({
        where: { id: staffId, businessId },
        select: { id: true }
    });
    if (!staff) {
        return { status: 'staff-not-found' };
    }

    const hours = await prisma.workingHours.findMany({
        where: { staffId },
        orderBy: { dayOfWeek: 'asc' }
    });
    return { status: 'found', hours };
}

const setStaffWorkingHoursService = async (businessId, staffId, workingHours) => {
    return prisma.$transaction(async (tx) => {
        const staff = await tx.staff.findFirst({
            where: { id: staffId, businessId },
            select: { id: true }
        });
        if (!staff) {
            return { status: 'staff-not-found' };
        }

        await tx.workingHours.deleteMany({ where: { staffId } });
        if (workingHours.length > 0) {
            await tx.workingHours.createMany({
                data: workingHours.map(hours => ({ ...hours, staffId }))
            });
        }

        const hours = await tx.workingHours.findMany({
            where: { staffId },
            orderBy: { dayOfWeek: 'asc' }
        });
        return { status: 'updated', hours };
    });
}

const updateStaffWorkingHoursService = async (businessId, staffId, workingHours) => {
    return prisma.$transaction(async (tx) => {
        const staff = await tx.staff.findFirst({
            where: { id: staffId, businessId },
            select: { id: true }
        });
        if (!staff) {
            return { status: 'staff-not-found' };
        }

        for (const hours of workingHours) {
            const { dayOfWeek, ...data } = hours;
            await tx.workingHours.upsert({
                where: { staffId_dayOfWeek: { staffId, dayOfWeek } },
                create: { ...data, staffId, dayOfWeek },
                update: data
            });
        }

        const updatedHours = await tx.workingHours.findMany({
            where: { staffId },
            orderBy: { dayOfWeek: 'asc' }
        });
        return { status: 'updated', hours: updatedHours };
    });
}

export {
    getAllStaffService,
    getStaffByIdService,
    createStaffService,
    updateStaffService,
    deleteStaffService,
    assignStaffServicesService,
    getStaffWorkingHoursService,
    setStaffWorkingHoursService,
    updateStaffWorkingHoursService
};