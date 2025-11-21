import React, { useState, useEffect } from 'react';
import { Editor } from './components/Editor';
import { DiffViewer } from './components/DiffViewer';
import { AIPanel } from './components/AIPanel';
import { SettingsModal } from './components/SettingsModal';
import { calculateSimilarity } from './utils/diffEngine';

// Default placeholder texts (Chinese)
const DEFAULT_ORIGINAL = `清晨的城市还没完全醒来。街道两旁的店铺铁门半开半合，像伸着懒腰准备起床的人。空气里带着一点潮气，也带着面包店刚出炉的香味。风很轻，从街口拂过来，带着微不可察的凉意，吹动路边梧桐的叶子，沙沙作响。

上学、上班、赶车的人慢慢多了。人群散乱地走在街上，却又似乎共享着一种默契——谁也不发出太大的声响，像是怕惊动了这座城市最安静的一刻。

在街角的小书摊前，一个高中生正翻着二手小说。他的书包看起来很重，肩带深深地勒进衣料里。他翻到一句话时愣了一下，仿佛被击中了什么，但又轻轻摇头，把书放回原处。他不知道该怎么表达那份触动，只不过继续走向拥挤的早高峰。

不远处的咖啡店，有个女孩坐在窗边，用笔记本打字。她写写停停，偶尔皱眉，偶尔露出一小小的笑。别人看不到屏幕，但她正在给未来的自己写一封信——希望几年后的某一天，她能回来看见这段文字，笑着说：“原来我真的走出来了。”`;

const DEFAULT_MODIFIED = `清晨的城市还没彻底醒来。街道两旁的店铺铁门半掩开半合，像伸着懒腰准备起床苏醒的人。空气里裹着一点潮气湿意，也混着面包店刚烤好的香味。风很轻柔，从街口拂掠过来，带着几乎察觉不到的清凉意，吹动路边梧桐的叶子，沙沙作响。

上学、上班、赶车的人慢慢渐渐多了。人群散乱散落散落地走在街上，却又似乎好像共享着一种默契——谁也不发出太大的声响，像是仿佛怕惊扰动了这座城市最安宁静的一片刻。

在街角的小书摊前，一个高中生正翻着一本旧小说。他的书包看上去很沉，肩带深深地勒压进衣料里。他翻到一句话时愣了一下，仿佛好像被触动了什么，但又轻轻摇头，把书放回原处。他不知道该如何表述那份心里的颤动，只继续走向愈发拥挤的早高峰。

不远处的咖啡店，有个女孩坐在窗边，用笔记本敲字。她断断续续地写写停停，偶尔皱眉又偶尔露出一小点浅浅的笑。别人看不到屏幕，但她正在给未来的自己写一封信——希望几年后的某一天，她能回来看见再次读到这段话，然后轻声笑着说：“原来我真的跨过去了。”`;

const App: React.FC = () => {
  const [original, setOriginal] = useState(DEFAULT_ORIGINAL);
  const [modified, setModified] = useState(DEFAULT_MODIFIED);
  const [similarity, setSimilarity] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Calculate similarity whenever text changes
  useEffect(() => {
    const score = calculateSimilarity(original, modified);
    setSimilarity(score);
  }, [original, modified]);

  const handleCopyReport = () => {
      const report = `分析报告 (Analysis Report)\n----------------\n相似度: ${similarity}%\n原稿长度: ${original.length} 字符\n变动稿长度: ${modified.length} 字符`;
      navigator.clipboard.writeText(report);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 text-slate-800 font-sans overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* Navbar */}
      <header className="h-16 flex-none bg-white border-b border-slate-200 shadow-sm px-6 flex items-center justify-between z-20 relative">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
              </svg>
           </div>
           <div>
             <h1 className="text-xl font-bold text-slate-900 tracking-tight">
               Smile Txt
             </h1>
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded border border-indigo-100">AI Enhanced</span>
                <span className="text-[10px] text-slate-400">v2.1</span>
             </div>
           </div>
        </div>

        <div className="flex items-center gap-6">
           {/* Similarity Score Indicator */}
           <div className="hidden md:flex flex-col items-end">
              <div className="flex items-baseline gap-2">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">相似度</span>
                 <span className={`text-2xl font-black tabular-nums ${similarity > 80 ? 'text-emerald-500' : similarity > 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                    {similarity}%
                 </span>
              </div>
              <div className="w-40 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-700 ease-out ${similarity > 80 ? 'bg-emerald-500' : similarity > 50 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                    style={{ width: `${similarity}%` }}
                ></div>
              </div>
           </div>

           <div className="h-8 w-px bg-slate-100 hidden md:block"></div>
           
           <div className="flex items-center gap-3">
              <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
                  title="API 设置"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.175 1.059c.991.028 1.921.257 2.775.646l.979-.641a1.125 1.125 0 0 1 1.42.13l.774.773a1.125 1.125 0 0 1 .13 1.42l-.641.979c.389.854.618 1.784.646 2.775l1.059.175c.542.09.94.56.94 1.11v1.093c0 .55-.398 1.02-.94 1.11l-1.059.175c-.028.991-.257 1.921-.646 2.775l.641.979a1.125 1.125 0 0 1-.13 1.42l-.773.774a1.125 1.125 0 0 1-1.42-.13l-.979-.641a9.014 9.014 0 0 1-2.775.646l-.175 1.059c-.09.542-.56.94-1.11.94h-1.093c-.55 0-1.02-.398-1.11-.94l-.175-1.059c-.991-.028-1.921-.257-2.775-.646l-.979.641a1.125 1.125 0 0 1-1.42-.13l-.774-.773a1.125 1.125 0 0 1-.13-1.42l.641-.979c-.389-.854-.618-1.784-.646-2.775l-1.059-.175a1.125 1.125 0 0 1-.94-1.11v-1.093c0-.55.398-1.02.94-1.11l1.059-.175c.028-.991.257-1.921.646-2.775l-.641-.979a1.125 1.125 0 0 1 .13-1.42l.773-.774a1.125 1.125 0 0 1 1.42.13l.979.641a9.014 9.014 0 0 1 2.775-.646l.175-1.059V3.94ZM12 16.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" />
                  </svg>
              </button>

              <button 
                  onClick={handleCopyReport}
                  className="group flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all shadow-md shadow-slate-200 active:scale-95"
              >
                  <span className="text-sm font-semibold">导出报告</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-0.5 transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
              </button>
           </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden p-4 gap-4">
         
         {/* Left Panel: Inputs */}
         <div className="flex-1 flex flex-col gap-4 min-w-[400px] max-w-[50%]">
            
            <div className="flex-1 h-1/2 relative">
               <Editor 
                 label="原稿 (ORIGINAL)" 
                 value={original} 
                 onChange={(e) => setOriginal(e.target.value)}
                 colorIndicator="slate"
                 placeholder="在此粘贴原稿..."
                 stats
                 onClear={() => setOriginal('')}
               />
               {/* Connection Line Design Element */}
               <div className="absolute -left-4 top-1/2 w-4 border-t border-dashed border-slate-300 hidden lg:block"></div>
            </div>
            
            <div className="flex-1 h-1/2 relative">
               <Editor 
                 label="变动稿 (MODIFIED)" 
                 value={modified} 
                 onChange={(e) => setModified(e.target.value)}
                 colorIndicator="indigo"
                 placeholder="在此粘贴修改后的文稿..."
                 stats
                 onClear={() => setModified('')}
               />
               {/* Connection Line Design Element */}
               <div className="absolute -left-4 top-1/2 w-4 border-t border-dashed border-slate-300 hidden lg:block"></div>
            </div>

         </div>

         {/* Right Panel: Diff & AI */}
         <div className="flex-[1.2] flex flex-col gap-4 min-w-[500px]">
             
             {/* Diff View - Takes up most space */}
             <div className="flex-1 min-h-0 shadow-sm rounded-2xl">
                <DiffViewer original={original} modified={modified} />
             </div>

             {/* AI Panel - Bottom section of right column */}
             <div className="flex-none">
                <AIPanel 
                    original={original} 
                    modified={modified} 
                    onApplyOptimization={setModified}
                />
             </div>
         </div>

      </main>
    </div>
  );
};

export default App;