
import React from 'react';

interface CalculatorButtonProps {
  label: string;
  onClick: (val: string) => void;
  variant?: 'number' | 'action' | 'delete';
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({ label, onClick, variant = 'number' }) => {
  const baseStyles = "flex items-center justify-center h-16 text-xl font-semibold rounded-2xl transition-all active:scale-95";
  
  const variants = {
    number: "bg-slate-100 hover:bg-slate-200 text-slate-800 shadow-sm border border-slate-200",
    action: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md",
    delete: "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
  };

  return (
    <button 
      onClick={() => onClick(label)}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {label}
    </button>
  );
};

export default CalculatorButton;
