import React from 'react';
import { NoteCheck, TeamMember } from '../types';
import { StickyNote, CheckSquare, Users, Share2 } from 'lucide-react';

interface NoCheckComunProps {
  notes: NoteCheck[];
  currentUser: TeamMember;
  onToggleCheckItem: (noteId: string, itemId: string) => void;
}

export const NoCheckComun: React.FC<NoCheckComunProps> = ({ 
  notes, 
  currentUser,
  onToggleCheckItem 
}) => {
  // Filter only published notes
  const publishedNotes = notes.filter(n => n.isPublished);

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white">
              <Users size={24} />
            </div>
            NoCheck Común
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Notas y checklists compartidos por el equipo</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
          <Share2 className="text-green-600 dark:text-green-400" size={18} />
          <span className="text-sm font-medium text-green-700 dark:text-green-400">{publishedNotes.length} publicaciones</span>
        </div>
      </div>

      {publishedNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
          <Share2 size={48} className="mb-4 opacity-50" />
          <p className="text-lg font-medium">No hay publicaciones aún</p>
          <p className="text-sm text-center max-w-md">
            Las notas y checklists que el equipo publique aparecerán aquí para que todos puedan verlas
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedNotes.map(note => (
            <div 
              key={note.id} 
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all overflow-hidden"
            >
              {/* Header */}
              <div className={`px-5 py-4 border-b ${note.type === 'note' ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30' : 'bg-violet-50 dark:bg-violet-900/20 border-violet-100 dark:border-violet-900/30'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {note.type === 'note' ? (
                      <StickyNote className="text-amber-500" size={20} />
                    ) : (
                      <CheckSquare className="text-violet-500" size={20} />
                    )}
                    <h3 className="font-bold text-slate-800 dark:text-white">{note.title}</h3>
                  </div>
                </div>
                
                {/* Author */}
                <div className="flex items-center gap-2 mt-3">
                  <img src={note.userAvatar} alt={note.userName} className="w-6 h-6 rounded-full object-cover" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">{note.userName}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {note.type === 'note' ? (
                  <p className="text-slate-600 dark:text-slate-300 text-sm whitespace-pre-wrap">{note.content}</p>
                ) : (
                  <div className="space-y-2">
                    {note.items?.map(item => (
                      <label 
                        key={item.id} 
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input 
                          type="checkbox" 
                          checked={item.completed}
                          onChange={() => onToggleCheckItem(note.id, item.id)}
                          className="w-5 h-5 rounded-md border-2 border-slate-300 dark:border-slate-600 text-violet-600 focus:ring-violet-500"
                        />
                        <span className={`text-sm ${item.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {item.text}
                        </span>
                      </label>
                    ))}
                    {note.items && note.items.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">
                            {note.items.filter(i => i.completed).length}/{note.items.length} completadas
                          </span>
                          <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all"
                              style={{ width: `${(note.items.filter(i => i.completed).length / note.items.length) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
                <span className="text-xs text-slate-400">{note.createdAt}</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                  <Share2 size={10} /> Público
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
