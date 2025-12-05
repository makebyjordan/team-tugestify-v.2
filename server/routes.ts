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

// Proposals
router.get('/proposals', async (req, res) => {
    const proposals = await prisma.proposal.findMany({
        include: { responses: true },
        orderBy: { createdAt: 'desc' }
    });
    res.json(proposals);
});

router.post('/proposals', async (req, res) => {
    const proposal = await prisma.proposal.create({
        data: req.body,
        include: { responses: true }
    });
    res.json(proposal);
});

router.delete('/proposals/:id', async (req, res) => {
    await prisma.proposal.delete({ where: { id: req.params.id } });
    res.json({ success: true });
});

// Proposal Responses
router.post('/proposals/:proposalId/responses', async (req, res) => {
    const { proposalId } = req.params;
    const { userId, userName, userAvatar, response } = req.body;

    // Check if user already responded, update if exists
    const existing = await prisma.proposalResponse.findFirst({
        where: { proposalId, userId }
    });

    let result;
    if (existing) {
        result = await prisma.proposalResponse.update({
            where: { id: existing.id },
            data: { response }
        });
    } else {
        result = await prisma.proposalResponse.create({
            data: { proposalId, userId, userName, userAvatar, response }
        });
    }
    res.json(result);
});

router.delete('/proposals/:proposalId/responses/:responseId', async (req, res) => {
    await prisma.proposalResponse.delete({ where: { id: req.params.responseId } });
    res.json({ success: true });
});

// Notes & Checks
router.get('/notes-checks', async (req, res) => {
    const notes = await prisma.noteCheck.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(notes);
});

router.post('/notes-checks', async (req, res) => {
    const note = await prisma.noteCheck.create({ data: req.body });
    res.json(note);
});

router.put('/notes-checks/:id', async (req, res) => {
    const note = await prisma.noteCheck.update({
        where: { id: req.params.id },
        data: req.body
    });
    res.json(note);
});

router.delete('/notes-checks/:id', async (req, res) => {
    await prisma.noteCheck.delete({ where: { id: req.params.id } });
    res.json({ success: true });
});

// Agenda Items
router.get('/agenda-items', async (req, res) => {
    const items = await prisma.agendaItem.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(items);
});

router.post('/agenda-items', async (req, res) => {
    const item = await prisma.agendaItem.create({ data: req.body });
    res.json(item);
});

router.put('/agenda-items/:id', async (req, res) => {
    const item = await prisma.agendaItem.update({
        where: { id: req.params.id },
        data: req.body
    });
    res.json(item);
});

router.delete('/agenda-items/:id', async (req, res) => {
    await prisma.agendaItem.delete({ where: { id: req.params.id } });
    res.json({ success: true });
});

export default router;
