import React, { useMemo, useState } from 'react';
import { DiffPart, DiffType, DiffOptions } from '../types';
import { calculateDiff } from '../utils/diffEngine';

interface DiffViewerProps {
  original: string;
  modified: string;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ original, modified }) => {
  const [options, setOptions] = useState<DiffOptions>({
    ignoreCase: false,
    ignoreWhitespace: false,
    ignorePunctuation: false,
    ignoreNewlines: false,
  });

  const diffs = useMemo(() => calculateDiff(original, modified, options), [original, modified, options]);

  // Calculate stats for the diff view
  const additions = diffs.filter(d => d.type === DiffType.INSERT).length;
  const deletions = diffs.filter(d => d.type === DiffType.DELETE).length;

  const toggleOption = (key: keyof DiffOptions) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header / Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 bg-white border-b border-slate-100 gap-3">
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
               <div className="flex items-center gap-2 flex-none">
                    <div className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></div>
                    <span className="font-bold text-sm text-slate-700">差异全景 (DIFFERENCE)</span>
               </div>
               
               <div className="h-4 w-px bg-slate-200 flex-none hidden sm:block"></div>

               {/* Filters */}
               <div className="flex items-center gap-1 flex-none">
                  <span className="text-xs font-medium text-slate-400 mr-2 hidden lg:inline-block">过滤:</span>
                  <FilterButton 
                    label="忽略空格" 
                    active={options.ignoreWhitespace} 
                    onClick={() => toggleOption('ignoreWhitespace')} 
                  />
                  <FilterButton 
                    label="忽略标点" 
                    active={options.ignorePunctuation} 
                    onClick={() => toggleOption('ignorePunctuation')} 
                  />
                  <FilterButton 
                    label="忽略大小写" 
                    active={options.ignoreCase} 
                    onClick={() => toggleOption('ignoreCase')} 
                  />
                  <FilterButton 
                    label="忽略空行" 
                    active={options.ignoreNewlines} 
                    onClick={() => toggleOption('ignoreNewlines')} 
                  />
               </div>
            </div>

            <div className="flex gap-3 text-xs font-medium flex-none">
                <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    <span className="text-lg leading-none">+</span> {additions} 新增
                </span>
                <span className="flex items-center gap-1.5 text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                    <span className="text-lg leading-none">-</span> {deletions} 删除
                </span>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 diff-content font-mono text-[15px] leading-8 text-slate-600 bg-slate-50/30">
            {diffs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <div className="p-4 bg-slate-50 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 opacity-50">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                    </div>
                    <p className="font-medium">未发现差异</p>
                    <p className="text-xs text-slate-400 mt-1">开始输入以查看对比</p>
                </div>
            )}
            {diffs.map((part, index) => {
                if (part.type === DiffType.INSERT) {
                    return (
                        <span key={index} className="bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded-sm border-b-2 border-emerald-300 mx-0.5 font-medium hover:bg-emerald-200 transition-colors" title="新增内容">
                            {part.value}
                        </span>
                    );
                }
                if (part.type === DiffType.DELETE) {
                    return (
                        <span key={index} className="bg-rose-100 text-rose-800 px-1 py-0.5 rounded-sm decoration-rose-400/50 line-through decoration-2 mx-0.5 opacity-80 hover:opacity-100 hover:bg-rose-200 transition-all" title="已删除内容">
                            {part.value}
                        </span>
                    );
                }
                return <span key={index} className="text-slate-700">{part.value}</span>;
            })}
        </div>
    </div>
  );
};

const FilterButton: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
    <button 
        onClick={onClick}
        className={`
            px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all select-none
            ${active 
                ? 'bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-100 border border-transparent hover:border-slate-200'}
        `}
    >
        <div className="flex items-center gap-1.5">
            {active && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
            )}
            {label}
        </div>
    </button>
);