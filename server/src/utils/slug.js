import { randomBytes } from 'crypto'

const generateSlug = (businessName) => {
    const cleanedName = businessName.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
    
    if(!cleanedName){
        throw new Error("Business name must contain at least one letter or number");
    }

    const bookingSlug = cleanedName +"-"+ randomBytes(4).toString("hex");
    return bookingSlug;
}

export {generateSlug};