import React, { forwardRef } from 'react';
import { getStats } from '../utils/diffEngine';

interface EditorProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  colorIndicator: string;
  stats?: boolean;
  onClear?: () => void;
}

export const Editor = forwardRef<HTMLTextAreaElement, EditorProps>(
  ({ label, colorIndicator, value, className, stats, onClear, ...props }, ref) => {
    const text = (value as string) || '';
    const statistics = getStats(text);

    const handleCopy = () => {
      navigator.clipboard.writeText(text);
    };

    return (
      <div className={`flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all focus-within:shadow-md focus-within:border-${colorIndicator}-400 group ${className}`}>
        <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-50">
          <div className="flex items-center gap-2.5">
             <div className={`w-2.5 h-2.5 rounded-full bg-${colorIndicator}-500 shadow-sm`}></div>
             <span className="font-bold text-xs tracking-wider text-slate-600 uppercase">{label}</span>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button onClick={handleCopy} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="复制文本">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                </svg>
              </button>
              {onClear && (
                  <button onClick={onClear} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors" title="清空文本">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
              )}
          </div>
        </div>
        
        <textarea
          ref={ref}
          className="flex-1 w-full p-4 resize-none outline-none font-mono text-sm leading-relaxed text-slate-700 bg-transparent selection:bg-indigo-100"
          spellCheck={false}
          value={value}
          {...props}
        />

        {stats && (
            <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-50 flex gap-3 text-[10px] font-medium text-slate-400 font-sans">
                <span className="bg-white px-2 py-0.5 rounded-md border border-slate-100 shadow-sm">{statistics.chars} 字符</span>
                <span className="bg-white px-2 py-0.5 rounded-md border border-slate-100 shadow-sm">{statistics.words} 词</span>
                <span className="bg-white px-2 py-0.5 rounded-md border border-slate-100 shadow-sm">{statistics.lines} 行</span>
            </div>
        )}
      </div>
    );
  }
);

Editor.displayName = 'Editor';