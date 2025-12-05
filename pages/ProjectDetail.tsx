
import React, { useState, useRef } from 'react';
import { Project, Asset } from '../types';
import { Clock, CheckCircle, AlertCircle, FileText, ArrowRight, Archive, Trash2, Plus, Save, X } from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
  assets: Asset[];
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  onAddNote: (id: string, note: string) => void;
  onUpload: (file: File) => void;
  onViewAllAssets: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ 
    project, 
    assets, 
    onArchive, 
    onDelete, 
    onAddNote,
    onUpload,
    onViewAllAssets
}) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteText, setNoteText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const completedStages = project.stages.filter(s => s.isCompleted).length;
  const totalStages = project.stages.length;
  const progress = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

  // Simulate filtering assets for this project (in a real app, this would use backend ID)
  // We'll show the latest assets as a placeholder
  const projectAssets = assets.slice(0, 3);

  const handleSaveNote = () => {
      if (noteText.trim()) {
          onAddNote(project.id, noteText);
          setNoteText('');
          setIsAddingNote(false);
      }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          onUpload(e.target.files[0]);
      }
      if(fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
        <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex-1">
                <div className="flex items-center space-x-2 text-violet-600 dark:text-violet-400 mb-2">
                    <span className="text-xs font-bold tracking-wider uppercase">Espacio de Trabajo</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">{project.title}</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-3xl text-lg">{project.description}</p>
            </div>
            
            <div className="flex items-center space-x-3">
                <button 
                    onClick={() => onArchive(project.id)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 font-medium"
                    title="Archivar sección (Quitar de barra lateral)"
                >
                    <Archive size={18} />
                    <span>Archivar</span>
                </button>
                <button 
                    onClick={() => onDelete(project.id)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors border border-rose-200 dark:border-rose-900/50 font-medium"
                    title="Borrar Proyecto Permanentemente"
                >
                    <Trash2 size={18} />
                    <span>Borrar</span>
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Main Progress Card */}
            <div className="lg:col-span-2 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-violet-500/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-white/80 font-medium mb-1">Estado General</p>
                            <h3 className="text-4xl font-bold">{progress}% Completado</h3>
                        </div>
                        <div className="w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center text-xl font-bold">
                            {completedStages}/{totalStages}
                        </div>
                    </div>
                    
                    <div className="w-full bg-black/20 h-3 rounded-full overflow-hidden mb-6">
                        <div 
                            className="h-full bg-white transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                            <Clock size={20} className="mb-2 text-white/80" />
                            <p className="text-xs text-white/60">Inicio</p>
                            <p className="font-semibold">{project.createdAt}</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                            <CheckCircle size={20} className="mb-2 text-white/80" />
                            <p className="text-xs text-white/60">Tareas</p>
                            <p className="font-semibold">{completedStages} listas</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                            <AlertCircle size={20} className="mb-2 text-white/80" />
                            <p className="text-xs text-white/60">Pendientes</p>
                            <p className="font-semibold">{totalStages - completedStages}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions / Notes */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">Notas Rápidas</h3>
                    <span className="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full text-slate-500">{project.notes?.length || 0}</span>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 flex-1 mb-4 border border-slate-100 dark:border-slate-700 overflow-y-auto max-h-[200px] space-y-3">
                    {project.notes && project.notes.length > 0 ? (
                        project.notes.map((note, i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-sm text-sm text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                                {note}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-slate-500 italic text-center py-4">No hay notas recientes para este proyecto.</p>
                    )}
                </div>

                {isAddingNote ? (
                    <div className="flex gap-2">
                         <input 
                            type="text" 
                            autoFocus
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm outline-none focus:border-violet-500 dark:text-white"
                            placeholder="Escribe nota..."
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveNote()}
                         />
                         <button onClick={handleSaveNote} className="p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"><Save size={16} /></button>
                         <button onClick={() => setIsAddingNote(false)} className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg"><X size={16} /></button>
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsAddingNote(true)}
                        className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-600 text-slate-400 hover:text-violet-500 hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-all font-medium text-sm flex items-center justify-center gap-2"
                    >
                        <Plus size={16} />
                        <span>Añadir Nota</span>
                    </button>
                )}
            </div>
        </div>

        {/* Project Specific Assets */}
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Recursos del Proyecto</h3>
                <button 
                    onClick={onViewAllAssets}
                    className="text-violet-600 dark:text-violet-400 text-sm font-medium hover:underline flex items-center gap-1"
                >
                    Ver todos <ArrowRight size={14} />
                </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {projectAssets.map((asset) => (
                    <div key={asset.id} className="group bg-white dark:bg-slate-800 rounded-2xl p-3 shadow-sm hover:shadow-lg transition-all border border-slate-100 dark:border-slate-700">
                        <div className="aspect-square rounded-xl bg-slate-100 dark:bg-slate-900 mb-3 overflow-hidden relative">
                             <img src={asset.url} alt={asset.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                             <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <h4 className="font-medium text-slate-800 dark:text-white text-sm truncate">{asset.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">{asset.category}</p>
                    </div>
                ))}
                
                {/* Upload Functional Button */}
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center aspect-square hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                >
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-violet-500 transition-colors mb-3">
                        <FileText size={24} />
                    </div>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-white">Subir archivo</span>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={handleFileChange}
                    />
                </button>
            </div>
        </div>
    </div>
  );
};