import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// Assets
router.get('/assets', async (req, res) => {
    const assets = await prisma.asset.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(assets);
});

router.post('/assets', async (req, res) => {
    const asset = await prisma.asset.create({ data: req.body });
    res.json(asset);
});

router.delete('/assets/:id', async (req, res) => {
    await prisma.asset.delete({ where: { id: req.params.id } });
    res.json({ success: true });
});

router.put('/assets/:id', async (req, res) => {
    const asset = await prisma.asset.update({
        where: { id: req.params.id },
        data: req.body
    });
    res.json(asset);
});

// Projects
router.get('/projects', async (req, res) => {
    const projects = await prisma.project.findMany({
        include: { stages: true },
        orderBy: { createdAt: 'desc' }
    });
    res.json(projects);
});

router.post('/projects', async (req, res) => {
    const { stages, ...projectData } = req.body;
    const project = await prisma.project.create({
        data: {
            ...projectData,
            stages: {
                create: stages
            }
        },
        include: { stages: true }
    });
    res.json(project);
});

router.put('/projects/:id', async (req, res) => {
    const { stages, ...projectData } = req.body;
    // For simplicity, we update basic fields. Stages handling is more complex (update/create/delete).
    // Here we just update the project fields.
    const project = await prisma.project.update({
        where: { id: req.params.id },
        data: projectData,
        include: { stages: true }
    });
    res.json(project);
});

router.delete('/projects/:id', async (req, res) => {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ success: true });
});

// Project Stages
router.put('/projects/:projectId/stages/:stageId', async (req, res) => {
    const stage = await prisma.projectStage.update({
        where: { id: req.params.stageId },
        data: req.body
    });
    res.json(stage);
});

// Team
router.get('/team', async (req, res) => {
    const members = await prisma.user.findMany();
    res.json(members);
});

router.post('/team', async (req, res) => {
    const member = await prisma.user.create({ data: req.body });
    res.json(member);
});

router.put('/team/:id', async (req, res) => {
    const member = await prisma.user.update({
        where: { id: req.params.id },
        data: req.body
    });
    res.json(member);
});

router.delete('/team/:id', async (req, res) => {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
});

// Brand Items
router.get('/brand-items', async (req, res) => {
    const items = await prisma.brandItem.findMany();
    res.json(items);
});

router.post('/brand-items', async (req, res) => {
    const item = await prisma.brandItem.create({ data: req.body });
    res.json(item);
});

// Activity Logs
router.get('/activity-logs', async (req, res) => {
    const logs = await prisma.activityLog.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(logs);
});

router.post('/activity-logs', async (req, res) => {
    const log = await prisma.activityLog.create({ data: req.body });
    res.json(log);
});

// Chat Messages
router.get('/chat', async (req, res) => {
    const messages = await prisma.chatMessage.findMany({ orderBy: { createdAt: 'asc' } });
    res.json(messages);
});

router.post('/chat', async (req, res) => {
    const message = await prisma.chatMessage.create({ data: req.body });
    res.json(message);
});

export default router;
