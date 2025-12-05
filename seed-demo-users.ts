import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding demo users...');

    // Delete existing users
    await prisma.user.deleteMany({});
    console.log('✓ Cleared existing users');

    // Create demo users
    const users = [
        {
            name: 'John Makhowsky',
            role: 'Design Lead',
            avatar: 'https://i.pravatar.cc/150?img=12',
            password: 'admin'
        },
        {
            name: 'Sarah Johnson',
            role: 'Creative Director',
            avatar: 'https://i.pravatar.cc/150?img=5',
            password: 'admin'
        },
        {
            name: 'Mike Chen',
            role: 'Brand Strategist',
            avatar: 'https://i.pravatar.cc/150?img=33',
            password: 'admin'
        },
        {
            name: 'Emma Davis',
            role: 'Marketing Manager',
            avatar: 'https://i.pravatar.cc/150?img=9',
            password: 'admin'
        }
    ];

    for (const userData of users) {
        const user = await prisma.user.create({ data: userData });
        console.log(`✓ Created user: ${user.name} (${user.role})`);
    }

    console.log('\n✅ Seeding complete!');
    console.log('You can now login with any username and password "admin"');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
