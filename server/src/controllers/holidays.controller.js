import {
    getHolidaysService,
    createHolidayService,
    deleteHolidayService
} from "../services/holidays.service.js";

const getHolidays = async (req, res, next) => {
    try {
        const holidays = await getHolidaysService(req.user.businessId);
        return res.status(200).json({
            success: true,
            data: holidays
        });
    } catch (err) {
        next(err);
    }
}

const createHoliday = async (req, res, next) => {
    try {
        const holiday = await createHolidayService(req.user.businessId, req.holidayData);
        return res.status(201).json({
            success: true,
            data: holiday
        });
    } catch (err) {
        next(err);
    }
}

const deleteHoliday = async (req, res, next) => {
    try {
        const result = await deleteHolidayService(req.user.businessId, req.holidayId);
        if (result.count === 0) {
            return res.status(404).json({
                success: false,
                message: "Holiday not found"
            });
        }

        return res.status(204).end();
    } catch (err) {
        next(err);
    }
}

export { getHolidays, createHoliday, deleteHoliday };
