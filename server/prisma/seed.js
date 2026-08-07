import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Step 1: Create a user
  const user = await prisma.user.create({
    data: {
      name: 'Test Owner',
      email: 'test@salon.com',
      passwordHash: 'placeholder_hash_for_now'
    }
  });
  console.log('User created:', user);

  // Step 2: Create a business for that user
  const business = await prisma.business.create({
    data: {
        name: 'Glow Salon',
        address: 'NO.78 Wall Street Chennai',
        phone: "1234567812",
        bookingSlug: "glow-salon",
        userId: user.id
    }
  })
  console.log('Business Created: ',business)

  // Step 3: Create a service
  const service = await prisma.service.create({
    data:{
        name: "Hair Cut",
        durationMins: 30,
        price: 150.00,
        isActive: true,
        businessId: business.id
    }
  })
  console.log("Service: ", service)

  // Step 4: Create a staff member
  const staff = await prisma.staff.create({
    data: {
        name: "Alice",
        phone: "123561234",
        isActive: true,
        businessId: business.id
    }
  })
  console.log("Staff Created: ",staff)

  // Step 5: Create staff-service mapping
  const staffService = await prisma.staffService.create({
    data:{
        serviceId: service.id,
        staffId: staff.id
    }
  })
  console.log("Staff-Service Created: ", staffService)
  

  console.log('Seeding complete');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });