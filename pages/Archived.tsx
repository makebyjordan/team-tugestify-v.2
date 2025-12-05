import React from 'react';
import { Project } from '../types';
import { RefreshCw, Trash2, Archive, Calendar } from 'lucide-react';

interface ArchivedProps {
  projects: Project[];
  onUnarchive: (id: string) => void;
  onDeletePermanent: (id: string) => void;
}

export const Archived: React.FC<ArchivedProps> = ({ projects, onUnarchive, onDeletePermanent }) => {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Archive size={24} className="text-slate-400" />
            Proyectos Archivados
        </h2>
        <p className="text-slate-500 dark:text-slate-400">Gestiona los proyectos que han sido ocultados del panel principal.</p>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
            <Archive size={48} className="mb-4 opacity-50" />
            <p>No hay proyectos archivados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
                <div key={project.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 opacity-75 hover:opacity-100 transition-opacity">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-slate-800 dark:text-white text-lg">{project.title}</h3>
                        <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 px-2 py-1 rounded">Archivado</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex items-center text-xs text-slate-400 mb-6">
                        <Calendar size={12} className="mr-1" />
                        <span>{project.createdAt}</span>
                    </div>
                    
                    <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <button 
                            onClick={() => onUnarchive(project.id)}
                            className="flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors text-sm font-medium"
                        >
                            <RefreshCw size={16} />
                            <span>Recuperar</span>
                        </button>
                        <button 
                            onClick={() => onDeletePermanent(project.id)}
                            className="p-2 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
                            title="Eliminar permanentemente"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};