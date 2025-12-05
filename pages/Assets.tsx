
import React, { useState, useRef } from 'react';
import { Asset, AssetCategory } from '../types';
import { AssetCard } from '../components/AssetCard';
import { Upload, Filter, X, Save, Download, Plus, Tag, FolderPlus } from 'lucide-react';

interface AssetsProps {
  assets: Asset[];
  onUpload: (newAsset: Asset) => void;
  onDelete: (id: string) => void;
  onUpdate: (asset: Asset) => void;
  currentUser: string;
}

const DEFAULT_CATEGORIES: { id: string; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'icons', label: 'Iconos' },
  { id: 'flyers', label: 'Folletos' },
  { id: 'infographics', label: 'Infografías' },
  { id: 'web-screenshots', label: 'Capturas Web' },
];

const SUGGESTED_TAGS = ['logo', 'branding', 'urgente', 'aprobado', 'borrador', 'final', 'redes sociales', 'web', 'print', 'cliente'];

export const Assets: React.FC<AssetsProps> = ({ assets, onUpload, onDelete, onUpdate, currentUser }) => {
  const [filter, setFilter] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Custom categories
  const [customCategories, setCustomCategories] = useState<{ id: string; label: string }[]>(() => {
    const saved = localStorage.getItem('customCategories');
    return saved ? JSON.parse(saved) : [];
  });
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const allCategories = [...DEFAULT_CATEGORIES, ...customCategories];
  
  const addCategory = () => {
    if (newCategoryName.trim()) {
      const id = newCategoryName.trim().toLowerCase().replace(/\s+/g, '-');
      const newCat = { id, label: newCategoryName.trim() };
      const updated = [...customCategories, newCat];
      setCustomCategories(updated);
      localStorage.setItem('customCategories', JSON.stringify(updated));
      setNewCategoryName('');
      setShowCategoryModal(false);
    }
  };
  
  const removeCategory = (catId: string) => {
    const updated = customCategories.filter(c => c.id !== catId);
    setCustomCategories(updated);
    localStorage.setItem('customCategories', JSON.stringify(updated));
    if (filter === catId) setFilter('all');
  };

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempFile, setTempFile] = useState<File | null>(null);
  const [tempPreviewUrl, setTempPreviewUrl] = useState<string>('');
  
  // Viewing State
  const [viewingAsset, setViewingAsset] = useState<Asset | null>(null);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null); // Null means new upload
  const [formData, setFormData] = useState({
      name: '',
      category: 'icons' as AssetCategory,
      tags: [] as string[]
  });
  const [newTagInput, setNewTagInput] = useState('');

  const filteredAssets = filter === 'all' 
    ? assets 
    : assets.filter(a => a.category === filter);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTempFile(file);
      const url = URL.createObjectURL(file);
      setTempPreviewUrl(url);
      
      // Init form for new upload
      setEditingId(null);
      setFormData({
          name: file.name.split('.')[0],
          category: 'other',
          tags: []
      });
      setNewTagInput('');
      setIsModalOpen(true);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEditClick = (asset: Asset) => {
      setEditingId(asset.id);
      setTempPreviewUrl(asset.url);
      setTempFile(null); // No new file when editing, usually
      setFormData({
          name: asset.name,
          category: asset.category,
          tags: asset.tags || []
      });
      setNewTagInput('');
      setIsModalOpen(true);
  };

  const closeModal = () => {
      setIsModalOpen(false);
      setTempFile(null);
      setTempPreviewUrl('');
  };

  const handleDownload = (asset: Asset) => {
    const link = document.createElement('a');
    link.href = asset.url;
    link.download = asset.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addTag = (tag: string) => {
      const trimmedTag = tag.trim().toLowerCase();
      if (trimmedTag && !formData.tags.includes(trimmedTag)) {
          setFormData({ ...formData, tags: [...formData.tags, trimmedTag] });
      }
      setNewTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
      setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) });
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
          e.preventDefault();
          addTag(newTagInput);
      }
  };

  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();

      if (editingId) {
          // Update existing
          const existing = assets.find(a => a.id === editingId);
          if (existing) {
              onUpdate({
                  ...existing,
                  name: formData.name,
                  category: formData.category,
                  tags: formData.tags
              });
          }
      } else {
          // Create new
          if (!tempPreviewUrl) return;
          
          const newAsset: Asset = {
            id: Math.random().toString(36).substr(2, 9),
            name: formData.name,
            category: formData.category,
            url: tempPreviewUrl,
            uploadedBy: currentUser,
            date: new Date().toLocaleDateString(),
            size: tempFile ? `${(tempFile.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown',
            tags: formData.tags
          };
          onUpload(newAsset);
      }
      closeModal();
  };

  return (
    <div className="p-8 h-full flex flex-col relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Biblioteca de Recursos</h2>
          <p className="text-slate-500 dark:text-slate-400">Gestiona todos los archivos creativos de tu proyecto</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 bg-violet-600 hover:bg-violet-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-200 dark:shadow-none font-medium"
          >
            <Upload size={18} />
            <span>Subir Nuevo</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
            accept="image/*,.pdf"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
        {allCategories.map((cat) => {
          const isCustom = customCategories.some(c => c.id === cat.id);
          return (
            <div key={cat.id} className="relative group">
              <button
                onClick={() => setFilter(cat.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === cat.id
                    ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
              {isCustom && (
                <button
                  onClick={(e) => { e.stopPropagation(); removeCategory(cat.id); }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  ×
                </button>
              )}
            </div>
          );
        })}
        <button
          onClick={() => setShowCategoryModal(true)}
          className="px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-900/50 flex items-center gap-1"
        >
          <FolderPlus size={16} />
          Nueva
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pb-20">
        {filteredAssets.length > 0 ? (
          filteredAssets.map(asset => (
            <AssetCard 
                key={asset.id} 
                asset={asset} 
                onDelete={onDelete} 
                onEdit={handleEditClick}
                onView={setViewingAsset}
                onDownload={handleDownload}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
            <Filter size={48} className="mb-4 opacity-50" />
            <p>No se encontraron recursos en esta categoría.</p>
          </div>
        )}
      </div>

      {/* Fullscreen Image Viewer Modal */}
      {viewingAsset && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setViewingAsset(null)}>
            <button 
                onClick={() => setViewingAsset(null)} 
                className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
                <X size={32} />
            </button>
            
            <img 
                src={viewingAsset.url} 
                alt={viewingAsset.name} 
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200" 
                onClick={(e) => e.stopPropagation()} 
            />
            
            <div 
                className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full flex items-center space-x-6 text-white" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col">
                    <span className="font-medium text-sm">{viewingAsset.name}</span>
                    <span className="text-[10px] text-white/60">{viewingAsset.size} • {viewingAsset.uploadedBy}</span>
                </div>
                <div className="w-px h-8 bg-white/20"></div>
                <button 
                    onClick={() => handleDownload(viewingAsset)} 
                    className="flex items-center space-x-2 hover:text-violet-300 transition-colors"
                    title="Descargar"
                >
                    <Download size={20} />
                    <span className="text-sm font-medium">Descargar</span>
                </button>
            </div>
        </div>
      )}

      {/* Upload/Edit Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white">
                          {editingId ? 'Editar Recurso' : 'Nuevo Recurso'}
                      </h3>
                      <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                          <X size={24} />
                      </button>
                  </div>
                  
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Left: Preview */}
                      <div className="flex flex-col justify-center">
                          <div className="aspect-square bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 relative">
                              {tempPreviewUrl ? (
                                  <img src={tempPreviewUrl} alt="Preview" className="w-full h-full object-contain" />
                              ) : (
                                  <div className="flex items-center justify-center h-full text-slate-400">Sin vista previa</div>
                              )}
                          </div>
                      </div>

                      {/* Right: Form */}
                      <form onSubmit={handleSave} className="space-y-4">
                          <div>
                              <label className="block text-sm font-medium text-slate-500 mb-1">Título</label>
                              <input 
                                  type="text" 
                                  required
                                  value={formData.name}
                                  onChange={e => setFormData({...formData, name: e.target.value})}
                                  className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 outline-none dark:text-white"
                                  placeholder="Ej. Banner Principal"
                              />
                          </div>
                          
                          <div>
                              <label className="block text-sm font-medium text-slate-500 mb-1">Categoría</label>
                              <select 
                                  value={formData.category}
                                  onChange={e => setFormData({...formData, category: e.target.value})}
                                  className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 outline-none dark:text-white"
                              >
                                  {allCategories.filter(c => c.id !== 'all').map(cat => (
                                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                                  ))}
                                  <option value="other">Otro</option>
                              </select>
                          </div>

                          <div>
                              <label className="block text-sm font-medium text-slate-500 mb-2 flex items-center gap-2">
                                  <Tag size={14} />
                                  Etiquetas
                              </label>
                              
                              {/* Tags actuales */}
                              <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
                                  {formData.tags.map((tag) => (
                                      <span 
                                          key={tag} 
                                          className="inline-flex items-center gap-1 px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium"
                                      >
                                          {tag}
                                          <button 
                                              type="button"
                                              onClick={() => removeTag(tag)}
                                              className="hover:text-violet-900 dark:hover:text-white"
                                          >
                                              <X size={14} />
                                          </button>
                                      </span>
                                  ))}
                              </div>

                              {/* Input para nuevo tag */}
                              <div className="flex gap-2 mb-3">
                                  <input 
                                      type="text"
                                      value={newTagInput}
                                      onChange={e => setNewTagInput(e.target.value)}
                                      onKeyDown={handleTagKeyDown}
                                      className="flex-1 px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 outline-none dark:text-white text-sm"
                                      placeholder="Escribe y pulsa Enter..."
                                  />
                                  <button 
                                      type="button"
                                      onClick={() => addTag(newTagInput)}
                                      className="px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
                                  >
                                      <Plus size={18} />
                                  </button>
                              </div>

                              {/* Tags sugeridos */}
                              <div className="flex flex-wrap gap-1">
                                  {SUGGESTED_TAGS.filter(t => !formData.tags.includes(t)).slice(0, 6).map((tag) => (
                                      <button
                                          key={tag}
                                          type="button"
                                          onClick={() => addTag(tag)}
                                          className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                                      >
                                          + {tag}
                                      </button>
                                  ))}
                              </div>
                          </div>

                          <div className="pt-4 flex gap-3">
                              <button 
                                  type="button" 
                                  onClick={closeModal}
                                  className="flex-1 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                              >
                                  Cancelar
                              </button>
                              <button 
                                  type="submit"
                                  className="flex-1 flex items-center justify-center space-x-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl font-medium shadow-lg shadow-violet-500/20 transition-colors"
                              >
                                  <Save size={18} />
                                  <span>Guardar</span>
                              </button>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      )}

      {/* Create Category Modal */}
      {showCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <FolderPlus className="text-violet-500" size={22} />
                          Nueva Categoría
                      </h3>
                      <button onClick={() => setShowCategoryModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                          <X size={24} />
                      </button>
                  </div>
                  
                  <div className="p-6">
                      <label className="block text-sm font-medium text-slate-500 mb-2">Nombre de la categoría</label>
                      <input 
                          type="text"
                          value={newCategoryName}
                          onChange={e => setNewCategoryName(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && addCategory()}
                          className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-violet-500 outline-none dark:text-white"
                          placeholder="Ej. Presentaciones, Videos, Mockups..."
                          autoFocus
                      />
                      
                      <div className="flex gap-3 mt-6">
                          <button 
                              onClick={() => setShowCategoryModal(false)}
                              className="flex-1 px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                          >
                              Cancelar
                          </button>
                          <button 
                              onClick={addCategory}
                              disabled={!newCategoryName.trim()}
                              className="flex-1 flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl font-medium shadow-lg shadow-violet-500/20 transition-colors"
                          >
                              <Plus size={18} />
                              Crear
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
