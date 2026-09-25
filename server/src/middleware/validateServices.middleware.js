

const validateCreateService = (req, res, next) => {

    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        return res.status(400).json({
            success: false,
            message: 'Request body must be a valid object'
        });
    }
    const { name, durationMins, price } = req.body;

    if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Service name is required'
        });
    }


    if (!Number.isInteger(durationMins) || durationMins <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Duration must be a positive integer in minutes'
        });
    }

    if (typeof price !== 'number' || !Number.isFinite(price) || price < 0) {
        return res.status(400).json({
            success: false,
            message: 'Price must be a non-negative number'
        });
    }

    next();
};



const validateUpdateService = (req, res, next) => {
    const body = req.body;

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return res.status(400).json({
            success: false,
            message: 'Request body must be a valid object'
        });
    }

    const allowedFields = ['name', 'isActive','durationMins', 'price'];
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

    if ('durationMins' in body && (!Number.isInteger(body.durationMins) || body.durationMins <= 0)) {
        return res.status(400).json({
            success: false,
            message: 'Duration must be a positive integer in minutes'
        });
    }

    if (
        'price' in body &&
        (typeof body.price !== 'number' || !Number.isFinite(body.price) || body.price < 0)
    ) {
        return res.status(400).json({
            success: false,
            message: 'Price must be a non-negative number'
        });
    }

    next();
};



const validateServiceId = (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Invalid service ID'
        });
    }

    req.serviceId = id;
    next();
};

export {
    validateCreateService,
    validateUpdateService,
    validateServiceId
};