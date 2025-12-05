
import React, { useState } from 'react';
import { Asset } from '../types';
import { MoreHorizontal, Download, Eye, Trash2, Pencil } from 'lucide-react';

interface AssetCardProps {
  asset: Asset;
  onDelete?: (id: string) => void;
  onEdit?: (asset: Asset) => void;
  onView?: (asset: Asset) => void;
  onDownload?: (asset: Asset) => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset, onDelete, onEdit, onView, onDownload }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 dark:border-slate-700 group relative">
      
      {/* Image Container */}
      <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-900">
        <img 
          src={asset.url} 
          alt={asset.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
            <button 
                onClick={() => onView?.(asset)}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors"
                title="Ver"
            >
                <Eye size={18} />
            </button>
            <button 
                onClick={() => onDownload?.(asset)}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors"
                title="Descargar"
            >
                <Download size={18} />
            </button>
        </div>
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded-md">
            <span className="text-xs font-medium text-white capitalize">{asset.category}</span>
        </div>
      </div>
      
      {/* Info Section */}
      <div className="flex items-start justify-between relative">
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-slate-800 dark:text-white truncate pr-2" title={asset.name}>{asset.name}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {asset.uploadedBy} • {asset.date}
          </p>
          {asset.tags && asset.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
                {asset.tags.slice(0, 2).map((tag, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-md">#{tag}</span>
                ))}
                {asset.tags.length > 2 && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-md">+{asset.tags.length - 2}</span>
                )}
            </div>
          )}
        </div>
        
        {/* Menu Button */}
        <button 
            onClick={() => setShowMenu(!showMenu)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <MoreHorizontal size={18} />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
            <>
                <div className="fixed inset-0 z-10 cursor-default" onClick={() => setShowMenu(false)}></div>
                <div className="absolute right-0 top-8 z-20 w-32 bg-white dark:bg-slate-700 rounded-xl shadow-xl border border-slate-100 dark:border-slate-600 overflow-hidden animate-in zoom-in-95 duration-100">
                    {onEdit && (
                        <button 
                            onClick={() => { setShowMenu(false); onEdit(asset); }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center space-x-2"
                        >
                            <Pencil size={14} />
                            <span>Editar</span>
                        </button>
                    )}
                    {onDelete && (
                        <button 
                            onClick={() => { setShowMenu(false); onDelete(asset.id); }}
                            className="w-full text-left px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 flex items-center space-x-2"
                        >
                            <Trash2 size={14} />
                            <span>Borrar</span>
                        </button>
                    )}
                    {onDownload && (
                         <button 
                            onClick={() => { setShowMenu(false); onDownload(asset); }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center space-x-2"
                         >
                             <Download size={14} />
                             <span>Bajar</span>
                         </button>
                    )}
                </div>
            </>
        )}
      </div>
    </div>
  );
};
