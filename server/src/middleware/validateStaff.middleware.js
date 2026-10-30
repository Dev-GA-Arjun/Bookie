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

export { validateCreateStaff, validateUpdateStaff, validateStaffId, validateStaffServices };