
import React from 'react';
import { LayoutDashboard, Image, Type, Users, Sparkles, LogOut, ListTodo, FolderKanban, ChevronRight, Archive, MessageCircle, StickyNote, Share2, CalendarDays, Calendar } from 'lucide-react';
import { UserState, Project } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userState: UserState;
  onLogout: () => void;
  customSections: Project[];
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userState, onLogout, customSections }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Resumen', icon: LayoutDashboard },
    { id: 'chat', label: 'Chat de Equipo', icon: MessageCircle },
    { id: 'progress', label: 'Progreso', icon: ListTodo },
    { id: 'assets', label: 'Recursos', icon: Image },
    { id: 'notas-checks', label: 'Notas & Checks', icon: StickyNote },
    { id: 'nocheck-comun', label: 'NoCheck Común', icon: Share2 },
    { id: 'agendarme', label: 'Agendarme', icon: CalendarDays },
    { id: 'calendario', label: 'Calendario', icon: Calendar },
    { id: 'brand', label: 'Kit de Marca', icon: Type },
    { id: 'ai', label: 'Asistente IA', icon: Sparkles },
    { id: 'team', label: 'Equipo', icon: Users },
    { id: 'archived', label: 'Archivados', icon: Archive },
  ];

  return (
    <div className="w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-colors duration-300 flex-shrink-0">
      <div className="p-6 flex items-center">
        <img 
          src="/media/tugestify-alpha.png" 
          alt="Tugestify" 
          className="h-14 object-contain"
        />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="flex flex-col items-center mb-8">
           <img 
            src={userState.currentUser?.avatar} 
            alt="Profile" 
            className="w-20 h-20 rounded-full border-4 border-violet-100 dark:border-slate-800 mb-3 object-cover"
          />
          <h3 className="font-semibold text-slate-800 dark:text-white">{userState.currentUser?.name}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{userState.currentUser?.role}</p>
        </div>

        <nav className="space-y-2 mb-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-none'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-violet-600 dark:hover:text-violet-400'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
              {item.id === 'assets' && (
                <span className="ml-auto w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse"></span>
              )}
            </button>
          ))}
        </nav>

        {customSections.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-300">
                <p className="text-xs font-bold text-slate-400 uppercase mb-4 px-2">Espacios de Trabajo</p>
                <div className="space-y-2">
                    {customSections.map(project => (
                        <button
                            key={project.id}
                            onClick={() => setActiveTab(`project-${project.id}`)}
                            className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                                activeTab === `project-${project.id}`
                                ? 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-300 border border-violet-100 dark:border-violet-700'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                        >
                            <FolderKanban size={18} className={activeTab === `project-${project.id}` ? 'text-violet-500' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'} />
                            <span className="font-medium text-sm truncate">{project.title}</span>
                            {activeTab === `project-${project.id}` && <ChevronRight size={14} className="ml-auto opacity-50" />}
                        </button>
                    ))}
                </div>
            </div>
        )}
      </div>

      <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
        <button 
            onClick={onLogout}
            className="flex items-center space-x-3 text-rose-500 hover:text-rose-600 transition-colors w-full"
        >
            <LogOut size={20} />
            <span>Salir</span>
        </button>
      </div>
    </div>
  );
};
