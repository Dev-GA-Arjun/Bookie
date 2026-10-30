

const validateBusinessProfile = (req, res, next) => {
    const body = req.body;

    if(!body || typeof body !== "object" || Array.isArray(body)){
        return res.status(400).json({
            success: false,
            message: "Request body must be a valid object"
        })
    }
    const allowedFields = ["name","address","hours","timezone"];
    const fields = Object.keys(body);

    if(fields.length === 0){
        return res.status(400).json({
            success: false,
            message: "Provide aleast one field for updating"
        })
    }

    const restrictedFields = fields.filter( field => !allowedFields.includes(field));

    if(restrictedFields.length !== 0){
        return res.status(400).json({
            success: false,
            message: `Unsupported fields: ${restrictedFields.join(', ')}`
        })
    }

    if('name' in body){
        if(typeof body.name !== 'string' || !body.name.trim()){
            return res.status(400).json({
                success: false,
                message: "Business name must be non-empty String"
            })
        }
    }
    
    if('address' in body && typeof body.address !== 'string'){
        return res.status(400).json({
            success: false,
            message: 'Business address must be non-empty String'
        })
    }

    if('hours' in body){
        if(typeof body.hours !== 'object' || body.hours === null || Array.isArray(body.hours)){
            return res.status(400).json({
                success: false,
                message: "Hours must be an object"
            })
        }
    }

    if('timezone' in body){
        if(typeof body.timezone !== 'string' || !body.timezone.trim()){
            return res.status(400).json({
                success: false,
                message: "Timezone must be a non-empty String"
            })
        }

        try{
            new Intl.DateTimeFormat('en-IN', {
                timeZone: body.timezone
            });
        }catch{
            return res.status(400).json({
                success: false,
                message: "Invalid Timezone"
            })
        }
    }

    next()

}

export { validateBusinessProfile };