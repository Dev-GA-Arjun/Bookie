const validateCreateStaff = (req, res, next) => {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        return res.status(400).json({
            success: false,
            message: 'Request body must be a valid object'
        });
    }

    const body = req.body;
    const allowedFields = ['name','phone'];
    const fields = Object.keys(body);

    if (fields.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Staff name is required'
        });
    }

    const unsupportedFields = fields.filter(
        field => !allowedFields.includes(field)
    );

    if (unsupportedFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Unsupported fields: ${unsupportedFields.join(', ')}`
        });
    }

    const name = body.name;
    if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Staff name is required'
        });
    }

    if('phone' in req.body){
        if (typeof req.body.phone !== 'string' || !req.body.phone.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Phone must be in right format'
            });
        }
    }

    next();

}

const validateUpdateStaff = (req, res, next) => {
    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return res.status(400).json({
            success: false,
            message: 'Request body must be a valid object'
        });
    }

    const allowedFields = ['name', 'isActive','phone'];
    const fields = Object.keys(body);

    if (fields.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Provide at least one field to update'
        });
    }

    const unsupportedFields = fields.filter(
        field => !allowedFields.includes(field)
    );

    if (unsupportedFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Unsupported fields: ${unsupportedFields.join(', ')}`
        });
    }

    if ('name' in body && (typeof body.name !== 'string' || !body.name.trim())) {
        return res.status(400).json({
            success: false,
            message: 'Service name must be a non-empty string'
        });
    }

    if ('isActive' in body && typeof body.isActive !== 'boolean') {
        return res.status(400).json({
            success: false,
            message: 'isActive must be a boolean'
        });
    }

    if('phone' in req.body){
        if (typeof req.body.phone !== 'string' || !req.body.phone.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Phone must be in right format'
            });
        }
    }

    next()
}

const validateStaffId = (req, res, next) => {
    const staffId = Number(req.params.id);
    if(!Number.isInteger(staffId) || staffId <0){
        return res.status(404).json({
            success: false,
            message: "Invalid Staff ID"
        })
    }
    req.staffId = staffId;
    next();
}

const validateStaffServices = (req, res, next) => {
    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return res.status(400).json({
            success: false,
            message: 'Request body must be a valid object'
        });
    }

    const fields = Object.keys(body);
    const unsupportedFields = fields.filter(field => field !== 'serviceIds');
    if (unsupportedFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Unsupported fields: ${unsupportedFields.join(', ')}`
        });
    }

    const { serviceIds } = body;
    if (!Array.isArray(serviceIds) || serviceIds.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'serviceIds must be a non-empty array of positive integers'
        });
    }

    if (serviceIds.some(serviceId => !Number.isInteger(serviceId) || serviceId <= 0)) {
        return res.status(400).json({
            success: false,
            message: 'serviceIds must contain only positive integers'
        });
    }

    if (new Set(serviceIds).size !== serviceIds.length) {
        return res.status(400).json({
            success: false,
            message: 'serviceIds must not contain duplicates'
        });
    }

    req.serviceIds = serviceIds;
    next();
}

const validateWorkingHours = (req, res, next, allowEmpty) => {
    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return res.status(400).json({
            success: false,
            message: 'Request body must be a valid object'
        });
    }

    const unsupportedFields = Object.keys(body).filter(field => field !== 'hours');
    if (unsupportedFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: `Unsupported fields: ${unsupportedFields.join(', ')}`
        });
    }

    if (!Array.isArray(body.hours) || (!allowEmpty && body.hours.length === 0)) {
        return res.status(400).json({
            success: false,
            message: allowEmpty
                ? 'hours must be an array'
                : 'hours must be a non-empty array'
        });
    }

    const allowedFields = ['dayOfWeek', 'startTime', 'endTime', 'breakStart', 'breakEnd'];
    const weekdays = new Set();
    const workingHours = [];
    for (const entry of body.hours) {
        if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
            return res.status(400).json({
                success: false,
                message: 'Each hours entry must be a valid object'
            });
        }

        const unsupportedEntryFields = Object.keys(entry).filter(field => !allowedFields.includes(field));
        if (unsupportedEntryFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Unsupported hours fields: ${unsupportedEntryFields.join(', ')}`
            });
        }

        const { dayOfWeek, startTime, endTime, breakStart, breakEnd } = entry;
        if (!Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6) {
            return res.status(400).json({
                success: false,
                message: 'dayOfWeek must be an integer from 0 (Sunday) to 6 (Saturday)'
            });
        }
        if (weekdays.has(dayOfWeek)) {
            return res.status(400).json({
                success: false,
                message: 'hours must not contain duplicate days'
            });
        }
        weekdays.add(dayOfWeek);

        const isTime = value => typeof value === 'string' && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
        if (!isTime(startTime) || !isTime(endTime) || startTime >= endTime) {
            return res.status(400).json({
                success: false,
                message: 'startTime and endTime must be valid HH:mm times with startTime before endTime'
            });
        }

        const hasBreakStart = breakStart !== undefined;
        const hasBreakEnd = breakEnd !== undefined;
        if (hasBreakStart !== hasBreakEnd) {
            return res.status(400).json({
                success: false,
                message: 'breakStart and breakEnd must be provided together'
            });
        }
        if (hasBreakStart && (
            !isTime(breakStart) ||
            !isTime(breakEnd) ||
            breakStart >= breakEnd ||
            breakStart < startTime ||
            breakEnd > endTime
        )) {
            return res.status(400).json({
                success: false,
                message: 'Break times must be valid HH:mm times within working hours'
            });
        }

        workingHours.push({
            dayOfWeek,
            startTime,
            endTime,
            ...(hasBreakStart ? { breakStart, breakEnd } : {})
        });
    }

    req.workingHours = workingHours;
    next();
}

const validateSetWorkingHours = (req, res, next) => validateWorkingHours(req, res, next, true);
const validatePatchWorkingHours = (req, res, next) => validateWorkingHours(req, res, next, false);

export {
    validateCreateStaff,
    validateUpdateStaff,
    validateStaffId,
    validateStaffServices,
    validateSetWorkingHours,
    validatePatchWorkingHours
};