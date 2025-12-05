import React, { useState } from 'react';
import { generateCreativeIdeas } from '../services/geminiService';
import { Sparkles, Send, Loader, Copy } from 'lucide-react';

export const AiAssistant: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setResponse('');
    
    const result = await generateCreativeIdeas(prompt);
    setResponse(result);
    setIsLoading(false);
  };

  const suggestions = [
    "Genera 10 hashtags de Instagram para nuestro lanzamiento de producto ecológico",
    "Escribe un eslogan pegadizo para una marca de café dirigida a la Gen Z",
    "Resume las tendencias clave en marketing digital para 2024",
    "Crea una descripción de paleta de colores para una marca de spa de lujo"
  ];

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white shadow-lg shadow-purple-500/30">
                <Sparkles size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Asistente Creativo</h2>
        </div>
        <p className="text-slate-500 dark:text-slate-400">Potenciado por Gemini AI. Haz lluvia de ideas, escribe textos y genera ideas.</p>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {response ? (
             <div className="flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-end">
                    <div className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[80%]">
                        <p>{prompt}</p>
                    </div>
                </div>
                <div className="flex justify-start">
                    <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800 text-slate-800 dark:text-slate-200 px-6 py-5 rounded-2xl rounded-tl-sm max-w-[90%] shadow-sm relative group">
                        <div className="markdown-body whitespace-pre-wrap leading-relaxed">
                            {response}
                        </div>
                        <button 
                            onClick={() => navigator.clipboard.writeText(response)}
                            className="absolute top-4 right-4 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-violet-600"
                            title="Copiar al portapapeles"
                        >
                            <Copy size={16} />
                        </button>
                    </div>
                </div>
             </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                <Sparkles size={48} className="text-violet-300 dark:text-slate-600 mb-4" />
                <h3 className="text-xl font-medium text-slate-700 dark:text-slate-300 mb-2">¿Cómo puedo ayudarte hoy?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full max-w-2xl">
                    {suggestions.map((s, i) => (
                        <button 
                            key={i}
                            onClick={() => setPrompt(s)}
                            className="p-4 bg-slate-50 dark:bg-slate-700/50 hover:bg-violet-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-left text-slate-600 dark:text-slate-300 transition-colors"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <div className="relative">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Pide a la IA que escriba un pie de foto, genere hashtags o piense ideas..."
                    className="w-full bg-white dark:bg-slate-800 border-0 rounded-xl px-4 py-4 pr-14 shadow-sm focus:ring-2 focus:ring-violet-500 outline-none resize-none text-slate-800 dark:text-white"
                    rows={2}
                    onKeyDown={(e) => {
                        if(e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleGenerate();
                        }
                    }}
                />
                <button 
                    onClick={handleGenerate}
                    disabled={isLoading || !prompt.trim()}
                    className="absolute right-2 bottom-2 p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};