import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function testApi() {
    console.log('🔍 Testing API Response...\n');
    const members = await prisma.user.findMany();

    console.log('Users from database:');
    members.forEach(m => {
        console.log(`- ${m.name}: isAdmin = ${m.isAdmin}`);
    });
}

testApi()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
