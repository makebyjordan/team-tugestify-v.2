import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function createAdminRoot() {
    console.log('🔐 Creando usuario Admin-Root...\n');

    try {
        // Verificar si ya existe admin-root
        const existingAdmin = await prisma.user.findFirst({
            where: { name: 'Admin Root' }
        });

        if (existingAdmin) {
            console.log('⚠️  Admin Root ya existe. Actualizando...');
            const updated = await prisma.user.update({
                where: { id: existingAdmin.id },
                data: {
                    password: 'root2024',
                    isAdmin: true,
                    role: 'Super Administrator',
                    avatar: 'https://i.pravatar.cc/150?img=68'
                }
            });
            console.log('✓ Admin Root actualizado:', updated.name);
        } else {
            // Crear nuevo admin-root
            const adminRoot = await prisma.user.create({
                data: {
                    name: 'Admin Root',
                    role: 'Super Administrator',
                    avatar: 'https://i.pravatar.cc/150?img=68',
                    password: 'root2024',
                    isAdmin: true
                }
            });
            console.log('✓ Admin Root creado:', adminRoot.name);
        }

        // Actualizar usuarios existentes para que NO sean admin
        await prisma.user.updateMany({
            where: {
                name: { not: 'Admin Root' }
            },
            data: {
                isAdmin: false
            }
        });
        console.log('✓ Usuarios regulares actualizados (isAdmin = false)');

        // Mostrar todos los usuarios
        const allUsers = await prisma.user.findMany({
            select: {
                name: true,
                role: true,
                isAdmin: true,
                password: true
            }
        });

        console.log('\n📋 Lista de Usuarios:');
        console.log('═══════════════════════════════════════════════════');
        allUsers.forEach(user => {
            const adminBadge = user.isAdmin ? '🔐 ADMIN' : '👤 USER';
            console.log(`${adminBadge} | ${user.name.padEnd(20)} | ${user.role.padEnd(25)} | Password: ${user.password}`);
        });
        console.log('═══════════════════════════════════════════════════');

        console.log('\n✅ CONFIGURACIÓN COMPLETA!');
        console.log('\n🔐 CREDENCIALES ADMIN-ROOT:');
        console.log('   Usuario: Admin Root');
        console.log('   Contraseña: root2024');
        console.log('\n💡 Solo Admin Root puede:');
        console.log('   ✓ Crear nuevos usuarios');
        console.log('   ✓ Editar usuarios existentes');
        console.log('   ✓ Cambiar contraseñas');
        console.log('   ✓ Asignar roles');

    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
}

createAdminRoot()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
