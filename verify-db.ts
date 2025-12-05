import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log('Starting verification...');

    // 1. Create a User
    const user = await prisma.user.create({
        data: {
            name: 'Test User',
            role: 'Tester',
            avatar: 'https://example.com/avatar.png',
        },
    });
    console.log('Created User:', user);

    // 2. Create a Project
    const project = await prisma.project.create({
        data: {
            title: 'Test Project',
            description: 'A project for testing',
            createdAt: new Date().toISOString(),
            stages: {
                create: [
                    { title: 'Stage 1', isCompleted: false }
                ]
            }
        },
        include: { stages: true }
    });
    console.log('Created Project:', project);

    // 3. Fetch Data
    const users = await prisma.user.findMany();
    console.log('All Users:', users.length);

    const projects = await prisma.project.findMany();
    console.log('All Projects:', projects.length);

    console.log('Verification complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
