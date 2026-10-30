const validateHolidayId = (req, res, next) => {
    const holidayId = Number(req.params.id);
    if (!Number.isInteger(holidayId) || holidayId <= 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid holiday ID"
        });
    }

    req.holidayId = holidayId;
    next();
}

const validateCreateHoliday = (req, res, next) => {
    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return res.status(400).json({
            success: false,
            message: "Request body must be a valid object"
        });
    }

    const allowedFields = ['date', 'reason'];
    const unsupportedFields = Object.keys(body).filter(field => !allowedFields.includes(field));
    if (unsupportedFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Unsupported fields: ${unsupportedFields.join(', ')}`
        });
    }

    if (typeof body.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
        return res.status(400).json({
            success: false,
            message: "Date must use YYYY-MM-DD format"
        });
    }

    const [year, month, day] = body.date.split('-').map(Number);
    const parsedDate = new Date(Date.UTC(year, month - 1, day));
    if (
        parsedDate.getUTCFullYear() !== year ||
        parsedDate.getUTCMonth() !== month - 1 ||
        parsedDate.getUTCDate() !== day
    ) {
        return res.status(400).json({
            success: false,
            message: "Date must be a valid calendar date"
        });
    }

    if ('reason' in body && (typeof body.reason !== 'string' || !body.reason.trim())) {
        return res.status(400).json({
            success: false,
            message: "Reason must be a non-empty string"
        });
    }

    req.holidayData = {
        date: parsedDate,
        ...(body.reason === undefined ? {} : { reason: body.reason.trim() })
    };
    next();
}

export { validateHolidayId, validateCreateHoliday };
