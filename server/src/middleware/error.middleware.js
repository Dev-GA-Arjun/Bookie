

const errorHandler = async (err, req, res, next) => {
    console.log(err);

    if(err.code === 'P2025'){
        return res.status(404).json({
            success: false,
            message: "Resource not found"
        })
    }

    if(err.code === 'P2002'){
        return res.status(409).json({
            success: false,
            message: "A record with that value already exists"
        })
    }

    if(err.code === 'P2003'){
        return res.status(400).json({
            success: false,
            message: "Invalid related resource"
        })
    }

    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    })
} 

export default errorHandler;