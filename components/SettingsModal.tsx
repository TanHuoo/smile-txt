import React, { useState, useEffect } from 'react';
import { validateApiKey, saveUserApiKey, removeUserApiKey, getUserApiKey } from '../services/geminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      const stored = getUserApiKey();
      setApiKey(stored || '');
      setStatus('idle');
      setStatusMsg('');
    }
  }, [isOpen]);

  const handleTestAndSave = async () => {
    if (!apiKey.trim()) {
        // If empty, we clear the storage (reverting to default env key)
        removeUserApiKey();
        setStatus('success');
        setStatusMsg('已切换回默认内置 API');
        setTimeout(() => {
            onClose();
        }, 1500);
        return;
    }

    setStatus('testing');
    const isValid = await validateApiKey(apiKey);

    if (isValid) {
      saveUserApiKey(apiKey);
      setStatus('success');
      setStatusMsg('连接成功！设置已保存');
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setStatus('error');
      setStatusMsg('连接失败，请检查 API Key 是否有效');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 transform transition-all scale-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-indigo-600">
                <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 5.389c-.42.18-.813.411-1.18.682l-2.114-1.034a1.875 1.875 0 0 0-2.255.928l-.75 1.299c-.397.689-.268 1.57.287 2.101l1.684 1.61a9.027 9.027 0 0 0 0 2.05l-1.684 1.61a1.875 1.875 0 0 0-.287 2.101l.75 1.299c.397.689 1.183.97 1.93.573l2.113-1.034c.368.271.761.502 1.18.682l.178 1.572A1.875 1.875 0 0 0 11.078 21.75h1.844c.917 0 1.699-.663 1.85-1.567l.178-1.572c.42-.18.813-.411 1.18-.682l2.114 1.034a1.875 1.875 0 0 0 2.255-.928l.75-1.299c.397-.689.268-1.57-.287-2.101l-1.684-1.61a9.027 9.027 0 0 0 0-2.05l1.684-1.61a1.875 1.875 0 0 0 .287-2.101l-.75-1.299a1.875 1.875 0 0 0-1.93-.573l-2.113 1.034a9.03 9.03 0 0 0-1.18-.682l-.178-1.572a1.875 1.875 0 0 0-1.85-1.567h-1.844ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clipRule="evenodd" />
            </svg>
            设置
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">AI 服务提供商</label>
            <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50">
              <option value="gemini">Google Gemini (推荐)</option>
              {/* Future extension placeholders */}
              <option value="openai" disabled>OpenAI GPT (即将推出)</option>
              <option value="claude" disabled>Anthropic Claude (即将推出)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">API Key</label>
            <input
              type="password"
              placeholder="输入您的 Gemini API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-50 placeholder:text-slate-400"
            />
            <p className="mt-2 text-xs text-slate-500">
              {apiKey ? '我们将优先使用您配置的 Key。' : '留空将使用应用内置的默认 API Key (Gemini)。'}
            </p>
          </div>

          {/* Status Message */}
          {statusMsg && (
             <div className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                status === 'success' ? 'bg-emerald-50 text-emerald-700' : 
                status === 'error' ? 'bg-rose-50 text-rose-700' : 'bg-slate-50 text-slate-600'
             }`}>
                {status === 'testing' && <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                {status === 'success' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
                {status === 'error' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                {statusMsg}
             </div>
          )}

          <div className="pt-4">
            <button
              onClick={handleTestAndSave}
              disabled={status === 'testing'}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {status === 'testing' ? '正在测试连接...' : '测试并保存'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};