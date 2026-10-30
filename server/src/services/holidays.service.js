import prisma from "../lib/prisma.js";

const getHolidaysService = async (businessId) => {
    return prisma.holiday.findMany({
        where: {businessId},
        orderBy: {date: 'asc'}
    });
}

const createHolidayService = async (businessId, data) => {
    return prisma.holiday.create({
        data: {...data, businessId}
    });
}

const deleteHolidayService = async (businessId, holidayId) => {
    return prisma.holiday.deleteMany({
        where: {id: holidayId, businessId}
    });
}

export { getHolidaysService, createHolidayService, deleteHolidayService };
