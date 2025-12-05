
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, TeamMember, ChatContext, Asset, Project, BrandItem } from '../types';
import { Send, Paperclip, X, Image as ImageIcon, Type, ListTodo, Search } from 'lucide-react';

interface ChatProps {
  messages: ChatMessage[];
  currentUser: TeamMember;
  teamMembers: TeamMember[];
  onSendMessage: (text: string, context?: ChatContext) => void;
  assets: Asset[];
  projects: Project[];
  brandItems: BrandItem[];
}

export const Chat: React.FC<ChatProps> = ({ 
    messages, 
    currentUser, 
    teamMembers, 
    onSendMessage,
    assets,
    projects,
    brandItems
}) => {
  const [inputText, setInputText] = useState('');
  const [activeContext, setActiveContext] = useState<ChatContext | undefined>(undefined);
  const [isContextModalOpen, setIsContextModalOpen] = useState(false);
  const [contextTab, setContextTab] = useState<'assets' | 'projects' | 'brand'>('assets');
  const [searchTerm, setSearchTerm] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim() || activeContext) {
      onSendMessage(inputText, activeContext);
      setInputText('');
      setActiveContext(undefined);
    }
  };

  const getAvatar = (userId: string) => {
      const member = teamMembers.find(m => m.id === userId);
      return member?.avatar || 'https://via.placeholder.com/150';
  };

  const getName = (userId: string) => {
    const member = teamMembers.find(m => m.id === userId);
    return member?.name || 'Usuario';
  };

  // --- Context Filtering ---
  const filteredAssets = assets.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredProjects = projects.filter(p => !p.isArchived && p.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredBrand = brandItems.filter(b => b.content.toLowerCase().includes(searchTerm.toLowerCase()));

  const selectContext = (context: ChatContext) => {
      setActiveContext(context);
      setIsContextModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => {
          const isOwn = msg.userId === currentUser.id;
          return (
            <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
              {!isOwn && (
                 <img src={getAvatar(msg.userId)} alt="avatar" className="w-8 h-8 rounded-full mr-3 mt-1 object-cover" />
              )}
              <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
                  {!isOwn && <span className="text-xs text-slate-500 ml-1 mb-1">{getName(msg.userId)}</span>}
                  
                  <div className={`rounded-2xl p-4 shadow-sm ${
                      isOwn 
                      ? 'bg-violet-600 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'
                  }`}>
                      {/* Context Attachment Display */}
                      {msg.context && (
                          <div className={`mb-3 rounded-xl overflow-hidden text-left ${
                              isOwn ? 'bg-white/10' : 'bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700'
                          }`}>
                              {msg.context.type === 'asset' && (
                                  <div className="flex items-center">
                                      {msg.context.thumbnail && (
                                          <img src={msg.context.thumbnail} alt="thumb" className="w-16 h-16 object-cover" />
                                      )}
                                      <div className="p-3 min-w-0">
                                          <p className="font-bold text-sm truncate">{msg.context.title}</p>
                                          <p className="text-xs opacity-70">{msg.context.detail}</p>
                                      </div>
                                  </div>
                              )}
                              {msg.context.type === 'project' && (
                                  <div className="p-3">
                                       <div className="flex items-center space-x-2 mb-1">
                                            <ListTodo size={14} />
                                            <span className="font-bold text-sm truncate">{msg.context.title}</span>
                                       </div>
                                       <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden">
                                           <div className="bg-current h-full w-1/2 opacity-50"></div> {/* Mock progress visual */}
                                       </div>
                                  </div>
                              )}
                              {msg.context.type === 'brand' && (
                                  <div className="p-3">
                                       <p className="font-medium text-sm">"{msg.context.title}"</p>
                                       <span className="text-[10px] uppercase opacity-60 tracking-wider mt-1 block">{msg.context.detail}</span>
                                  </div>
                              )}
                          </div>
                      )}
                      
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 mx-1">{msg.timestamp}</span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        
        {/* Active Context Preview Pill */}
        {activeContext && (
            <div className="flex items-center space-x-2 bg-violet-50 dark:bg-violet-900/30 border border-violet-100 dark:border-violet-800 rounded-lg p-2 mb-2 w-fit max-w-full animate-in slide-in-from-bottom-2">
                <span className="text-xs font-bold text-violet-600 dark:text-violet-300 uppercase px-1">{activeContext.type}:</span>
                <span className="text-sm text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{activeContext.title}</span>
                <button onClick={() => setActiveContext(undefined)} className="p-1 hover:bg-black/10 rounded-full transition-colors">
                    <X size={14} className="text-slate-500" />
                </button>
            </div>
        )}

        <div className="flex items-center space-x-2">
            <button 
                onClick={() => setIsContextModalOpen(true)}
                className={`p-3 rounded-xl transition-colors ${activeContext ? 'bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                title="Adjuntar contexto (Foto, Proyecto, Marca)"
            >
                <Paperclip size={20} />
            </button>
            <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe un mensaje..."
                className="flex-1 bg-slate-100 dark:bg-slate-800 border-none outline-none px-4 py-3 rounded-xl text-slate-800 dark:text-white placeholder:text-slate-400"
            />
            <button 
                onClick={handleSend}
                disabled={!inputText.trim() && !activeContext}
                className="p-3 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-violet-500/20"
            >
                <Send size={20} />
            </button>
        </div>
      </div>

      {/* Context Selection Modal */}
      {isContextModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">Adjuntar Contexto</h3>
                    <button onClick={() => setIsContextModalOpen(false)}><X size={20} className="text-slate-400" /></button>
                </div>

                {/* Tabs */}
                <div className="flex p-2 bg-slate-50 dark:bg-slate-900 gap-2">
                    {[
                        { id: 'assets', label: 'Recursos', icon: ImageIcon },
                        { id: 'projects', label: 'Proyectos', icon: ListTodo },
                        { id: 'brand', label: 'Kit de Marca', icon: Type }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setContextTab(tab.id as any)}
                            className={`flex-1 flex items-center justify-center space-x-2 py-2 rounded-lg text-sm font-medium transition-all ${
                                contextTab === tab.id 
                                ? 'bg-white dark:bg-slate-800 shadow-sm text-violet-600 dark:text-violet-400' 
                                : 'text-slate-500 hover:bg-white/50 dark:hover:bg-slate-800/50'
                            }`}
                        >
                            <tab.icon size={16} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Buscar..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 outline-none text-sm dark:text-white"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {contextTab === 'assets' && (
                        <div className="grid grid-cols-2 gap-4">
                            {filteredAssets.map(asset => (
                                <button key={asset.id} onClick={() => selectContext({ id: asset.id, type: 'asset', title: asset.name, thumbnail: asset.url, detail: asset.category })} className="flex items-start space-x-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-left border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all">
                                    <img src={asset.url} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{asset.name}</p>
                                        <p className="text-xs text-slate-500">{asset.category}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {contextTab === 'projects' && (
                        <div className="space-y-2">
                            {filteredProjects.map(project => (
                                <button key={project.id} onClick={() => selectContext({ id: project.id, type: 'project', title: project.title, detail: `${project.stages.filter(s=>s.isCompleted).length}/${project.stages.length} tareas` })} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-left border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all">
                                    <div>
                                        <p className="text-sm font-medium text-slate-800 dark:text-white">{project.title}</p>
                                        <p className="text-xs text-slate-500 truncate max-w-xs">{project.description}</p>
                                    </div>
                                    <div className="text-xs font-mono bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded">
                                        {project.stages.filter(s=>s.isCompleted).length}/{project.stages.length}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {contextTab === 'brand' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {filteredBrand.map(item => (
                                <button key={item.id} onClick={() => selectContext({ id: item.id, type: 'brand', title: item.content, detail: item.type })} className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 text-left border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all flex flex-col">
                                    <span className="text-xs font-bold text-violet-500 uppercase mb-1">{item.type}</span>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">{item.content}</p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
