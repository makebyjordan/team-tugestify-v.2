import React, { useState } from 'react';
import { NoteCheck, CheckItem, TeamMember } from '../types';
import { Plus, StickyNote, CheckSquare, MoreVertical, Edit3, Trash2, Share2, X, Save } from 'lucide-react';

interface NotasChecksProps {
  notes: NoteCheck[];
  currentUser: TeamMember;
  onAdd: (note: NoteCheck) => void;
  onUpdate: (note: NoteCheck) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
}

export const NotasChecks: React.FC<NotasChecksProps> = ({ 
  notes, 
  currentUser, 
  onAdd, 
  onUpdate, 
  onDelete,
  onPublish 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState<NoteCheck | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  // Form state
  const [formType, setFormType] = useState<'note' | 'checklist'>('note');
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formItems, setFormItems] = useState<CheckItem[]>([]);
  const [newItemText, setNewItemText] = useState('');

  // Filter only current user's notes
  const myNotes = notes.filter(n => n.userId === currentUser.id);

  const resetForm = () => {
    setFormType('note');
    setFormTitle('');
    setFormContent('');
    setFormItems([]);
    setNewItemText('');
    setEditingNote(null);
  };

  const openCreate = (type: 'note' | 'checklist') => {
    resetForm();
    setFormType(type);
    setShowModal(true);
  };

  const openEdit = (note: NoteCheck) => {
    setEditingNote(note);
    setFormType(note.type);
    setFormTitle(note.title);
    setFormContent(note.content || '');
    setFormItems(note.items || []);
    setShowModal(true);
    setActiveMenu(null);
  };

  const addCheckItem = () => {
    if (newItemText.trim()) {
      setFormItems([...formItems, { id: Date.now().toString(), text: newItemText.trim(), completed: false }]);
      setNewItemText('');
    }
  };

  const toggleCheckItem = (itemId: string) => {
    setFormItems(formItems.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ));
  };

  const removeCheckItem = (itemId: string) => {
    setFormItems(formItems.filter(item => item.id !== itemId));
  };

  const handleSave = () => {
    if (!formTitle.trim()) return;

    const noteData: NoteCheck = {
      id: editingNote?.id || Date.now().toString(),
      type: formType,
      title: formTitle.trim(),
      content: formType === 'note' ? formContent : undefined,
      items: formType === 'checklist' ? formItems : undefined,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      createdAt: editingNote?.createdAt || new Date().toLocaleDateString(),
      isPublished: editingNote?.isPublished || false
    };

    if (editingNote) {
      onUpdate(noteData);
    } else {
      onAdd(noteData);
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    setActiveMenu(null);
  };

  const handlePublish = (id: string) => {
    onPublish(id);
    setActiveMenu(null);
  };

  // Toggle check item in view (not in modal)
  const toggleViewCheckItem = (note: NoteCheck, itemId: string) => {
    const updatedItems = note.items?.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    onUpdate({ ...note, items: updatedItems });
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Mis Notas & Checks</h2>
          <p className="text-slate-500 dark:text-slate-400">Tu espacio privado para organizar ideas y tareas</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => openCreate('note')}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl transition-all font-medium"
          >
            <StickyNote size={18} />
            Nueva Nota
          </button>
          <button 
            onClick={() => openCreate('checklist')}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-xl transition-all font-medium"
          >
            <CheckSquare size={18} />
            Nuevo Check
          </button>
        </div>
      </div>

      {myNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
          <StickyNote size={48} className="mb-4 opacity-50" />
          <p className="text-lg font-medium">No tienes notas aún</p>
          <p className="text-sm">Crea una nota o checklist para empezar</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myNotes.map(note => (
            <div 
              key={note.id} 
              className={`relative bg-white dark:bg-slate-800 rounded-2xl border ${note.isPublished ? 'border-green-300 dark:border-green-700' : 'border-slate-200 dark:border-slate-700'} shadow-sm hover:shadow-lg transition-all overflow-hidden`}
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
                  
                  {/* Menu */}
                  <div className="relative">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === note.id ? null : note.id)}
                      className="p-1 hover:bg-white/50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <MoreVertical size={18} className="text-slate-500" />
                    </button>
                    
                    {activeMenu === note.id && (
                      <div className="absolute right-0 top-8 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-10 min-w-[150px]">
                        <button 
                          onClick={() => openEdit(note)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                        >
                          <Edit3 size={16} /> Editar
                        </button>
                        <button 
                          onClick={() => handlePublish(note.id)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-green-600 dark:text-green-400"
                        >
                          <Share2 size={16} /> {note.isPublished ? 'Despublicar' : 'Publicar'}
                        </button>
                        <button 
                          onClick={() => handleDelete(note.id)}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-rose-600"
                        >
                          <Trash2 size={16} /> Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {note.isPublished && (
                  <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full">
                    <Share2 size={12} /> Publicado
                  </span>
                )}
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
                          onChange={() => toggleViewCheckItem(note, item.id)}
                          className="w-5 h-5 rounded-md border-2 border-slate-300 dark:border-slate-600 text-violet-600 focus:ring-violet-500"
                        />
                        <span className={`text-sm ${item.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {item.text}
                        </span>
                      </label>
                    ))}
                    {note.items && note.items.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                        <span className="text-xs text-slate-400">
                          {note.items.filter(i => i.completed).length}/{note.items.length} completadas
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/50 text-xs text-slate-400">
                {note.createdAt}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                {formType === 'note' ? (
                  <><StickyNote className="text-amber-500" size={22} /> {editingNote ? 'Editar Nota' : 'Nueva Nota'}</>
                ) : (
                  <><CheckSquare className="text-violet-500" size={22} /> {editingNote ? 'Editar Checklist' : 'Nuevo Checklist'}</>
                )}
              </h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Título</label>
                <input 
                  type="text"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 outline-none dark:text-white"
                  placeholder="Título de la nota..."
                />
              </div>

              {formType === 'note' ? (
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Contenido</label>
                  <textarea 
                    value={formContent}
                    onChange={e => setFormContent(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 outline-none dark:text-white resize-none"
                    placeholder="Escribe tu nota aquí..."
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-2">Items del checklist</label>
                  
                  {/* Existing items */}
                  <div className="space-y-2 mb-4">
                    {formItems.map(item => (
                      <div key={item.id} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900 px-4 py-2.5 rounded-xl">
                        <input 
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleCheckItem(item.id)}
                          className="w-5 h-5 rounded-md border-2 border-slate-300 dark:border-slate-600 text-violet-600"
                        />
                        <span className={`flex-1 text-sm ${item.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {item.text}
                        </span>
                        <button onClick={() => removeCheckItem(item.id)} className="text-slate-400 hover:text-rose-500">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add new item */}
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      value={newItemText}
                      onChange={e => setNewItemText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addCheckItem()}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 outline-none dark:text-white text-sm"
                      placeholder="Añadir item..."
                    />
                    <button 
                      onClick={addCheckItem}
                      className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              )}
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
                disabled={!formTitle.trim()}
                className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
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
