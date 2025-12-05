
import React, { useState } from 'react';
import { Project, ActivityLog } from '../types';
import { Plus, Check, Calendar, Activity, MoreHorizontal, Pencil, Trash2, X, FolderInput } from 'lucide-react';

interface ProgressProps {
    projects: Project[];
    logs: ActivityLog[];
    onAddProject: (project: Project) => void;
    onUpdateProject: (project: Project) => void;
    onDeleteProject: (projectId: string) => void;
    onToggleStage: (projectId: string, stageId: string) => void;
    onCreateSection: (project: Project) => void;
}

interface StageInput {
    id?: string;
    title: string;
    isCompleted: boolean;
    completedBy?: string;
    completedAt?: string;
}

export const Progress: React.FC<ProgressProps> = ({ projects, logs, onAddProject, onUpdateProject, onDeleteProject, onToggleStage, onCreateSection }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formTitle, setFormTitle] = useState('');
    const [formDesc, setFormDesc] = useState('');
    const [formStages, setFormStages] = useState<StageInput[]>([{ title: '', isCompleted: false }]);

    const openCreateModal = () => {
        setEditingId(null);
        setFormTitle('');
        setFormDesc('');
        setFormStages([{ title: '', isCompleted: false }]);
        setIsModalOpen(true);
        setOpenMenuId(null);
    };

    const openEditModal = (project: Project) => {
        setEditingId(project.id);
        setFormTitle(project.title);
        setFormDesc(project.description);
        // Map existing stages to form format
        setFormStages(project.stages.map(s => ({
            id: s.id,
            title: s.title,
            isCompleted: s.isCompleted,
            completedBy: s.completedBy,
            completedAt: s.completedAt
        })));
        setIsModalOpen(true);
        setOpenMenuId(null);
    };

    const handleStageInput = (index: number, value: string) => {
        const newStages = [...formStages];
        newStages[index] = { ...newStages[index], title: value };
        setFormStages(newStages);
    };

    const addStageInput = () => {
        setFormStages([...formStages, { title: '', isCompleted: false }]);
    };

    const removeStageInput = (index: number) => {
        if (formStages.length > 1) {
            const newStages = formStages.filter((_, i) => i !== index);
            setFormStages(newStages);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formTitle || !formDesc) return;

        const validStages = formStages.filter(s => s.title.trim() !== '');
        if (validStages.length === 0) return;

        if (editingId) {
            // Update
            const updatedProject: Project = {
                id: editingId,
                title: formTitle,
                description: formDesc,
                createdAt: new Date().toLocaleDateString(), // Or keep original
                stages: validStages.map((s, i) => ({
                    id: s.id || `s-${Date.now()}-${i}`,
                    title: s.title,
                    isCompleted: s.isCompleted,
                    completedBy: (s as any).completedBy,
                    completedAt: (s as any).completedAt
                }))
            };
            const original = projects.find(p => p.id === editingId);
            if (original) updatedProject.createdAt = original.createdAt;

            onUpdateProject(updatedProject);
        } else {
            // Create
            const newProject: Project = {
                id: Date.now().toString(),
                title: formTitle,
                description: formDesc,
                createdAt: new Date().toLocaleDateString(),
                stages: validStages.map((s, i) => ({
                    id: `s-${Date.now()}-${i}`,
                    title: s.title,
                    isCompleted: false
                }))
            };
            onAddProject(newProject);
        }

        setIsModalOpen(false);
    };

    const calculateProgress = (project: Project) => {
        if (project.stages.length === 0) return 0;
        const completed = project.stages.filter(s => s.isCompleted).length;
        return Math.round((completed / project.stages.length) * 100);
    };

    return (
        <div className="flex h-full relative" onClick={() => setOpenMenuId(null)}>
            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Hoja de Ruta</h2>
                        <p className="text-slate-500 dark:text-slate-400">Rastrea el progreso de tus proyectos y tareas.</p>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); openCreateModal(); }}
                        className="flex items-center space-x-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-200 dark:shadow-none font-medium"
                    >
                        <Plus size={18} />
                        <span>Crear Proyecto</span>
                    </button>
                </div>

                <div className="space-y-8 pb-20">
                    {projects.map(project => {
                        const progress = calculateProgress(project);
                        return (
                            <div key={project.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 relative group transition-all hover:shadow-md hover:border-violet-200 dark:hover:border-violet-900/50">

                                {/* Options Menu */}
                                <div className="absolute top-6 right-6 z-10">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === project.id ? null : project.id); }}
                                        className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                    >
                                        <MoreHorizontal size={20} />
                                    </button>
                                    {openMenuId === project.id && (
                                        <div className="absolute right-0 top-8 w-44 bg-white dark:bg-slate-700 rounded-xl shadow-xl border border-slate-100 dark:border-slate-600 overflow-hidden animate-in zoom-in-95 duration-100 z-50">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onCreateSection(project); setOpenMenuId(null); }}
                                                className="w-full text-left px-4 py-2.5 text-sm text-violet-600 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-900/30 flex items-center space-x-2 border-b border-slate-100 dark:border-slate-600"
                                            >
                                                <FolderInput size={14} />
                                                <span>Pasar a sección</span>
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); openEditModal(project); }}
                                                className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center space-x-2"
                                            >
                                                <Pencil size={14} />
                                                <span>Editar</span>
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }}
                                                className="w-full text-left px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 flex items-center space-x-2"
                                            >
                                                <Trash2 size={14} />
                                                <span>Borrar</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 pr-8">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">{project.title}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">{project.description}</p>
                                        <div className="flex items-center space-x-2 mt-2 text-xs text-slate-400">
                                            <Calendar size={12} />
                                            <span>Iniciado: {project.createdAt}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex items-center space-x-3 bg-slate-50 dark:bg-slate-700 px-4 py-2 rounded-xl">
                                        <div className="text-right">
                                            <span className="block text-xs text-slate-500 dark:text-slate-300 font-medium">Progreso</span>
                                            <span className="block text-xl font-bold text-violet-600 dark:text-violet-400">{progress}%</span>
                                        </div>
                                        <div className="w-12 h-12 relative flex items-center justify-center">
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-200 dark:text-slate-600" />
                                                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={126} strokeDashoffset={126 - (126 * progress) / 100} className="text-violet-500 transition-all duration-1000 ease-out" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="relative pl-4 border-l-2 border-slate-100 dark:border-slate-700 space-y-6">
                                    {project.stages.map((stage) => (
                                        <div key={stage.id} className="relative pl-6 group">
                                            {/* Timeline Node */}
                                            <div
                                                className={`absolute -left-[23px] top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-300 ${stage.isCompleted
                                                    ? 'bg-violet-600 border-violet-600'
                                                    : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-500'
                                                    }`}
                                            >
                                                {stage.isCompleted && <Check size={10} className="text-white" />}
                                            </div>

                                            {/* Content */}
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-3">
                                                    <input
                                                        type="checkbox"
                                                        checked={stage.isCompleted}
                                                        onChange={() => onToggleStage(project.id, stage.id)}
                                                        className="mt-1 w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                                                    />
                                                    <div>
                                                        <span className={`text-sm font-medium transition-all ${stage.isCompleted ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-white'}`}>
                                                            {stage.title}
                                                        </span>
                                                        {stage.isCompleted && stage.completedBy && (
                                                            <div className="flex items-center space-x-1 mt-1">
                                                                <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-[8px] font-bold text-slate-600 dark:text-slate-300">
                                                                    {stage.completedBy.charAt(0)}
                                                                </div>
                                                                <span className="text-xs text-slate-400">Completado por {stage.completedBy}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Right Sidebar - History */}
            <div className="w-80 bg-white dark:bg-slate-800/50 border-l border-slate-200 dark:border-slate-800 p-6 overflow-y-auto hidden xl:block">
                <div className="flex items-center space-x-2 mb-6">
                    <Activity size={20} className="text-violet-500" />
                    <h3 className="font-bold text-slate-800 dark:text-white">Historial de Acciones</h3>
                </div>
                <div className="space-y-6 relative">
                    <div className="absolute left-3 top-2 bottom-0 w-px bg-slate-100 dark:bg-slate-700"></div>
                    {logs.map(log => (
                        <div key={log.id} className="relative pl-8">
                            <div className="absolute left-[9px] top-1.5 w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-slate-800"></div>
                            <p className="text-sm text-slate-800 dark:text-slate-200">{log.action}</p>
                            <div className="flex items-center justify-between mt-1">
                                <span className="text-xs text-slate-500 font-medium">{log.user}</span>
                                <span className="text-[10px] text-slate-400">{log.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create/Edit Project Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700 flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                                {editingId ? 'Editar Proyecto' : 'Crear Nuevo Progreso'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-1">Título del Proyecto</label>
                                    <input
                                        type="text"
                                        required
                                        value={formTitle}
                                        onChange={e => setFormTitle(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 outline-none dark:text-white"
                                        placeholder="Ej. Lanzamiento Web"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-1">Descripción</label>
                                    <textarea
                                        required
                                        value={formDesc}
                                        onChange={e => setFormDesc(e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 outline-none dark:text-white resize-none h-20"
                                        placeholder="Breve descripción del objetivo..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-500 mb-2">Etapas / Tareas</label>
                                    <div className="space-y-2">
                                        {formStages.map((stage, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={stage.title}
                                                    onChange={(e) => handleStageInput(index, e.target.value)}
                                                    className="flex-1 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 outline-none dark:text-white text-sm"
                                                    placeholder={`Etapa ${index + 1}`}
                                                />
                                                {formStages.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeStageInput(index)}
                                                        className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addStageInput}
                                        className="mt-3 text-sm text-violet-600 hover:text-violet-700 font-medium flex items-center space-x-1"
                                    >
                                        <Plus size={16} />
                                        <span>Añadir otra etapa</span>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl font-medium shadow-lg shadow-violet-500/20 transition-colors"
                                >
                                    {editingId ? 'Guardar Cambios' : 'Crear Proyecto'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
