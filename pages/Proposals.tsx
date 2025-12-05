import React, { useState } from 'react';
import { Calendar, Clock, Plus, X, Check, XCircle, MessageSquare, HelpCircle, Trash2, Users, AlertTriangle, Palette, Code, TrendingUp, UserCheck, User, HelpCircleIcon } from 'lucide-react';
import { Proposal, ProposalCategory, ProposalResponseType, TeamMember } from '../types';

interface ProposalsProps {
  proposals: Proposal[];
  currentUser: TeamMember;
  onAdd: (proposal: Omit<Proposal, 'id' | 'responses'>) => void;
  onDelete: (id: string) => void;
  onRespond: (proposalId: string, response: ProposalResponseType) => void;
}

const CATEGORIES: { value: ProposalCategory; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'importante', label: 'Importante', icon: AlertTriangle, color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
  { value: 'diseño', label: 'Diseño', icon: Palette, color: 'text-pink-500 bg-pink-50 dark:bg-pink-900/20' },
  { value: 'desarrollo', label: 'Desarrollo', icon: Code, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
  { value: 'ventas', label: 'Ventas', icon: TrendingUp, color: 'text-green-500 bg-green-50 dark:bg-green-900/20' },
  { value: 'cliente', label: 'Cliente', icon: UserCheck, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' },
  { value: 'equipo', label: 'Equipo', icon: Users, color: 'text-violet-500 bg-violet-50 dark:bg-violet-900/20' },
  { value: 'alguien', label: 'Alguien', icon: User, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' },
  { value: 'otros', label: 'Otros', icon: HelpCircleIcon, color: 'text-slate-500 bg-slate-50 dark:bg-slate-800' },
];

const RESPONSE_OPTIONS: { value: ProposalResponseType; label: string; icon: React.ElementType; color: string }[] = [
  { value: 'ok', label: 'OK', icon: Check, color: 'bg-green-500 hover:bg-green-600 text-white' },
  { value: 'no_puedo', label: 'No puedo', icon: XCircle, color: 'bg-red-500 hover:bg-red-600 text-white' },
  { value: 'hablame_privado', label: 'Háblame privado', icon: MessageSquare, color: 'bg-blue-500 hover:bg-blue-600 text-white' },
  { value: 'decirme_despues', label: 'Decirme después', icon: HelpCircle, color: 'bg-amber-500 hover:bg-amber-600 text-white' },
];

export const Proposals: React.FC<ProposalsProps> = ({ proposals, currentUser, onAdd, onDelete, onRespond }) => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProposalCategory>('equipo');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !time) return;

    onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      date,
      time,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
    });

    setTitle('');
    setDescription('');
    setCategory('equipo');
    setDate('');
    setTime('');
    setShowForm(false);
  };

  const getCategoryInfo = (cat: ProposalCategory) => {
    return CATEGORIES.find(c => c.value === cat) || CATEGORIES[7];
  };

  const getUserResponse = (proposal: Proposal) => {
    return proposal.responses.find(r => r.userId === currentUser.id);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const getResponseLabel = (response: ProposalResponseType) => {
    return RESPONSE_OPTIONS.find(r => r.value === response)?.label || response;
  };

  const getResponseColor = (response: ProposalResponseType) => {
    const colors: Record<ProposalResponseType, string> = {
      'ok': 'text-green-600 bg-green-100 dark:bg-green-900/30',
      'no_puedo': 'text-red-600 bg-red-100 dark:bg-red-900/30',
      'hablame_privado': 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
      'decirme_despues': 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
    };
    return colors[response];
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Proposals</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Propuestas de reuniones del equipo</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200 dark:shadow-none"
          >
            <Plus size={18} />
            Nueva Propuesta
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Proponer Reunión</h2>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Título de la reunión *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Revisión de diseño del landing"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Descripción (opcional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detalles adicionales..."
                    rows={2}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Categoría *
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                          category === cat.value
                            ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                            : 'border-transparent bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600'
                        }`}
                      >
                        <cat.icon size={18} className={cat.color.split(' ')[0]} />
                        <span className="text-xs text-slate-600 dark:text-slate-300">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Fecha *
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Hora *
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors"
                  >
                    Proponer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Proposals List */}
        {proposals.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">No hay propuestas aún</h3>
            <p className="text-slate-500 dark:text-slate-500 text-sm">Sé el primero en proponer una reunión</p>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => {
              const catInfo = getCategoryInfo(proposal.category);
              const myResponse = getUserResponse(proposal);
              const isOwner = proposal.userId === currentUser.id;

              return (
                <div
                  key={proposal.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={proposal.userAvatar}
                        alt={proposal.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-white">{proposal.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Propuesto por {proposal.userName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${catInfo.color}`}>
                        <catInfo.icon size={12} />
                        {catInfo.label}
                      </span>
                      {isOwner && (
                        <button
                          onClick={() => onDelete(proposal.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {proposal.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 pl-13">
                      {proposal.description}
                    </p>
                  )}

                  {/* Date & Time */}
                  <div className="flex items-center gap-4 mb-4 pl-13">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                      <Calendar size={14} className="text-violet-500" />
                      {formatDate(proposal.date)}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                      <Clock size={14} className="text-violet-500" />
                      {proposal.time}
                    </div>
                  </div>

                  {/* Responses Section */}
                  <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                    {/* Show existing responses */}
                    {proposal.responses.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {proposal.responses.map((resp) => (
                          <div
                            key={resp.id}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${getResponseColor(resp.response)}`}
                          >
                            <img src={resp.userAvatar} alt={resp.userName} className="w-4 h-4 rounded-full" />
                            <span>{resp.userName.split(' ')[0]}</span>
                            <span className="opacity-70">• {getResponseLabel(resp.response)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Response buttons for non-owners */}
                    {!isOwner && (
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400 mr-2 self-center">
                          {myResponse ? 'Cambiar respuesta:' : 'Tu respuesta:'}
                        </span>
                        {RESPONSE_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => onRespond(proposal.id, opt.value)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              myResponse?.response === opt.value
                                ? opt.color + ' ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800'
                                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                            }`}
                          >
                            <opt.icon size={12} />
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Summary for owner */}
                    {isOwner && proposal.responses.length > 0 && (
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <span className="text-green-600">
                          {proposal.responses.filter(r => r.response === 'ok').length} OK
                        </span>
                        <span className="text-red-600">
                          {proposal.responses.filter(r => r.response === 'no_puedo').length} No pueden
                        </span>
                        <span className="text-blue-600">
                          {proposal.responses.filter(r => r.response === 'hablame_privado').length} Privado
                        </span>
                        <span className="text-amber-600">
                          {proposal.responses.filter(r => r.response === 'decirme_despues').length} Después
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
