import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function seedAll() {
    console.log('🌱 Seeding complete application data...\n');

    try {
        // 1. Seed Users
        console.log('👥 Seeding users...');
        await prisma.user.deleteMany({});

        const users = await Promise.all([
            prisma.user.create({
                data: {
                    name: 'John Makhowsky',
                    role: 'Design Lead',
                    avatar: 'https://i.pravatar.cc/150?img=12',
                    password: 'admin'
                }
            }),
            prisma.user.create({
                data: {
                    name: 'Sarah Johnson',
                    role: 'Creative Director',
                    avatar: 'https://i.pravatar.cc/150?img=5',
                    password: 'admin'
                }
            }),
            prisma.user.create({
                data: {
                    name: 'Mike Chen',
                    role: 'Brand Strategist',
                    avatar: 'https://i.pravatar.cc/150?img=33',
                    password: 'admin'
                }
            }),
            prisma.user.create({
                data: {
                    name: 'Emma Davis',
                    role: 'Marketing Manager',
                    avatar: 'https://i.pravatar.cc/150?img=9',
                    password: 'admin'
                }
            })
        ]);
        console.log(`✓ Created ${users.length} users\n`);

        // 2. Seed Assets
        console.log('🖼️  Seeding assets...');
        await prisma.asset.deleteMany({});

        const assets = await Promise.all([
            prisma.asset.create({
                data: {
                    name: 'Brand Logo Primary',
                    category: 'icons',
                    url: 'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=400',
                    uploadedBy: 'John Makhowsky',
                    date: '2024-12-01',
                    size: '2.4 MB',
                    tags: ['logo', 'branding', 'primary']
                }
            }),
            prisma.asset.create({
                data: {
                    name: 'Product Launch Flyer',
                    category: 'flyers',
                    url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
                    uploadedBy: 'Sarah Johnson',
                    date: '2024-12-02',
                    size: '5.1 MB',
                    tags: ['marketing', 'campaign', '2024']
                }
            }),
            prisma.asset.create({
                data: {
                    name: 'Customer Journey Map',
                    category: 'infographics',
                    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
                    uploadedBy: 'Mike Chen',
                    date: '2024-12-03',
                    size: '3.8 MB',
                    tags: ['analytics', 'customer', 'journey']
                }
            }),
            prisma.asset.create({
                data: {
                    name: 'Website Redesign Mockup',
                    category: 'web-screenshots',
                    url: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400',
                    uploadedBy: 'Emma Davis',
                    date: '2024-12-04',
                    size: '4.2 MB',
                    tags: ['web', 'design', 'ui/ux']
                }
            })
        ]);
        console.log(`✓ Created ${assets.length} assets\n`);

        // 3. Seed Brand Items
        console.log('🎨 Seeding brand items...');
        await prisma.brandItem.deleteMany({});

        const brandItems = await Promise.all([
            prisma.brandItem.create({
                data: {
                    type: 'text',
                    content: 'Innovate with purpose, design with passion',
                    tags: ['slogan', 'primary', 'brand-voice']
                }
            }),
            prisma.brandItem.create({
                data: {
                    type: 'hashtag',
                    content: '#BrandSyncSolutions',
                    tags: ['social', 'campaign']
                }
            }),
            prisma.brandItem.create({
                data: {
                    type: 'keyword',
                    content: 'Digital Transformation',
                    tags: ['core', 'messaging']
                }
            })
        ]);
        console.log(`✓ Created ${brandItems.length} brand items\n`);

        // 4. Seed Projects with Stages
        console.log('📋 Seeding projects...');
        await prisma.project.deleteMany({});

        const project1 = await prisma.project.create({
            data: {
                title: 'Q1 Marketing Campaign',
                description: 'Launch comprehensive digital marketing campaign for Q1 2025',
                createdAt: '2024-12-01',
                isArchived: false,
                notes: ['Budget approved: $50K', 'Target audience: 25-45 professionals'],
                stages: {
                    create: [
                        {
                            title: 'Market Research & Analysis',
                            isCompleted: true,
                            completedBy: 'Mike Chen',
                            completedAt: '2024-12-02'
                        },
                        {
                            title: 'Creative Concept Development',
                            isCompleted: true,
                            completedBy: 'Sarah Johnson',
                            completedAt: '2024-12-03'
                        },
                        {
                            title: 'Design Assets Creation',
                            isCompleted: false
                        },
                        {
                            title: 'Campaign Launch',
                            isCompleted: false
                        }
                    ]
                }
            },
            include: { stages: true }
        });

        const project2 = await prisma.project.create({
            data: {
                title: 'Brand Identity Refresh',
                description: 'Update brand guidelines and visual identity system',
                createdAt: '2024-11-15',
                isArchived: false,
                notes: ['Stakeholder meetings scheduled'],
                stages: {
                    create: [
                        {
                            title: 'Audit Current Brand Assets',
                            isCompleted: true,
                            completedBy: 'John Makhowsky',
                            completedAt: '2024-11-20'
                        },
                        {
                            title: 'Design New Logo Concepts',
                            isCompleted: false
                        },
                        {
                            title: 'Create Brand Guidelines',
                            isCompleted: false
                        }
                    ]
                }
            },
            include: { stages: true }
        });

        console.log(`✓ Created 2 projects with stages\n`);

        // 5. Seed Activity Logs
        console.log('📝 Seeding activity logs...');
        await prisma.activityLog.deleteMany({});

        const logs = await Promise.all([
            prisma.activityLog.create({
                data: {
                    action: 'Creó proyecto: Q1 Marketing Campaign',
                    user: 'Sarah Johnson',
                    time: 'hace 2 horas'
                }
            }),
            prisma.activityLog.create({
                data: {
                    action: 'Subió nuevo archivo: Brand Logo Primary',
                    user: 'John Makhowsky',
                    time: 'hace 3 horas'
                }
            }),
            prisma.activityLog.create({
                data: {
                    action: 'Completó tarea "Market Research & Analysis"',
                    user: 'Mike Chen',
                    time: 'hace 5 horas'
                }
            }),
            prisma.activityLog.create({
                data: {
                    action: 'Añadió miembro: Emma Davis',
                    user: 'Sarah Johnson',
                    time: 'hace 1 día'
                }
            })
        ]);
        console.log(`✓ Created ${logs.length} activity logs\n`);

        // 6. Seed Chat Messages
        console.log('💬 Seeding chat messages...');
        await prisma.chatMessage.deleteMany({});

        const chatMessages = await Promise.all([
            prisma.chatMessage.create({
                data: {
                    userId: users[0].id,
                    content: '¡Hola equipo! ¿Cómo va el progreso del proyecto Q1?',
                    timestamp: '10:30'
                }
            }),
            prisma.chatMessage.create({
                data: {
                    userId: users[1].id,
                    content: 'Muy bien! Hemos completado la fase de investigación.',
                    timestamp: '10:35'
                }
            }),
            prisma.chatMessage.create({
                data: {
                    userId: users[2].id,
                    content: 'Necesitamos revisar los assets de marca antes del viernes',
                    timestamp: '11:20'
                }
            })
        ]);
        console.log(`✓ Created ${chatMessages.length} chat messages\n`);

        console.log('✅ SEEDING COMPLETE!');
        console.log('\n📊 Summary:');
        console.log(`   - ${users.length} users`);
        console.log(`   - ${assets.length} assets`);
        console.log(`   - ${brandItems.length} brand items`);
        console.log(`   - 2 projects`);
        console.log(`   - ${logs.length} activity logs`);
        console.log(`   - ${chatMessages.length} chat messages`);
        console.log('\n🔐 Login with: "John Makhowsky" / "admin"');

    } catch (error) {
        console.error('❌ Seeding error:', error);
        throw error;
    }
}

seedAll()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
