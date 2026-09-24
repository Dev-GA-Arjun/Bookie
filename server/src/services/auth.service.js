// registerUser ( name, email, password, businessName )
// loginUser (name, email, password, businessName ) 
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {generateSlug} from "../utils/slug.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter });

const registerUserService = async (newUser) => {
    const { name, email, password, businessName } = newUser;
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });
    if(existingUser){
        throw new Error('User with this email already exists'); 
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const bookingSlug = generateSlug(businessName);

    const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({data: {name, email, passwordHash}});
        const business = await tx.business.create({data: {userId: user.id, name: businessName, bookingSlug }});
        return { user, business };
    })

    const token = jwt.sign(
        {
            userId: result.user.id,
            businessId: result.business.id
        },
        process.env.JWT_SECRET,
        {
            "expiresIn": '7d'
        }
    );
    return { token };

}

const loginUserService = async (loginUser) => {
    const { email, password } = loginUser;
    const user = await prisma.user.findUnique({ where: {email}, include: { business: true } });
    if(!user){
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch){
        throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
        {
            userId: user.id,
            businessId: user.business.id
        },
        process.env.JWT_SECRET,
        {
            "expiresIn": '7d'
        }
    );
    return { token }; 
}

const getUserInfoService = async (decoded) => {
    const { userId, businessId } = decoded;
            const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            business: {
                select: {
                    id: true,
                    name: true,
                    bookingSlug: true,
                    address: true
                }
            }
        }
    });
    if(!user){
        throw new Error("User not found");
    }
    return user;
}

export { registerUserService, loginUserService, getUserInfoService };