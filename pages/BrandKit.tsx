import React, { useState } from 'react';
import { BrandItem } from '../types';
import { Copy, Plus, Hash, Type, Key, X, Eye, Upload, Image, FileText, Tags, FolderPlus, Edit3, Trash2 } from 'lucide-react';

interface BrandKitProps {
  items: BrandItem[];
  onAddItem: (item: BrandItem) => void;
}

export const BrandKit: React.FC<BrandKitProps> = ({ items, onAddItem }) => {
  const [newItemContent, setNewItemContent] = useState('');
  const [activeType, setActiveType] = useState<'text' | 'hashtag' | 'keyword' | 'file'>('hashtag');
  const [viewingItem, setViewingItem] = useState<BrandItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Categorías predefinidas
  const defaultCategories = ['hashtag', 'keyword', 'text', 'file'];
  const allCategories = [...defaultCategories, ...customCategories];

  const handleAdd = () => {
    if (!newItemContent.trim() && activeType !== 'file') return;
    if (activeType === 'file' && !fileUrl.trim()) return;

    const newItem: BrandItem = {
      id: Date.now().toString(),
      type: activeType,
      content: activeType === 'file'
        ? (fileName || fileUrl)
        : (activeType === 'hashtag' && !newItemContent.startsWith('#') ? `#${newItemContent}` : newItemContent),
      tags: customTags.length > 0 ? customTags : undefined
    };

    // Si es un archivo, agregar metadata
    if (activeType === 'file') {
      (newItem as any).fileUrl = fileUrl;
      (newItem as any).fileName = fileName || 'Archivo sin nombre';
    }

    onAddItem(newItem);
    resetForm();
  };

  const resetForm = () => {
    setNewItemContent('');
    setCustomTags([]);
    setFileUrl('');
    setFileName('');
    setIsModalOpen(false);
  };

  const addTag = () => {
    if (currentTag.trim() && !customTags.includes(currentTag.trim())) {
      setCustomTags([...customTags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tag: string) => {
    setCustomTags(customTags.filter(t => t !== tag));
  };

  const addCategory = () => {
    if (newCategoryName.trim() && !customCategories.includes(newCategoryName.trim())) {
      setCustomCategories([...customCategories, newCategoryName.trim()]);
      setNewCategoryName('');
      setShowCategoryModal(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleItemClick = (item: BrandItem) => {
    if (item.type === 'text' || item.type === 'file') {
      setViewingItem(item);
    } else {
      copyToClipboard(item.content);
    }
  };

  const openAdvancedModal = () => {
    setIsModalOpen(true);
  };

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'hashtag': return Hash;
      case 'keyword': return Key;
      case 'text': return Type;
      case 'file': return FileText;
      default: return FolderPlus;
    }
  };

  const getCategoryTitle = (type: string) => {
    switch (type) {
      case 'hashtag': return 'Hashtags';
      case 'keyword': return 'Palabras Clave';
      case 'text': return 'Fragmentos de Texto';
      case 'file': return 'Archivos';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const renderSection = (title: string, type: string, icon: any) => {
    const filteredItems = items.filter(i => i.type === type);
    const Icon = icon;

    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-lg">
              <Icon size={20} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{title}</h3>
            <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 px-2 py-1 rounded-full">{filteredItems.length}</span>
          </div>

          {!defaultCategories.includes(type) && (
            <button className="text-slate-400 hover:text-rose-500 transition-colors">
              <Trash2 size={16} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={`group cursor-pointer bg-slate-50 hover:bg-violet-50 dark:bg-slate-700 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 px-4 py-2 rounded-lg transition-all ${type === 'text' || type === 'file' ? 'max-w-full sm:max-w-md' : ''}`}
            >
              <div className="flex items-center space-x-2">
                {type === 'file' && <FileText size={16} className="text-violet-500 flex-shrink-0" />}
                <span className={`text-sm font-medium text-slate-700 dark:text-slate-200 ${type === 'text' || type === 'file' ? 'truncate block max-w-[280px]' : ''}`}>
                  {item.content}
                </span>
                {type === 'text' || type === 'file' ? (
                  <Eye size={14} className="opacity-0 group-hover:opacity-100 text-violet-500 transition-opacity flex-shrink-0" />
                ) : (
                  <Copy size={14} className="opacity-0 group-hover:opacity-100 text-violet-500 transition-opacity flex-shrink-0" />
                )}
              </div>
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-xs bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {filteredItems.length === 0 && <p className="text-sm text-slate-400 italic">No hay items aún.</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 h-full overflow-y-auto relative">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Kit de Marca</h2>
          <p className="text-slate-500 dark:text-slate-400">Repositorio centralizado para textos, archivos y recursos de marca.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowCategoryModal(true)}
            className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors font-medium"
          >
            <FolderPlus size={18} />
            <span>Nueva Categoría</span>
          </button>

          <button
            onClick={openAdvancedModal}
            className="flex items-center space-x-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all font-medium"
          >
            <Plus size={18} />
            <span>Añadir con Tags</span>
          </button>
        </div>
      </div>

      {/* Quick Add Input */}
      <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-6 rounded-2xl text-white shadow-lg mb-8">
        <h3 className="font-semibold mb-4">Añadir Rápido</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex bg-white/10 backdrop-blur-md rounded-xl p-1 flex-wrap">
            <button
              onClick={() => setActiveType('hashtag')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeType === 'hashtag' ? 'bg-white text-violet-600 shadow-sm' : 'text-white/70 hover:text-white'}`}
            >Hashtag</button>
            <button
              onClick={() => setActiveType('keyword')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeType === 'keyword' ? 'bg-white text-violet-600 shadow-sm' : 'text-white/70 hover:text-white'}`}
            >Palabra</button>
            <button
              onClick={() => setActiveType('text')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeType === 'text' ? 'bg-white text-violet-600 shadow-sm' : 'text-white/70 hover:text-white'}`}
            >Texto</button>
            <button
              onClick={() => setActiveType('file')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeType === 'file' ? 'bg-white text-violet-600 shadow-sm' : 'text-white/70 hover:text-white'}`}
            >Archivo</button>
          </div>
          <div className="flex-1 flex bg-white rounded-xl overflow-hidden shadow-inner">
            <input
              type="text"
              value={activeType === 'file' ? fileUrl : newItemContent}
              onChange={(e) => activeType === 'file' ? setFileUrl(e.target.value) : setNewItemContent(e.target.value)}
              placeholder={activeType === 'file' ? 'URL del archivo...' : `Escribe nuevo ${activeType}...`}
              className="flex-1 px-4 py-3 text-slate-800 outline-none placeholder:text-slate-400"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <button
              onClick={handleAdd}
              className="bg-slate-900 hover:bg-black text-white px-6 font-medium transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Render all sections */}
      {allCategories.map(category => {
        const Icon = getCategoryIcon(category);
        const title = getCategoryTitle(category);
        return renderSection(title, category, Icon);
      })}

      {/* Advanced Modal with Tags */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-violet-200 dark:border-slate-700">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-slate-900 dark:to-slate-900">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xl text-slate-800 dark:text-white flex items-center space-x-2">
                  <Upload size={24} className="text-violet-600" />
                  <span>Añadir a Kit de Marca</span>
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tipo de Contenido</label>
                <div className="grid grid-cols-4 gap-2">
                  {['hashtag', 'keyword', 'text', 'file'].map(type => (
                    <button
                      key={type}
                      onClick={() => setActiveType(type as any)}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeType === type
                          ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                        }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contenido o URL */}
              {activeType === 'file' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">URL del Archivo</label>
                    <input
                      type="url"
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                      placeholder="https://ejemplo.com/archivo.pdf"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nombre del Archivo (opcional)</label>
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                      placeholder="Ej: Logo Principal 2024"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Contenido</label>
                  {activeType === 'text' ? (
                    <textarea
                      value={newItemContent}
                      onChange={(e) => setNewItemContent(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none"
                      rows={4}
                      placeholder="Escribe el fragmento de texto..."
                    />
                  ) : (
                    <input
                      type="text"
                      value={newItemContent}
                      onChange={(e) => setNewItemContent(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                      placeholder={`Escribe el ${activeType}...`}
                    />
                  )}
                </div>
              )}

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center space-x-2">
                  <Tags size={16} />
                  <span>Etiquetas (opcional)</span>
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-violet-500 transition-all"
                    placeholder="Escribe una etiqueta y presiona Enter"
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors font-medium"
                  >
                    Añadir
                  </button>
                </div>
                {customTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {customTags.map(tag => (
                      <span key={tag} className="inline-flex items-center space-x-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-3 py-1 rounded-full text-sm font-medium">
                        <span>{tag}</span>
                        <button onClick={() => removeTag(tag)} className="hover:text-violet-900 dark:hover:text-violet-100">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAdd}
                className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl hover:shadow-lg hover:shadow-violet-500/25 transition-all font-medium"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Creation Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-violet-200 dark:border-slate-700">
            <h3 className="font-bold text-xl text-slate-800 dark:text-white mb-4 flex items-center space-x-2">
              <FolderPlus size={24} className="text-violet-600" />
              <span>Nueva Categoría</span>
            </h3>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCategory()}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all mb-4"
              placeholder="Ej: Logotipos, Paletas de Color, etc."
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-6 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={addCategory}
                className="px-6 py-2.5 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors font-medium"
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Item Modal */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center space-x-2 text-violet-600 dark:text-violet-400">
                {viewingItem.type === 'file' ? <FileText size={20} /> : <Type size={20} />}
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">
                  {viewingItem.type === 'file' ? 'Archivo' : 'Fragmento de Texto'}
                </h3>
              </div>
              <button
                onClick={() => setViewingItem(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {viewingItem.type === 'file' ? (
                <div className="space-y-4">
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                    <p className="text-sm text-slate-500 mb-2">Nombre:</p>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">{(viewingItem as any).fileName || viewingItem.content}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                    <p className="text-sm text-slate-500 mb-2">URL:</p>
                    <a href={(viewingItem as any).fileUrl} target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:text-violet-700 break-all">
                      {(viewingItem as any).fileUrl}
                    </a>
                  </div>
                  {viewingItem.tags && viewingItem.tags.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                      <p className="text-sm text-slate-500 mb-2">Etiquetas:</p>
                      <div className="flex flex-wrap gap-2">
                        {viewingItem.tags.map(tag => (
                          <span key={tag} className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-3 py-1 rounded-full text-sm font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {viewingItem.content}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end gap-3">
              {viewingItem.type === 'file' && (
                <a
                  href={(viewingItem as any).fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-xl transition-colors font-medium"
                >
                  <Eye size={18} />
                  <span>Ver Archivo</span>
                </a>
              )}
              <button
                onClick={() => copyToClipboard(viewingItem.type === 'file' ? (viewingItem as any).fileUrl : viewingItem.content)}
                className="flex items-center space-x-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl transition-colors font-medium shadow-lg shadow-violet-500/20"
              >
                <Copy size={18} />
                <span>Copiar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};