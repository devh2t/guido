
import React from 'react';
import { Info } from 'lucide-react';

interface ToastProps {
  show: boolean;
  message: string;
}

const Toast: React.FC<ToastProps> = ({ show, message }) => {
  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 transform ${show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
      <div className="bg-indigo-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold border border-white/10">
        <Info className="w-5 h-5 text-orange-400" />
        {message}
      </div>
    </div>
  );
};

export default Toast;