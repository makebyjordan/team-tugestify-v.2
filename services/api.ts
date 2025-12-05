import { Asset, Project, TeamMember, BrandItem, ActivityLog, ChatMessage, Proposal, ProposalResponse, NoteCheck, AgendaItem } from '../types';

const API_URL = 'http://localhost:3001/api';

export const api = {
    // Assets
    getAssets: async (): Promise<Asset[]> => {
        const res = await fetch(`${API_URL}/assets`);
        return res.json();
    },
    createAsset: async (asset: Asset): Promise<Asset> => {
        const res = await fetch(`${API_URL}/assets`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(asset),
        });
        return res.json();
    },
    updateAsset: async (asset: Asset): Promise<Asset> => {
        const res = await fetch(`${API_URL}/assets/${asset.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(asset),
        });
        return res.json();
    },
    deleteAsset: async (id: string): Promise<void> => {
        await fetch(`${API_URL}/assets/${id}`, { method: 'DELETE' });
    },

    // Projects
    getProjects: async (): Promise<Project[]> => {
        const res = await fetch(`${API_URL}/projects`);
        return res.json();
    },
    createProject: async (project: Project): Promise<Project> => {
        const res = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(project),
        });
        return res.json();
    },
    updateProject: async (project: Project): Promise<Project> => {
        const res = await fetch(`${API_URL}/projects/${project.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(project),
        });
        return res.json();
    },
    deleteProject: async (id: string): Promise<void> => {
        await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
    },
    updateProjectStage: async (projectId: string, stageId: string, data: any): Promise<void> => {
        await fetch(`${API_URL}/projects/${projectId}/stages/${stageId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
    },

    // Team
    getTeam: async (): Promise<TeamMember[]> => {
        const res = await fetch(`${API_URL}/team`);
        return res.json();
    },
    createMember: async (member: TeamMember): Promise<TeamMember> => {
        const res = await fetch(`${API_URL}/team`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(member),
        });
        return res.json();
    },
    updateMember: async (member: TeamMember): Promise<TeamMember> => {
        const res = await fetch(`${API_URL}/team/${member.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(member),
        });
        return res.json();
    },
    deleteMember: async (id: string): Promise<void> => {
        await fetch(`${API_URL}/team/${id}`, { method: 'DELETE' });
    },

    // Brand Items
    getBrandItems: async (): Promise<BrandItem[]> => {
        const res = await fetch(`${API_URL}/brand-items`);
        return res.json();
    },
    createBrandItem: async (item: BrandItem): Promise<BrandItem> => {
        const res = await fetch(`${API_URL}/brand-items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        });
        return res.json();
    },

    // Activity Logs
    getLogs: async (): Promise<ActivityLog[]> => {
        const res = await fetch(`${API_URL}/activity-logs`);
        return res.json();
    },
    createLog: async (log: ActivityLog): Promise<ActivityLog> => {
        const res = await fetch(`${API_URL}/activity-logs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(log),
        });
        return res.json();
    },

    // Chat
    getMessages: async (): Promise<ChatMessage[]> => {
        const res = await fetch(`${API_URL}/chat`);
        return res.json();
    },
    createMessage: async (message: ChatMessage): Promise<ChatMessage> => {
        const res = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message),
        });
        return res.json();
    },

    // Proposals
    getProposals: async (): Promise<Proposal[]> => {
        const res = await fetch(`${API_URL}/proposals`);
        return res.json();
    },
    createProposal: async (proposal: Omit<Proposal, 'id' | 'responses'>): Promise<Proposal> => {
        const res = await fetch(`${API_URL}/proposals`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(proposal),
        });
        return res.json();
    },
    deleteProposal: async (id: string): Promise<void> => {
        await fetch(`${API_URL}/proposals/${id}`, { method: 'DELETE' });
    },
    respondToProposal: async (proposalId: string, response: Omit<ProposalResponse, 'id' | 'proposalId'>): Promise<ProposalResponse> => {
        const res = await fetch(`${API_URL}/proposals/${proposalId}/responses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
        });
        return res.json();
    },

    // Notes & Checks
    getNotesChecks: async (): Promise<NoteCheck[]> => {
        const res = await fetch(`${API_URL}/notes-checks`);
        return res.json();
    },
    createNoteCheck: async (note: NoteCheck): Promise<NoteCheck> => {
        const res = await fetch(`${API_URL}/notes-checks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note),
        });
        return res.json();
    },
    updateNoteCheck: async (note: NoteCheck): Promise<NoteCheck> => {
        const res = await fetch(`${API_URL}/notes-checks/${note.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note),
        });
        return res.json();
    },
    deleteNoteCheck: async (id: string): Promise<void> => {
        await fetch(`${API_URL}/notes-checks/${id}`, { method: 'DELETE' });
    },

    // Agenda Items
    getAgendaItems: async (): Promise<AgendaItem[]> => {
        const res = await fetch(`${API_URL}/agenda-items`);
        return res.json();
    },
    createAgendaItem: async (item: AgendaItem): Promise<AgendaItem> => {
        const res = await fetch(`${API_URL}/agenda-items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        });
        return res.json();
    },
    updateAgendaItem: async (item: AgendaItem): Promise<AgendaItem> => {
        const res = await fetch(`${API_URL}/agenda-items/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        });
        return res.json();
    },
    deleteAgendaItem: async (id: string): Promise<void> => {
        await fetch(`${API_URL}/agenda-items/${id}`, { method: 'DELETE' });
    },
};
