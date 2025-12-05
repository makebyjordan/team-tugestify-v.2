
import React from 'react';
import { Search, Bell, Moon, Sun } from 'lucide-react';
import { ThemeMode } from '../types';

interface TopBarProps {
  title: string;
  theme: ThemeMode;
  toggleTheme: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ title, theme, toggleTheme }) => {
  const getTitle = (id: string) => {
    switch(id) {
        case 'dashboard': return 'Resumen';
        case 'chat': return 'Chat de Equipo';
        case 'progress': return 'Progreso de Proyectos';
        case 'assets': return 'Recursos';
        case 'notas-checks': return 'Mis Notas & Checks';
        case 'nocheck-comun': return 'NoCheck Común';
        case 'agendarme': return 'Mi Agenda';
        case 'calendario': return 'Calendario del Equipo';
        case 'brand': return 'Kit de Marca';
        case 'ai': return 'Asistente IA';
        case 'team': return 'Equipo';
        case 'archived': return 'Proyectos Archivados';
        default: return id;
    }
  }

  return (
    <div className="h-20 px-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 transition-colors duration-300 flex-shrink-0">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white hidden md:block capitalize">
        {getTitle(title)}
      </h1>

      <div className="flex items-center space-x-6 ml-auto">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar archivos, etiquetas..." 
            className="pl-10 pr-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-violet-500 w-64 transition-all"
          />
        </div>

        <button className="relative text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>

        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700"></div>

        <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-slate-500 uppercase dark:text-slate-400 mr-2">
                Modo {theme === 'light' ? 'Claro' : 'Oscuro'}
            </span>
            <button 
                onClick={toggleTheme}
                className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 flex items-center ${theme === 'dark' ? 'bg-violet-600 justify-end' : 'bg-slate-200 justify-start'}`}
            >
                <div className="w-5 h-5 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-800">
                    {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />}
                </div>
            </button>
        </div>
      </div>
    </div>
  );
};
