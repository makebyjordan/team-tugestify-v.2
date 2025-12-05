import React, { useState } from 'react';
import { AgendaItem, AgendaType, TeamMember } from '../types';
import { Plus, Calendar, Clock, X, Save, MoreVertical, Edit3, Trash2, Phone, CheckCircle, Users, Lightbulb, Video, HelpCircle } from 'lucide-react';

interface AgendarmeProps {
  items: AgendaItem[];
  currentUser: TeamMember;
  onAdd: (item: AgendaItem) => void;
  onUpdate: (item: AgendaItem) => void;
  onDelete: (id: string) => void;
}

const TYPE_OPTIONS: { value: AgendaType; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'llamar', label: 'Llamar', icon: Phone, color: 'bg-blue-500' },
  { value: 'hacer', label: 'Hacer', icon: CheckCircle, color: 'bg-green-500' },
  { value: 'equipo', label: 'Equipo', icon: Users, color: 'bg-violet-500' },
  { value: 'proponer', label: 'Proponer', icon: Lightbulb, color: 'bg-amber-500' },
  { value: 'reunion', label: 'Reunión', icon: Video, color: 'bg-rose-500' },
  { value: 'otro', label: 'Otro', icon: HelpCircle, color: 'bg-slate-500' },
];

export const Agendarme: React.FC<AgendarmeProps> = ({ 
  items, 
  currentUser, 
  onAdd, 
  onUpdate, 
  onDelete 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AgendaItem | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formType, setFormType] = useState<AgendaType>('hacer');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');

  // Filter only current user's items
  const myItems = items.filter(i => i.userId === currentUser.id);

  // Group by date
  const groupedItems = myItems.reduce((acc, item) => {
    if (!acc[item.date]) acc[item.date] = [];
    acc[item.date].push(item);
    return acc;
  }, {} as Record<string, AgendaItem[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedItems).sort();

  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormType('hacer');
    setFormDate('');
    setFormTime('');
    setEditingItem(null);
  };

  const openCreate = () => {
    resetForm();
    // Default to today
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormTime('09:00');
    setShowModal(true);
  };

  const openEdit = (item: AgendaItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormDescription(item.description);
    setFormType(item.type);
    setFormDate(item.date);
    setFormTime(item.time);
    setShowModal(true);
    setActiveMenu(null);
  };

  const handleSave = () => {
    if (!formTitle.trim() || !formDate || !formTime) return;

    const itemData: AgendaItem = {
      id: editingItem?.id || Date.now().toString(),
      title: formTitle.trim(),
      description: formDescription.trim(),
      type: formType,
      date: formDate,
      time: formTime,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      createdAt: editingItem?.createdAt || new Date().toISOString()
    };

    if (editingItem) {
      onUpdate(itemData);
    } else {
      onAdd(itemData);
    }

    setShowModal(false);
    resetForm();
  };

  const getTypeConfig = (type: AgendaType) => {
    return TYPE_OPTIONS.find(t => t.value === type) || TYPE_OPTIONS[5];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.getTime() === today.getTime()) return 'Hoy';
    if (date.getTime() === tomorrow.getTime()) return 'Mañana';

    return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl text-white">
              <Calendar size={24} />
            </div>
            Mi Agenda
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Organiza tus actividades y compromisos</p>
        </div>
        <button 
          onClick={openCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-5 py-2.5 rounded-xl transition-all font-medium shadow-lg shadow-cyan-500/25"
        >
          <Plus size={18} />
          Agendar
        </button>
      </div>

      {myItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
          <Calendar size={48} className="mb-4 opacity-50" />
          <p className="text-lg font-medium">Sin agendamientos</p>
          <p className="text-sm">Crea tu primer evento para empezar</p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedDates.map(date => (
            <div key={date}>
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mb-4 flex items-center gap-2">
                <Calendar size={16} />
                {formatDate(date)}
              </h3>
              <div className="space-y-3">
                {groupedItems[date]
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map(item => {
                    const typeConfig = getTypeConfig(item.type);
                    const TypeIcon = typeConfig.icon;
                    return (
                      <div 
                        key={item.id} 
                        className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:shadow-lg transition-all flex items-start gap-4"
                      >
                        <div className={`p-3 ${typeConfig.color} rounded-xl text-white flex-shrink-0`}>
                          <TypeIcon size={20} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-bold text-slate-800 dark:text-white">{item.title}</h4>
                              {item.description && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{item.description}</p>
                              )}
                            </div>
                            
                            {/* Menu */}
                            <div className="relative flex-shrink-0">
                              <button 
                                onClick={() => setActiveMenu(activeMenu === item.id ? null : item.id)}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                              >
                                <MoreVertical size={18} className="text-slate-400" />
                              </button>
                              
                              {activeMenu === item.id && (
                                <div className="absolute right-0 top-8 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-10 min-w-[120px]">
                                  <button 
                                    onClick={() => openEdit(item)}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                                  >
                                    <Edit3 size={16} /> Editar
                                  </button>
                                  <button 
                                    onClick={() => { onDelete(item.id); setActiveMenu(null); }}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-rose-600"
                                  >
                                    <Trash2 size={16} /> Eliminar
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-3">
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                              <Clock size={14} />
                              {item.time}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 ${typeConfig.color} bg-opacity-20 text-xs rounded-full font-medium`} style={{ color: typeConfig.color.replace('bg-', '').includes('slate') ? '#64748b' : undefined }}>
                              {typeConfig.label}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Calendar className="text-cyan-500" size={22} />
                {editingItem ? 'Editar Evento' : 'Nuevo Evento'}
              </h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Título *</label>
                <input 
                  type="text"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none dark:text-white"
                  placeholder="¿Qué necesitas hacer?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Descripción</label>
                <textarea 
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none dark:text-white resize-none"
                  placeholder="Detalles adicionales..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 mb-2">Tipo</label>
                <div className="grid grid-cols-3 gap-2">
                  {TYPE_OPTIONS.map(opt => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormType(opt.value)}
                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                          formType === opt.value 
                            ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' 
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className={`p-2 ${opt.color} rounded-lg text-white`}>
                          <Icon size={16} />
                        </div>
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Fecha *</label>
                  <input 
                    type="date"
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Hora *</label>
                  <input 
                    type="time"
                    value={formTime}
                    onChange={e => setFormTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-cyan-500 outline-none dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-slate-100 dark:border-slate-700">
              <button 
                onClick={() => { setShowModal(false); resetForm(); }}
                className="flex-1 px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                disabled={!formTitle.trim() || !formDate || !formTime}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-slate-300 disabled:to-slate-400 text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
              >
                <Save size={18} />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
