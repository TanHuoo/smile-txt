import React, { useState } from 'react';
import { analyzeDifference, smartOptimize } from '../services/geminiService';
import { AnalysisResult } from '../types';

interface AIPanelProps {
  original: string;
  modified: string;
  onApplyOptimization: (text: string) => void;
}

export const AIPanel: React.FC<AIPanelProps> = ({ original, modified, onApplyOptimization }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');

  const handleAnalyze = async () => {
    if (!original || !modified) return;
    setIsAnalyzing(true);
    const res = await analyzeDifference(original, modified);
    setResult(res);
    setIsAnalyzing(false);
  };

  const handleQuickOptimize = async (type: string) => {
      if (!modified) return;
      let prompt = "";
      switch(type) {
          case 'grammar': prompt = "修复语法和拼写错误。"; break;
          case 'polish': prompt = "润色语气，使其更加专业流畅。"; break;
          case 'shorten': prompt = "在不丢失原意的情况下精简文本。"; break;
          default: prompt = customPrompt;
      }
      
      if (!prompt) return;
      setIsOptimizing(true);
      const newText = await smartOptimize(modified, prompt);
      if (newText) {
          onApplyOptimization(newText);
          if (type === 'custom') setCustomPrompt('');
      }
      setIsOptimizing(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl shadow-sm p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813a3.75 3.75 0 0 0 2.576-2.576l.813-2.846A.75.75 0 0 1 9 4.5ZM1.5 3a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-1.5 0V3ZM4.5 1.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-1.5 0V1.5ZM1.5 19.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-1.5 0v-1.5ZM4.5 21a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-1.5 0V21ZM21 4.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-1.5 0V4.5ZM19.5 1.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-1.5 0V1.5ZM21 19.5a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-1.5 0v-1.5ZM19.5 21a.75.75 0 0 1 1.5 0v1.5a.75.75 0 0 1-1.5 0V21Z" clipRule="evenodd" />
                </svg>
            </div>
            <div>
                <h3 className="font-bold text-indigo-950 text-sm">智能解读</h3>
                <p className="text-[10px] text-indigo-400 font-medium uppercase tracking-wider">由 Gemini 2.5 驱动</p>
            </div>
         </div>
         <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 rounded-xl transition-all disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
         >
            {isAnalyzing ? (
                <>
                    <svg className="animate-spin h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    分析中...
                </>
            ) : (
                '智能解读差异'
            )}
         </button>
      </div>

      {/* Analysis Result Cards */}
      {result && (
        <div className="grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-white/60 p-3 rounded-xl border border-indigo-50 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    <p className="font-bold text-xs text-slate-500 uppercase">摘要</p>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{result.summary}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/60 p-3 rounded-xl border border-indigo-50 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                        <p className="font-bold text-xs text-slate-500 uppercase">语气变化</p>
                    </div>
                    <p className="text-xs text-slate-600">{result.toneChange}</p>
                </div>
                <div className="bg-white/60 p-3 rounded-xl border border-indigo-50 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                        <p className="font-bold text-xs text-slate-500 uppercase">建议</p>
                    </div>
                    <p className="text-xs text-slate-600">{result.suggestions}</p>
                </div>
            </div>
        </div>
      )}

      {/* Optimization Tools */}
      <div className="pt-4 border-t border-indigo-50">
        <p className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wide">优化建议</p>
        
        {/* Quick Actions */}
        <div className="flex gap-2 mb-3">
            <button disabled={isOptimizing} onClick={() => handleQuickOptimize('grammar')} className="flex-1 py-2 px-3 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 rounded-lg text-xs font-semibold text-slate-600 transition-colors shadow-sm">
               修复语法
            </button>
            <button disabled={isOptimizing} onClick={() => handleQuickOptimize('polish')} className="flex-1 py-2 px-3 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 rounded-lg text-xs font-semibold text-slate-600 transition-colors shadow-sm">
               润色语气
            </button>
            <button disabled={isOptimizing} onClick={() => handleQuickOptimize('shorten')} className="flex-1 py-2 px-3 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 rounded-lg text-xs font-semibold text-slate-600 transition-colors shadow-sm">
               精简
            </button>
        </div>

        {/* Custom Input */}
        <div className="relative">
            <input
                type="text"
                placeholder="自定义指令 (例如：'让语气更活泼')"
                className="w-full pl-3 pr-20 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all shadow-sm"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuickOptimize('custom')}
            />
            <button
                onClick={() => handleQuickOptimize('custom')}
                disabled={isOptimizing || !customPrompt}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                 {isOptimizing ? '...' : '执行'}
            </button>
        </div>
      </div>
    </div>
  );
};