import React, { useState } from 'react';
import { AgendaItem, AgendaType } from '../types';
import { ChevronLeft, ChevronRight, Calendar, Clock, Phone, CheckCircle, Users, Lightbulb, Video, HelpCircle } from 'lucide-react';

interface CalendarioProps {
  items: AgendaItem[];
}

const TYPE_CONFIG: Record<AgendaType, { icon: React.ElementType; color: string; bgColor: string }> = {
  llamar: { icon: Phone, color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  hacer: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  equipo: { icon: Users, color: 'text-violet-600', bgColor: 'bg-violet-100 dark:bg-violet-900/30' },
  proponer: { icon: Lightbulb, color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
  reunion: { icon: Video, color: 'text-rose-600', bgColor: 'bg-rose-100 dark:bg-rose-900/30' },
  otro: { icon: HelpCircle, color: 'text-slate-600', bgColor: 'bg-slate-100 dark:bg-slate-700' },
};

const DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export const Calendario: React.FC<CalendarioProps> = ({ items }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and total days
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  
  // Adjust for Monday start (0 = Monday, 6 = Sunday)
  let startDay = firstDayOfMonth.getDay() - 1;
  if (startDay < 0) startDay = 6;

  // Get items for a specific date
  const getItemsForDate = (dateStr: string) => {
    return items.filter(item => item.date === dateStr);
  };

  // Generate calendar days
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
  };

  const formatDateStr = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const selectedItems = selectedDate ? getItemsForDate(selectedDate) : [];

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white">
              <Calendar size={24} />
            </div>
            Calendario del Equipo
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Vista general de todos los agendamientos</p>
        </div>
        <button 
          onClick={goToToday}
          className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-colors"
        >
          Hoy
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={goToPrevMonth}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              <ChevronLeft size={24} className="text-slate-600 dark:text-slate-400" />
            </button>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              {MONTHS[month]} {year}
            </h3>
            <button 
              onClick={goToNextMonth}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              <ChevronRight size={24} className="text-slate-600 dark:text-slate-400" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map(day => (
              <div key={day} className="text-center text-sm font-medium text-slate-500 dark:text-slate-400 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const dateStr = formatDateStr(day);
              const dayItems = getItemsForDate(dateStr);
              const hasItems = dayItems.length > 0;
              const isSelected = selectedDate === dateStr;
              const isTodayDate = isToday(day);

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`aspect-square p-1 rounded-xl transition-all relative flex flex-col items-center justify-start pt-2 ${
                    isSelected 
                      ? 'bg-indigo-600 text-white' 
                      : isTodayDate
                        ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className={`text-sm font-medium ${isSelected ? 'text-white' : ''}`}>{day}</span>
                  
                  {hasItems && (
                    <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                      {dayItems.slice(0, 3).map((item, i) => (
                        <div 
                          key={i} 
                          className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : TYPE_CONFIG[item.type].color.replace('text-', 'bg-')}`}
                        />
                      ))}
                      {dayItems.length > 3 && (
                        <span className={`text-[8px] ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>+{dayItems.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
            {selectedDate 
              ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
              : 'Selecciona un día'
            }
          </h3>

          {!selectedDate ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Calendar size={40} className="mb-3 opacity-50" />
              <p className="text-sm text-center">Haz clic en un día para ver los eventos</p>
            </div>
          ) : selectedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Calendar size={40} className="mb-3 opacity-50" />
              <p className="text-sm">Sin eventos este día</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {selectedItems
                .sort((a, b) => a.time.localeCompare(b.time))
                .map(item => {
                  const config = TYPE_CONFIG[item.type];
                  const Icon = config.icon;
                  return (
                    <div 
                      key={item.id} 
                      className={`p-4 rounded-xl ${config.bgColor} border border-slate-200 dark:border-slate-700`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 bg-white dark:bg-slate-800 rounded-lg ${config.color}`}>
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-800 dark:text-white text-sm">{item.title}</h4>
                          {item.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                              <Clock size={12} />
                              {item.time}
                            </span>
                            <div className="flex items-center gap-1">
                              <img src={item.userAvatar} alt={item.userName} className="w-4 h-4 rounded-full" />
                              <span className="text-xs text-slate-500 dark:text-slate-400">{item.userName}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex flex-wrap items-center gap-6 justify-center">
          {Object.entries(TYPE_CONFIG).map(([type, config]) => {
            const Icon = config.icon;
            return (
              <div key={type} className="flex items-center gap-2">
                <div className={`p-1.5 ${config.bgColor} rounded-lg ${config.color}`}>
                  <Icon size={14} />
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">{type}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
