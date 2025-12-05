
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './pages/Dashboard';
import { Assets } from './pages/Assets';
import { BrandKit } from './pages/BrandKit';
import { Team } from './pages/Team';
import { Login } from './pages/Login';
import { AiAssistant } from './pages/AiAssistant';
import { Progress } from './pages/Progress';
import { ProjectDetail } from './pages/ProjectDetail';
import { Archived } from './pages/Archived';
import { Chat } from './pages/Chat';
import { NotasChecks } from './pages/NotasChecks';
import { NoCheckComun } from './pages/NoCheckComun';
import { Agendarme } from './pages/Agendarme';
import { Calendario } from './pages/Calendario';
import { Proposals } from './pages/Proposals';
import { ThemeMode, Asset, BrandItem, TeamMember, UserState, ActivityLog, Project, ChatMessage, ChatContext, NoteCheck, AgendaItem, Proposal, ProposalResponseType } from './types';

import { api } from './services/api';

const App: React.FC = () => {
  // --- State ---
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [userState, setUserState] = useState<UserState>({ isAuthenticated: false, currentUser: null });
  const [activeTab, setActiveTab] = useState('dashboard');

  // Data State
  const [assets, setAssets] = useState<Asset[]>([]);
  const [brandItems, setBrandItems] = useState<BrandItem[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Dynamic Sections (Created from Projects)
  const [customSections, setCustomSections] = useState<Project[]>([]);

  // Notas & Checks State (from database)
  const [notesChecks, setNotesChecks] = useState<NoteCheck[]>([]);

  // Agenda Items State (from database)
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);

  // Proposals State
  const [proposals, setProposals] = useState<Proposal[]>([]);

  // --- Effects ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedAssets, fetchedBrandItems, fetchedTeam, fetchedLogs, fetchedProjects, fetchedMessages, fetchedProposals, fetchedNotesChecks, fetchedAgendaItems] = await Promise.all([
          api.getAssets(),
          api.getBrandItems(),
          api.getTeam(),
          api.getLogs(),
          api.getProjects(),
          api.getMessages(),
          api.getProposals(),
          api.getNotesChecks(),
          api.getAgendaItems()
        ]);
        setAssets(fetchedAssets);
        setBrandItems(fetchedBrandItems);
        setTeamMembers(fetchedTeam);
        setActivityLogs(fetchedLogs);
        setProjects(fetchedProjects);
        setChatMessages(fetchedMessages);
        setProposals(fetchedProposals);
        setNotesChecks(fetchedNotesChecks);
        setAgendaItems(fetchedAgendaItems);
        // Initialize custom sections from projects if needed, or fetch separately
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // --- Handlers ---
  const handleLogin = (user: TeamMember) => {
    setUserState({ isAuthenticated: true, currentUser: user });
  };

  const handleLogout = () => {
    setUserState({ isAuthenticated: false, currentUser: null });
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleUploadAsset = async (newAsset: Asset) => {
    const created = await api.createAsset(newAsset);
    setAssets([created, ...assets]);
    addLog(`Subió nuevo archivo: ${created.name}`);
  };

  // Helper handler for uploading directly from ProjectDetail (converts File to Asset mock)
  const handleUploadFileFromDetail = (file: File) => {
    const newAsset: Asset = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name.split('.')[0],
      category: 'other',
      url: URL.createObjectURL(file), // Mock URL
      uploadedBy: userState.currentUser?.name || 'Unknown',
      date: new Date().toLocaleDateString(),
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      tags: ['project-upload']
    };
    handleUploadAsset(newAsset);
  };

  const handleUpdateAsset = async (updatedAsset: Asset) => {
    const updated = await api.updateAsset(updatedAsset);
    setAssets(assets.map(a => a.id === updated.id ? updated : a));
    addLog(`Editó archivo: ${updated.name}`);
  };

  const handleDeleteAsset = async (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    await api.deleteAsset(assetId);
    setAssets(assets.filter(a => a.id !== assetId));
    if (asset) {
      addLog(`Eliminó archivo: ${asset.name}`);
    }
  };

  const handleAddBrandItem = async (item: BrandItem) => {
    const created = await api.createBrandItem(item);
    setBrandItems([created, ...brandItems]);
    addLog(`Añadió a kit de marca: ${created.content.substring(0, 20)}...`);
  };

  const handleAddMember = async (member: TeamMember) => {
    const created = await api.createMember(member);
    setTeamMembers([...teamMembers, created]);
    addLog(`Añadió miembro: ${created.name}`);
  };

  const handleUpdateMember = async (updatedMember: TeamMember) => {
    const updated = await api.updateMember(updatedMember);
    setTeamMembers(teamMembers.map(m => m.id === updated.id ? updated : m));
    addLog(`Actualizó miembro: ${updated.name}`);
  };

  const handleDeleteMember = async (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    await api.deleteMember(memberId);
    setTeamMembers(teamMembers.filter(m => m.id !== memberId));
    if (member) {
      addLog(`Eliminó miembro: ${member.name}`);
    }
  };

  const handleAddProject = async (project: Project) => {
    const created = await api.createProject(project);
    setProjects([created, ...projects]);
    addLog(`Creó proyecto: ${created.title}`);
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    const updated = await api.updateProject(updatedProject);
    setProjects(projects.map(p => p.id === updated.id ? updated : p));
    // Also update custom section if it exists
    setCustomSections(customSections.map(p => p.id === updated.id ? updated : p));
    addLog(`Actualizó proyecto: ${updated.title}`);
  };

  const handleDeleteProject = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    await api.deleteProject(projectId);
    setProjects(projects.filter(p => p.id !== projectId));
    setCustomSections(customSections.filter(p => p.id !== projectId));

    // If we are currently viewing the deleted project, go back to dashboard
    if (activeTab === `project-${projectId}`) {
      setActiveTab('dashboard');
    }

    if (project) addLog(`Eliminó proyecto: ${project.title}`);
  };

  const handleArchiveSection = (projectId: string) => {
    // Remove from sidebar
    setCustomSections(customSections.filter(p => p.id !== projectId));

    // Mark as archived in main list
    setProjects(projects.map(p => p.id === projectId ? { ...p, isArchived: true } : p));

    setActiveTab('progress');
    addLog(`Archivó proyecto: ${projectId}`);
  };

  const handleUnarchiveProject = (projectId: string) => {
    setProjects(projects.map(p => p.id === projectId ? { ...p, isArchived: false } : p));
    addLog(`Recuperó proyecto: ${projectId}`);
  };

  const handleAddProjectNote = (projectId: string, note: string) => {
    const updateLogic = (list: Project[]) => list.map(p => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        notes: [note, ...(p.notes || [])]
      };
    });
    setProjects(updateLogic(projects));
    setCustomSections(updateLogic(customSections));
    addLog(`Añadió nota a proyecto`);
  };

  const handleToggleStage = (projectId: string, stageId: string) => {
    const updateLogic = (list: Project[]) => list.map(p => {
      if (p.id !== projectId) return p;

      const stage = p.stages.find(s => s.id === stageId);
      if (!stage) return p;

      const isNowCompleted = !stage.isCompleted;

      // Log the action only once (checking if main list)
      if (isNowCompleted && list === projects) {
        addLog(`Completó tarea "${stage.title}" en ${p.title}`);
      }

      return {
        ...p,
        stages: p.stages.map(s => {
          if (s.id !== stageId) return s;
          return {
            ...s,
            isCompleted: isNowCompleted,
            completedBy: isNowCompleted ? userState.currentUser?.name : undefined,
            completedAt: isNowCompleted ? new Date().toLocaleDateString() : undefined
          };
        })
      };
    });

    setProjects(updateLogic(projects));
    setCustomSections(updateLogic(customSections));
  };

  const handleCreateSection = (project: Project) => {
    if (!customSections.find(s => s.id === project.id)) {
      setCustomSections([...customSections, project]);
      addLog(`Creó espacio de trabajo para: ${project.title}`);
    }
  };

  const handleSendMessage = async (text: string, context?: ChatContext) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: userState.currentUser?.id || 'unknown',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      context
    };
    const created = await api.createMessage(newMessage);
    setChatMessages([...chatMessages, created]);
  };

  const addLog = async (action: string) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      action,
      user: userState.currentUser?.name || 'Unknown',
      time: 'ahora'
    };
    const created = await api.createLog(newLog);
    setActivityLogs([created, ...activityLogs]);
  };

  // --- Notas & Checks Handlers ---
  const handleAddNote = async (note: NoteCheck) => {
    const created = await api.createNoteCheck(note);
    setNotesChecks([created, ...notesChecks]);
    addLog(`Creó ${note.type === 'note' ? 'nota' : 'checklist'}: ${note.title}`);
  };

  const handleUpdateNote = async (note: NoteCheck) => {
    const updated = await api.updateNoteCheck(note);
    setNotesChecks(notesChecks.map(n => n.id === updated.id ? updated : n));
  };

  const handleDeleteNote = async (id: string) => {
    const note = notesChecks.find(n => n.id === id);
    await api.deleteNoteCheck(id);
    setNotesChecks(notesChecks.filter(n => n.id !== id));
    if (note) addLog(`Eliminó ${note.type === 'note' ? 'nota' : 'checklist'}: ${note.title}`);
  };

  const handlePublishNote = async (id: string) => {
    const note = notesChecks.find(n => n.id === id);
    if (!note) return;
    const newPublished = !note.isPublished;
    const updated = await api.updateNoteCheck({ ...note, isPublished: newPublished });
    setNotesChecks(notesChecks.map(n => n.id === id ? updated : n));
    if (newPublished) addLog(`Publicó ${note.type === 'note' ? 'nota' : 'checklist'}: ${note.title}`);
  };

  const handleTogglePublicCheckItem = async (noteId: string, itemId: string) => {
    const note = notesChecks.find(n => n.id === noteId);
    if (!note || !note.items) return;
    const updatedItems = note.items.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    const updated = await api.updateNoteCheck({ ...note, items: updatedItems });
    setNotesChecks(notesChecks.map(n => n.id === noteId ? updated : n));
  };

  // --- Agenda Handlers ---
  const handleAddAgendaItem = async (item: AgendaItem) => {
    const created = await api.createAgendaItem(item);
    setAgendaItems([created, ...agendaItems]);
    addLog(`Agendó: ${item.title} para ${item.date}`);
  };

  const handleUpdateAgendaItem = async (item: AgendaItem) => {
    const updated = await api.updateAgendaItem(item);
    setAgendaItems(agendaItems.map(i => i.id === updated.id ? updated : i));
  };

  const handleDeleteAgendaItem = async (id: string) => {
    const item = agendaItems.find(i => i.id === id);
    await api.deleteAgendaItem(id);
    setAgendaItems(agendaItems.filter(i => i.id !== id));
    if (item) addLog(`Eliminó evento: ${item.title}`);
  };

  // --- Proposals Handlers ---
  const handleAddProposal = async (proposal: Omit<Proposal, 'id' | 'responses'>) => {
    const created = await api.createProposal(proposal);
    setProposals([created, ...proposals]);
    addLog(`Propuso reunión: ${created.title}`);
  };

  const handleDeleteProposal = async (id: string) => {
    const proposal = proposals.find(p => p.id === id);
    await api.deleteProposal(id);
    setProposals(proposals.filter(p => p.id !== id));
    if (proposal) addLog(`Eliminó propuesta: ${proposal.title}`);
  };

  const handleRespondToProposal = async (proposalId: string, response: ProposalResponseType) => {
    if (!userState.currentUser) return;
    const responseData = {
      userId: userState.currentUser.id,
      userName: userState.currentUser.name,
      userAvatar: userState.currentUser.avatar,
      response
    };
    const created = await api.respondToProposal(proposalId, responseData);
    setProposals(proposals.map(p => {
      if (p.id !== proposalId) return p;
      const existingIndex = p.responses.findIndex(r => r.userId === userState.currentUser!.id);
      if (existingIndex >= 0) {
        const newResponses = [...p.responses];
        newResponses[existingIndex] = { ...newResponses[existingIndex], response };
        return { ...p, responses: newResponses };
      }
      return { ...p, responses: [...p.responses, { ...created, proposalId }] };
    }));
  };

  // --- Render ---
  if (!userState.isAuthenticated) {
    return <Login onLogin={handleLogin} users={teamMembers} />;
  }

  const renderContent = () => {
    // Check for dynamic project section
    if (activeTab.startsWith('project-')) {
      const projectId = activeTab.replace('project-', '');
      const project = customSections.find(p => p.id === projectId) || projects.find(p => p.id === projectId);
      if (project) {
        return (
          <ProjectDetail
            project={project}
            assets={assets}
            onArchive={handleArchiveSection}
            onDelete={handleDeleteProject}
            onAddNote={handleAddProjectNote}
            onUpload={handleUploadFileFromDetail}
            onViewAllAssets={() => setActiveTab('assets')}
          />
        );
      }
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard assets={assets} logs={activityLogs} teamMembers={teamMembers} projects={projects} chatMessages={chatMessages} />;
      case 'chat':
        return (
          <Chat
            messages={chatMessages}
            currentUser={userState.currentUser!}
            teamMembers={teamMembers}
            onSendMessage={handleSendMessage}
            assets={assets}
            projects={projects}
            brandItems={brandItems}
          />
        );
      case 'assets':
        return (
          <Assets
            assets={assets}
            onUpload={handleUploadAsset}
            onDelete={handleDeleteAsset}
            onUpdate={handleUpdateAsset}
            currentUser={userState.currentUser?.name || 'Usuario'}
          />
        );
      case 'notas-checks':
        return (
          <NotasChecks
            notes={notesChecks}
            currentUser={userState.currentUser!}
            onAdd={handleAddNote}
            onUpdate={handleUpdateNote}
            onDelete={handleDeleteNote}
            onPublish={handlePublishNote}
          />
        );
      case 'nocheck-comun':
        return (
          <NoCheckComun
            notes={notesChecks}
            currentUser={userState.currentUser!}
            onToggleCheckItem={handleTogglePublicCheckItem}
          />
        );
      case 'agendarme':
        return (
          <Agendarme
            items={agendaItems}
            currentUser={userState.currentUser!}
            onAdd={handleAddAgendaItem}
            onUpdate={handleUpdateAgendaItem}
            onDelete={handleDeleteAgendaItem}
          />
        );
      case 'calendario':
        return <Calendario items={agendaItems} proposals={proposals} />;
      case 'proposals':
        return (
          <Proposals
            proposals={proposals}
            currentUser={userState.currentUser!}
            onAdd={handleAddProposal}
            onDelete={handleDeleteProposal}
            onRespond={handleRespondToProposal}
          />
        );
      case 'brand':
        return <BrandKit items={brandItems} onAddItem={handleAddBrandItem} />;
      case 'ai':
        return <AiAssistant />;
      case 'team':
        return <Team members={teamMembers} onAddMember={handleAddMember} onUpdateMember={handleUpdateMember} onDeleteMember={handleDeleteMember} currentUser={userState.currentUser} />;
      case 'progress':
        return (
          <Progress
            projects={projects.filter(p => !p.isArchived)}
            logs={activityLogs}
            onAddProject={handleAddProject}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
            onToggleStage={handleToggleStage}
            onCreateSection={handleCreateSection}
          />
        );
      case 'archived':
        return (
          <Archived
            projects={projects.filter(p => p.isArchived)}
            onUnarchive={handleUnarchiveProject}
            onDeletePermanent={handleDeleteProject}
          />
        );
      default:
        return <Dashboard assets={assets} logs={activityLogs} teamMembers={teamMembers} projects={projects} chatMessages={chatMessages} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans transition-colors duration-300">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userState={userState}
        onLogout={handleLogout}
        customSections={customSections}
      />

      <main className="flex-1 flex flex-col min-w-0">
        <TopBar
          title={activeTab}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        <div className="flex-1 overflow-hidden relative">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
