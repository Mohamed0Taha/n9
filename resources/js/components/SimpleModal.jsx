import React, { useState, useEffect, useMemo } from 'react';
import { useTheme, THEMES } from '../contexts/ThemeContext.jsx';

export default function SimpleModal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'alert', // 'alert', 'confirm', 'prompt'
  defaultValue = '',
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel'
}) {
  const { theme, isComic } = useTheme();
  const [inputValue, setInputValue] = useState(defaultValue);

  const styles = useMemo(() => {
    switch(theme) {
        case THEMES.HACKER: return {
            container: 'bg-black border border-green-500 shadow-[0_0_20px_rgba(0,255,0,0.3)] font-mono text-green-500 rounded-none',
            header: 'border-b border-green-900 bg-black',
            title: 'text-green-500 font-bold',
            closeBtn: 'text-green-700 hover:text-green-500',
            text: 'text-green-400',
            input: 'bg-black border border-green-700 text-green-500 focus:border-green-500 focus:ring-1 focus:ring-green-500 rounded-none',
            footer: 'bg-black border-t border-green-900',
            cancel: 'text-green-700 hover:text-green-500 hover:bg-green-900/20 rounded-none',
            confirm: 'bg-green-900 text-green-400 border border-green-600 hover:bg-green-800 rounded-none'
        };
        case THEMES.TERMINAL: return {
            container: 'bg-slate-950 border border-amber-900 font-mono text-amber-500 rounded-none',
            header: 'border-b border-amber-900 bg-slate-950',
            title: 'text-amber-500 font-bold',
            closeBtn: 'text-amber-700 hover:text-amber-500',
            text: 'text-amber-600',
            input: 'bg-slate-900 border border-amber-900 text-amber-500 focus:border-amber-600 rounded-none',
            footer: 'bg-slate-950 border-t border-amber-900',
            cancel: 'text-amber-700 hover:text-amber-500 hover:bg-amber-900/20 rounded-none',
            confirm: 'bg-amber-900/40 text-amber-500 border border-amber-700 hover:bg-amber-900/60 rounded-none'
        };
        case THEMES.DARK: return {
            container: 'bg-gray-800 border border-gray-700 shadow-xl font-sans text-gray-100 rounded-xl',
            header: 'border-b border-gray-700 bg-gray-800 rounded-t-xl',
            title: 'text-white font-semibold',
            closeBtn: 'text-gray-400 hover:text-white',
            text: 'text-gray-300',
            input: 'bg-gray-900 border border-gray-600 text-white focus:border-blue-500 rounded-lg',
            footer: 'bg-gray-800 border-t border-gray-700 rounded-b-xl',
            cancel: 'text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg',
            confirm: 'bg-blue-600 text-white hover:bg-blue-700 rounded-lg'
        };
        case THEMES.PROFESSIONAL: return {
            container: 'bg-white border border-slate-200 shadow-2xl font-sans rounded-xl',
            header: 'border-b border-slate-100 bg-white rounded-t-xl',
            title: 'text-slate-900 font-semibold',
            closeBtn: 'text-slate-400 hover:text-slate-600',
            text: 'text-slate-600',
            input: 'bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500',
            footer: 'bg-slate-50 border-t border-slate-100 rounded-b-xl',
            cancel: 'text-slate-600 hover:bg-slate-200 rounded-lg',
            confirm: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm rounded-lg'
        };
        default: return { // COMIC
            container: 'bg-white border-4 border-black font-comic shadow-[8px_8px_0px_#000] rounded-xl',
            header: 'border-b-4 border-black bg-yellow-300 rounded-t-lg',
            title: 'text-black font-bold',
            closeBtn: 'text-black hover:text-red-600',
            text: 'text-black font-medium',
            input: 'bg-white border-3 border-black rounded-lg shadow-[4px_4px_0px_#000] font-bold',
            footer: 'border-t-4 border-black bg-slate-100 rounded-b-lg',
            cancel: 'tactile-button bg-white border-2 border-black text-black font-bold hover:bg-red-100 shadow-[2px_2px_0px_#000] rounded-lg',
            confirm: 'tactile-button bg-green-400 text-black border-2 border-black font-bold hover:bg-green-500 shadow-[2px_2px_0px_#000] rounded-lg'
        };
    }
  }, [theme]);

  useEffect(() => {
    if (isOpen) {
      setInputValue(defaultValue);
    }
  }, [isOpen, defaultValue]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (type === 'prompt') {
      onConfirm(inputValue);
    } else {
      onConfirm();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className={`w-full max-w-md transform transition-all scale-100 ${styles.container}`}>
        {/* Header */}
        <div className={`px-6 py-4 flex items-center justify-between ${styles.header}`}>
          <h3 className={`text-lg ${styles.title}`}>
            {title}
          </h3>
          <button 
            onClick={onClose}
            className={`transition ${styles.closeBtn}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {message && (
            <p className={`mb-4 ${styles.text}`}>
              {message}
            </p>
          )}

          {type === 'prompt' && (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className={`w-full px-4 py-2 outline-none transition ${styles.input}`}
              placeholder="Enter value..."
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirm();
                if (e.key === 'Escape') onClose();
              }}
            />
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 flex justify-end gap-3 ${styles.footer}`}>
          {(type === 'confirm' || type === 'prompt') && (
            <button
              onClick={onClose}
              className={`px-4 py-2 transition font-medium ${styles.cancel}`}
              style={isComic ? { boxShadow: '2px 2px 0px #000' } : {}}
            >
              {cancelText}
            </button>
          )}
          
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 transition font-medium ${styles.confirm}`}
            style={isComic ? { boxShadow: '2px 2px 0px #000' } : {}}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
